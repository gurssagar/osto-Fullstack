package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Invoice struct {
	ID               uuid.UUID  `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	OrganizationID   uuid.UUID  `gorm:"type:uuid;not null;index" json:"organization_id" validate:"required"`
	SubscriptionID   *uuid.UUID `gorm:"type:uuid;index" json:"subscription_id"`
	PaymentMethodID  *uuid.UUID `gorm:"type:uuid;index" json:"payment_method_id"`
	InvoiceNumber    string     `gorm:"unique;not null" json:"invoice_number" validate:"required"`
	Status           string     `gorm:"not null;default:draft" json:"status"` // draft, sent, paid, overdue, canceled
	Subtotal         float64    `gorm:"not null" json:"subtotal" validate:"required,min=0"`
	TaxAmount        float64    `gorm:"default:0" json:"tax_amount"`
	DiscountAmount   float64    `gorm:"default:0" json:"discount_amount"`
	Total            float64    `gorm:"not null" json:"total" validate:"required,min=0"`
	Currency         string     `gorm:"not null;default:USD" json:"currency"`
	IssueDate        time.Time  `gorm:"not null" json:"issue_date" validate:"required"`
	DueDate          time.Time  `gorm:"not null" json:"due_date" validate:"required"`
	PaidAt           *time.Time `json:"paid_at"`
	Notes            string     `gorm:"type:text" json:"notes"`
	CreatedAt        time.Time  `json:"created_at"`
	UpdatedAt        time.Time  `json:"updated_at"`
	DeletedAt        gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	Organization  Organization   `gorm:"foreignKey:OrganizationID" json:"organization,omitempty"`
	Subscription  *Subscription  `gorm:"foreignKey:SubscriptionID" json:"subscription,omitempty"`
	PaymentMethod *PaymentMethod `gorm:"foreignKey:PaymentMethodID" json:"payment_method,omitempty"`
	Items         []InvoiceItem  `gorm:"foreignKey:InvoiceID" json:"items,omitempty"`
}

// BeforeCreate hook to generate UUID and invoice number if not provided
func (i *Invoice) BeforeCreate(tx *gorm.DB) error {
	if i.ID == uuid.Nil {
		i.ID = uuid.New()
	}
	if i.InvoiceNumber == "" {
		// Generate invoice number (you might want to implement a more sophisticated numbering system)
		i.InvoiceNumber = "INV-" + time.Now().Format("20060102") + "-" + i.ID.String()[:8]
	}
	return nil
}

// IsPaid checks if the invoice is paid
func (i *Invoice) IsPaid() bool {
	return i.Status == "paid" && i.PaidAt != nil
}

// IsOverdue checks if the invoice is overdue
func (i *Invoice) IsOverdue() bool {
	return i.Status != "paid" && i.DueDate.Before(time.Now())
}

// TableName returns the table name for Invoice model
func (Invoice) TableName() string {
	return "invoices"
}