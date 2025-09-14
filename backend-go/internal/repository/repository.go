package repository

import (
	"gorm.io/gorm"
)

// Repositories holds all repository interfaces
type Repositories struct {
	User         UserRepository
	Organization OrganizationRepository
	Plan         PlanRepository
	Subscription SubscriptionRepository
	Invoice      InvoiceRepository
}

// NewRepositories creates and returns all repositories
func NewRepositories(db *gorm.DB) *Repositories {
	return &Repositories{
		User:         NewUserRepository(db),
		Organization: NewOrganizationRepository(db),
		Plan:         NewPlanRepository(db),
		Subscription: NewSubscriptionRepository(db),
		Invoice:      NewInvoiceRepository(db),
	}
}