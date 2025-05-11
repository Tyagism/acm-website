package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
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

// setupCORS configures CORS headers for all responses
func setupCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

// handleOptions responds to preflight requests
func handleOptions(w http.ResponseWriter, r *http.Request) {
	setupCORS(w)
	w.WriteHeader(http.StatusOK)
}

// Export applications as CSV
func exportApplicationsCSV(appPath string) ([]byte, error) {
	log.Printf("Reading applications from: %s", appPath)

	// Read the JSON file
	data, err := ioutil.ReadFile(appPath)
	if err != nil {
		log.Printf("Error reading file: %v", err)
		return nil, fmt.Errorf("failed to read file: %w", err)
	}

	// Parse the JSON
	var applications []ExportApplication
	if err := json.Unmarshal(data, &applications); err != nil {
		log.Printf("Error parsing JSON: %v", err)
		return nil, fmt.Errorf("failed to parse JSON: %w", err)
	}

	log.Printf("Found %d applications", len(applications))

	// Create CSV writer
	buffer := &strings.Builder{}
	csvWriter := csv.NewWriter(buffer)

	// Write header
	header := []string{"ID", "FullName", "Email", "StudentID", "School", "YearOfStudy", "Timestamp"}
	if err := csvWriter.Write(header); err != nil {
		log.Printf("Error writing header: %v", err)
		return nil, fmt.Errorf("error writing CSV header: %w", err)
	}

	// Write data rows
	for _, app := range applications {
		record := []string{
			app.ID,
			app.FullName,
			app.Email,
			app.StudentID,
			app.School,
			app.YearOfStudy,
			app.Timestamp.Format(time.RFC3339),
		}
		if err := csvWriter.Write(record); err != nil {
			log.Printf("Error writing record: %v", err)
			return nil, fmt.Errorf("error writing CSV record: %w", err)
		}
	}

	csvWriter.Flush()
	if err := csvWriter.Error(); err != nil {
		log.Printf("Error flushing writer: %v", err)
		return nil, fmt.Errorf("error flushing CSV writer: %w", err)
	}

	log.Printf("Successfully generated applications CSV, size: %d bytes", buffer.Len())
	return []byte(buffer.String()), nil
}

// Export messages as CSV
func exportMessagesCSV(msgPath string) ([]byte, error) {
	log.Printf("Reading messages from: %s", msgPath)

	// Read the JSON file
	data, err := ioutil.ReadFile(msgPath)
	if err != nil {
		log.Printf("Error reading file: %v", err)
		return nil, fmt.Errorf("failed to read file: %w", err)
	}

	// Parse the JSON
	var messages []ExportMessage
	if err := json.Unmarshal(data, &messages); err != nil {
		log.Printf("Error parsing JSON: %v", err)
		return nil, fmt.Errorf("failed to parse JSON: %w", err)
	}

	log.Printf("Found %d messages", len(messages))

	// Create CSV writer
	buffer := &strings.Builder{}
	csvWriter := csv.NewWriter(buffer)

	// Write header
	header := []string{"ID", "Name", "Email", "Message", "Timestamp"}
	if err := csvWriter.Write(header); err != nil {
		log.Printf("Error writing header: %v", err)
		return nil, fmt.Errorf("error writing CSV header: %w", err)
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
			return nil, fmt.Errorf("error writing CSV record: %w", err)
		}
	}

	csvWriter.Flush()
	if err := csvWriter.Error(); err != nil {
		log.Printf("Error flushing writer: %v", err)
		return nil, fmt.Errorf("error flushing CSV writer: %w", err)
	}

	log.Printf("Successfully generated messages CSV, size: %d bytes", buffer.Len())
	return []byte(buffer.String()), nil
}

func handleExportApplications(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers first
	setupCORS(w)

	log.Printf("Handling export applications request")

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
	setupCORS(w)

	log.Printf("Handling export messages request")

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

func main() {
	// Print the current working directory
	cwd, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("Export server - Current working directory: %s", cwd)

	// Check if data directory exists
	dataDir := filepath.Join(cwd, "data")
	if _, err := os.Stat(dataDir); os.IsNotExist(err) {
		log.Printf("Export server - Data directory does not exist: %s", dataDir)
		// Create data directory
		if err := os.Mkdir(dataDir, 0755); err != nil {
			log.Printf("Export server - Failed to create data directory: %v", err)
		} else {
			log.Printf("Export server - Created data directory: %s", dataDir)
		}
	} else {
		log.Printf("Export server - Data directory exists: %s", dataDir)

		// List files in data directory
		files, err := ioutil.ReadDir(dataDir)
		if err != nil {
			log.Printf("Export server - Error reading data directory: %v", err)
		} else {
			log.Printf("Export server - Files in data directory:")
			for _, file := range files {
				log.Printf("  - %s (%d bytes)", file.Name(), file.Size())
			}
		}
	}

	// Set up routes
	http.HandleFunc("/export/applications", handleExportApplications)
	http.HandleFunc("/export/messages", handleExportMessages)
	http.HandleFunc("/options", handleOptions)

	// Add a simple ping handler
	http.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		setupCORS(w)
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok", "message":"Export server is running"}`))
	})

	// Serve static files
	http.Handle("/", http.FileServer(http.Dir(".")))

	// Start the server
	port := 8082 // Use a different port to avoid conflict
	log.Printf("Starting export server on port %d...", port)
	if err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil); err != nil {
		log.Fatalf("Export server error: %v", err)
	}
}
