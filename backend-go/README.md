# OstoBilling Backend

A comprehensive subscription billing backend built with Go, Gin, GORM, and PostgreSQL. This backend provides a complete solution for managing users, organizations, subscription plans, and billing.

## Features

- 🔐 **JWT Authentication** - Secure user authentication with access and refresh tokens
- 👥 **User Management** - User registration, login, profile management
- 🏢 **Organization Management** - Multi-tenant organization support
- 💳 **Subscription Management** - Flexible subscription plans and billing cycles
- 📊 **Invoice Management** - Automated invoice generation and tracking
- 🛡️ **Security Middleware** - Rate limiting, CORS, security headers
- 📝 **Comprehensive Logging** - Request logging and error tracking
- 🗄️ **Database Migrations** - Automated database schema management
- 🔄 **Graceful Shutdown** - Proper server shutdown handling

## Tech Stack

- **Language**: Go 1.21+
- **Web Framework**: Gin
- **ORM**: GORM
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Configuration**: Environment variables
- **Migrations**: SQL migrations

## Project Structure

```
go-backend/
├── cmd/
│   └── server/
│       └── main.go              # Application entry point
├── config/
│   └── config.go                # Configuration management
├── internal/
│   ├── database/
│   │   └── database.go          # Database connection and setup
│   ├── handlers/
│   │   ├── auth_handler.go      # Authentication endpoints
│   │   ├── plan_handler.go      # Subscription plan endpoints
│   │   ├── subscription_handler.go # Subscription endpoints
│   │   └── handlers.go          # Handler aggregator
│   ├── middleware/
│   │   ├── auth.go              # Authentication middleware
│   │   └── middleware.go        # General middleware
│   ├── models/
│   │   ├── user.go              # User model
│   │   ├── organization.go      # Organization model
│   │   ├── plan.go              # Plan model
│   │   ├── subscription.go      # Subscription model
│   │   └── invoice.go           # Invoice model
│   ├── repository/
│   │   └── repository.go        # Repository interfaces and implementations
│   ├── router/
│   │   └── router.go            # Route configuration
│   └── services/
│       ├── auth_service.go      # Authentication business logic
│       ├── plan_service.go      # Plan business logic
│       ├── subscription_service.go # Subscription business logic
│       └── services.go          # Service aggregator
├── migrations/
│   ├── 001_create_tables.up.sql   # Database schema creation
│   └── 001_create_tables.down.sql # Database schema rollback
├── pkg/
│   └── utils/
│       ├── jwt.go               # JWT utilities
│       ├── password.go          # Password hashing utilities
│       ├── response.go          # HTTP response utilities
│       └── slug.go              # URL slug utilities
├── .env.example                 # Environment variables template
├── go.mod                       # Go module definition
└── README.md                    # This file
```

## Prerequisites

- Go 1.21 or higher
- PostgreSQL 12 or higher
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd go-backend
   ```

2. **Install dependencies**
   ```bash
   go mod download
   ```

3. **Set up PostgreSQL database**
   ```sql
   CREATE DATABASE ostobilling;
   CREATE USER ostobilling_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE ostobilling TO ostobilling_user;
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Server Configuration
   PORT=8080
   ENVIRONMENT=development
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=ostobilling_user
   DB_PASSWORD=your_password
   DB_NAME=ostobilling
   DB_SSLMODE=disable
   
   # JWT Configuration
   JWT_SECRET_KEY=your-super-secret-jwt-key-here
   JWT_ACCESS_TOKEN_EXPIRY=15m
   JWT_REFRESH_TOKEN_EXPIRY=7d
   ```

5. **Run database migrations**
   ```bash
   # The application will automatically run migrations on startup
   # Or you can run them manually using a migration tool
   ```

## Running the Application

### Development Mode
```bash
go run cmd/server/main.go
```

### Production Mode
```bash
# Build the application
go build -o bin/server cmd/server/main.go

# Run the binary
./bin/server
```

### Using Docker (Optional)
```bash
# Build Docker image
docker build -t go-backend .

# Run with Docker Compose
docker-compose up -d
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout
- `PUT /api/v1/auth/change-password` - Change password

