package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type BillingAddress struct {
	ID             uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	OrganizationID uuid.UUID `gorm:"type:uuid;not null;index" json:"organization_id" validate:"required"`
	CompanyName    string    `json:"company_name"`
	ContactName    string    `gorm:"not null" json:"contact_name" validate:"required"`
	AddressLine1   string    `gorm:"not null" json:"address_line1" validate:"required"`
	AddressLine2   string    `json:"address_line2"`
	City           string    `gorm:"not null" json:"city" validate:"required"`
	State          string    `json:"state"`
	PostalCode     string    `gorm:"not null" json:"postal_code" validate:"required"`
	Country        string    `gorm:"not null" json:"country" validate:"required"`
	TaxID          string    `json:"tax_id"`
	IsDefault      bool      `gorm:"default:false" json:"is_default"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	Organization Organization `gorm:"foreignKey:OrganizationID" json:"organization,omitempty"`
}

// BeforeCreate hook to generate UUID if not provided
func (ba *BillingAddress) BeforeCreate(tx *gorm.DB) error {
	if ba.ID == uuid.Nil {
		ba.ID = uuid.New()
	}
	return nil
}

// GetFullAddress returns the complete address as a formatted string
func (ba *BillingAddress) GetFullAddress() string {
	address := ba.AddressLine1
	if ba.AddressLine2 != "" {
		address += ", " + ba.AddressLine2
	}
	address += ", " + ba.City
	if ba.State != "" {
		address += ", " + ba.State
	}
	address += " " + ba.PostalCode + ", " + ba.Country
	return address
}

// TableName returns the table name for BillingAddress model
func (BillingAddress) TableName() string {
	return "billing_addresses"
}