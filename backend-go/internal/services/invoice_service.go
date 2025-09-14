package services

import (
	"errors"
	"go-backend/internal/models"
	"go-backend/internal/repository"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// InvoiceService handles invoice business logic
type InvoiceService struct {
	invoiceRepo repository.InvoiceRepository
	orgRepo     repository.OrganizationRepository
}

// NewInvoiceService creates a new invoice service
func NewInvoiceService(invoiceRepo repository.InvoiceRepository, orgRepo repository.OrganizationRepository) *InvoiceService {
	return &InvoiceService{
		invoiceRepo: invoiceRepo,
		orgRepo:     orgRepo,
	}
}

// GetInvoicesByOrganization gets invoices for an organization with pagination
func (s *InvoiceService) GetInvoicesByOrganization(organizationIDStr string, page, limit int) ([]*models.Invoice, int64, error) {
	orgID, err := uuid.Parse(organizationIDStr)
	if err != nil {
		return nil, 0, errors.New("invalid organization ID")
	}

	// Check if organization exists
	_, err = s.orgRepo.GetByID(orgID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, 0, errors.New("organization not found")
		}
		return nil, 0, err
	}

	offset := (page - 1) * limit
	invoices, err := s.invoiceRepo.GetByOrganizationID(orgID, limit, offset)
	if err != nil {
		return nil, 0, err
	}

	// For now, return the length of invoices as total count
	// In a real implementation, you might want a separate count query
	total := int64(len(invoices))

	return invoices, total, nil
}

// GetInvoiceByID gets an invoice by ID
func (s *InvoiceService) GetInvoiceByID(invoiceIDStr string) (*models.Invoice, error) {
	invoiceID, err := uuid.Parse(invoiceIDStr)
	if err != nil {
		return nil, errors.New("invalid invoice ID")
	}

	invoice, err := s.invoiceRepo.GetByID(invoiceID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("invoice not found")
		}
		return nil, err
	}

	return invoice, nil
}

// GetAllInvoices gets all invoices with pagination
func (s *InvoiceService) GetAllInvoices(page, limit int) ([]*models.Invoice, int64, error) {
	offset := (page - 1) * limit
	invoices, err := s.invoiceRepo.List(limit, offset)
	if err != nil {
		return nil, 0, err
	}

	total, err := s.invoiceRepo.Count()
	if err != nil {
		return nil, 0, err
	}

	return invoices, total, nil
}

// GetOverdueInvoices gets all overdue invoices
func (s *InvoiceService) GetOverdueInvoices() ([]*models.Invoice, error) {
	return s.invoiceRepo.GetOverdue()
}

// GetInvoicesByDateRange gets invoices within a date range
func (s *InvoiceService) GetInvoicesByDateRange(startDate, endDate time.Time, page, limit int) ([]*models.Invoice, int64, error) {
	offset := (page - 1) * limit
	invoices, err := s.invoiceRepo.GetByDateRange(startDate, endDate, limit, offset)
	if err != nil {
		return nil, 0, err
	}

	// For now, return the length of invoices as total count
	total := int64(len(invoices))

	return invoices, total, nil
}