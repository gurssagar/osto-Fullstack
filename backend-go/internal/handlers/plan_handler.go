package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"go-backend/internal/middleware"
	"go-backend/internal/services"
	"go-backend/pkg/utils"
)

// PlanHandler handles plan endpoints
type PlanHandler struct {
	planService *services.PlanService
}

// NewPlanHandler creates a new plan handler
func NewPlanHandler(planService *services.PlanService) *PlanHandler {
	return &PlanHandler{
		planService: planService,
	}
}

// RegisterRoutes registers plan routes
func (h *PlanHandler) RegisterRoutes(router *gin.RouterGroup, authMiddleware gin.HandlerFunc) {
	plans := router.Group("/plans")
	{
		// Public routes
		plans.GET("", h.GetPlans)
		plans.GET("/active", h.GetActivePlans)
		plans.GET("/popular", h.GetPopularPlans)
		plans.GET("/:id", h.GetPlan)
		plans.GET("/slug/:slug", h.GetPlanBySlug)

		// Protected routes (admin only)
		admin := plans.Group("", authMiddleware, middleware.AdminMiddleware())
		{
			admin.POST("", h.CreatePlan)
			admin.PUT("/:id", h.UpdatePlan)
			admin.DELETE("/:id", h.DeletePlan)
			admin.POST("/:id/activate", h.ActivatePlan)
			admin.POST("/:id/deactivate", h.DeactivatePlan)
			admin.POST("/:id/set-popular", h.SetPopularPlan)
		}
	}
}

// GetPlans gets all plans with pagination
// @Summary Get all plans
// @Description Get all plans with pagination
// @Tags plans
// @Accept json
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(10)
// @Success 200 {object} utils.PaginatedResponse{data=[]models.Plan}
// @Failure 500 {object} utils.APIResponse
// @Router /plans [get]
func (h *PlanHandler) GetPlans(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	plans, total, err := h.planService.GetAllPlans(page, limit)
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to get plans", err)
		return
	}

	totalPages := int((total + int64(limit) - 1) / int64(limit))
	pagination := utils.Pagination{
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	}

	utils.PaginatedSuccessResponse(c, "Plans retrieved successfully", plans, pagination)
}

// GetActivePlans gets all active plans
// @Summary Get active plans
// @Description Get all active plans
// @Tags plans
// @Accept json
// @Produce json
// @Success 200 {object} utils.APIResponse{data=[]models.Plan}
// @Failure 500 {object} utils.APIResponse
// @Router /plans/active [get]
func (h *PlanHandler) GetActivePlans(c *gin.Context) {
	plans, err := h.planService.GetActivePlans()
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to get active plans", err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Active plans retrieved successfully", plans)
}

// GetPopularPlans gets all popular plans
// @Summary Get popular plans
// @Description Get all popular plans
// @Tags plans
// @Accept json
// @Produce json
// @Success 200 {object} utils.APIResponse{data=[]models.Plan}
// @Failure 500 {object} utils.APIResponse
// @Router /plans/popular [get]
func (h *PlanHandler) GetPopularPlans(c *gin.Context) {
	plans, err := h.planService.GetPopularPlans()
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to get popular plans", err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Popular plans retrieved successfully", plans)
}

