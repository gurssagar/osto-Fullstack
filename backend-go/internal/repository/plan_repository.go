package repository

import (
	"go-backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// PlanRepository interface defines methods for plan data operations
type PlanRepository interface {
	Create(plan *models.Plan) error
	GetByID(id uuid.UUID) (*models.Plan, error)
	GetBySlug(slug string) (*models.Plan, error)
	Update(plan *models.Plan) error
	Delete(id uuid.UUID) error
	List(limit, offset int) ([]*models.Plan, error)
	Count() (int64, error)
	GetActive() ([]*models.Plan, error)
	GetPopular() ([]*models.Plan, error)
}

// planRepository implements PlanRepository interface
type planRepository struct {
	db *gorm.DB
}

// NewPlanRepository creates a new plan repository
func NewPlanRepository(db *gorm.DB) PlanRepository {
	return &planRepository{db: db}
}

// Create creates a new plan
func (r *planRepository) Create(plan *models.Plan) error {
	return r.db.Create(plan).Error
}

// GetByID retrieves a plan by ID
func (r *planRepository) GetByID(id uuid.UUID) (*models.Plan, error) {
	var plan models.Plan
	err := r.db.Where("id = ?", id).First(&plan).Error
	if err != nil {
		return nil, err
	}
	return &plan, nil
}

// GetBySlug retrieves a plan by slug
func (r *planRepository) GetBySlug(slug string) (*models.Plan, error) {
	var plan models.Plan
	err := r.db.Where("slug = ?", slug).First(&plan).Error
	if err != nil {
		return nil, err
	}
	return &plan, nil
}

// Update updates an existing plan
func (r *planRepository) Update(plan *models.Plan) error {
	return r.db.Save(plan).Error
}

// Delete soft deletes a plan by ID
func (r *planRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Plan{}, id).Error
}

// List retrieves plans with pagination
func (r *planRepository) List(limit, offset int) ([]*models.Plan, error) {
	var plans []*models.Plan
	err := r.db.Limit(limit).Offset(offset).Find(&plans).Error
	return plans, err
}

// Count returns the total number of plans
func (r *planRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&models.Plan{}).Count(&count).Error
	return count, err
}

// GetActive retrieves all active plans
func (r *planRepository) GetActive() ([]*models.Plan, error) {
	var plans []*models.Plan
	err := r.db.Where("is_active = ?", true).Order("price ASC").Find(&plans).Error
	return plans, err
}

// GetPopular retrieves popular plans
func (r *planRepository) GetPopular() ([]*models.Plan, error) {
	var plans []*models.Plan
	err := r.db.Where("is_active = ? AND is_popular = ?", true, true).Order("price ASC").Find(&plans).Error
	return plans, err
}