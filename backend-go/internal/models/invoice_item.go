package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type InvoiceItem struct {
	ID          uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	InvoiceID   uuid.UUID `gorm:"type:uuid;not null;index" json:"invoice_id" validate:"required"`
	Description string    `gorm:"not null" json:"description" validate:"required"`
	Quantity    int       `gorm:"not null;default:1" json:"quantity" validate:"required,min=1"`
	UnitPrice   float64   `gorm:"not null" json:"unit_price" validate:"required,min=0"`
	Amount      float64   `gorm:"not null" json:"amount" validate:"required,min=0"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	Invoice Invoice `gorm:"foreignKey:InvoiceID" json:"invoice,omitempty"`
}

// BeforeCreate hook to generate UUID and calculate amount if not provided
func (ii *InvoiceItem) BeforeCreate(tx *gorm.DB) error {
	if ii.ID == uuid.Nil {
		ii.ID = uuid.New()
	}
	// Calculate amount if not provided
	if ii.Amount == 0 {
		ii.Amount = float64(ii.Quantity) * ii.UnitPrice
	}
	return nil
}

// BeforeUpdate hook to recalculate amount when quantity or unit price changes
func (ii *InvoiceItem) BeforeUpdate(tx *gorm.DB) error {
	ii.Amount = float64(ii.Quantity) * ii.UnitPrice
	return nil
}

// TableName returns the table name for InvoiceItem model
func (InvoiceItem) TableName() string {
	return "invoice_items"
}