// GetPlan gets a plan by ID
// @Summary Get plan by ID
// @Description Get a specific plan by ID
// @Tags plans
// @Accept json
// @Produce json
// @Param id path string true "Plan ID"
// @Success 200 {object} utils.APIResponse{data=models.Plan}
// @Failure 404 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /plans/{id} [get]
func (h *PlanHandler) GetPlan(c *gin.Context) {
	id := c.Param("id")

	plan, err := h.planService.GetPlanByID(id)
	if err != nil {
		utils.NotFoundResponse(c, "Plan not found")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Plan retrieved successfully", plan)
}

// GetPlanBySlug gets a plan by slug
// @Summary Get plan by slug
// @Description Get a specific plan by slug
// @Tags plans
// @Accept json
// @Produce json
// @Param slug path string true "Plan slug"
// @Success 200 {object} utils.APIResponse{data=models.Plan}
// @Failure 404 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /plans/slug/{slug} [get]
func (h *PlanHandler) GetPlanBySlug(c *gin.Context) {
	slug := c.Param("slug")

	plan, err := h.planService.GetPlanBySlug(slug)
	if err != nil {
		utils.NotFoundResponse(c, "Plan not found")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Plan retrieved successfully", plan)
}

// CreatePlan creates a new plan
// @Summary Create plan
// @Description Create a new subscription plan (admin only)
// @Tags plans
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body services.CreatePlanRequest true "Plan data"
// @Success 201 {object} utils.APIResponse{data=models.Plan}
// @Failure 400 {object} utils.APIResponse
// @Failure 401 {object} utils.APIResponse
// @Failure 403 {object} utils.APIResponse
// @Failure 409 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /plans [post]
func (h *PlanHandler) CreatePlan(c *gin.Context) {
	var req services.CreatePlanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	plan, err := h.planService.CreatePlan(&req)
	if err != nil {
		if err.Error() == "plan with this name already exists" {
			utils.ErrorResponse(c, http.StatusConflict, "Plan already exists", err)
			return
		}
		if err.Error() == "invalid currency code" {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid currency code", err)
			return
		}
		utils.InternalServerErrorResponse(c, "Failed to create plan", err)
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Plan created successfully", plan)
}

// UpdatePlan updates a plan
// @Summary Update plan
// @Description Update an existing plan (admin only)
// @Tags plans
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "Plan ID"
// @Param request body services.UpdatePlanRequest true "Plan update data"
// @Success 200 {object} utils.APIResponse{data=models.Plan}
// @Failure 400 {object} utils.APIResponse
// @Failure 401 {object} utils.APIResponse
// @Failure 403 {object} utils.APIResponse
// @Failure 404 {object} utils.APIResponse
// @Failure 409 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /plans/{id} [put]
func (h *PlanHandler) UpdatePlan(c *gin.Context) {
	id := c.Param("id")

	var req services.UpdatePlanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	plan, err := h.planService.UpdatePlan(id, &req)
	if err != nil {
		if err.Error() == "plan with this name already exists" {
			utils.ErrorResponse(c, http.StatusConflict, "Plan name already exists", err)
			return
		}
		if err.Error() == "invalid currency code" {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid currency code", err)
			return
		}
		utils.InternalServerErrorResponse(c, "Failed to update plan", err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Plan updated successfully", plan)
}

// DeletePlan deletes a plan
// @Summary Delete plan
// @Description Delete a plan (admin only)
// @Tags plans
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "Plan ID"
// @Success 200 {object} utils.APIResponse
// @Failure 401 {object} utils.APIResponse
// @Failure 403 {object} utils.APIResponse
// @Failure 404 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /plans/{id} [delete]
func (h *PlanHandler) DeletePlan(c *gin.Context) {
	id := c.Param("id")

	if err := h.planService.DeletePlan(id); err != nil {
		utils.InternalServerErrorResponse(c, "Failed to delete plan", err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Plan deleted successfully", nil)
}

// ActivatePlan activates a plan
// @Summary Activate plan
// @Description Activate a plan (admin only)
// @Tags plans
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "Plan ID"
// @Success 200 {object} utils.APIResponse
// @Failure 401 {object} utils.APIResponse
// @Failure 403 {object} utils.APIResponse
// @Failure 404 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /plans/{id}/activate [post]
func (h *PlanHandler) ActivatePlan(c *gin.Context) {
	id := c.Param("id")

	if err := h.planService.ActivatePlan(id); err != nil {
		utils.InternalServerErrorResponse(c, "Failed to activate plan", err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Plan activated successfully", nil)
}

// DeactivatePlan deactivates a plan
// @Summary Deactivate plan
// @Description Deactivate a plan (admin only)
// @Tags plans
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "Plan ID"
// @Success 200 {object} utils.APIResponse
// @Failure 401 {object} utils.APIResponse
// @Failure 403 {object} utils.APIResponse
// @Failure 404 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /plans/{id}/deactivate [post]
func (h *PlanHandler) DeactivatePlan(c *gin.Context) {
	id := c.Param("id")

	if err := h.planService.DeactivatePlan(id); err != nil {
		utils.InternalServerErrorResponse(c, "Failed to deactivate plan", err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Plan deactivated successfully", nil)
}

// SetPopularPlan sets a plan as popular
// @Summary Set popular plan
// @Description Set a plan as popular (admin only)
// @Tags plans
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "Plan ID"
// @Success 200 {object} utils.APIResponse
// @Failure 401 {object} utils.APIResponse
// @Failure 403 {object} utils.APIResponse
// @Failure 404 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /plans/{id}/set-popular [post]
func (h *PlanHandler) SetPopularPlan(c *gin.Context) {
	id := c.Param("id")

	if err := h.planService.SetPopularPlan(id); err != nil {
		utils.InternalServerErrorResponse(c, "Failed to set popular plan", err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Plan set as popular successfully", nil)
}