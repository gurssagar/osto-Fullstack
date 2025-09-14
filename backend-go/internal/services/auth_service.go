package services

import (
	"errors"
	"time"

	"go-backend/internal/models"
	"go-backend/internal/repository"
	"go-backend/pkg/utils"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// AuthService handles authentication business logic
type AuthService struct {
	userRepo   repository.UserRepository
	orgRepo    repository.OrganizationRepository
	jwtManager *utils.JWTManager
}

// NewAuthService creates a new auth service
func NewAuthService(userRepo repository.UserRepository, orgRepo repository.OrganizationRepository, jwtManager *utils.JWTManager) *AuthService {
	return &AuthService{
		userRepo:   userRepo,
		orgRepo:    orgRepo,
		jwtManager: jwtManager,
	}
}

// RegisterRequest represents user registration data
type RegisterRequest struct {
	FirstName        string `json:"first_name" binding:"required,min=2,max=50"`
	LastName         string `json:"last_name" binding:"required,min=2,max=50"`
	Email            string `json:"email" binding:"required,email"`
	Password         string `json:"password" binding:"required,min=8"`
	OrganizationName string `json:"organization_name" binding:"required,min=2,max=100"`
}

// LoginRequest represents user login data
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// AuthResponse represents authentication response
type AuthResponse struct {
	User         *models.User         `json:"user"`
	Organization *models.Organization `json:"organization"`
	AccessToken  string               `json:"access_token"`
	RefreshToken string               `json:"refresh_token"`
	ExpiresAt    time.Time            `json:"expires_at"`
}

// Register creates a new user and organization
func (s *AuthService) Register(req *RegisterRequest) (*AuthResponse, error) {
	// Check if user already exists
	existingUser, err := s.userRepo.GetByEmail(req.Email)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}
	if existingUser != nil {
		return nil, errors.New("user with this email already exists")
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	// Create organization first
	org := &models.Organization{
		Name:        req.OrganizationName,
		Slug:        utils.GenerateSlug(req.OrganizationName),
		IsActive:    true,
	}

	if err := s.orgRepo.Create(org); err != nil {
		return nil, err
	}

	// Create user
	user := &models.User{
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Email:     req.Email,
		Password:  hashedPassword,
		Role:      "owner",
		IsActive:  true,
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	// Generate access token
	accessToken, err := s.jwtManager.GenerateToken(user.ID, user.Email, user.Role, &org.ID)
	if err != nil {
		return nil, err
	}

	// Save user to database
	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	return &AuthResponse{
		User:         user,
		Organization: org,
		AccessToken:  accessToken,
	}, nil
}

// Login authenticates a user
func (s *AuthService) Login(req *LoginRequest) (*AuthResponse, error) {
	// Get user by email
	user, err := s.userRepo.GetByEmail(req.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("invalid email or password")
		}
		return nil, err
	}

	// Check if user is active
	if !user.IsActive {
		return nil, errors.New("account is deactivated")
	}

	// Verify password
	if !utils.CheckPassword(user.Password, req.Password) {
		return nil, errors.New("invalid email or password")
	}

	// Generate access token (simplified for now)
	accessToken, err := s.jwtManager.GenerateToken(user.ID, user.Email, user.Role, nil)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{
		User:        user,
		AccessToken: accessToken,
	}, nil
}

// RefreshToken generates new access token using refresh token
func (s *AuthService) RefreshToken(refreshToken string) (*AuthResponse, error) {
	// Validate refresh token
	claims, err := s.jwtManager.ValidateToken(refreshToken)
	if err != nil {
		return nil, errors.New("invalid refresh token")
	}

	// Get user
	user, err := s.userRepo.GetByID(claims.UserID)
	if err != nil {
		return nil, err
	}

	// Check if user is active
	if !user.IsActive {
		return nil, errors.New("account is deactivated")
	}

	// Generate new access token
	newAccessToken, err := s.jwtManager.GenerateToken(user.ID, user.Email, user.Role, claims.OrganizationID)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{
		User:        user,
		AccessToken: newAccessToken,
	}, nil
}

// Logout invalidates user's refresh token
func (s *AuthService) Logout(userID string) error {
	// For now, just return success since we don't store refresh tokens
	return nil
}

// ChangePassword changes user's password
func (s *AuthService) ChangePassword(userIDStr, currentPassword, newPassword string) error {
	// Parse UUID
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return errors.New("invalid user ID")
	}

	user, err := s.userRepo.GetByID(userID)
	if err != nil {
		return err
	}

	// Verify current password
	if !utils.CheckPassword(user.Password, currentPassword) {
		return errors.New("current password is incorrect")
	}

	// Hash new password
	hashedPassword, err := utils.HashPassword(newPassword)
	if err != nil {
		return err
	}

	// Update password
	user.Password = hashedPassword
	return s.userRepo.Update(user)
}