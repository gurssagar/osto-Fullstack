package handlers

import (
	"net/http"
	"strconv"

	"go-backend/internal/middleware"
	"go-backend/internal/services"
	"go-backend/pkg/utils"

	"github.com/gin-gonic/gin"
)

// SubscriptionHandler handles subscription endpoints
type SubscriptionHandler struct {
	subscriptionService *services.SubscriptionService
}

// NewSubscriptionHandler creates a new subscription handler
func NewSubscriptionHandler(subscriptionService *services.SubscriptionService) *SubscriptionHandler {
	return &SubscriptionHandler{
		subscriptionService: subscriptionService,
	}
}

// RegisterRoutes registers subscription routes
func (h *SubscriptionHandler) RegisterRoutes(router *gin.RouterGroup, authMiddleware gin.HandlerFunc) {
	subscriptions := router.Group("/subscriptions", authMiddleware)
	{
		subscriptions.GET("", h.GetSubscriptions)
		subscriptions.POST("", h.CreateSubscription)
		subscriptions.GET("/organization/:org_id", middleware.OrganizationMiddleware(), h.GetSubscriptionsByOrganization)
		subscriptions.GET("/organization/:org_id/active", middleware.OrganizationMiddleware(), h.GetActiveSubscription)
		subscriptions.GET("/:id", h.GetSubscription)
		subscriptions.POST("/:id/cancel", h.CancelSubscription)
		subscriptions.POST("/:id/renew", h.RenewSubscription)
	}
}

// CreateSubscription creates a new subscription
// @Summary Create subscription
// @Description Create a new subscription for an organization
// @Tags subscriptions
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body services.CreateSubscriptionRequest true "Subscription data"
// @Success 201 {object} utils.APIResponse{data=services.SubscriptionResponse}
// @Failure 400 {object} utils.APIResponse
// @Failure 401 {object} utils.APIResponse
// @Failure 404 {object} utils.APIResponse
// @Failure 409 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /subscriptions [post]
func (h *SubscriptionHandler) CreateSubscription(c *gin.Context) {
	var req services.CreateSubscriptionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	// Validate user has access to the organization
	userOrgID, exists := middleware.GetOrganizationID(c)
	if !exists {
		utils.UnauthorizedResponse(c, "Authentication required")
		return
	}

	userRole, _ := middleware.GetUserRole(c)
	if userRole != "admin" && userOrgID != req.OrganizationID {
		utils.ForbiddenResponse(c, "Access denied for this organization")
		return
	}

	response, err := h.subscriptionService.CreateSubscription(&req)
	if err != nil {
		switch err.Error() {
		case "organization not found":
			utils.NotFoundResponse(c, "Organization not found")
		case "plan not found":
			utils.NotFoundResponse(c, "Plan not found")
		case "plan is not active":
			utils.ErrorResponse(c, http.StatusBadRequest, "Plan is not active", err)
		case "organization already has an active subscription":
			utils.ErrorResponse(c, http.StatusConflict, "Organization already has an active subscription", err)
		case "invalid plan interval":
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid plan interval", err)
		default:
			utils.InternalServerErrorResponse(c, "Failed to create subscription", err)
		}
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Subscription created successfully", response)
}

// GetSubscriptions gets all subscriptions for the authenticated user
// @Summary Get user subscriptions
// @Description Get all subscriptions for the authenticated user
// @Tags subscriptions
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(10)
// @Success 200 {object} utils.PaginatedResponse{data=[]models.Subscription}
// @Failure 401 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /subscriptions [get]
func (h *SubscriptionHandler) GetSubscriptions(c *gin.Context) {
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

	// Get user's organization ID from middleware or user service
	userOrgID, exists := middleware.GetOrganizationID(c)
	if !exists {
		// If no organization ID in middleware, we'll return empty results
		// This could be enhanced to get user's organization from user service
		utils.PaginatedSuccessResponse(c, "Subscriptions retrieved successfully", []interface{}{}, utils.Pagination{
			Page:       page,
			Limit:      limit,
			Total:      0,
			TotalPages: 0,
		})
		return
	}

	subscriptions, total, err := h.subscriptionService.GetSubscriptionsByOrganization(userOrgID, page, limit)
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to get subscriptions", err)
		return
	}

	totalPages := int((total + int64(limit) - 1) / int64(limit))
	pagination := utils.Pagination{
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	}

	utils.PaginatedSuccessResponse(c, "Subscriptions retrieved successfully", subscriptions, pagination)
}

