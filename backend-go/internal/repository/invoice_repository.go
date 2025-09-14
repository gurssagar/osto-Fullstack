package repository

import (
	"go-backend/internal/models"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// InvoiceRepository interface defines methods for invoice data operations
type InvoiceRepository interface {
	Create(invoice *models.Invoice) error
	GetByID(id uuid.UUID) (*models.Invoice, error)
	GetByInvoiceNumber(invoiceNumber string) (*models.Invoice, error)
	Update(invoice *models.Invoice) error
	Delete(id uuid.UUID) error
	List(limit, offset int) ([]*models.Invoice, error)
	Count() (int64, error)
	GetByOrganizationID(orgID uuid.UUID, limit, offset int) ([]*models.Invoice, error)
	GetByStatus(status string, limit, offset int) ([]*models.Invoice, error)
	GetOverdue() ([]*models.Invoice, error)
	GetByDateRange(startDate, endDate time.Time, limit, offset int) ([]*models.Invoice, error)
}

// invoiceRepository implements InvoiceRepository interface
type invoiceRepository struct {
	db *gorm.DB
}

// NewInvoiceRepository creates a new invoice repository
func NewInvoiceRepository(db *gorm.DB) InvoiceRepository {
	return &invoiceRepository{db: db}
}

// Create creates a new invoice
func (r *invoiceRepository) Create(invoice *models.Invoice) error {
	return r.db.Create(invoice).Error
}

// GetByID retrieves an invoice by ID with related data
func (r *invoiceRepository) GetByID(id uuid.UUID) (*models.Invoice, error) {
	var invoice models.Invoice
	err := r.db.Preload("Organization").Preload("Subscription").Preload("PaymentMethod").Preload("Items").
		Where("id = ?", id).First(&invoice).Error
	if err != nil {
		return nil, err
	}
	return &invoice, nil
}

// GetByInvoiceNumber retrieves an invoice by invoice number
func (r *invoiceRepository) GetByInvoiceNumber(invoiceNumber string) (*models.Invoice, error) {
	var invoice models.Invoice
	err := r.db.Preload("Organization").Preload("Subscription").Preload("PaymentMethod").Preload("Items").
		Where("invoice_number = ?", invoiceNumber).First(&invoice).Error
	if err != nil {
		return nil, err
	}
	return &invoice, nil
}

// Update updates an existing invoice
func (r *invoiceRepository) Update(invoice *models.Invoice) error {
	return r.db.Save(invoice).Error
}

// Delete soft deletes an invoice by ID
func (r *invoiceRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Invoice{}, id).Error
}

// List retrieves invoices with pagination
func (r *invoiceRepository) List(limit, offset int) ([]*models.Invoice, error) {
	var invoices []*models.Invoice
	err := r.db.Preload("Organization").Preload("Subscription").
		Order("created_at DESC").Limit(limit).Offset(offset).Find(&invoices).Error
	return invoices, err
}

// Count returns the total number of invoices
func (r *invoiceRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&models.Invoice{}).Count(&count).Error
	return count, err
}

// GetByOrganizationID retrieves invoices for an organization
func (r *invoiceRepository) GetByOrganizationID(orgID uuid.UUID, limit, offset int) ([]*models.Invoice, error) {
	var invoices []*models.Invoice
	err := r.db.Preload("Subscription").Preload("Items").
		Where("organization_id = ?", orgID).
		Order("created_at DESC").Limit(limit).Offset(offset).Find(&invoices).Error
	return invoices, err
}

// GetByStatus retrieves invoices by status
func (r *invoiceRepository) GetByStatus(status string, limit, offset int) ([]*models.Invoice, error) {
	var invoices []*models.Invoice
	err := r.db.Preload("Organization").Preload("Subscription").
		Where("status = ?", status).
		Order("created_at DESC").Limit(limit).Offset(offset).Find(&invoices).Error
	return invoices, err
}

// GetOverdue retrieves overdue invoices
func (r *invoiceRepository) GetOverdue() ([]*models.Invoice, error) {
	var invoices []*models.Invoice
	err := r.db.Preload("Organization").Preload("Subscription").
		Where("status != ? AND due_date < ?", "paid", time.Now()).
		Order("due_date ASC").Find(&invoices).Error
	return invoices, err
}

// GetByDateRange retrieves invoices within a date range
func (r *invoiceRepository) GetByDateRange(startDate, endDate time.Time, limit, offset int) ([]*models.Invoice, error) {
	var invoices []*models.Invoice
	err := r.db.Preload("Organization").Preload("Subscription").
		Where("issue_date >= ? AND issue_date <= ?", startDate, endDate).
		Order("issue_date DESC").Limit(limit).Offset(offset).Find(&invoices).Error
	return invoices, err
}