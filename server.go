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
	"sync"
	"time"
)

// Application represents a membership application
type Application struct {
	ID          string    `json:"id"`
	FullName    string    `json:"fullName"`
	Email       string    `json:"email"`
	StudentID   string    `json:"studentId"`
	School      string    `json:"school"`
	YearOfStudy string    `json:"yearOfStudy"`
	Timestamp   time.Time `json:"timestamp"`
}

// Message represents a contact form message
type Message struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}

// User represents an admin user
type User struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
	Role     string `json:"role"`
}

// AdminCredentials represents login credentials
type AdminCredentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// DataStore handles data persistence
type DataStore struct {
	ApplicationsFile string
	MessagesFile     string
	UsersFile        string
	mutex            sync.Mutex
}

func NewDataStore() *DataStore {
	return &DataStore{
		ApplicationsFile: "data/applications.json",
		MessagesFile:     "data/messages.json",
		UsersFile:        "data/users.json",
	}
}

// Initialize creates data directory and files if they don't exist
func (ds *DataStore) Initialize() error {
	// Create data directory if it doesn't exist
	log.Println("Initializing data store...")
	if err := os.MkdirAll("data", 0755); err != nil {
		log.Printf("Error creating data directory: %v", err)
		return err
	}

	// Initialize applications file if it doesn't exist
	if _, err := os.Stat(ds.ApplicationsFile); os.IsNotExist(err) {
		log.Printf("Creating applications file: %s", ds.ApplicationsFile)
		if err := ioutil.WriteFile(ds.ApplicationsFile, []byte("[]"), 0644); err != nil {
			log.Printf("Error creating applications file: %v", err)
			return err
		}
	}

	// Initialize messages file if it doesn't exist
	if _, err := os.Stat(ds.MessagesFile); os.IsNotExist(err) {
		log.Printf("Creating messages file: %s", ds.MessagesFile)
		if err := ioutil.WriteFile(ds.MessagesFile, []byte("[]"), 0644); err != nil {
			log.Printf("Error creating messages file: %v", err)
			return err
		}
	}

	// Initialize users file if it doesn't exist
	if _, err := os.Stat(ds.UsersFile); os.IsNotExist(err) {
		log.Printf("Creating users file with default admin: %s", ds.UsersFile)
		// Create default admin user
		defaultAdmin := []User{
			{
				Email:    "admin@usar.acm.org",
				Password: "admin123", // In a real app, this would be hashed
				Name:     "Admin User",
				Role:     "admin",
			},
		}
		adminBytes, err := json.Marshal(defaultAdmin)
		if err != nil {
			log.Printf("Error marshaling default admin user: %v", err)
			return err
		}
		if err := ioutil.WriteFile(ds.UsersFile, adminBytes, 0644); err != nil {
			log.Printf("Error writing users file: %v", err)
			return err
		}
	}

	log.Println("Data store initialization complete!")
	return nil
}

// SaveApplication saves a new application to the JSON file
func (ds *DataStore) SaveApplication(app Application) error {
	ds.mutex.Lock()
	defer ds.mutex.Unlock()

	log.Printf("Saving application to %s", ds.ApplicationsFile)

	// Read existing applications
	data, err := ioutil.ReadFile(ds.ApplicationsFile)
	if err != nil {
		log.Printf("Error reading applications file: %v", err)
		return fmt.Errorf("failed to read applications file: %w", err)
	}

	var applications []Application
	if err := json.Unmarshal(data, &applications); err != nil {
		log.Printf("Error unmarshaling applications JSON: %v", err)
		return fmt.Errorf("failed to parse applications JSON: %w", err)
	}

	// Add the new application
	applications = append(applications, app)

	// Write back to file
	updatedData, err := json.MarshalIndent(applications, "", "  ")
	if err != nil {
		log.Printf("Error marshaling applications: %v", err)
		return fmt.Errorf("failed to convert applications to JSON: %w", err)
	}

	if err := ioutil.WriteFile(ds.ApplicationsFile, updatedData, 0644); err != nil {
		log.Printf("Error writing applications file: %v", err)
		return fmt.Errorf("failed to write applications file: %w", err)
	}

	log.Printf("Successfully saved application for %s", app.FullName)
	return nil
}

