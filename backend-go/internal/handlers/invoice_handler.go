package handlers

import (
	"net/http"
	"strconv"
	"time"

	"go-backend/internal/middleware"
	"go-backend/internal/services"
	"go-backend/pkg/utils"

	"github.com/gin-gonic/gin"
)

// InvoiceHandler handles invoice endpoints
type InvoiceHandler struct {
	invoiceService *services.InvoiceService
}

// NewInvoiceHandler creates a new invoice handler
func NewInvoiceHandler(invoiceService *services.InvoiceService) *InvoiceHandler {
	return &InvoiceHandler{
		invoiceService: invoiceService,
	}
}

// RegisterRoutes registers invoice routes
func (h *InvoiceHandler) RegisterRoutes(router *gin.RouterGroup, authMiddleware gin.HandlerFunc) {
	invoices := router.Group("/invoices", authMiddleware)
	{
		invoices.GET("", h.GetInvoices)
		invoices.GET("/:id", h.GetInvoice)
		invoices.GET("/organization/:org_id", middleware.OrganizationMiddleware(), h.GetInvoicesByOrganization)
		invoices.GET("/overdue", h.GetOverdueInvoices)
		invoices.GET("/date-range", h.GetInvoicesByDateRange)
	}
}

// GetInvoices gets all invoices with pagination
// @Summary Get invoices
// @Description Get all invoices with pagination
// @Tags invoices
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(10)
// @Success 200 {object} utils.PaginatedResponse{data=[]models.Invoice}
// @Failure 401 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /invoices [get]
func (h *InvoiceHandler) GetInvoices(c *gin.Context) {
	_, exists := middleware.GetUserID(c)
	if !exists {
		utils.UnauthorizedResponse(c, "Authentication required")
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	invoices, total, err := h.invoiceService.GetAllInvoices(page, limit)
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to get invoices", err)
		return
	}

	totalPages := int((total + int64(limit) - 1) / int64(limit))
	pagination := utils.Pagination{
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	}

	utils.PaginatedSuccessResponse(c, "Invoices retrieved successfully", invoices, pagination)
}

// GetInvoice gets an invoice by ID
// @Summary Get invoice by ID
// @Description Get a specific invoice by ID
// @Tags invoices
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "Invoice ID"
// @Success 200 {object} utils.APIResponse{data=models.Invoice}
// @Failure 401 {object} utils.APIResponse
// @Failure 404 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /invoices/{id} [get]
func (h *InvoiceHandler) GetInvoice(c *gin.Context) {
	_, exists := middleware.GetUserID(c)
	if !exists {
		utils.UnauthorizedResponse(c, "Authentication required")
		return
	}

	invoiceID := c.Param("id")
	invoice, err := h.invoiceService.GetInvoiceByID(invoiceID)
	if err != nil {
		if err.Error() == "invoice not found" {
			utils.NotFoundResponse(c, "Invoice not found")
			return
		}
		utils.InternalServerErrorResponse(c, "Failed to get invoice", err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Invoice retrieved successfully", invoice)
}

// GetInvoicesByOrganization gets invoices for an organization
// @Summary Get organization invoices
// @Description Get all invoices for an organization
// @Tags invoices
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param org_id path string true "Organization ID"
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(10)
// @Success 200 {object} utils.PaginatedResponse{data=[]models.Invoice}
// @Failure 401 {object} utils.APIResponse
// @Failure 403 {object} utils.APIResponse
// @Failure 404 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /invoices/organization/{org_id} [get]
func (h *InvoiceHandler) GetInvoicesByOrganization(c *gin.Context) {
	orgID := c.Param("org_id")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	invoices, total, err := h.invoiceService.GetInvoicesByOrganization(orgID, page, limit)
	if err != nil {
		if err.Error() == "organization not found" {
			utils.NotFoundResponse(c, "Organization not found")
			return
		}
		if err.Error() == "invalid organization ID" {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid organization ID", err)
			return
		}
		utils.InternalServerErrorResponse(c, "Failed to get organization invoices", err)
		return
	}

	totalPages := int((total + int64(limit) - 1) / int64(limit))
	pagination := utils.Pagination{
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	}

	utils.PaginatedSuccessResponse(c, "Organization invoices retrieved successfully", invoices, pagination)
}

// GetOverdueInvoices gets all overdue invoices
// @Summary Get overdue invoices
// @Description Get all overdue invoices
// @Tags invoices
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} utils.APIResponse{data=[]models.Invoice}
// @Failure 401 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /invoices/overdue [get]
func (h *InvoiceHandler) GetOverdueInvoices(c *gin.Context) {
	_, exists := middleware.GetUserID(c)
	if !exists {
		utils.UnauthorizedResponse(c, "Authentication required")
		return
	}

	invoices, err := h.invoiceService.GetOverdueInvoices()
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to get overdue invoices", err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Overdue invoices retrieved successfully", invoices)
}

// GetInvoicesByDateRange gets invoices within a date range
// @Summary Get invoices by date range
// @Description Get invoices within a specific date range
// @Tags invoices
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param start_date query string true "Start date (YYYY-MM-DD)"
// @Param end_date query string true "End date (YYYY-MM-DD)"
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(10)
// @Success 200 {object} utils.PaginatedResponse{data=[]models.Invoice}
// @Failure 400 {object} utils.APIResponse
// @Failure 401 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /invoices/date-range [get]
func (h *InvoiceHandler) GetInvoicesByDateRange(c *gin.Context) {
	_, exists := middleware.GetUserID(c)
	if !exists {
		utils.UnauthorizedResponse(c, "Authentication required")
		return
	}

	startDateStr := c.Query("start_date")
	endDateStr := c.Query("end_date")

	if startDateStr == "" || endDateStr == "" {
		utils.ErrorResponse(c, http.StatusBadRequest, "start_date and end_date are required", nil)
		return
	}

	startDate, err := time.Parse("2006-01-02", startDateStr)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid start_date format. Use YYYY-MM-DD", err)
		return
	}

	endDate, err := time.Parse("2006-01-02", endDateStr)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid end_date format. Use YYYY-MM-DD", err)
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	invoices, total, err := h.invoiceService.GetInvoicesByDateRange(startDate, endDate, page, limit)
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to get invoices by date range", err)
		return
	}

	totalPages := int((total + int64(limit) - 1) / int64(limit))
	pagination := utils.Pagination{
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	}

	utils.PaginatedSuccessResponse(c, "Invoices retrieved successfully", invoices, pagination)
}