// GetSubscriptionsByOrganization gets subscriptions for an organization
// @Summary Get organization subscriptions
// @Description Get all subscriptions for an organization
// @Tags subscriptions
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param org_id path string true "Organization ID"
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(10)
// @Success 200 {object} utils.PaginatedResponse{data=[]models.Subscription}
// @Failure 401 {object} utils.APIResponse
// @Failure 403 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /subscriptions/organization/{org_id} [get]
func (h *SubscriptionHandler) GetSubscriptionsByOrganization(c *gin.Context) {
	orgID := c.Param("org_id")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	subscriptions, total, err := h.subscriptionService.GetSubscriptionsByOrganization(orgID, page, limit)
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to get subscriptions", err)
		return
	}

	totalPages := int((total + int64(limit) - 1) / int64(limit))
	pagination := utils.Pagination{
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	}

	utils.PaginatedSuccessResponse(c, "Subscriptions retrieved successfully", subscriptions, pagination)
}

// GetActiveSubscription gets the active subscription for an organization
// @Summary Get active subscription
// @Description Get the active subscription for an organization
// @Tags subscriptions
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param org_id path string true "Organization ID"
// @Success 200 {object} utils.APIResponse{data=services.SubscriptionResponse}
// @Failure 401 {object} utils.APIResponse
// @Failure 403 {object} utils.APIResponse
// @Failure 404 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /subscriptions/organization/{org_id}/active [get]
func (h *SubscriptionHandler) GetActiveSubscription(c *gin.Context) {
	orgID := c.Param("org_id")

	response, err := h.subscriptionService.GetActiveSubscription(orgID)
	if err != nil {
		if err.Error() == "no active subscription found" {
			utils.NotFoundResponse(c, "No active subscription found")
			return
		}
		utils.InternalServerErrorResponse(c, "Failed to get active subscription", err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Active subscription retrieved successfully", response)
}

// GetSubscription gets a subscription by ID
// @Summary Get subscription
// @Description Get a specific subscription by ID
// @Tags subscriptions
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "Subscription ID"
// @Success 200 {object} utils.APIResponse{data=models.Subscription}
// @Failure 401 {object} utils.APIResponse
// @Failure 403 {object} utils.APIResponse
// @Failure 404 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /subscriptions/{id} [get]
func (h *SubscriptionHandler) GetSubscription(c *gin.Context) {
	// Note: This would require a GetByID method in the subscription service
	// For now, we'll return a not implemented response
	utils.ErrorResponse(c, http.StatusNotImplemented, "Method not implemented", nil)
}

// CancelSubscription cancels a subscription
// @Summary Cancel subscription
// @Description Cancel a subscription
// @Tags subscriptions
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "Subscription ID"
// @Param request body CancelSubscriptionRequest true "Cancellation data"
// @Success 200 {object} utils.APIResponse
// @Failure 400 {object} utils.APIResponse
// @Failure 401 {object} utils.APIResponse
// @Failure 403 {object} utils.APIResponse
// @Failure 404 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /subscriptions/{id}/cancel [post]
func (h *SubscriptionHandler) CancelSubscription(c *gin.Context) {
	id := c.Param("id")

	var req struct {
		Immediate bool `json:"immediate"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	// TODO: Add authorization check to ensure user can cancel this subscription

	if err := h.subscriptionService.CancelSubscription(id, req.Immediate); err != nil {
		if err.Error() == "subscription is already canceled" {
			utils.ErrorResponse(c, http.StatusBadRequest, "Subscription is already canceled", err)
			return
		}
		utils.InternalServerErrorResponse(c, "Failed to cancel subscription", err)
		return
	}

	message := "Subscription canceled successfully"
	if !req.Immediate {
		message = "Subscription will be canceled at the end of the current period"
	}

	utils.SuccessResponse(c, http.StatusOK, message, nil)
}

// RenewSubscription renews a subscription
// @Summary Renew subscription
// @Description Renew a subscription for the next period
// @Tags subscriptions
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "Subscription ID"
// @Success 200 {object} utils.APIResponse
// @Failure 400 {object} utils.APIResponse
// @Failure 401 {object} utils.APIResponse
// @Failure 403 {object} utils.APIResponse
// @Failure 404 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /subscriptions/{id}/renew [post]
func (h *SubscriptionHandler) RenewSubscription(c *gin.Context) {
	id := c.Param("id")

	// TODO: Add authorization check to ensure user can renew this subscription

	if err := h.subscriptionService.RenewSubscription(id); err != nil {
		if err.Error() == "only active subscriptions can be renewed" {
			utils.ErrorResponse(c, http.StatusBadRequest, "Only active subscriptions can be renewed", err)
			return
		}
		if err.Error() == "invalid plan interval" {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid plan interval", err)
			return
		}
		utils.InternalServerErrorResponse(c, "Failed to renew subscription", err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Subscription renewed successfully", nil)
}
