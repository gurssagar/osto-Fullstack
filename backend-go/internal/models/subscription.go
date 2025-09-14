package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Subscription struct {
	ID             uuid.UUID  `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	OrganizationID uuid.UUID  `gorm:"type:uuid;not null;index" json:"organization_id" validate:"required"`
	PlanID         uuid.UUID  `gorm:"type:uuid;not null;index" json:"plan_id" validate:"required"`
	Status         string     `gorm:"not null;default:active" json:"status"` // active, canceled, expired, trial
	StartDate      time.Time  `gorm:"not null" json:"start_date" validate:"required"`
	EndDate        *time.Time `json:"end_date"`
	TrialEndDate   *time.Time `json:"trial_end_date"`
	CanceledAt     *time.Time `json:"canceled_at"`
	CurrentPeriodStart time.Time `gorm:"not null" json:"current_period_start"`
	CurrentPeriodEnd   time.Time `gorm:"not null" json:"current_period_end"`
	AutoRenew      bool       `gorm:"default:true" json:"auto_renew"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	Organization Organization `gorm:"foreignKey:OrganizationID" json:"organization,omitempty"`
	Plan         Plan         `gorm:"foreignKey:PlanID" json:"plan,omitempty"`
	Invoices     []Invoice    `gorm:"foreignKey:SubscriptionID" json:"invoices,omitempty"`
}

// BeforeCreate hook to generate UUID if not provided
func (s *Subscription) BeforeCreate(tx *gorm.DB) error {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}
	return nil
}

// IsActive checks if the subscription is currently active
func (s *Subscription) IsActive() bool {
	return s.Status == "active" && (s.EndDate == nil || s.EndDate.After(time.Now()))
}

// IsInTrial checks if the subscription is in trial period
func (s *Subscription) IsInTrial() bool {
	return s.TrialEndDate != nil && s.TrialEndDate.After(time.Now())
}

// TableName returns the table name for Subscription model
func (Subscription) TableName() string {
	return "subscriptions"
}