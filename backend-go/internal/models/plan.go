package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Plan struct {
	ID          uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Name        string    `gorm:"not null" json:"name" validate:"required"`
	Slug        string    `gorm:"unique;not null" json:"slug" validate:"required"`
	Description string    `json:"description"`
	Price       float64   `gorm:"not null" json:"price" validate:"required,min=0"`
	Currency    string    `gorm:"not null;default:USD" json:"currency"`
	Interval    string    `gorm:"not null" json:"interval" validate:"required"` // monthly, yearly, weekly
	Features    string    `gorm:"type:text" json:"features"` // JSON string of features
	IsActive    bool      `gorm:"default:true" json:"is_active"`
	IsPopular   bool      `gorm:"default:false" json:"is_popular"`
	TrialDays   int       `gorm:"default:0" json:"trial_days"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	Subscriptions []Subscription `gorm:"foreignKey:PlanID" json:"subscriptions,omitempty"`
}

// BeforeCreate hook to generate UUID if not provided
func (p *Plan) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
}

// TableName returns the table name for Plan model
func (Plan) TableName() string {
	return "plans"
}