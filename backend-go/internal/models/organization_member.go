package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type OrganizationMember struct {
	ID             uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	UserID         uuid.UUID `gorm:"type:uuid;not null;index" json:"user_id" validate:"required"`
	OrganizationID uuid.UUID `gorm:"type:uuid;not null;index" json:"organization_id" validate:"required"`
	Role           string    `gorm:"not null;default:member" json:"role"` // owner, admin, member
	IsActive       bool      `gorm:"default:true" json:"is_active"`
	JoinedAt       time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"joined_at"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	User         User         `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Organization Organization `gorm:"foreignKey:OrganizationID" json:"organization,omitempty"`
}

// BeforeCreate hook to generate UUID if not provided
func (om *OrganizationMember) BeforeCreate(tx *gorm.DB) error {
	if om.ID == uuid.Nil {
		om.ID = uuid.New()
	}
	if om.JoinedAt.IsZero() {
		om.JoinedAt = time.Now()
	}
	return nil
}

// TableName returns the table name for OrganizationMember model
func (OrganizationMember) TableName() string {
	return "organization_members"
}