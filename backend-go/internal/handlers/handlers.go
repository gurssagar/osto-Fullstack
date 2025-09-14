package handlers

import (
	"go-backend/internal/services"
)

// Handlers holds all handler instances
type Handlers struct {
	Auth         *AuthHandler
	Plan         *PlanHandler
	Subscription *SubscriptionHandler
	Invoice      *InvoiceHandler
}

// NewHandlers creates and initializes all handlers
func NewHandlers(services *services.Services) *Handlers {
	return &Handlers{
		Auth:         NewAuthHandler(services.Auth),
		Plan:         NewPlanHandler(services.Plan),
		Subscription: NewSubscriptionHandler(services.Subscription),
		Invoice:      NewInvoiceHandler(services.Invoice),
	}
}