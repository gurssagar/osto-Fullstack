package services

import (
	"errors"
	"time"

	"go-backend/internal/models"
	"go-backend/internal/repository"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// SubscriptionService handles subscription business logic
type SubscriptionService struct {
	subscriptionRepo repository.SubscriptionRepository
	planRepo         repository.PlanRepository
	orgRepo          repository.OrganizationRepository
	invoiceRepo      repository.InvoiceRepository
}

// NewSubscriptionService creates a new subscription service
func NewSubscriptionService(
	subscriptionRepo repository.SubscriptionRepository,
	planRepo repository.PlanRepository,
	orgRepo repository.OrganizationRepository,
	invoiceRepo repository.InvoiceRepository,
) *SubscriptionService {
	return &SubscriptionService{
		subscriptionRepo: subscriptionRepo,
		planRepo:         planRepo,
		orgRepo:          orgRepo,
		invoiceRepo:      invoiceRepo,
	}
}

// CreateSubscriptionRequest represents subscription creation data
type CreateSubscriptionRequest struct {
	OrganizationID string `json:"organization_id" binding:"required"`
	PlanID         string `json:"plan_id" binding:"required"`
	AutoRenew      bool   `json:"auto_renew"`
}

// SubscriptionResponse represents subscription response data
type SubscriptionResponse struct {
	Subscription *models.Subscription `json:"subscription"`
	Plan         *models.Plan         `json:"plan"`
	Organization *models.Organization `json:"organization"`
}

// CreateSubscription creates a new subscription for an organization
func (s *SubscriptionService) CreateSubscription(req *CreateSubscriptionRequest) (*SubscriptionResponse, error) {
	// Parse UUIDs
	orgID, err := uuid.Parse(req.OrganizationID)
	if err != nil {
		return nil, errors.New("invalid organization ID")
	}

	planID, err := uuid.Parse(req.PlanID)
	if err != nil {
		return nil, errors.New("invalid plan ID")
	}

	// Validate organization exists
	org, err := s.orgRepo.GetByID(orgID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("organization not found")
		}
		return nil, err
	}

	// Validate plan exists and is active
	plan, err := s.planRepo.GetByID(planID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("plan not found")
		}
		return nil, err
	}

	if !plan.IsActive {
		return nil, errors.New("plan is not active")
	}

	// Check if organization already has an active subscription
	activeSubscription, err := s.subscriptionRepo.GetActiveByOrganizationID(orgID)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	if activeSubscription != nil {
		return nil, errors.New("organization already has an active subscription")
	}

	// Calculate subscription dates
	now := time.Now()
	startDate := now
	var endDate time.Time
	var trialEndDate *time.Time

	// Set trial period if plan has trial days
	if plan.TrialDays > 0 {
		trialEnd := now.AddDate(0, 0, plan.TrialDays)
		trialEndDate = &trialEnd
	}

	// Calculate end date based on plan interval
	switch plan.Interval {
	case "monthly":
		endDate = startDate.AddDate(0, 1, 0)
	case "yearly":
		endDate = startDate.AddDate(1, 0, 0)
	case "weekly":
		endDate = startDate.AddDate(0, 0, 7)
	default:
		return nil, errors.New("invalid plan interval")
	}

	// Create subscription
	subscription := &models.Subscription{
		OrganizationID:       orgID,
		PlanID:               planID,
		Status:               "active",
		StartDate:            startDate,
		EndDate:              &endDate,
		TrialEndDate:         trialEndDate,
		CurrentPeriodStart:   startDate,
		CurrentPeriodEnd:     endDate,
		AutoRenew:            req.AutoRenew,
	}

	// If in trial, set status to trialing
	if trialEndDate != nil && now.Before(*trialEndDate) {
		subscription.Status = "trialing"
	}

	if err := s.subscriptionRepo.Create(subscription); err != nil {
		return nil, err
	}

	// Organization is already loaded, no need to update plan type

	// Create initial invoice if not in trial
	if subscription.Status == "active" {
		if err := s.createSubscriptionInvoice(subscription, plan); err != nil {
			return nil, err
		}
	}

	return &SubscriptionResponse{
		Subscription: subscription,
		Plan:         plan,
		Organization: org,
	}, nil
}

// CancelSubscription cancels a subscription
func (s *SubscriptionService) CancelSubscription(subscriptionIDStr string, immediate bool) error {
	subscriptionID, err := uuid.Parse(subscriptionIDStr)
	if err != nil {
		return errors.New("invalid subscription ID")
	}

	subscription, err := s.subscriptionRepo.GetByID(subscriptionID)
	if err != nil {
		return err
	}

	if subscription.Status == "canceled" {
		return errors.New("subscription is already canceled")
	}

	now := time.Now()
	subscription.CanceledAt = &now

	if immediate {
		subscription.Status = "canceled"
		subscription.EndDate = &now
	} else {
		// Cancel at end of current period
		subscription.AutoRenew = false
	}

	return s.subscriptionRepo.Update(subscription)
}

