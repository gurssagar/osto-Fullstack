package repository

import (
	"go-backend/internal/models"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// SubscriptionRepository interface defines methods for subscription data operations
type SubscriptionRepository interface {
	Create(subscription *models.Subscription) error
	GetByID(id uuid.UUID) (*models.Subscription, error)
	Update(subscription *models.Subscription) error
	Delete(id uuid.UUID) error
	List(limit, offset int) ([]*models.Subscription, error)
	Count() (int64, error)
	GetByOrganizationID(orgID uuid.UUID) ([]*models.Subscription, error)
	GetActiveByOrganizationID(orgID uuid.UUID) (*models.Subscription, error)
	GetExpiring(days int) ([]*models.Subscription, error)
	GetByStatus(status string, limit, offset int) ([]*models.Subscription, error)
}

// subscriptionRepository implements SubscriptionRepository interface
type subscriptionRepository struct {
	db *gorm.DB
}

// NewSubscriptionRepository creates a new subscription repository
func NewSubscriptionRepository(db *gorm.DB) SubscriptionRepository {
	return &subscriptionRepository{db: db}
}

// Create creates a new subscription
func (r *subscriptionRepository) Create(subscription *models.Subscription) error {
	return r.db.Create(subscription).Error
}

// GetByID retrieves a subscription by ID with related data
func (r *subscriptionRepository) GetByID(id uuid.UUID) (*models.Subscription, error) {
	var subscription models.Subscription
	err := r.db.Preload("Organization").Preload("Plan").Where("id = ?", id).First(&subscription).Error
	if err != nil {
		return nil, err
	}
	return &subscription, nil
}

// Update updates an existing subscription
func (r *subscriptionRepository) Update(subscription *models.Subscription) error {
	return r.db.Save(subscription).Error
}

// Delete soft deletes a subscription by ID
func (r *subscriptionRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Subscription{}, id).Error
}

// List retrieves subscriptions with pagination
func (r *subscriptionRepository) List(limit, offset int) ([]*models.Subscription, error) {
	var subscriptions []*models.Subscription
	err := r.db.Preload("Organization").Preload("Plan").Limit(limit).Offset(offset).Find(&subscriptions).Error
	return subscriptions, err
}

// Count returns the total number of subscriptions
func (r *subscriptionRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&models.Subscription{}).Count(&count).Error
	return count, err
}

// GetByOrganizationID retrieves all subscriptions for an organization
func (r *subscriptionRepository) GetByOrganizationID(orgID uuid.UUID) ([]*models.Subscription, error) {
	var subscriptions []*models.Subscription
	err := r.db.Preload("Plan").Where("organization_id = ?", orgID).Find(&subscriptions).Error
	return subscriptions, err
}

// GetActiveByOrganizationID retrieves the active subscription for an organization
func (r *subscriptionRepository) GetActiveByOrganizationID(orgID uuid.UUID) (*models.Subscription, error) {
	var subscription models.Subscription
	err := r.db.Preload("Plan").
		Where("organization_id = ? AND status = ?", orgID, "active").
		Where("(end_date IS NULL OR end_date > ?)", time.Now()).
		First(&subscription).Error
	if err != nil {
		return nil, err
	}
	return &subscription, nil
}

// GetExpiring retrieves subscriptions expiring within the specified number of days
func (r *subscriptionRepository) GetExpiring(days int) ([]*models.Subscription, error) {
	var subscriptions []*models.Subscription
	expiryDate := time.Now().AddDate(0, 0, days)
	err := r.db.Preload("Organization").Preload("Plan").
		Where("status = ? AND current_period_end <= ? AND current_period_end > ?", "active", expiryDate, time.Now()).
		Find(&subscriptions).Error
	return subscriptions, err
}

// GetByStatus retrieves subscriptions by status with pagination
func (r *subscriptionRepository) GetByStatus(status string, limit, offset int) ([]*models.Subscription, error) {
	var subscriptions []*models.Subscription
	err := r.db.Preload("Organization").Preload("Plan").
		Where("status = ?", status).
		Limit(limit).Offset(offset).
		Find(&subscriptions).Error
	return subscriptions, err
}