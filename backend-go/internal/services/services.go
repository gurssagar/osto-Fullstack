package services

import (
	"go-backend/internal/repository"
	"go-backend/pkg/utils"
)

// Services holds all service instances
type Services struct {
	Auth         *AuthService
	Subscription *SubscriptionService
	Plan         *PlanService
	Invoice      *InvoiceService
}

// NewServices creates and initializes all services
func NewServices(repos *repository.Repositories, jwtManager *utils.JWTManager) *Services {
	return &Services{
		Auth: NewAuthService(
			repos.User,
			repos.Organization,
			jwtManager,
		),
		Subscription: NewSubscriptionService(
			repos.Subscription,
			repos.Plan,
			repos.Organization,
			repos.Invoice,
		),
		Plan: NewPlanService(
			repos.Plan,
		),
		Invoice: NewInvoiceService(
			repos.Invoice,
			repos.Organization,
		),
	}
}