package utils

import (
	"regexp"
	"strings"
	"unicode"

	"golang.org/x/text/transform"
	"golang.org/x/text/unicode/norm"
)

// GenerateSlug creates a URL-friendly slug from a string
func GenerateSlug(input string) string {
	// Convert to lowercase
	slug := strings.ToLower(input)

	// Remove accents and normalize unicode
	t := transform.Chain(norm.NFD, transform.RemoveFunc(isMn), norm.NFC)
	slug, _, _ = transform.String(t, slug)

	// Replace spaces and special characters with hyphens
	re := regexp.MustCompile(`[^a-z0-9]+`)
	slug = re.ReplaceAllString(slug, "-")

	// Remove leading and trailing hyphens
	slug = strings.Trim(slug, "-")

	// Ensure slug is not empty
	if slug == "" {
		slug = "untitled"
	}

	return slug
}

// isMn checks if a rune is a nonspacing mark
func isMn(r rune) bool {
	return unicode.Is(unicode.Mn, r)
}

// GenerateUniqueSlug creates a unique slug by appending a number if needed
func GenerateUniqueSlug(input string, existingSlugs []string) string {
	baseSlug := GenerateSlug(input)
	slug := baseSlug
	counter := 1

	// Check if slug already exists
	for contains(existingSlugs, slug) {
		slug = baseSlug + "-" + string(rune(counter+'0'))
		counter++
	}

	return slug
}

// contains checks if a slice contains a string
func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}