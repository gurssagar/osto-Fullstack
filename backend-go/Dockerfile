# Build stage
FROM golang:1.25.1 as builder

WORKDIR /app

# Download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o osto-backend ./cmd/server

# Final stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from builder
COPY --from=builder /app/osto-backend .

# Expose port
EXPOSE 8080

# Command to run the executable
CMD ["./osto-backend"]