// SaveMessage saves a new message to the JSON file
func (ds *DataStore) SaveMessage(msg Message) error {
	ds.mutex.Lock()
	defer ds.mutex.Unlock()

	log.Printf("Saving message to %s", ds.MessagesFile)

	// Read existing messages
	data, err := ioutil.ReadFile(ds.MessagesFile)
	if err != nil {
		log.Printf("Error reading messages file: %v", err)
		return fmt.Errorf("failed to read messages file: %w", err)
	}

	var messages []Message
	if err := json.Unmarshal(data, &messages); err != nil {
		log.Printf("Error unmarshaling messages JSON: %v", err)
		return fmt.Errorf("failed to parse messages JSON: %w", err)
	}

	// Add the new message
	messages = append(messages, msg)

	// Write back to file
	updatedData, err := json.MarshalIndent(messages, "", "  ")
	if err != nil {
		log.Printf("Error marshaling messages: %v", err)
		return fmt.Errorf("failed to convert messages to JSON: %w", err)
	}

	if err := ioutil.WriteFile(ds.MessagesFile, updatedData, 0644); err != nil {
		log.Printf("Error writing messages file: %v", err)
		return fmt.Errorf("failed to write messages file: %w", err)
	}

	log.Printf("Successfully saved message from %s", msg.Name)
	return nil
}

// GetApplications returns all applications
func (ds *DataStore) GetApplications() ([]Application, error) {
	ds.mutex.Lock()
	defer ds.mutex.Unlock()

	data, err := ioutil.ReadFile(ds.ApplicationsFile)
	if err != nil {
		return nil, err
	}

	var applications []Application
	if err := json.Unmarshal(data, &applications); err != nil {
		return nil, err
	}

	return applications, nil
}

// GetMessages returns all messages
func (ds *DataStore) GetMessages() ([]Message, error) {
	ds.mutex.Lock()
	defer ds.mutex.Unlock()

	data, err := ioutil.ReadFile(ds.MessagesFile)
	if err != nil {
		return nil, err
	}

	var messages []Message
	if err := json.Unmarshal(data, &messages); err != nil {
		return nil, err
	}

	return messages, nil
}

// ExportApplicationsCSV exports applications as CSV data
func (ds *DataStore) ExportApplicationsCSV() ([]byte, error) {
	applications, err := ds.GetApplications()
	if err != nil {
		return nil, fmt.Errorf("failed to get applications: %w", err)
	}

	// Create CSV writer that writes to a buffer
	buffer := &strings.Builder{}
	csvWriter := csv.NewWriter(buffer)

	// Define header
	header := []string{
		"ID",
		"FullName",
		"Email",
		"StudentID",
		"School",
		"YearOfStudy",
		"Timestamp",
	}

	// Write header
	if err := csvWriter.Write(header); err != nil {
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
			return nil, fmt.Errorf("error writing CSV record: %w", err)
		}
	}

	csvWriter.Flush()
	if err := csvWriter.Error(); err != nil {
		return nil, fmt.Errorf("error flushing CSV writer: %w", err)
	}

	return []byte(buffer.String()), nil
}

// ExportMessagesCSV exports messages as CSV data
func (ds *DataStore) ExportMessagesCSV() ([]byte, error) {
	messages, err := ds.GetMessages()
	if err != nil {
		return nil, fmt.Errorf("failed to get messages: %w", err)
	}

	// Create CSV writer that writes to a buffer
	buffer := &strings.Builder{}
	csvWriter := csv.NewWriter(buffer)

	// Define header
	header := []string{
		"ID",
		"Name",
		"Email",
		"Message",
		"Timestamp",
	}

	// Write header
	if err := csvWriter.Write(header); err != nil {
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
			return nil, fmt.Errorf("error writing CSV record: %w", err)
		}
	}

	csvWriter.Flush()
	if err := csvWriter.Error(); err != nil {
		return nil, fmt.Errorf("error flushing CSV writer: %w", err)
	}

	return []byte(buffer.String()), nil
}

