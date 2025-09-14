package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID           uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Email        string         `gorm:"unique;not null" json:"email" validate:"required,email"`
	Password     string         `gorm:"not null" json:"-"` // Never return password in JSON
	FirstName    string         `gorm:"not null" json:"first_name" validate:"required"`
	LastName     string         `gorm:"not null" json:"last_name" validate:"required"`
	Role         string         `gorm:"default:user" json:"role"` // user, admin, super_admin
	IsActive     bool           `gorm:"default:true" json:"is_active"`
	Organization string         `json:"organization"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	OrganizationMembers []OrganizationMember `gorm:"foreignKey:UserID" json:"organization_members,omitempty"`
}

// BeforeCreate hook to generate UUID if not provided
func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}

// TableName returns the table name for User model
func (User) TableName() string {
	return "users"
}
