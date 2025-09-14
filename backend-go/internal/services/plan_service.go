package services

import (
	"encoding/json"
	"errors"

	"go-backend/internal/models"
	"go-backend/internal/repository"
	"go-backend/pkg/utils"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// PlanService handles plan business logic
type PlanService struct {
	planRepo repository.PlanRepository
}

// NewPlanService creates a new plan service
func NewPlanService(planRepo repository.PlanRepository) *PlanService {
	return &PlanService{
		planRepo: planRepo,
	}
}

// CreatePlanRequest represents plan creation data
type CreatePlanRequest struct {
	Name        string   `json:"name" binding:"required,min=2,max=100"`
	Description string   `json:"description" binding:"required,min=10,max=500"`
	Price       float64  `json:"price" binding:"required,min=0"`
	Currency    string   `json:"currency" binding:"required,len=3"`
	Interval    string   `json:"interval" binding:"required,oneof=weekly monthly yearly"`
	Features    []string `json:"features" binding:"required,min=1"`
	TrialDays   int      `json:"trial_days" binding:"min=0,max=365"`
	IsPopular   bool     `json:"is_popular"`
}

// UpdatePlanRequest represents plan update data
type UpdatePlanRequest struct {
	Name        *string   `json:"name,omitempty" binding:"omitempty,min=2,max=100"`
	Description *string   `json:"description,omitempty" binding:"omitempty,min=10,max=500"`
	Price       *float64  `json:"price,omitempty" binding:"omitempty,min=0"`
	Currency    *string   `json:"currency,omitempty" binding:"omitempty,len=3"`
	Interval    *string   `json:"interval,omitempty" binding:"omitempty,oneof=weekly monthly yearly"`
	Features    *[]string `json:"features,omitempty" binding:"omitempty,min=1"`
	TrialDays   *int      `json:"trial_days,omitempty" binding:"omitempty,min=0,max=365"`
	IsActive    *bool     `json:"is_active,omitempty"`
	IsPopular   *bool     `json:"is_popular,omitempty"`
}

// CreatePlan creates a new plan
func (s *PlanService) CreatePlan(req *CreatePlanRequest) (*models.Plan, error) {
	// Generate slug from name
	slug := utils.GenerateSlug(req.Name)

	// Check if slug already exists
	existingPlan, err := s.planRepo.GetBySlug(slug)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}
	if existingPlan != nil {
		return nil, errors.New("plan with this name already exists")
	}

	// Validate currency
	if !isValidCurrency(req.Currency) {
		return nil, errors.New("invalid currency code")
	}

	// Create plan
	plan := &models.Plan{
		Name:        req.Name,
		Slug:        slug,
		Description: req.Description,
		Price:       req.Price,
		Currency:    req.Currency,
		Interval:    req.Interval,
		Features:    "", // Will be set below
		IsActive:    true,
		IsPopular:   req.IsPopular,
		TrialDays:   req.TrialDays,
	}

	// Convert features slice to JSON string
	if len(req.Features) > 0 {
		featuresJSON, err := json.Marshal(req.Features)
		if err != nil {
			return nil, err
		}
		plan.Features = string(featuresJSON)
	}

	if err := s.planRepo.Create(plan); err != nil {
		return nil, err
	}

	return plan, nil
}

// GetPlanByID gets a plan by ID
func (s *PlanService) GetPlanByID(idStr string) (*models.Plan, error) {
	id, err := uuid.Parse(idStr)
	if err != nil {
		return nil, errors.New("invalid plan ID")
	}
	return s.planRepo.GetByID(id)
}

// GetPlanBySlug gets a plan by slug
func (s *PlanService) GetPlanBySlug(slug string) (*models.Plan, error) {
	return s.planRepo.GetBySlug(slug)
}

// GetAllPlans gets all plans with pagination
func (s *PlanService) GetAllPlans(page, limit int) ([]*models.Plan, int64, error) {
	offset := (page - 1) * limit
	plans, err := s.planRepo.List(limit, offset)
	if err != nil {
		return nil, 0, err
	}

	total, err := s.planRepo.Count()
	if err != nil {
		return nil, 0, err
	}

	return plans, total, nil
}

// GetActivePlans gets all active plans
func (s *PlanService) GetActivePlans() ([]*models.Plan, error) {
	return s.planRepo.GetActive()
}

// GetPopularPlans gets all popular plans
func (s *PlanService) GetPopularPlans() ([]*models.Plan, error) {
	return s.planRepo.GetPopular()
}

