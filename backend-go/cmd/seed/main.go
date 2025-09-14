package main

import (
	"io/ioutil"
	"log"

	"go-backend/config"
	"go-backend/internal/database"

	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using system environment variables")
	}

	// Load configuration
	cfg := config.Load()

	// Initialize database
	db, err := database.Initialize(cfg.Database)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Get underlying SQL DB
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("Failed to get underlying sql.DB: %v", err)
	}
	defer sqlDB.Close()

	// Read the SQL file
	sqlFile := "migrations/002_insert_dummy_data.sql"
	sqlContent, err := ioutil.ReadFile(sqlFile)
	if err != nil {
		log.Fatalf("Failed to read SQL file %s: %v", sqlFile, err)
	}

	log.Printf("📄 Executing SQL file: %s", sqlFile)

	// Execute the SQL content
	if err := db.Exec(string(sqlContent)).Error; err != nil {
		log.Fatalf("Failed to execute SQL: %v", err)
	}

	log.Println("✅ Dummy data inserted successfully!")

	// Verify the data was inserted
	log.Println("📊 Verifying inserted data...")

	// Count records in each table
	tables := []string{"users", "organizations", "plans", "subscriptions", "invoices"}
	for _, table := range tables {
		var count int64
		if err := db.Table(table).Count(&count).Error; err != nil {
			log.Printf("❌ Failed to count records in %s: %v", table, err)
			continue
		}
		log.Printf("📋 %s: %d records", table, count)
	}

	log.Println("🎉 Database seeding completed successfully!")
}