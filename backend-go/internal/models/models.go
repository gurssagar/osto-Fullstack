package models

import (
	"gorm.io/gorm"
)

// AllModels returns a slice of all model structs for migration purposes
func AllModels() []interface{} {
	return []interface{}{
		&User{},
		&Organization{},
		&OrganizationMember{},
		&Plan{},
		&Subscription{},
		&PaymentMethod{},
		&Invoice{},
		&InvoiceItem{},
		&BillingAddress{},
	}
}

// AutoMigrate runs auto migration for all models
func AutoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(AllModels()...)
}

// CreateIndexes creates additional indexes for better performance
func CreateIndexes(db *gorm.DB) error {
	// Add composite indexes for better query performance
	err := db.Exec("CREATE INDEX IF NOT EXISTS idx_organization_members_user_org ON organization_members(user_id, organization_id)").Error
	if err != nil {
		return err
	}

	err = db.Exec("CREATE INDEX IF NOT EXISTS idx_subscriptions_org_status ON subscriptions(organization_id, status)").Error
	if err != nil {
		return err
	}

	err = db.Exec("CREATE INDEX IF NOT EXISTS idx_invoices_org_status ON invoices(organization_id, status)").Error
	if err != nil {
		return err
	}

	err = db.Exec("CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date) WHERE status != 'paid'").Error
	if err != nil {
		return err
	}

	return nil
}