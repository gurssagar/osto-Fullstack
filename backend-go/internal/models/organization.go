package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Organization struct {
	ID          uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Name        string    `gorm:"not null" json:"name" validate:"required"`
	Slug        string    `gorm:"unique;not null" json:"slug" validate:"required"`
	Description string    `json:"description"`
	Website     string    `json:"website"`
	Phone       string    `json:"phone"`
	Email       string    `json:"email" validate:"omitempty,email"`
	IsActive    bool      `gorm:"default:true" json:"is_active"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	Members           []OrganizationMember `gorm:"foreignKey:OrganizationID" json:"members,omitempty"`
	Subscriptions     []Subscription       `gorm:"foreignKey:OrganizationID" json:"subscriptions,omitempty"`
	PaymentMethods    []PaymentMethod      `gorm:"foreignKey:OrganizationID" json:"payment_methods,omitempty"`
	Invoices          []Invoice            `gorm:"foreignKey:OrganizationID" json:"invoices,omitempty"`
	BillingAddresses  []BillingAddress     `gorm:"foreignKey:OrganizationID" json:"billing_addresses,omitempty"`
}

// BeforeCreate hook to generate UUID if not provided
func (o *Organization) BeforeCreate(tx *gorm.DB) error {
	if o.ID == uuid.Nil {
		o.ID = uuid.New()
	}
	return nil
}

// TableName returns the table name for Organization model
func (Organization) TableName() string {
	return "organizations"
}