// AuthenticateUser checks if the provided credentials match a user
func (ds *DataStore) AuthenticateUser(creds AdminCredentials) (*User, error) {
	ds.mutex.Lock()
	defer ds.mutex.Unlock()

	data, err := ioutil.ReadFile(ds.UsersFile)
	if err != nil {
		return nil, err
	}

	var users []User
	if err := json.Unmarshal(data, &users); err != nil {
		return nil, err
	}

	for _, user := range users {
		if user.Email == creds.Email && user.Password == creds.Password {
			return &user, nil
		}
	}

	return nil, fmt.Errorf("invalid credentials")
}

// setupCORS adds CORS headers to response
func setupCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

// handleOptions handles preflight OPTIONS requests
func handleOptions(w http.ResponseWriter, r *http.Request) {
	setupCORS(w)
	w.WriteHeader(http.StatusOK)
}

func main() {
	// Initialize data store
	log.Println("Starting ACM website server...")

	dataStore := NewDataStore()
	log.Println("Initializing data store...")
	if err := dataStore.Initialize(); err != nil {
		log.Fatalf("Failed to initialize data store: %v", err)
	}
	log.Println("Data store initialized successfully")

	// Ping endpoint for checking server status
	http.HandleFunc("/api/ping", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			handleOptions(w, r)
			return
		}

		setupCORS(w)
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "ok",
			"message": "Server is running",
		})
	})

	// Application submission endpoint
	http.HandleFunc("/api/applications", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			handleOptions(w, r)
			return
		}

		setupCORS(w)
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var appData struct {
			FullName    string `json:"fullName"`
			Email       string `json:"email"`
			StudentID   string `json:"studentId"`
			School      string `json:"school"`
			YearOfStudy string `json:"yearOfStudy"`
		}

		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&appData); err != nil {
			log.Printf("Error decoding application JSON: %v", err)
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Create new application record
		app := Application{
			ID:          fmt.Sprintf("%d", time.Now().UnixNano()),
			FullName:    appData.FullName,
			Email:       appData.Email,
			StudentID:   appData.StudentID,
			School:      appData.School,
			YearOfStudy: appData.YearOfStudy,
			Timestamp:   time.Now(),
		}

		if err := dataStore.SaveApplication(app); err != nil {
			log.Printf("Error saving application: %v", err)
			http.Error(w, "Failed to save application", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Application submitted successfully!",
		})
	})

	// Contact form submission endpoint
	http.HandleFunc("/api/contact", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			handleOptions(w, r)
			return
		}

		setupCORS(w)
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var messageData struct {
			Name    string `json:"name"`
			Email   string `json:"email"`
			Message string `json:"message"`
		}

		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&messageData); err != nil {
			log.Printf("Error decoding message JSON: %v", err)
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Create new message record
		msg := Message{
			ID:        fmt.Sprintf("%d", time.Now().UnixNano()),
			Name:      messageData.Name,
			Email:     messageData.Email,
			Message:   messageData.Message,
			Timestamp: time.Now(),
		}

		if err := dataStore.SaveMessage(msg); err != nil {
			log.Printf("Error saving message: %v", err)
			http.Error(w, "Failed to save message", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Message sent successfully!",
		})
	})

	// Admin login endpoint
	http.HandleFunc("/api/admin/login", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var creds AdminCredentials
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&creds); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		user, err := dataStore.AuthenticateUser(creds)
		if err != nil {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": true,
			"user": map[string]string{
				"email": user.Email,
				"name":  user.Name,
				"role":  user.Role,
			},
		})
	})

	// Get applications data endpoint
	http.HandleFunc("/api/admin/applications", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		applications, err := dataStore.GetApplications()
		if err != nil {
			log.Printf("Error getting applications: %v", err)
			http.Error(w, "Failed to get applications", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(applications)
	})

	// Get messages data endpoint
	http.HandleFunc("/api/admin/messages", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		messages, err := dataStore.GetMessages()
		if err != nil {
			log.Printf("Error getting messages: %v", err)
			http.Error(w, "Failed to get messages", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(messages)
	})

	// Export applications to CSV endpoint
	http.HandleFunc("/api/admin/export/applications", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		setupCORS(w)

		// Check if the specified file exists
		specificPath := r.URL.Query().Get("path")
		if specificPath != "" {
			// For security, restrict to files in the project directory
			if !strings.HasPrefix(filepath.Clean(specificPath), filepath.Clean(filepath.Dir(dataStore.ApplicationsFile))) {
				http.Error(w, "Access denied", http.StatusForbidden)
				return
			}

			// If a specific file path is provided, read from that file instead
			data, err := ioutil.ReadFile(specificPath)
			if err != nil {
				log.Printf("Error reading file %s: %v", specificPath, err)
				http.Error(w, "Failed to read file", http.StatusInternalServerError)
				return
			}

			var applications []Application
			if err := json.Unmarshal(data, &applications); err != nil {
				log.Printf("Error unmarshaling applications from %s: %v", specificPath, err)
				http.Error(w, "Failed to parse JSON file", http.StatusInternalServerError)
				return
			}

			// Create a temporary DataStore to use the export function
			tempDS := &DataStore{}

			// Convert the applications to CSV
			csvData, err := tempDS.ExportApplicationsCSV()
			if err != nil {
				log.Printf("Error exporting applications to CSV: %v", err)
				http.Error(w, "Failed to generate CSV", http.StatusInternalServerError)
				return
			}

			// Set response headers for file download
			w.Header().Set("Content-Type", "text/csv")
			w.Header().Set("Content-Disposition", "attachment; filename=applications.csv")

			// Write the CSV data to the response
			w.Write(csvData)
			return
		}

		// Generate CSV data from the datastore
		csvData, err := dataStore.ExportApplicationsCSV()
		if err != nil {
			log.Printf("Error exporting applications to CSV: %v", err)
			http.Error(w, "Failed to generate CSV", http.StatusInternalServerError)
			return
		}

		// Set response headers for file download
		w.Header().Set("Content-Type", "text/csv")
		w.Header().Set("Content-Disposition", "attachment; filename=applications.csv")

		// Write the CSV data to the response
		w.Write(csvData)
	})

	// Export messages to CSV endpoint
	http.HandleFunc("/api/admin/export/messages", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		setupCORS(w)

		// Check if the specified file exists
		specificPath := r.URL.Query().Get("path")
		if specificPath != "" {
			// For security, restrict to files in the project directory
			if !strings.HasPrefix(filepath.Clean(specificPath), filepath.Clean(filepath.Dir(dataStore.MessagesFile))) {
				http.Error(w, "Access denied", http.StatusForbidden)
				return
			}

			// If a specific file path is provided, read from that file instead
			data, err := ioutil.ReadFile(specificPath)
			if err != nil {
				log.Printf("Error reading file %s: %v", specificPath, err)
				http.Error(w, "Failed to read file", http.StatusInternalServerError)
				return
			}

			var messages []Message
			if err := json.Unmarshal(data, &messages); err != nil {
				log.Printf("Error unmarshaling messages from %s: %v", specificPath, err)
				http.Error(w, "Failed to parse JSON file", http.StatusInternalServerError)
				return
			}

			// Create a temporary DataStore to use the export function
			tempDS := &DataStore{}

			// Convert the messages to CSV
			csvData, err := tempDS.ExportMessagesCSV()
			if err != nil {
				log.Printf("Error exporting messages to CSV: %v", err)
				http.Error(w, "Failed to generate CSV", http.StatusInternalServerError)
				return
			}

			// Set response headers for file download
			w.Header().Set("Content-Type", "text/csv")
			w.Header().Set("Content-Disposition", "attachment; filename=messages.csv")

			// Write the CSV data to the response
			w.Write(csvData)
			return
		}

		// Generate CSV data from the datastore
		csvData, err := dataStore.ExportMessagesCSV()
		if err != nil {
			log.Printf("Error exporting messages to CSV: %v", err)
			http.Error(w, "Failed to generate CSV", http.StatusInternalServerError)
			return
		}

		// Set response headers for file download
		w.Header().Set("Content-Type", "text/csv")
		w.Header().Set("Content-Disposition", "attachment; filename=messages.csv")

		// Write the CSV data to the response
		w.Write(csvData)
	})

	// Set up a simple file server for static files as the last handler
	http.Handle("/", http.FileServer(http.Dir(".")))

	// Start the server
	port := "8081"
	log.Printf("Server starting on port %s...", port)
	log.Printf("Open http://localhost:%s in your browser", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Printf("Server error: %v", err)
	}
}
