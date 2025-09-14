package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PaymentMethod struct {
	ID             uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	OrganizationID uuid.UUID `gorm:"type:uuid;not null;index" json:"organization_id" validate:"required"`
	Type           string    `gorm:"not null" json:"type" validate:"required"` // card, bank_account, paypal
	Provider       string    `gorm:"not null" json:"provider"` // stripe, paypal, etc.
	ProviderID     string    `gorm:"not null" json:"provider_id"` // External provider's ID
	Last4          string    `json:"last4"` // Last 4 digits for cards
	Brand          string    `json:"brand"` // visa, mastercard, etc.
	ExpiryMonth    int       `json:"expiry_month"`
	ExpiryYear     int       `json:"expiry_year"`
	HolderName     string    `json:"holder_name"`
	IsDefault      bool      `gorm:"default:false" json:"is_default"`
	IsActive       bool      `gorm:"default:true" json:"is_active"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	Organization Organization `gorm:"foreignKey:OrganizationID" json:"organization,omitempty"`
	Invoices     []Invoice    `gorm:"foreignKey:PaymentMethodID" json:"invoices,omitempty"`
}

// BeforeCreate hook to generate UUID if not provided
func (pm *PaymentMethod) BeforeCreate(tx *gorm.DB) error {
	if pm.ID == uuid.Nil {
		pm.ID = uuid.New()
	}
	return nil
}

// IsExpired checks if the payment method is expired (for cards)
func (pm *PaymentMethod) IsExpired() bool {
	if pm.Type != "card" {
		return false
	}
	now := time.Now()
	return now.Year() > pm.ExpiryYear || (now.Year() == pm.ExpiryYear && int(now.Month()) > pm.ExpiryMonth)
}

// TableName returns the table name for PaymentMethod model
func (PaymentMethod) TableName() string {
	return "payment_methods"
}