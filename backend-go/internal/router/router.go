package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go-backend/internal/handlers"
	"go-backend/internal/middleware"
	"go-backend/pkg/utils"
)

// SetupRouter configures and returns the main router
func SetupRouter(handlers *handlers.Handlers, jwtManager *utils.JWTManager) *gin.Engine {
	// Set Gin mode
	gin.SetMode(gin.ReleaseMode) // Change to gin.DebugMode for development

	// Create router
	router := gin.New()

	// Global middleware
	router.Use(middleware.LoggerMiddleware())
	router.Use(middleware.RecoveryMiddleware())
	router.Use(middleware.CORSMiddleware())
	router.Use(middleware.SecurityHeadersMiddleware())
	router.Use(middleware.RequestIDMiddleware())

	// Rate limiting middleware (100 requests per second, burst of 200)
	router.Use(middleware.RateLimitMiddleware(100, 200))

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "Server is running",
			"version": "1.0.0",
		})
	})

	// API version 1
	v1 := router.Group("/api/v1")

	// Authentication middleware
	authMiddleware := middleware.AuthMiddleware(jwtManager)

	// Register routes
	registerAuthRoutes(v1, handlers.Auth)
	registerPlanRoutes(v1, handlers.Plan, authMiddleware)
	registerSubscriptionRoutes(v1, handlers.Subscription, authMiddleware)
	registerInvoiceRoutes(v1, handlers.Invoice, authMiddleware)

	// Protected routes that require authentication
	protected := v1.Group("", authMiddleware)
	{
		// User profile endpoints
		protected.GET("/profile", getProfile)
		protected.PUT("/profile", updateProfile)

		// Organization endpoints
		protected.GET("/organizations", getOrganizations)
		protected.POST("/organizations", createOrganization)
		protected.GET("/organizations/:id", getOrganization)
		protected.PUT("/organizations/:id", updateOrganization)
	}

	// Admin routes
	admin := v1.Group("/admin", authMiddleware, middleware.AdminMiddleware())
	{
		admin.GET("/users", getUsers)
		admin.GET("/organizations", getAllOrganizations)
		admin.GET("/subscriptions", getAllSubscriptions)
		admin.GET("/analytics", getAnalytics)
	}

	// 404 handler
	router.NoRoute(func(c *gin.Context) {
		utils.NotFoundResponse(c, "Endpoint not found")
	})

	return router
}

// registerAuthRoutes registers authentication routes
func registerAuthRoutes(router *gin.RouterGroup, authHandler *handlers.AuthHandler) {
	authHandler.RegisterRoutes(router)
}

// registerPlanRoutes registers plan routes
func registerPlanRoutes(router *gin.RouterGroup, planHandler *handlers.PlanHandler, authMiddleware gin.HandlerFunc) {
	planHandler.RegisterRoutes(router, authMiddleware)
}

// registerSubscriptionRoutes registers subscription routes
func registerSubscriptionRoutes(router *gin.RouterGroup, subscriptionHandler *handlers.SubscriptionHandler, authMiddleware gin.HandlerFunc) {
	subscriptionHandler.RegisterRoutes(router, authMiddleware)
}

// registerInvoiceRoutes registers invoice routes
func registerInvoiceRoutes(router *gin.RouterGroup, invoiceHandler *handlers.InvoiceHandler, authMiddleware gin.HandlerFunc) {
	invoiceHandler.RegisterRoutes(router, authMiddleware)
}

// Placeholder handlers for endpoints not yet implemented

// getProfile gets user profile
func getProfile(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		utils.UnauthorizedResponse(c, "Authentication required")
		return
	}

	// TODO: Implement user profile retrieval
	utils.SuccessResponse(c, http.StatusOK, "Profile retrieved successfully", gin.H{
		"user_id": userID,
		"message": "Profile endpoint not yet implemented",
	})
}

// updateProfile updates user profile
func updateProfile(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		utils.UnauthorizedResponse(c, "Authentication required")
		return
	}

	// TODO: Implement user profile update
	utils.SuccessResponse(c, http.StatusOK, "Profile updated successfully", gin.H{
		"user_id": userID,
		"message": "Profile update endpoint not yet implemented",
	})
}

// getOrganizations gets user's organizations
func getOrganizations(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		utils.UnauthorizedResponse(c, "Authentication required")
		return
	}

	// TODO: Implement organizations retrieval
	utils.SuccessResponse(c, http.StatusOK, "Organizations retrieved successfully", gin.H{
		"user_id": userID,
		"message": "Organizations endpoint not yet implemented",
	})
}

// createOrganization creates a new organization
func createOrganization(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		utils.UnauthorizedResponse(c, "Authentication required")
		return
	}

	// TODO: Implement organization creation
	utils.SuccessResponse(c, http.StatusCreated, "Organization created successfully", gin.H{
		"user_id": userID,
		"message": "Organization creation endpoint not yet implemented",
	})
}

// getOrganization gets a specific organization
func getOrganization(c *gin.Context) {
	orgID := c.Param("id")
	userID, exists := middleware.GetUserID(c)
	if !exists {
		utils.UnauthorizedResponse(c, "Authentication required")
		return
	}

	// TODO: Implement organization retrieval
	utils.SuccessResponse(c, http.StatusOK, "Organization retrieved successfully", gin.H{
		"user_id":        userID,
		"organization_id": orgID,
		"message":        "Organization endpoint not yet implemented",
	})
}

// updateOrganization updates an organization
func updateOrganization(c *gin.Context) {
	orgID := c.Param("id")
	userID, exists := middleware.GetUserID(c)
	if !exists {
		utils.UnauthorizedResponse(c, "Authentication required")
		return
	}

	// TODO: Implement organization update
	utils.SuccessResponse(c, http.StatusOK, "Organization updated successfully", gin.H{
		"user_id":        userID,
		"organization_id": orgID,
		"message":        "Organization update endpoint not yet implemented",
	})
}

// Admin endpoints

// getUsers gets all users (admin only)
func getUsers(c *gin.Context) {
	// TODO: Implement users retrieval
	utils.SuccessResponse(c, http.StatusOK, "Users retrieved successfully", gin.H{
		"message": "Admin users endpoint not yet implemented",
	})
}

// getAllOrganizations gets all organizations (admin only)
func getAllOrganizations(c *gin.Context) {
	// TODO: Implement all organizations retrieval
	utils.SuccessResponse(c, http.StatusOK, "Organizations retrieved successfully", gin.H{
		"message": "Admin organizations endpoint not yet implemented",
	})
}

// getAllSubscriptions gets all subscriptions (admin only)
func getAllSubscriptions(c *gin.Context) {
	// TODO: Implement all subscriptions retrieval
	utils.SuccessResponse(c, http.StatusOK, "Subscriptions retrieved successfully", gin.H{
		"message": "Admin subscriptions endpoint not yet implemented",
	})
}

// getAnalytics gets system analytics (admin only)
func getAnalytics(c *gin.Context) {
	// TODO: Implement analytics
	utils.SuccessResponse(c, http.StatusOK, "Analytics retrieved successfully", gin.H{
		"message": "Admin analytics endpoint not yet implemented",
	})
}