### Subscription Plans
- `GET /api/v1/plans` - List all plans
- `GET /api/v1/plans/:id` - Get plan by ID
- `POST /api/v1/plans` - Create new plan (Admin only)
- `PUT /api/v1/plans/:id` - Update plan (Admin only)
- `DELETE /api/v1/plans/:id` - Delete plan (Admin only)
- `PUT /api/v1/plans/:id/activate` - Activate plan (Admin only)
- `PUT /api/v1/plans/:id/deactivate` - Deactivate plan (Admin only)

### Subscriptions
- `GET /api/v1/subscriptions` - List user's subscriptions
- `GET /api/v1/subscriptions/:id` - Get subscription by ID
- `POST /api/v1/subscriptions` - Create new subscription
- `PUT /api/v1/subscriptions/:id/cancel` - Cancel subscription
- `PUT /api/v1/subscriptions/:id/renew` - Renew subscription

### User Profile
- `GET /api/v1/profile` - Get user profile
- `PUT /api/v1/profile` - Update user profile

### Organizations
- `GET /api/v1/organizations` - List user's organizations
- `POST /api/v1/organizations` - Create organization
- `GET /api/v1/organizations/:id` - Get organization
- `PUT /api/v1/organizations/:id` - Update organization

### Admin Endpoints
- `GET /api/v1/admin/users` - List all users
- `GET /api/v1/admin/organizations` - List all organizations
- `GET /api/v1/admin/subscriptions` - List all subscriptions
- `GET /api/v1/admin/analytics` - Get system analytics

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Token Refresh
When the access token expires, use the refresh token to get a new access token:

```bash
curl -X POST http://localhost:8080/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "your_refresh_token"}'
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Rate Limiting

The API implements rate limiting:
- 100 requests per second
- Burst limit of 200 requests
- Rate limit headers included in responses

## Security Features

- **Password Hashing**: bcrypt with cost factor 12
- **JWT Security**: Secure token generation and validation
- **CORS**: Configurable cross-origin resource sharing
- **Security Headers**: Comprehensive security headers
- **Request ID**: Unique request tracking
- **Input Validation**: Request payload validation

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8080` |
| `ENVIRONMENT` | Environment (development/production) | `development` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_USER` | Database user | - |
| `DB_PASSWORD` | Database password | - |
| `DB_NAME` | Database name | - |
| `DB_SSLMODE` | SSL mode | `disable` |
| `JWT_SECRET_KEY` | JWT signing key | - |
| `JWT_ACCESS_TOKEN_EXPIRY` | Access token expiry | `15m` |
| `JWT_REFRESH_TOKEN_EXPIRY` | Refresh token expiry | `7d` |

## Development

### Code Structure

The project follows Clean Architecture principles:

- **Models**: Data structures and business entities
- **Repository**: Data access layer
- **Services**: Business logic layer
- **Handlers**: HTTP request/response handling
- **Middleware**: Cross-cutting concerns

### Adding New Features

1. **Add Model**: Define the data structure in `internal/models/`
2. **Add Repository**: Implement data access in `internal/repository/`
3. **Add Service**: Implement business logic in `internal/services/`
4. **Add Handler**: Implement HTTP endpoints in `internal/handlers/`
5. **Add Routes**: Register routes in `internal/router/`

### Testing

```bash
# Run all tests
go test ./...

# Run tests with coverage
go test -cover ./...

# Run specific package tests
go test ./internal/services
```

### Database Migrations

To create new migrations:

1. Create `.up.sql` and `.down.sql` files in `migrations/`
2. Use sequential numbering (e.g., `002_add_new_table.up.sql`)
3. Test both up and down migrations

## Deployment

### Production Checklist

- [ ] Set `ENVIRONMENT=production`
- [ ] Use strong JWT secret key
- [ ] Configure proper database credentials
- [ ] Set up SSL/TLS
- [ ] Configure reverse proxy (nginx/Apache)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

### Docker Deployment

```dockerfile
# Example Dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o server cmd/server/main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/server .
CMD ["./server"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API endpoints

---

**Happy coding! 🚀**