// RenewSubscription renews a subscription for the next period
func (s *SubscriptionService) RenewSubscription(subscriptionIDStr string) error {
	subscriptionID, err := uuid.Parse(subscriptionIDStr)
	if err != nil {
		return errors.New("invalid subscription ID")
	}

	subscription, err := s.subscriptionRepo.GetByID(subscriptionID)
	if err != nil {
		return err
	}

	if subscription.Status != "active" {
		return errors.New("only active subscriptions can be renewed")
	}

	// Get plan details
	plan, err := s.planRepo.GetByID(subscription.PlanID)
	if err != nil {
		return err
	}

	// Calculate new period dates
	newStartDate := subscription.CurrentPeriodEnd
	var newEndDate time.Time

	switch plan.Interval {
	case "monthly":
		newEndDate = newStartDate.AddDate(0, 1, 0)
	case "yearly":
		newEndDate = newStartDate.AddDate(1, 0, 0)
	case "weekly":
		newEndDate = newStartDate.AddDate(0, 0, 7)
	default:
		return errors.New("invalid plan interval")
	}

	// Update subscription
	subscription.CurrentPeriodStart = newStartDate
	subscription.CurrentPeriodEnd = newEndDate
	subscription.EndDate = &newEndDate

	if err := s.subscriptionRepo.Update(subscription); err != nil {
		return err
	}

	// Create invoice for new period
	return s.createSubscriptionInvoice(subscription, plan)
}

// GetSubscriptionsByOrganization gets all subscriptions for an organization
func (s *SubscriptionService) GetSubscriptionsByOrganization(organizationIDStr string, page, limit int) ([]*models.Subscription, int64, error) {
	orgID, err := uuid.Parse(organizationIDStr)
	if err != nil {
		return nil, 0, errors.New("invalid organization ID")
	}

	subscriptions, err := s.subscriptionRepo.GetByOrganizationID(orgID)
	if err != nil {
		return nil, 0, err
	}

	// For simplicity, return the length of subscriptions as total
	// In a real implementation, you might want to add pagination to GetByOrganizationID
	total := int64(len(subscriptions))

	return subscriptions, total, nil
}

// GetActiveSubscription gets the active subscription for an organization
func (s *SubscriptionService) GetActiveSubscription(organizationIDStr string) (*SubscriptionResponse, error) {
	orgID, err := uuid.Parse(organizationIDStr)
	if err != nil {
		return nil, errors.New("invalid organization ID")
	}

	subscription, err := s.subscriptionRepo.GetActiveByOrganizationID(orgID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("no active subscription found")
		}
		return nil, err
	}

	// Get plan and organization details
	plan, err := s.planRepo.GetByID(subscription.PlanID)
	if err != nil {
		return nil, err
	}

	org, err := s.orgRepo.GetByID(subscription.OrganizationID)
	if err != nil {
		return nil, err
	}

	return &SubscriptionResponse{
		Subscription: subscription,
		Plan:         plan,
		Organization: org,
	}, nil
}

// ProcessExpiredSubscriptions processes subscriptions that have expired
func (s *SubscriptionService) ProcessExpiredSubscriptions() error {
	// Get subscriptions expiring in 0 days (already expired)
	expiredSubscriptions, err := s.subscriptionRepo.GetExpiring(0)
	if err != nil {
		return err
	}

	for _, subscription := range expiredSubscriptions {
		if subscription.AutoRenew {
			// Try to renew
			if err := s.RenewSubscription(subscription.ID.String()); err != nil {
				// If renewal fails, mark as expired
				subscription.Status = "expired"
				s.subscriptionRepo.Update(subscription)
			}
		} else {
			// Mark as expired
			subscription.Status = "expired"
			s.subscriptionRepo.Update(subscription)
		}
	}

	return nil
}

// createSubscriptionInvoice creates an invoice for a subscription
func (s *SubscriptionService) createSubscriptionInvoice(subscription *models.Subscription, plan *models.Plan) error {
	invoice := &models.Invoice{
		OrganizationID: subscription.OrganizationID,
		SubscriptionID: &subscription.ID,
		InvoiceNumber:  "INV-" + subscription.ID.String()[:8],
		Status:         "draft",
		Subtotal:       plan.Price,
		Total:          plan.Price,
		Currency:       plan.Currency,
		IssueDate:      time.Now(),
		DueDate:        subscription.CurrentPeriodEnd,
		Notes:          "Subscription: " + plan.Name,
	}

	if err := s.invoiceRepo.Create(invoice); err != nil {
		return err
	}

	// Create invoice item
	invoiceItem := &models.InvoiceItem{
		InvoiceID:   invoice.ID,
		Description: plan.Name + " - " + plan.Interval + " subscription",
		Quantity:    1,
		UnitPrice:   plan.Price,
		Amount:      plan.Price,
	}

	// Note: You would need to create an InvoiceItemRepository to save this
	// For now, we'll skip this step
	_ = invoiceItem

	return nil
}