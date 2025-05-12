// Package main provides an export server for the ACM website
package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"path/filepath"
	"strings"
	"time"
)

// ExportApplication represents a membership application for export purposes
type ExportApplication struct {
	ID          string    `json:"id"`
	FullName    string    `json:"fullName"`
	Email       string    `json:"email"`
	StudentID   string    `json:"studentId"`
	School      string    `json:"school"`
	YearOfStudy string    `json:"yearOfStudy"`
	Timestamp   time.Time `json:"timestamp"`
}

// ExportMessage represents a contact form message for export purposes
type ExportMessage struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}

// setupExportCORS configures CORS headers for all responses
func setupExportCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

// exportNoCacheMiddleware adds headers to prevent caching for certain file types
func exportNoCacheMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Add no-cache headers for JSON and image files
		path := r.URL.Path
		if strings.HasSuffix(path, ".json") ||
			strings.HasSuffix(path, ".jpg") ||
			strings.HasSuffix(path, ".jpeg") ||
			strings.HasSuffix(path, ".png") {
			w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
			w.Header().Set("Pragma", "no-cache")
			w.Header().Set("Expires", "0")
		}
		next.ServeHTTP(w, r)
	})
}

// Main function for the export server
func RunExportServer() {
	log.Println("Starting ACM Export Server...")

	// Create router
	mux := http.NewServeMux()

	// Register export endpoints
	mux.HandleFunc("/export/applications", handleExportApplications)
	mux.HandleFunc("/export/messages", handleExportMessages)

	// Add a simple ping endpoint
	mux.HandleFunc("/export/ping", func(w http.ResponseWriter, r *http.Request) {
		setupExportCORS(w)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"status": "ok",
			"server": "export",
		})
	})

	// Register static file server with cache control middleware
	fileServer := http.FileServer(http.Dir("."))
	mux.Handle("/", exportNoCacheMiddleware(fileServer))

	// Start server
	log.Println("Export server is running on http://localhost:8082")
	log.Fatal(http.ListenAndServe(":8082", mux))
}

// Export applications as CSV
func exportApplicationsCSV(appPath string) ([]byte, error) {
	// Read applications JSON file
	data, err := ioutil.ReadFile(appPath)
	if err != nil {
		return nil, fmt.Errorf("error reading applications file: %v", err)
	}

	// Parse JSON
	var applications []map[string]interface{}
	if err := json.Unmarshal(data, &applications); err != nil {
		return nil, fmt.Errorf("error parsing applications JSON: %v", err)
	}

	// Create CSV file in memory
	buf := &strings.Builder{}
	csvWriter := csv.NewWriter(buf)

	// Write header
	header := []string{"Name", "Email", "Student ID", "School", "Year Of Study", "Status", "Submission Date"}
	if err := csvWriter.Write(header); err != nil {
		return nil, fmt.Errorf("error writing CSV header: %v", err)
	}

	// Write rows
	for _, app := range applications {
		row := []string{
			fmt.Sprint(app["fullName"]),
			fmt.Sprint(app["email"]),
			fmt.Sprint(app["studentId"]),
			fmt.Sprint(app["school"]),
			fmt.Sprint(app["yearOfStudy"]),
			fmt.Sprint(app["status"]),
			fmt.Sprint(app["submissionDate"]),
		}
		if err := csvWriter.Write(row); err != nil {
			return nil, fmt.Errorf("error writing CSV row: %v", err)
		}
	}

	csvWriter.Flush()
	if err := csvWriter.Error(); err != nil {
		return nil, fmt.Errorf("error flushing CSV writer: %v", err)
	}

	return []byte(buf.String()), nil
}

// Export messages as CSV
func exportMessagesCSV(msgPath string) ([]byte, error) {
	log.Printf("Reading messages from: %s", msgPath)

	// Read the JSON file
	data, err := ioutil.ReadFile(msgPath)
	if err != nil {
		log.Printf("Error reading file: %v", err)
		return nil, fmt.Errorf("failed to read file: %v", err)
	}

	// Parse the JSON
	var messages []ExportMessage
	if err := json.Unmarshal(data, &messages); err != nil {
		log.Printf("Error parsing JSON: %v", err)
		return nil, fmt.Errorf("failed to parse JSON: %v", err)
	}

	log.Printf("Found %d messages", len(messages))

	// Create CSV writer
	buffer := &strings.Builder{}
	csvWriter := csv.NewWriter(buffer)

	// Write header
	header := []string{"ID", "Name", "Email", "Message", "Timestamp"}
	if err := csvWriter.Write(header); err != nil {
		log.Printf("Error writing header: %v", err)
		return nil, fmt.Errorf("error writing CSV header: %v", err)
	}

	// Write data rows
	for _, msg := range messages {
		record := []string{
			msg.ID,
			msg.Name,
			msg.Email,
			msg.Message,
			msg.Timestamp.Format(time.RFC3339),
		}
		if err := csvWriter.Write(record); err != nil {
			log.Printf("Error writing record: %v", err)
			return nil, fmt.Errorf("error writing CSV record: %v", err)
		}
	}

	csvWriter.Flush()
	if err := csvWriter.Error(); err != nil {
		log.Printf("Error flushing writer: %v", err)
		return nil, fmt.Errorf("error flushing CSV writer: %v", err)
	}

	log.Printf("Successfully generated messages CSV, size: %d bytes", buffer.Len())
	return []byte(buffer.String()), nil
}

func handleExportApplications(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers first
	setupExportCORS(w)

	log.Printf("Handling export applications request")

	// Handle OPTIONS method
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Handle test parameter
	if r.URL.Query().Get("test") == "1" {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"status": "ok",
		})
		return
	}

	// Get path from query parameter or use default
	path := r.URL.Query().Get("path")
	if path == "" {
		path = "data/applications.json"
	}

	// For Windows, convert slashes
	path = filepath.FromSlash(path)
	log.Printf("Using path: %s", path)

	// Generate CSV data
	csvData, err := exportApplicationsCSV(path)
	if err != nil {
		log.Printf("Error generating CSV: %v", err)
		http.Error(w, fmt.Sprintf("Failed to generate CSV: %v", err), http.StatusInternalServerError)
		return
	}

	// Set response headers
	w.Header().Set("Content-Type", "text/csv")
	w.Header().Set("Content-Disposition", "attachment; filename=applications.csv")

	// Write the CSV data
	_, err = w.Write(csvData)
	if err != nil {
		log.Printf("Error writing response: %v", err)
	} else {
		log.Printf("Successfully sent applications CSV response")
	}
}

func handleExportMessages(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers first
	setupExportCORS(w)

	log.Printf("Handling export messages request")

	// Handle OPTIONS method
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get path from query parameter or use default
	path := r.URL.Query().Get("path")
	if path == "" {
		path = "data/messages.json"
	}

	// For Windows, convert slashes
	path = filepath.FromSlash(path)
	log.Printf("Using path: %s", path)

	// Generate CSV data
	csvData, err := exportMessagesCSV(path)
	if err != nil {
		log.Printf("Error generating CSV: %v", err)
		http.Error(w, fmt.Sprintf("Failed to generate CSV: %v", err), http.StatusInternalServerError)
		return
	}

	// Set response headers
	w.Header().Set("Content-Type", "text/csv")
	w.Header().Set("Content-Disposition", "attachment; filename=messages.csv")

	// Write the CSV data
	_, err = w.Write(csvData)
	if err != nil {
		log.Printf("Error writing response: %v", err)
	} else {
		log.Printf("Successfully sent messages CSV response")
	}
}