// UpdatePlan updates a plan
func (s *PlanService) UpdatePlan(idStr string, req *UpdatePlanRequest) (*models.Plan, error) {
	id, err := uuid.Parse(idStr)
	if err != nil {
		return nil, errors.New("invalid plan ID")
	}

	plan, err := s.planRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Update fields if provided
	if req.Name != nil {
		// Generate new slug if name changed
		if *req.Name != plan.Name {
			newSlug := utils.GenerateSlug(*req.Name)
			// Check if new slug already exists
			existingPlan, err := s.planRepo.GetBySlug(newSlug)
			if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, err
			}
			if existingPlan != nil && existingPlan.ID != plan.ID {
				return nil, errors.New("plan with this name already exists")
			}
			plan.Slug = newSlug
		}
		plan.Name = *req.Name
	}

	if req.Description != nil {
		plan.Description = *req.Description
	}

	if req.Price != nil {
		plan.Price = *req.Price
	}

	if req.Currency != nil {
		if !isValidCurrency(*req.Currency) {
			return nil, errors.New("invalid currency code")
		}
		plan.Currency = *req.Currency
	}

	if req.Interval != nil {
		plan.Interval = *req.Interval
	}

	if req.Features != nil {
		featuresJSON, err := json.Marshal(*req.Features)
		if err != nil {
			return nil, err
		}
		plan.Features = string(featuresJSON)
	}

	if req.TrialDays != nil {
		plan.TrialDays = *req.TrialDays
	}

	if req.IsActive != nil {
		plan.IsActive = *req.IsActive
	}

	if req.IsPopular != nil {
		plan.IsPopular = *req.IsPopular
	}

	if err := s.planRepo.Update(plan); err != nil {
		return nil, err
	}

	return plan, nil
}

// DeletePlan soft deletes a plan
func (s *PlanService) DeletePlan(idStr string) error {
	id, err := uuid.Parse(idStr)
	if err != nil {
		return errors.New("invalid plan ID")
	}

	plan, err := s.planRepo.GetByID(id)
	if err != nil {
		return err
	}

	// Check if plan has active subscriptions
	// Note: This would require a subscription repository method
	// For now, we'll just deactivate the plan
	plan.IsActive = false
	return s.planRepo.Update(plan)
}

// ActivatePlan activates a plan
func (s *PlanService) ActivatePlan(idStr string) error {
	id, err := uuid.Parse(idStr)
	if err != nil {
		return errors.New("invalid plan ID")
	}

	plan, err := s.planRepo.GetByID(id)
	if err != nil {
		return err
	}

	plan.IsActive = true
	return s.planRepo.Update(plan)
}

// DeactivatePlan deactivates a plan
func (s *PlanService) DeactivatePlan(idStr string) error {
	id, err := uuid.Parse(idStr)
	if err != nil {
		return errors.New("invalid plan ID")
	}

	plan, err := s.planRepo.GetByID(id)
	if err != nil {
		return err
	}

	plan.IsActive = false
	return s.planRepo.Update(plan)
}

// SetPopularPlan sets a plan as popular and removes popular flag from others
func (s *PlanService) SetPopularPlan(idStr string) error {
	id, err := uuid.Parse(idStr)
	if err != nil {
		return errors.New("invalid plan ID")
	}

	// First, remove popular flag from all plans
	allPlans, err := s.planRepo.GetPopular()
	if err != nil {
		return err
	}

	for _, plan := range allPlans {
		plan.IsPopular = false
		if err := s.planRepo.Update(plan); err != nil {
			return err
		}
	}

	// Set the specified plan as popular
	plan, err := s.planRepo.GetByID(id)
	if err != nil {
		return err
	}

	plan.IsPopular = true
	return s.planRepo.Update(plan)
}

// isValidCurrency checks if a currency code is valid
func isValidCurrency(currency string) bool {
	validCurrencies := map[string]bool{
		"USD": true,
		"EUR": true,
		"GBP": true,
		"CAD": true,
		"AUD": true,
		"JPY": true,
		"CHF": true,
		"CNY": true,
		"INR": true,
		"BRL": true,
		"MXN": true,
		"SGD": true,
		"HKD": true,
		"NOK": true,
		"SEK": true,
		"DKK": true,
		"PLN": true,
		"CZK": true,
		"HUF": true,
		"RUB": true,
		"ZAR": true,
		"KRW": true,
		"THB": true,
		"MYR": true,
		"PHP": true,
		"IDR": true,
		"VND": true,
	}
	return validCurrencies[currency]
}