package middleware

import (
	
	"github.com/gin-gonic/gin"
	"go-backend/pkg/utils"
)

// AuthMiddleware validates JWT tokens and sets user context
func AuthMiddleware(jwtManager *utils.JWTManager) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extract token from Authorization header
		token := utils.ExtractTokenFromHeader(c.GetHeader("Authorization"))
		if token == "" {
			utils.UnauthorizedResponse(c, "Missing or invalid authorization token")
			c.Abort()
			return
		}

		// Validate token
		claims, err := jwtManager.ValidateToken(token)
		if err != nil {
			utils.UnauthorizedResponse(c, "Invalid or expired token")
			c.Abort()
			return
		}

		// Set user context
		c.Set("user_id", claims.UserID)
		c.Set("organization_id", claims.OrganizationID)
		c.Set("role", claims.Role)
		c.Set("claims", claims)

		c.Next()
	}
}

// OptionalAuthMiddleware validates JWT tokens but doesn't require them
func OptionalAuthMiddleware(jwtManager *utils.JWTManager) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extract token from Authorization header
		token := utils.ExtractTokenFromHeader(c.GetHeader("Authorization"))
		if token != "" {
			// Validate token if present
			claims, err := jwtManager.ValidateToken(token)
			if err == nil {
				// Set user context if token is valid
				c.Set("user_id", claims.UserID)
				c.Set("organization_id", claims.OrganizationID)
				c.Set("role", claims.Role)
				c.Set("claims", claims)
			}
		}

		c.Next()
	}
}

// AdminMiddleware ensures the user has admin role
func AdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists {
			utils.UnauthorizedResponse(c, "Authentication required")
			c.Abort()
			return
		}

		if role != "admin" {
			utils.ForbiddenResponse(c, "Admin access required")
			c.Abort()
			return
		}

		c.Next()
	}
}

// OrganizationMiddleware ensures the user belongs to the specified organization
func OrganizationMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		userOrgID, exists := c.Get("organization_id")
		if !exists {
			utils.UnauthorizedResponse(c, "Authentication required")
			c.Abort()
			return
		}

		// Get organization ID from URL parameter
		requiredOrgID := c.Param("organization_id")
		if requiredOrgID == "" {
			requiredOrgID = c.Param("org_id")
		}

		// Check if user belongs to the organization or is admin
		role, _ := c.Get("role")
		if role != "admin" && userOrgID != requiredOrgID {
			utils.ForbiddenResponse(c, "Access denied for this organization")
			c.Abort()
			return
		}

		c.Next()
	}
}

// GetUserID extracts user ID from context
func GetUserID(c *gin.Context) (string, bool) {
	userID, exists := c.Get("user_id")
	if !exists {
		return "", false
	}
	return userID.(string), true
}

// GetOrganizationID extracts organization ID from context
func GetOrganizationID(c *gin.Context) (string, bool) {
	orgID, exists := c.Get("organization_id")
	if !exists {
		return "", false
	}
	return orgID.(string), true
}

// GetUserRole extracts user role from context
func GetUserRole(c *gin.Context) (string, bool) {
	role, exists := c.Get("role")
	if !exists {
		return "", false
	}
	return role.(string), true
}

// GetClaims extracts JWT claims from context
func GetClaims(c *gin.Context) (*utils.JWTClaims, bool) {
	claims, exists := c.Get("claims")
	if !exists {
		return nil, false
	}
	return claims.(*utils.JWTClaims), true
}