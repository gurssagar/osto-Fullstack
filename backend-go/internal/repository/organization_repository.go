package repository

import (
	"go-backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// OrganizationRepository interface defines methods for organization data operations
type OrganizationRepository interface {
	Create(org *models.Organization) error
	GetByID(id uuid.UUID) (*models.Organization, error)
	GetBySlug(slug string) (*models.Organization, error)
	Update(org *models.Organization) error
	Delete(id uuid.UUID) error
	List(limit, offset int) ([]*models.Organization, error)
	Count() (int64, error)
	GetByUserID(userID uuid.UUID) ([]*models.Organization, error)
}

// organizationRepository implements OrganizationRepository interface
type organizationRepository struct {
	db *gorm.DB
}

// NewOrganizationRepository creates a new organization repository
func NewOrganizationRepository(db *gorm.DB) OrganizationRepository {
	return &organizationRepository{db: db}
}

// Create creates a new organization
func (r *organizationRepository) Create(org *models.Organization) error {
	return r.db.Create(org).Error
}

// GetByID retrieves an organization by ID
func (r *organizationRepository) GetByID(id uuid.UUID) (*models.Organization, error) {
	var org models.Organization
	err := r.db.Where("id = ?", id).First(&org).Error
	if err != nil {
		return nil, err
	}
	return &org, nil
}

// GetBySlug retrieves an organization by slug
func (r *organizationRepository) GetBySlug(slug string) (*models.Organization, error) {
	var org models.Organization
	err := r.db.Where("slug = ?", slug).First(&org).Error
	if err != nil {
		return nil, err
	}
	return &org, nil
}

// Update updates an existing organization
func (r *organizationRepository) Update(org *models.Organization) error {
	return r.db.Save(org).Error
}

// Delete soft deletes an organization by ID
func (r *organizationRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Organization{}, id).Error
}

// List retrieves organizations with pagination
func (r *organizationRepository) List(limit, offset int) ([]*models.Organization, error) {
	var orgs []*models.Organization
	err := r.db.Limit(limit).Offset(offset).Find(&orgs).Error
	return orgs, err
}

// Count returns the total number of organizations
func (r *organizationRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&models.Organization{}).Count(&count).Error
	return count, err
}

// GetByUserID retrieves organizations that a user is a member of
func (r *organizationRepository) GetByUserID(userID uuid.UUID) ([]*models.Organization, error) {
	var orgs []*models.Organization
	err := r.db.Joins("JOIN organization_members ON organizations.id = organization_members.organization_id").
		Where("organization_members.user_id = ? AND organization_members.is_active = ?", userID, true).
		Find(&orgs).Error
	return orgs, err
}