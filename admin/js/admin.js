document.addEventListener("DOMContentLoaded", () => {
  // Initialize Admin Dashboard
  const AdminDashboard = {
    // DOM Elements
    elements: {
      loginForm: document.getElementById("login-form"),
      loginError: document.getElementById("login-error"),
      adminLogin: document.getElementById("admin-login"),
      adminDashboard: document.getElementById("admin-dashboard"),
      navLinks: document.querySelectorAll(".admin-nav-link"),
      sections: document.querySelectorAll(".admin-section"),
      sectionTitle: document.getElementById("section-title"),
      logoutBtn: document.getElementById("logout-btn"),
      adminUserName: document.getElementById("admin-user-name"),
      
      // Mobile menu elements
      menuToggle: document.getElementById("admin-menu-toggle"),
      sidebar: document.getElementById("admin-sidebar"),
      sidebarOverlay: document.getElementById("admin-sidebar-overlay"),
      
      // Forgot password elements
      forgotPasswordLink: document.getElementById("forgot-password-link"),
      resetPasswordModal: document.getElementById("reset-password-modal"),
      resetPasswordForm: document.getElementById("reset-password-form"),
      resetModalClose: document.getElementById("reset-modal-close"),
      resetCancelBtn: document.getElementById("reset-cancel-btn"),
      resetMessage: document.getElementById("reset-message"),
      
      // Team section
      teamTabs: document.querySelectorAll(".admin-tab"),
      teamGrid: document.getElementById("admin-team-grid"),
      addTeamMemberBtn: document.getElementById("add-team-member-btn"),
      teamModal: document.getElementById("team-modal"),
      teamModalTitle: document.getElementById("team-modal-title"),
      teamModalClose: document.getElementById("team-modal-close"),
      teamForm: document.getElementById("team-form"),
      teamCancelBtn: document.getElementById("team-cancel-btn"),
      
      // Events section
      eventsTable: document.getElementById("events-table"),
      addEventBtn: document.getElementById("add-event-btn"),
      eventModal: document.getElementById("event-modal"),
      eventModalTitle: document.getElementById("event-modal-title"),
      eventModalClose: document.getElementById("event-modal-close"),
      eventForm: document.getElementById("event-form"),
      eventCancelBtn: document.getElementById("event-cancel-btn"),
      
      // Applications section
      applicationsTable: document.getElementById("applications-table"),
      applicationModal: document.getElementById("application-modal"),
      applicationModalClose: document.getElementById("application-modal-close"),
      applicationCloseBtn: document.getElementById("application-close-btn"),
      applicationDeleteBtn: document.getElementById("application-delete-btn"),
      exportApplicationsBtn: document.getElementById("export-applications-btn"),
      refreshApplicationsBtn: document.getElementById("refresh-applications-btn"),
      
      // Messages section
      messagesTable: document.getElementById("messages-table"),
      messageModal: document.getElementById("message-modal"),
      messageModalClose: document.getElementById("message-modal-close"),
      messageCloseBtn: document.getElementById("message-close-btn"),
      messageDeleteBtn: document.getElementById("message-delete-btn"),
      exportMessagesBtn: document.getElementById("export-messages-btn"),
      refreshMessagesBtn: document.getElementById("refresh-messages-btn"),
      
      // Settings section
      firebaseForm: document.getElementById("firebase-form"),
      adminForm: document.getElementById("admin-form"),
      
      // Dashboard stats
      teamCount: document.getElementById("team-count"),
      eventsCount: document.getElementById("events-count"),
      applicationsCount: document.getElementById("applications-count"),
      messagesCount: document.getElementById("messages-count"),
      recentApplications: document.getElementById("recent-applications"),
      upcomingEvents: document.getElementById("upcoming-events"),
      applicationsUpdated: document.getElementById("applications-updated"),
      messagesUpdated: document.getElementById("messages-updated"),
      
      // Team selection
      teamSelect: document.getElementById("team-select")
    },
    
    // Data
    data: {
      currentUser: null,
      teams: [],
      events: [],
      applications: [],
      messages: [],
      currentTeam: "Executive Board",
      firebaseConfig: null,
      // Default team data
      defaultTeams: [
        {
          name: "Executive Board",
          members: [
            {
              id: "1",
              name: "Aditya Sharma",
              position: "Chapter Chair",
              image: "../images/acm-logo.svg",
              linkedin: "https://linkedin.com/in/aditya-sharma"
            },
            {
              id: "2",
              name: "Priya Patel",
              position: "Vice Chair",
              image: "../images/acm-logo.svg",
              linkedin: "https://linkedin.com/in/priya-patel"
            }
          ]
        },
        {
          name: "Technical Team",
          members: [
            {
              id: "5",
              name: "Vikram Mehta",
              position: "Technical Lead",
              image: "../images/acm-logo.svg",
              linkedin: "https://linkedin.com/in/vikram-mehta"
            }
          ]
        },
        {
          name: "Events Team",
          members: [
            {
              id: "9",
              name: "Rohan Malhotra",
              position: "Events Coordinator",
              image: "../images/acm-logo.svg",
              linkedin: "https://linkedin.com/in/rohan-malhotra"
            }
          ]
        }
      ],
      // Default events data
      defaultEvents: [
        {
          id: "1",
          title: "Web Development Workshop",
          description: "Learn the basics of HTML, CSS, and JavaScript",
          date: "2025-06-15",
          location: "Computer Science Building, Room 101",
          attendees: 30,
          image: "../images/acm-logo.svg"
        },
        {
          id: "2",
          title: "AI/ML Hackathon",
          description: "Build innovative solutions using artificial intelligence",
          date: "2025-07-20",
          location: "Engineering Center, Main Hall",
          attendees: 50,
          image: "../images/acm-logo.svg"
        }
      ]
    },
    
    // Initialize
    init() {
      // For file:// protocol, ensure data files exist in the right location
      if (window.location.protocol === 'file:') {
        console.log("Running from file:// protocol, using default data");
        
        // Create admin/data directory structure and sync with main data
        this.syncDataFromMainDirectory();
      }
      
      this.setupEventListeners();
      this.checkAuth();
      this.loadFirebaseConfig();
      
      // Check window size and setup responsive behavior
      this.setupResponsiveBehavior();
      window.addEventListener('resize', () => this.setupResponsiveBehavior());
    },
    
    // Setup responsive behavior based on window size
    setupResponsiveBehavior() {
      const isMobile = window.innerWidth < 768;
      
      // If on mobile, make sure sidebar is hidden by default
      if (isMobile && this.elements.sidebar) {
        this.elements.sidebar.classList.remove('active');
        if (this.elements.sidebarOverlay) {
          this.elements.sidebarOverlay.classList.remove('active');
        }
      }
    },
    
    // Toggle mobile sidebar
    toggleMobileSidebar() {
      if (this.elements.sidebar) {
        this.elements.sidebar.classList.toggle('active');
      }
      
      if (this.elements.sidebarOverlay) {
        this.elements.sidebarOverlay.classList.toggle('active');
      }
    },
    
    // Hide mobile sidebar
    hideMobileSidebar() {
      if (this.elements.sidebar) {
        this.elements.sidebar.classList.remove('active');
      }
      
      if (this.elements.sidebarOverlay) {
        this.elements.sidebarOverlay.classList.remove('active');
      }
    },
    
    // Sync data from main directory to admin/data if running locally
    syncDataFromMainDirectory() {
      // This is a no-op when running from file:// protocol
      // Just use the defaultTeams and defaultEvents from memory
      console.log("Using in-memory default data due to file:// protocol limitations");
      
      // Set the default data in memory right away
      this.data.teams = JSON.parse(JSON.stringify(this.data.defaultTeams));
      this.data.events = JSON.parse(JSON.stringify(this.data.defaultEvents));
    },
    
    // Setup Event Listeners
    setupEventListeners() {
      // Login form submission
      this.elements.loginForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleLogin();
      });
      
      // Logout button
      this.elements.logoutBtn?.addEventListener("click", () => {
        this.handleLogout();
      });
      
      // Mobile menu toggle
      this.elements.menuToggle?.addEventListener("click", () => {
        this.toggleMobileSidebar();
      });
      
      // Sidebar overlay click (to close sidebar)
      this.elements.sidebarOverlay?.addEventListener("click", () => {
        this.hideMobileSidebar();
      });
      
      // Navigation links
      this.elements.navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          this.hideMobileSidebar();
          const section = link.getAttribute("data-section");
          this.showSection(section);
          
          // Update URL hash
          window.location.hash = link.getAttribute("href");
        });
      });
      
      // Team modal close
      this.elements.teamModalClose?.addEventListener("click", () => {
        this.hideTeamModal();
      });
      
      // Team cancel button
      this.elements.teamCancelBtn?.addEventListener("click", () => {
        this.hideTeamModal();
      });
      
      // Add team member button
      this.elements.addTeamMemberBtn?.addEventListener("click", () => {
        this.showTeamModal();
      });
      
      // Team form submission
      this.elements.teamForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveTeamMember();
      });
      
      // Team selection change
      this.elements.teamSelect?.addEventListener("change", () => {
        this.data.currentTeam = this.elements.teamSelect.value;
        this.renderTeamMembers();
      });
      
      // Event modal close
      this.elements.eventModalClose?.addEventListener("click", () => {
        this.hideEventModal();
      });
      
      // Event cancel button
      this.elements.eventCancelBtn?.addEventListener("click", () => {
        this.hideEventModal();
      });
      
      // Add event button
      this.elements.addEventBtn?.addEventListener("click", () => {
        this.showEventModal();
      });
      
      // Event form submission
      this.elements.eventForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveEvent();
      });
      
      // Application modal close
      this.elements.applicationModalClose?.addEventListener("click", () => {
        this.hideApplicationModal();
      });
      
      // Application close button
      this.elements.applicationCloseBtn?.addEventListener("click", () => {
        this.hideApplicationModal();
      });
      
      // Application delete button
      this.elements.applicationDeleteBtn?.addEventListener("click", () => {
        this.deleteApplication();
      });
      
      // Export Applications Button
      this.elements.exportApplicationsBtn?.addEventListener("click", () => {
        this.exportApplicationsCSV();
      });
      
      // Refresh Applications Button
      this.elements.refreshApplicationsBtn?.addEventListener("click", () => {
        this.fetchAndUpdateApplicationsCount();
      });
      
      // Message modal close
      this.elements.messageModalClose?.addEventListener("click", () => {
        this.hideMessageModal();
      });
      
      // Message close button
      this.elements.messageCloseBtn?.addEventListener("click", () => {
        this.hideMessageModal();
      });
      
      // Message delete button
      this.elements.messageDeleteBtn?.addEventListener("click", () => {
        this.deleteMessage();
      });
      
      // Export Messages Button
      this.elements.exportMessagesBtn?.addEventListener("click", () => {
        this.exportMessagesCSV();
      });
      
      // Refresh Messages Button
      this.elements.refreshMessagesBtn?.addEventListener("click", () => {
        this.fetchAndUpdateMessagesCount();
      });
      
      // Dashboard Export Applications Button
      document.getElementById("export-applications-btn")?.addEventListener("click", () => {
        this.exportApplicationsCSV();
      });
      
      // Dashboard Export Messages Button
      document.getElementById("export-messages-btn")?.addEventListener("click", () => {
        this.exportMessagesCSV();
      });
    },
    
    // Check Authentication
    checkAuth() {
      // Check if user is logged in
      const user = localStorage.getItem("acm_admin_user");
      if (user) {
        this.data.currentUser = JSON.parse(user);
        this.showDashboard();
        this.loadData();
      } else {
        this.showLogin();
      }
    },
    
    // Handle Login
    handleLogin() {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      
      // Simple authentication for demo purposes
      // In a real application, you would use Firebase Auth or another secure authentication method
      if (email === "admin@usar.acm.org" && password === "admin123") {
        const user = {
          email: email,
          name: "Admin User",
          role: "admin"
        };
        
        localStorage.setItem("acm_admin_user", JSON.stringify(user));
        this.data.currentUser = user;
        this.showDashboard();
        this.loadData();
      } else {
        this.elements.loginError.textContent = "Invalid email or password";
        this.elements.loginError.style.display = "block";
      }
    },
    
    // Handle Logout
    handleLogout() {
      localStorage.removeItem("acm_admin_user");
      this.data.currentUser = null;
      this.showLogin();
    },
    
    // Show Login
    showLogin() {
      this.elements.adminLogin.classList.remove("hidden");
      this.elements.adminDashboard.classList.add("hidden");
    },
    
    // Show Dashboard
    showDashboard() {
      if (this.elements.adminLogin) {
        this.elements.adminLogin.classList.add("hidden");
      }
      
      if (this.elements.adminDashboard) {
        this.elements.adminDashboard.classList.remove("hidden");
        
        // Add active class after a short delay to trigger the transition
        setTimeout(() => {
          this.elements.adminDashboard.classList.add("active");
          this.setupAnimationOrders();
        }, 100);
      }
      
      // Set user name if available
      if (this.data.currentUser && this.elements.adminUserName) {
        this.elements.adminUserName.textContent = this.data.currentUser.name;
      }
      
      // Show default section
      this.showSection("dashboard-section");
      
      // Load data
      this.loadData();
    },
    
    // Setup animation orders for card and stat elements
    setupAnimationOrders() {
      // Set animation orders for stat cards
      const statCards = document.querySelectorAll('.admin-stat-card');
      statCards.forEach((card, index) => {
        card.style.setProperty('--animation-order', index + 1);
      });
      
      // Set animation orders for regular cards
      const cards = document.querySelectorAll('.admin-card');
      cards.forEach((card, index) => {
        card.style.setProperty('--animation-order', index + 1);
      });
    },
    
    // Show Section with animation
    showSection(sectionId) {
      // Update active navigation link
      this.elements.navLinks.forEach(link => {
        if (link.getAttribute("data-section") === sectionId) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
      
      // Update section title
      if (this.elements.sectionTitle) {
        const activeLink = document.querySelector(`.admin-nav-link[data-section="${sectionId}"]`);
        if (activeLink) {
          this.elements.sectionTitle.textContent = activeLink.textContent.trim();
        }
      }
      
      // Hide all sections first
      this.elements.sections.forEach(section => {
        section.classList.remove("active");
      });
      
      // Show the selected section with a small delay for transition
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        setTimeout(() => {
          targetSection.classList.add("active");
          this.setupAnimationOrders();
        }, 50);
      }
    },
    
    // Load Data
    loadData() {
      this.loadTeamMembers();
      this.loadEvents();
      this.loadApplications();
      this.loadMessages();
    },
    
    // Load Team Members
    loadTeamMembers() {
      console.log("Loading team members...");
      
      // First check if we already have team data in memory to prevent reloading
      if (this.data.teams && this.data.teams.length > 0) {
        console.log("Already have team data in memory");
        this.renderTeamMembers();
        this.updateDashboardStats();
        return;
      }
      
      // IMMEDIATE FIX: Use default data
      this.data.teams = JSON.parse(JSON.stringify(this.data.defaultTeams));
      this.renderTeamMembers();
      this.updateDashboardStats();
      console.log("Using default team data");
      
      // Skip remote loading for file:// protocol (CORS restriction)
      if (window.location.protocol === 'file:') {
        console.log("Running from file:// protocol, skipping remote JSON loading");
        return;
      }
      
      // Try localStorage
      const storedTeams = localStorage.getItem("acm_team_data");
      if (storedTeams) {
        try {
          const parsedTeams = JSON.parse(storedTeams);
          if (parsedTeams && parsedTeams.length > 0) {
            this.data.teams = parsedTeams;
            this.renderTeamMembers();
            this.updateDashboardStats();
            console.log("Loaded team data from localStorage");
            
            // Don't try to load from file if we have data from localStorage
            return;
          }
        } catch (error) {
          console.error("Error parsing team data from localStorage:", error);
        }
      }
      
      // Only try to load from file if we don't have valid data yet and not on file:// protocol
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'data/team.json', true);
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              try {
                const data = JSON.parse(xhr.responseText);
                if (data && data.teams) {
          this.data.teams = data.teams;
          this.renderTeamMembers();
          this.updateDashboardStats();
                  
                  // Save to localStorage for future use
                  localStorage.setItem("acm_team_data", JSON.stringify(data.teams));
                  console.log("Loaded team data from JSON file");
                }
              } catch (error) {
                console.error("Error parsing team.json:", error);
              }
            } else {
              console.log(`Failed to load team.json: ${xhr.status}`);
            }
          }
        };
        xhr.onerror = () => {
          console.error("Error loading team data file");
        };
        xhr.send();
      } catch (error) {
        console.error("Error loading team data file:", error);
        // We already have default data, no need to do anything else
      }
    },
    
    // Load Events
    loadEvents() {
      console.log("Loading events...");
      
      // First check if we already have events data in memory to prevent reloading
      if (this.data.events && this.data.events.length > 0) {
        console.log("Already have events data in memory");
        this.renderEvents();
        this.renderUpcomingEvents();
        this.updateDashboardStats();
        return;
      }
      
      // IMMEDIATE FIX: Use default data
      this.data.events = JSON.parse(JSON.stringify(this.data.defaultEvents));
      this.renderEvents();
      this.renderUpcomingEvents();
      this.updateDashboardStats();
      console.log("Using default events data");
      
      // Skip remote loading for file:// protocol (CORS restriction)
      if (window.location.protocol === 'file:') {
        console.log("Running from file:// protocol, skipping remote JSON loading");
        return;
      }
      
      // Try localStorage
      const storedEvents = localStorage.getItem("acm_events_data");
      if (storedEvents) {
        try {
          const parsedEvents = JSON.parse(storedEvents);
          if (parsedEvents && parsedEvents.length > 0) {
            this.data.events = parsedEvents;
            this.renderEvents();
            this.renderUpcomingEvents();
            this.updateDashboardStats();
            console.log("Loaded events data from localStorage");
            
            // Don't try to load from file if we have data from localStorage
            return;
          }
        } catch (error) {
          console.error("Error parsing events data from localStorage:", error);
        }
      }
      
      // Only try to load from file if we don't have valid data yet and not on file:// protocol
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'data/events.json', true);
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              try {
                const data = JSON.parse(xhr.responseText);
                if (data && data.events) {
                  this.data.events = data.events;
                  this.renderEvents();
                  this.renderUpcomingEvents();
                  this.updateDashboardStats();
                  
                  // Save to localStorage for future use
                  localStorage.setItem("acm_events_data", JSON.stringify(data.events));
                  console.log("Loaded events data from JSON file");
                }
              } catch (error) {
                console.error("Error parsing events.json:", error);
              }
            } else {
              console.log(`Failed to load events.json: ${xhr.status}`);
            }
          }
        };
        xhr.onerror = () => {
          console.error("Error loading events data file");
        };
        xhr.send();
      } catch (error) {
        console.error("Error loading events data file:", error);
        // We already have default data, no need to do anything else
      }
    },
    
    // Load Applications
    loadApplications() {
      console.log("Loading applications...");
      
      // Prevent reloading if we already have data
      if (this.data.applications && this.data.applications.length > 0) {
        console.log("Already have applications data in memory");
        this.renderApplications();
        this.renderRecentApplications();
        this.updateDashboardStats();
        return;
      }
      
      // Try to load from local storage first
      const storedApplications = localStorage.getItem("acm_applications");
      
      if (storedApplications) {
        try {
          this.data.applications = JSON.parse(storedApplications);
          this.renderApplications();
          this.renderRecentApplications();
          this.updateDashboardStats();
          console.log("Loaded applications from localStorage");
          return;
        } catch (error) {
          console.error("Error parsing applications data:", error);
          this.data.applications = [];
        }
      } else {
        this.data.applications = [];
      }
      
      // Skip Firebase for file:// protocol (CORS restriction)
      if (window.location.protocol === 'file:') {
        console.log("Running from file:// protocol, skipping Firebase loading for applications");
        return;
      }
      
      // Try to load from Firebase if configured, but only once
      if (this.data.firebaseConfig) {
        this.loadFromFirebase("applications");
      }
    },
    
    // Render Team Members
    renderTeamMembers() {
      console.log("renderTeamMembers called");
      
      // Check if we need to render at all
      if (!this.elements.teamGrid) {
        console.error("teamGrid element not found");
        return;
      }
      
      // Clear existing content and event listeners
        this.elements.teamGrid.innerHTML = "";
        
      const currentTeamData = this.data.teams.find(t => t.name === this.data.currentTeam);
      if (!currentTeamData || !currentTeamData.members || !Array.isArray(currentTeamData.members)) {
        this.elements.teamGrid.innerHTML = "<div class='admin-no-data'>No team members found</div>";
        return;
      }
      
      // Build the team members display
      let html = "";
      currentTeamData.members.forEach(member => {
        if (!member) return;
        
        const imageUrl = member.image || "../images/acm-logo.svg";
        
        html += `
          <div class="admin-team-card" data-id="${member.id}">
            <div class="admin-team-image">
              <img src="${imageUrl}" alt="${member.name}" onerror="this.src='../images/acm-logo.svg'">
              <div class="admin-team-actions">
                <button class="admin-team-btn edit" data-id="${member.id}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button class="admin-team-btn delete" data-id="${member.id}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>
            <div class="admin-team-info">
              <h3 class="admin-team-name">${member.name}</h3>
              <p class="admin-team-position">${member.position}</p>
            </div>
            </div>
          `;
      });
      
      // Update the DOM only once
      this.elements.teamGrid.innerHTML = html;
      
      // Add event listeners after DOM update
      const handleEdit = (event) => {
        const btn = event.currentTarget;
        const memberId = btn.getAttribute("data-id");
        const member = this.findMemberById(memberId);
        if (member) {
            this.editTeamMember(member);
        }
      };
      
      const handleDelete = (event) => {
        const btn = event.currentTarget;
        const memberId = btn.getAttribute("data-id");
        const member = this.findMemberById(memberId);
        if (member) {
            this.deleteTeamMember(member);
        }
      };
      
      // Add event listeners once
      const editBtns = this.elements.teamGrid.querySelectorAll(".admin-team-btn.edit");
      const deleteBtns = this.elements.teamGrid.querySelectorAll(".admin-team-btn.delete");
      
      editBtns.forEach(btn => {
        btn.addEventListener("click", handleEdit);
      });
      
      deleteBtns.forEach(btn => {
        btn.addEventListener("click", handleDelete);
      });
    },
    
    // Helper function to find a member by ID
    findMemberById(id) {
      if (!this.data.teams || !Array.isArray(this.data.teams)) {
        return null;
      }
      
      for (const team of this.data.teams) {
        if (team && team.members && Array.isArray(team.members)) {
          const member = team.members.find(m => m && m.id === id);
          if (member) {
            return member;
          }
        }
      }
      
      return null;
    },
    
    // Show Team Modal
    showTeamModal(member = null) {
      this.elements.teamModal.classList.add("active");
      
      if (member) {
        this.elements.teamModalTitle.textContent = "Edit Team Member";
        document.getElementById("team-id").value = member.id || "";
        document.getElementById("team-name").value = member.name || "";
        document.getElementById("team-position").value = member.position || "";
        document.getElementById("team-image").value = member.image || "";
        document.getElementById("team-linkedin").value = member.linkedin || "";
        document.getElementById("team-group").value = member.team || this.data.currentTeam;
      } else {
        this.elements.teamModalTitle.textContent = "Add Team Member";
        this.elements.teamForm.reset();
        document.getElementById("team-group").value = this.data.currentTeam;
      }
    },
    
    // Hide Team Modal
    hideTeamModal() {
      this.elements.teamModal.classList.remove("active");
    },
    
    // Edit Team Member
    editTeamMember(member) {
      this.showTeamModal(member);
    },
    
    // Delete Team Member
    deleteTeamMember(member) {
      if (confirm(`Are you sure you want to delete ${member.name}?`)) {
        // Find the team
        const teamIndex = this.data.teams.findIndex(t => t.name === this.data.currentTeam);
        
        if (teamIndex !== -1) {
          // Find the member
          const memberIndex = this.data.teams[teamIndex].members.findIndex(m => m.name === member.name);
          
          if (memberIndex !== -1) {
            // Remove the member
            this.data.teams[teamIndex].members.splice(memberIndex, 1);
            
            // Save to local storage
            this.saveTeamData();
            
            // Re-render
            this.renderTeamMembers();
            this.updateDashboardStats();
          }
        }
      }
      
      // Show success toast
      this.showToast('success', 'Team Member Deleted', 'The team member has been successfully deleted.');
    },
    
    // Save Team Member
    saveTeamMember() {
      const id = document.getElementById("team-id").value;
      const name = document.getElementById("team-name").value;
      const position = document.getElementById("team-position").value;
      const image = document.getElementById("team-image").value;
      const linkedin = document.getElementById("team-linkedin").value;
      const team = document.getElementById("team-group").value;
      
      const member = {
        id: id || Date.now().toString(),
        name,
        position,
        image,
        linkedin
      };
      
      // Find the team
      const teamIndex = this.data.teams.findIndex(t => t.name === team);
      
      if (teamIndex !== -1) {
        if (id) {
          // Update existing member
          const memberIndex = this.data.teams[teamIndex].members.findIndex(m => m.id === id);
          
          if (memberIndex !== -1) {
            this.data.teams[teamIndex].members[memberIndex] = member;
          } else {
            // Member not found in this team, add as new
            this.data.teams[teamIndex].members.push(member);
          }
        } else {
          // Add new member
          this.data.teams[teamIndex].members.push(member);
        }
        
        // Save to local storage
        this.saveTeamData();
        
        // Re-render if current team
        if (team === this.data.currentTeam) {
          this.renderTeamMembers();
        }
        
        this.updateDashboardStats();
      }
      
      // Hide modal
      this.hideTeamModal();
      
      // Show success toast
      this.showToast('success', 'Team Member Saved', 'The team member has been successfully saved.');
    },
    
    // Save Team Data
    saveTeamData() {
      localStorage.setItem("acm_team_data", JSON.stringify(this.data.teams));
      
      // Create data directory if it doesn't exist
      try {
        if (window.location.protocol !== 'file:') {
          // Create data folder via fetch if running from a server
          fetch('data', { method: 'HEAD' })
            .catch(() => {
              console.log("Creating data directory");
              // This is just to notify - the actual file save below will create the directory if needed
            });
        }
      } catch (error) {
        console.log("Error checking data directory:", error);
      }
      
      // If Firebase is configured, save to Firestore
      this.saveToFirebase("teams", this.data.teams);
    },
    
    // Render Events
    renderEvents() {
      if (this.data.events && this.data.events.length > 0) {
        this.elements.eventsTable.innerHTML = "";
        
        this.data.events.forEach(event => {
          // Ensure we have valid properties
          const title = event.title || 'Unnamed Event';
          const location = event.location || 'TBD';
          const attendees = event.attendees || 0;
          
          // Format date
          let formattedDate = "TBD";
          if (event.date) {
            try {
          const eventDate = new Date(event.date);
              formattedDate = eventDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
          });
            } catch (e) {
              console.error("Error formatting date:", e);
            }
          }
          
          const row = document.createElement("tr");
          
          row.innerHTML = `
            <td>${title}</td>
            <td>${formattedDate}</td>
            <td>${location}</td>
            <td>${attendees}</td>
            <td>
              <div class="admin-table-actions">
                <button class="admin-table-btn edit" data-id="${event.id || ''}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button class="admin-table-btn delete" data-id="${event.id || ''}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </td>
          `;
          
          this.elements.eventsTable.appendChild(row);
          
          // Add event listeners
          const editBtn = row.querySelector(".admin-table-btn.edit");
          const deleteBtn = row.querySelector(".admin-table-btn.delete");
          
          editBtn.addEventListener("click", () => {
            this.editEvent(event);
          });
          
          deleteBtn.addEventListener("click", () => {
            this.deleteEvent(event);
          });
        });
      } else {
        this.elements.eventsTable.innerHTML = `
          <tr>
            <td colspan="5" class="admin-table-empty">No events found.</td>
          </tr>
        `;
      }
    },
    
    // Render Upcoming Events
    renderUpcomingEvents() {
      if (!this.elements.upcomingEvents) {
        console.error("upcomingEvents element not found");
        return;
      }
      
      if (this.data.events && this.data.events.length > 0) {
        // Sort events by date
        const sortedEvents = [...this.data.events].sort((a, b) => {
          return new Date(a.date || "2099-01-01") - new Date(b.date || "2099-01-01");
        });
        
        // Get upcoming events (future dates)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let upcomingEvents = sortedEvents.filter(event => {
          const eventDate = new Date(event.date || "2099-01-01");
          return eventDate >= today;
        });
        
        // If no upcoming events, just show the next 3 events regardless of date
        if (upcomingEvents.length === 0) {
          upcomingEvents = sortedEvents;
        }
        
        // Limit to 3 events
        const limitedEvents = upcomingEvents.slice(0, 3);
        
        if (limitedEvents.length > 0) {
          this.elements.upcomingEvents.innerHTML = "";
          
          limitedEvents.forEach(event => {
            // Ensure we have valid properties
            const title = event.title || 'Unnamed Event';
            const location = event.location || 'TBD';
            
            // Format date
            let formattedDate = "TBD";
            if (event.date) {
              try {
            const eventDate = new Date(event.date);
                formattedDate = eventDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            });
              } catch (e) {
                console.error("Error formatting date:", e);
              }
            }
            
            const li = document.createElement("li");
            li.className = "admin-event-item";
            li.innerHTML = `
              <div class="admin-event-date">${formattedDate}</div>
              <h4 class="admin-event-title">${title}</h4>
              <div class="admin-event-location">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>${location}</span>
              </div>
            `;
            
            this.elements.upcomingEvents.appendChild(li);
          });
        } else {
          this.elements.upcomingEvents.innerHTML = `
            <li class="admin-event-item">
              <div class="admin-event-date">No upcoming events</div>
            </li>
          `;
        }
      } else {
        this.elements.upcomingEvents.innerHTML = `
          <li class="admin-event-item">
            <div class="admin-event-date">No events found</div>
          </li>
        `;
      }
    },
    
    // Show Event Modal
    showEventModal(event = null) {
      this.elements.eventModal.classList.add("active");
      
      if (event) {
        this.elements.eventModalTitle.textContent = "Edit Event";
        document.getElementById("event-id").value = event.id || "";
        document.getElementById("event-title").value = event.title || "";
        document.getElementById("event-description").value = event.description || "";
        document.getElementById("event-date").value = event.date || "";
        document.getElementById("event-location").value = event.location || "";
        document.getElementById("event-attendees").value = event.attendees || "";
        document.getElementById("event-image").value = event.image || "";
      } else {
        this.elements.eventModalTitle.textContent = "Add Event";
        this.elements.eventForm.reset();
      }
    },
    
    // Hide Event Modal
    hideEventModal() {
      this.elements.eventModal.classList.remove("active");
    },
    
    // Edit Event
    editEvent(event) {
      this.showEventModal(event);
    },
    
    // Delete Event
    deleteEvent(event) {
      if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
        // Find the event
        const eventIndex = this.data.events.findIndex(e => e.id === event.id);
        
        if (eventIndex !== -1) {
          // Remove the event
          this.data.events.splice(eventIndex, 1);
          
          // Save to local storage
          this.saveEventData();
          
          // Re-render
          this.renderEvents();
          this.renderUpcomingEvents();
          this.updateDashboardStats();
        }
      }
    },
    
    // Save Event
    saveEvent() {
      const id = document.getElementById("event-id").value;
      const title = document.getElementById("event-title").value;
      const description = document.getElementById("event-description").value;
      const date = document.getElementById("event-date").value;
      const location = document.getElementById("event-location").value;
      const attendees = document.getElementById("event-attendees").value;
      const image = document.getElementById("event-image").value;
      
      const event = {
        id: id || Date.now().toString(),
        title,
        description,
        date,
        location,
        attendees: Number.parseInt(attendees),
        image
      };
      
      if (id) {
        // Update existing event
        const eventIndex = this.data.events.findIndex(e => e.id === id);
        
        if (eventIndex !== -1) {
          this.data.events[eventIndex] = event;
        } else {
          // Event not found, add as new
          this.data.events.push(event);
        }
      } else {
        // Add new event
        this.data.events.push(event);
      }
      
      // Save to local storage
      this.saveEventData();
      
      // Re-render
      this.renderEvents();
      this.renderUpcomingEvents();
      this.updateDashboardStats();
      
      // Hide modal
      this.hideEventModal();
    },
    
    // Save Event Data
    saveEventData() {
      localStorage.setItem("acm_events_data", JSON.stringify(this.data.events));
      
      // Create data directory if it doesn't exist
      try {
        if (window.location.protocol !== 'file:') {
          // Create data folder via fetch if running from a server
          fetch('data', { method: 'HEAD' })
            .catch(() => {
              console.log("Creating data directory");
              // This is just to notify - the actual file save below will create the directory if needed
            });
        }
        } catch (error) {
        console.log("Error checking data directory:", error);
      }
      
      // If Firebase is configured, save to Firestore
      this.saveToFirebase("events", this.data.events);
    },
    
    // Render Applications
    renderApplications() {
      if (this.data.applications && this.data.applications.length > 0) {
        // Sort by timestamp (newest first)
        const sortedApplications = [...this.data.applications].sort((a, b) => {
          return new Date(b.timestamp) - new Date(a.timestamp);
        });
        
        this.elements.applicationsTable.innerHTML = "";
        
        sortedApplications.forEach(application => {
          const row = document.createElement("tr");
          
          // Format date
          let formattedDate = "N/A";
          if (application.timestamp) {
            const date = new Date(application.timestamp);
            formattedDate = date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric"
            });
          }
          
          row.innerHTML = `
            <td>${application.fullName}</td>
            <td>${application.email}</td>
            <td>${application.studentId}</td>
            <td>${application.yearOfStudy}</td>
            <td>${formattedDate}</td>
            <td>
              <div class="admin-table-actions">
                <button class="admin-table-btn view" data-id="${application.id || ''}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
                <button class="admin-table-btn delete" data-id="${application.id || ''}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </td>
          `;
          
          this.elements.applicationsTable.appendChild(row);
          
          // Add event listeners
          const viewBtn = row.querySelector(".admin-table-btn.view");
          const deleteBtn = row.querySelector(".admin-table-btn.delete");
          
          viewBtn.addEventListener("click", () => {
            this.viewApplication(application);
          });
          
          deleteBtn.addEventListener("click", () => {
            this.deleteApplication(application);
          });
        });
      } else {
        this.elements.applicationsTable.innerHTML = `
          <tr>
            <td colspan="6" class="admin-table-empty">No applications found.</td>
          </tr>
        `;
      }
    },

    // Render Recent Applications
    renderRecentApplications() {
      if (!this.elements.recentApplications) return;
      
      if (this.data.applications && this.data.applications.length > 0) {
        // Sort by timestamp (newest first)
        const sortedApplications = [...this.data.applications]
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 5); // Show only the 5 most recent
        
        this.elements.recentApplications.innerHTML = "";
        
        sortedApplications.forEach(application => {
          // Format date
          let formattedDate = "N/A";
          if (application.timestamp) {
            const date = new Date(application.timestamp);
            formattedDate = date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric"
            });
          }
          
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${application.fullName}</td>
            <td>${application.email}</td>
            <td>${application.studentId}</td>
            <td>${formattedDate}</td>
          `;
          
          this.elements.recentApplications.appendChild(row);
        });
      } else {
        this.elements.recentApplications.innerHTML = `
          <tr>
            <td colspan="4" class="admin-table-empty">No applications found.</td>
          </tr>
        `;
      }
    },
    
    // View Application
    viewApplication(application) {
      // Set current application
      this.currentApplication = application;
      
      // Populate modal
      const modalContent = document.getElementById("application-details");
      if (modalContent) {
        // Format date
        let formattedDate = "N/A";
        if (application.timestamp) {
          const date = new Date(application.timestamp);
          formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
          });
        }
        
        modalContent.innerHTML = `
          <div class="admin-modal-row">
            <div class="admin-modal-col">
              <h4>Personal Information</h4>
              <p><strong>Full Name:</strong> ${application.fullName}</p>
              <p><strong>Email:</strong> ${application.email}</p>
              <p><strong>Student ID:</strong> ${application.studentId}</p>
              <p><strong>Year of Study:</strong> ${application.yearOfStudy}</p>
              <p><strong>Date Applied:</strong> ${formattedDate}</p>
            </div>
            <div class="admin-modal-col">
              <h4>Application Details</h4>
              <p><strong>Major:</strong> ${application.major}</p>
              <p><strong>Previous Experience:</strong> ${application.experience}</p>
              <p><strong>Why Join:</strong> ${application.whyJoin}</p>
              <p><strong>Skills:</strong> ${application.skills}</p>
            </div>
          </div>
        `;
      }
      
      // Show modal
      this.elements.applicationModal.classList.add("active");
    },
    
    // Delete Application
    deleteApplication(application = null) {
      if (!application && this.currentApplication) {
        application = this.currentApplication;
      }
      
      if (application && confirm(`Are you sure you want to delete this application from ${application.fullName}?`)) {
        // Find the application
        const appIndex = this.data.applications.findIndex(a => a.id === application.id);
        
        if (appIndex !== -1) {
          // Remove the application
          this.data.applications.splice(appIndex, 1);
          
          // Save to local storage
          localStorage.setItem("acm_applications", JSON.stringify(this.data.applications));
          
          // If Firebase is configured, save to Firestore
          this.saveToFirebase("applications", this.data.applications);
          
          // Re-render
          this.renderApplications();
          this.renderRecentApplications();
          this.updateDashboardStats();
          
          // Hide modal
          this.hideApplicationModal();
        }
      }
    },
    
    // Hide Application Modal
    hideApplicationModal() {
      this.elements.applicationModal.classList.remove("active");
      this.currentApplication = null;
    },
    
    // Update Dashboard Stats
    updateDashboardStats() {
      this.elements.teamCount.textContent = this.getTotalTeamMembers();
      this.elements.eventsCount.textContent = this.data.events.length;
      
      // Update applications and messages count directly from export server
      this.fetchAndUpdateApplicationsCount();
      this.fetchAndUpdateMessagesCount();
    },
    
    // Fetch and update applications count from export server
    fetchAndUpdateApplicationsCount() {
      // Show loading indicator
      this.elements.applicationsCount.textContent = "...";
      this.elements.applicationsUpdated.textContent = "Updating...";
      
      // Try to use in-memory data first
      if (this.data.applications && this.data.applications.length > 0) {
        this.elements.applicationsCount.textContent = this.data.applications.length;
      }
      
      // Then try to get fresh data from export server
      fetch('http://localhost:8082/export/applications?path=data/applications.json')
        .then(response => {
          if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
          }
          return response.text();
        })
        .then(csvData => {
          // Count the lines in the CSV data (excluding header)
          const lines = csvData.split('\n');
          // Skip the empty lines
          const nonEmptyLines = lines.filter(line => line.trim() !== '');
          // Subtract 1 for the header row
          const count = nonEmptyLines.length > 1 ? nonEmptyLines.length - 1 : 0;
          
          // Update the UI
          this.elements.applicationsCount.textContent = count;
          this.elements.applicationsUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
          
          // Parse CSV data to JSON and update the applications table
          if (count > 0) {
            // Parse CSV data
            const headers = nonEmptyLines[0].split(',').map(header => header.trim().replace(/^"|"$/g, ''));
            const applicationsData = [];
            
            for (let i = 1; i < nonEmptyLines.length; i++) {
              // Handle commas inside quotes properly
              const values = this.parseCSVLine(nonEmptyLines[i]);
              const application = {};
              
              headers.forEach((header, index) => {
                if (header === 'Timestamp') {
                  application.timestamp = values[index];
                } else if (header === 'ID') {
                  application.id = values[index];
                } else if (header === 'FullName') {
                  application.fullName = values[index];
                } else if (header === 'Email') {
                  application.email = values[index];
                } else if (header === 'StudentID') {
                  application.studentId = values[index];
                } else if (header === 'School') {
                  application.school = values[index];
                } else if (header === 'YearOfStudy') {
                  application.yearOfStudy = values[index];
                } else {
                  application[header.toLowerCase()] = values[index];
                }
              });
              
              applicationsData.push(application);
            }
            
            // Update in-memory data
            this.data.applications = applicationsData;
            
            // Update the applications table
            this.renderApplications();
            this.renderRecentApplications();
          }
        })
        .catch(error => {
          console.error('Error fetching applications count:', error);
          // Fallback to in-memory data if already available
          if (this.data.applications && this.data.applications.length > 0) {
            this.elements.applicationsCount.textContent = this.data.applications.length;
          } else {
            this.elements.applicationsCount.textContent = "N/A";
          }
          this.elements.applicationsUpdated.textContent = `Error: ${error.message}`;
        });
    },
    
    // Helper function to parse CSV line while respecting quoted values with commas
    parseCSVLine(line) {
      const result = [];
      let currentValue = '';
      let insideQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
          // End of field
          result.push(currentValue.trim().replace(/^"|"$/g, ''));
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      // Push the last value
      result.push(currentValue.trim().replace(/^"|"$/g, ''));
      
      return result;
    },
    
    // Fetch and update messages count from export server
    fetchAndUpdateMessagesCount() {
      // Show loading indicator
      this.elements.messagesCount.textContent = "...";
      this.elements.messagesUpdated.textContent = "Updating...";
      
      // Try to use in-memory data first
      if (this.data.messages && this.data.messages.length > 0) {
        this.elements.messagesCount.textContent = this.data.messages.length;
      }
      
      // Then try to get fresh data from export server
      fetch('http://localhost:8082/export/messages?path=data/messages.json')
        .then(response => {
          if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
          }
          return response.text();
        })
        .then(csvData => {
          // Count the lines in the CSV data (excluding header)
          const lines = csvData.split('\n');
          // Skip the empty lines
          const nonEmptyLines = lines.filter(line => line.trim() !== '');
          // Subtract 1 for the header row
          const count = nonEmptyLines.length > 1 ? nonEmptyLines.length - 1 : 0;
          
          // Update the UI
          this.elements.messagesCount.textContent = count;
          this.elements.messagesUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
          
          // Parse CSV data to JSON and update the messages table
          if (count > 0) {
            // Parse CSV data
            const headers = nonEmptyLines[0].split(',').map(header => header.trim().replace(/^"|"$/g, ''));
            const messagesData = [];
            
            for (let i = 1; i < nonEmptyLines.length; i++) {
              // Handle commas inside quotes properly
              const values = this.parseCSVLine(nonEmptyLines[i]);
              const message = {};
              
              headers.forEach((header, index) => {
                if (header === 'Timestamp') {
                  message.timestamp = values[index];
                } else if (header === 'ID') {
                  message.id = values[index];
                } else if (header === 'Name') {
                  message.name = values[index];
                } else if (header === 'Email') {
                  message.email = values[index];
                } else if (header === 'Message') {
                  message.message = values[index];
                } else {
                  message[header.toLowerCase()] = values[index];
                }
              });
              
              messagesData.push(message);
            }
            
            // Update in-memory data
            this.data.messages = messagesData;
            
            // Update the messages table
            this.renderMessages();
          }
        })
        .catch(error => {
          console.error('Error fetching messages count:', error);
          // Fallback to in-memory data if already available
          if (this.data.messages && this.data.messages.length > 0) {
            this.elements.messagesCount.textContent = this.data.messages.length;
          } else {
            this.elements.messagesCount.textContent = "N/A";
          }
          this.elements.messagesUpdated.textContent = `Error: ${error.message}`;
        });
    },
    
    // Get total team members
    getTotalTeamMembers() {
      let total = 0;
      
      if (!this.data.teams) {
        return 0;
      }
      
      if (Array.isArray(this.data.teams)) {
        // If teams are in the format from team.json
        this.data.teams.forEach(team => {
          if (team && team.members && Array.isArray(team.members)) {
            total += team.members.length;
          }
        });
      } else if (typeof this.data.teams === 'object') {
        // If teams are organized by categories directly
        Object.keys(this.data.teams).forEach(teamName => {
          const team = this.data.teams[teamName];
          if (Array.isArray(team)) {
            total += team.length;
          } else if (team && team.members && Array.isArray(team.members)) {
            total += team.members.length;
          }
        });
      }
      
      return total;
    },
    
    // Save to Firebase
    saveToFirebase(collection, data) {
      // Skip for file:// protocol (CORS restriction)
      if (window.location.protocol === 'file:') {
        console.log(`Running from file:// protocol, skipping Firebase save for ${collection}`);
        return;
      }
      
      if (!this.data.firebaseConfig || !this.isFirebaseInitialized) return;
      
      try {
        const db = firebase.firestore();
        
        // Create a batch write
        const batch = db.batch();
        
        // Get collection reference
        const collectionRef = db.collection(collection);
        
        // Clear existing documents
        collectionRef.get().then(snapshot => {
          snapshot.forEach(doc => {
            batch.delete(doc.ref);
          });
          
          // Add new documents
          if (Array.isArray(data)) {
            data.forEach(item => {
              const docRef = collectionRef.doc(item.id || Date.now().toString());
              batch.set(docRef, item);
            });
          } else {
            // If data is an object
            Object.keys(data).forEach(key => {
              const docRef = collectionRef.doc(key);
              batch.set(docRef, { data: data[key] });
            });
          }
          
          // Commit the batch
          batch.commit().catch(error => {
            console.error(`Error writing to Firebase (${collection}):`, error);
          });
        }).catch(error => {
          console.error(`Error reading from Firebase (${collection}):`, error);
        });
      } catch (error) {
        console.error(`Error with Firebase operation (${collection}):`, error);
      }
    },
    
    // Load from Firebase
    loadFromFirebase(collection) {
      console.log(`Attempting to load ${collection} from Firebase...`);
      
      // Skip for file:// protocol (CORS restriction)
      if (window.location.protocol === 'file:') {
        console.log(`Running from file:// protocol, skipping Firebase loading for ${collection}`);
        return Promise.resolve();
      }
      
      // Create a flag to track if we've already loaded this collection
      const loadedFlag = `_loaded_${collection}`;
      if (this.data[loadedFlag]) {
        console.log(`${collection} already loaded from Firebase.`);
        return Promise.resolve();
      }
      
      // Check if Firebase is initialized
      if (!this.data.firebaseConfig || !window.firebase || !window.firebase.apps.length) {
        console.log("Firebase not initialized, can't load data.");
        return Promise.resolve();
      }
      
      try {
        const db = firebase.firestore();
        
        return db.collection(collection).get()
          .then(snapshot => {
            if (snapshot.empty) {
              console.log(`No ${collection} found in Firebase.`);
              return;
            }
            
            // Mark this collection as loaded to prevent repeated calls
            this.data[loadedFlag] = true;
            
            const items = [];
            snapshot.forEach(doc => {
              items.push({
                id: doc.id,
                ...doc.data()
              });
            });
            
            console.log(`Loaded ${items.length} ${collection} from Firebase.`);
            
            // Update data and UI
            if (collection === "applications") {
              this.data.applications = items;
              this.renderApplications();
              this.renderRecentApplications();
            } else if (collection === "messages") {
              this.data.messages = items;
              this.renderMessages();
            } else if (collection === "teams") {
              // Create proper structure for teams data
              const teams = [];
              items.forEach(item => {
                const team = teams.find(t => t.name === item.team);
                if (team) {
                  team.members.push(item);
                } else {
                  teams.push({
                    name: item.team,
                    members: [item]
                  });
                }
              });
              
              this.data.teams = teams;
              this.renderTeamMembers();
            } else if (collection === "events") {
              this.data.events = items;
              this.renderEvents();
              this.renderUpcomingEvents();
            }
            
            // Update stats
            this.updateDashboardStats();
            
            // Save to localStorage for future use
            localStorage.setItem(`acm_${collection}`, JSON.stringify(items));
          })
          .catch(error => {
            console.error(`Error loading ${collection} from Firebase:`, error);
            return Promise.resolve();
          });
      } catch (error) {
        console.error(`Error in loadFromFirebase (${collection}):`, error);
        return Promise.resolve();
      }
    },
    
    // Export Applications to CSV
    exportApplicationsCSV() {
      // Use our dedicated export server instead
      const downloadUrl = 'http://localhost:8082/export/applications?path=data/applications.json';
      
      // Use fetch to check for errors
      fetch(downloadUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
          }
          return response.blob();
        })
        .then(blob => {
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'applications.csv');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          this.showToast('success', 'Export Complete', 'Applications exported to CSV successfully');
        })
        .catch(error => {
          console.error('Export error:', error);
          this.showToast('error', 'Export Failed', error.message);
        });
    },
    
    // Export Messages to CSV
    exportMessagesCSV() {
      // Use our dedicated export server instead
      const downloadUrl = 'http://localhost:8082/export/messages?path=data/messages.json';
      
      // Use fetch to check for errors
      fetch(downloadUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
          }
          return response.blob();
        })
        .then(blob => {
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'messages.csv');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          this.showToast('success', 'Export Complete', 'Messages exported to CSV successfully');
        })
        .catch(error => {
          console.error('Export error:', error);
          this.showToast('error', 'Export Failed', error.message);
        });
    },
    
    // Delete Message
    deleteMessage() {
      if (confirm("Are you sure you want to delete this message?")) {
        // Find the message
        const messageIndex = this.data.messages.findIndex(m => m.id === this.currentMessage.id);
        
        if (messageIndex !== -1) {
          // Remove the message
          this.data.messages.splice(messageIndex, 1);
          
          // Save to local storage
          localStorage.setItem("acm_messages", JSON.stringify(this.data.messages));
          
          // If Firebase is configured, save to Firestore
          this.saveToFirebase("messages", this.data.messages);
          
          // Re-render
          this.renderMessages();
          
          // Hide message modal
          this.hideMessageModal();
        }
      }
    },
    
    // Hide Message Modal
    hideMessageModal() {
      this.elements.messageModal.classList.remove("active");
      this.currentMessage = null;
    },
    
    // Load Messages
    loadMessages() {
      console.log("Loading messages...");
      
      // Skip loading if we already have messages in memory
      if (this.data.messages && this.data.messages.length > 0) {
        console.log("Already have messages data in memory");
        this.renderMessages();
        this.updateDashboardStats();
        return;
      }
      
      // Try localStorage first
      const storedMessages = localStorage.getItem("acm_messages");
      
      if (storedMessages) {
        try {
          this.data.messages = JSON.parse(storedMessages);
          this.renderMessages();
          this.updateDashboardStats();
          console.log("Loaded messages from localStorage");
          return;
        } catch (error) {
          console.error("Error parsing messages data:", error);
          this.data.messages = [];
        }
      } else {
        this.data.messages = [];
      }
      
      // Skip Firebase for file:// protocol (CORS restriction)
      if (window.location.protocol === 'file:') {
        console.log("Running from file:// protocol, skipping Firebase loading for messages");
        return;
      }
      
      // Try to load from Firebase if configured, but only once
      if (this.data.firebaseConfig) {
        this.loadFromFirebase("messages");
      }
    },
    
    // Load Firebase Config
    loadFirebaseConfig() {
      console.log("Loading Firebase config...");
      
      // Skip if already initialized
      if (this.data.firebaseConfig) {
        console.log("Firebase config already loaded");
        return;
      }
      
      // Try to load from local storage
      const storedConfig = localStorage.getItem("acm_firebase_config");
      
      if (storedConfig) {
        try {
          this.data.firebaseConfig = JSON.parse(storedConfig);
          console.log("Loaded Firebase config from localStorage");
          
          // Initialize Firebase with the loaded config
          this.initializeFirebase();
        } catch (error) {
          console.error("Error parsing Firebase config:", error);
        }
      }
    },
    
    // Initialize Firebase
    initializeFirebase() {
      if (!this.data.firebaseConfig) return;
      
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(this.data.firebaseConfig);
          this.isFirebaseInitialized = true;
          console.log("Firebase initialized successfully");
        } else {
          this.isFirebaseInitialized = true;
          console.log("Firebase already initialized");
        }
      } catch (error) {
        console.error("Error initializing Firebase:", error);
        this.isFirebaseInitialized = false;
      }
    },
    
    // Save Firebase Config
    saveFirebaseConfig() {
      const config = {
        apiKey: document.getElementById("firebase-apiKey").value,
        authDomain: document.getElementById("firebase-authDomain").value,
        projectId: document.getElementById("firebase-projectId").value,
        storageBucket: document.getElementById("firebase-storageBucket").value,
        messagingSenderId: document.getElementById("firebase-messagingSenderId").value,
        appId: document.getElementById("firebase-appId").value
      };
      
      // Save to local storage
      localStorage.setItem("acm_firebase_config", JSON.stringify(config));
      
      // Update data
      this.data.firebaseConfig = config;
      
      // Initialize Firebase
      this.initializeFirebase();
      
      // Show success message
      alert("Firebase configuration saved successfully!");
      
      // Reload data
      if (this.isFirebaseInitialized) {
        this.loadData();
      }
    },
    
    // Update Admin Account
    updateAdminAccount() {
      const email = document.getElementById("admin-email").value;
      const name = document.getElementById("admin-name").value;
      const password = document.getElementById("admin-password").value;
      const confirmPassword = document.getElementById("admin-confirm-password").value;
      
      // Validate inputs
      if (!email || !name) {
        alert("Email and name are required");
        return;
      }
      
      // If changing password
      if (password) {
        if (password !== confirmPassword) {
          alert("Passwords do not match");
          return;
        }
        
        if (password.length < 6) {
          alert("Password must be at least 6 characters");
          return;
        }
      }
      
      // Update user data
      const user = {
        email: email,
        name: name,
        role: "admin"
      };
      
      // Save in localStorage
      localStorage.setItem("acm_admin_user", JSON.stringify(user));
      
      // If using Firebase Auth, you would update the user here
      // For demo purposes, we'll just use localStorage
      
      // Update current user
      this.data.currentUser = user;
      
      // Update UI
      this.elements.adminUserName.textContent = user.name;
      
      // Show success message
      alert("Admin account updated successfully!");
    },
    
    // Render Messages
    renderMessages() {
      if (this.data.messages && this.data.messages.length > 0) {
        this.elements.messagesTable.innerHTML = "";
        
        this.data.messages.forEach(message => {
          const row = document.createElement("tr");
          
          row.innerHTML = `
            <td>${message.sender}</td>
            <td>${message.recipient}</td>
            <td>${message.subject}</td>
            <td>${message.message}</td>
            <td>${new Date(message.timestamp).toLocaleDateString()}</td>
            <td>
              <div class="admin-table-actions">
                <button class="admin-table-btn view" data-id="${message.id}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
                <button class="admin-table-btn delete" data-id="${message.id}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </td>
          `;
          
          this.elements.messagesTable.appendChild(row);
          
          // Add event listeners
          const viewBtn = row.querySelector(".admin-table-btn.view");
          const deleteBtn = row.querySelector(".admin-table-btn.delete");
          
          viewBtn.addEventListener("click", () => {
            this.viewMessage(message);
          });
          
          deleteBtn.addEventListener("click", () => {
            this.deleteMessage(message);
          });
        });
      } else {
        this.elements.messagesTable.innerHTML = `
          <tr>
            <td colspan="6" class="admin-table-empty">No messages found.</td>
          </tr>
        `;
      }
    },
    
    // View Message
    viewMessage(message) {
      // Set current message
      this.currentMessage = message;
      
      // Populate modal
      const modalContent = document.getElementById("message-details");
      if (modalContent) {
        modalContent.innerHTML = `
          <div class="admin-modal-row">
            <div class="admin-modal-col">
              <h4>Message Details</h4>
              <p><strong>Sender:</strong> ${message.sender}</p>
              <p><strong>Recipient:</strong> ${message.recipient}</p>
              <p><strong>Subject:</strong> ${message.subject}</p>
              <p><strong>Message:</strong> ${message.message}</p>
              <p><strong>Date Sent:</strong> ${new Date(message.timestamp).toLocaleDateString()}</p>
            </div>
          </div>
        `;
      }
      
      // Show modal
      this.elements.messageModal.classList.add("active");
    },
    
    // Delete Message
    deleteMessage(message = null) {
      if (!message && this.currentMessage) {
        message = this.currentMessage;
      }
      
      if (message && confirm(`Are you sure you want to delete this message from ${message.sender} to ${message.recipient}?`)) {
        // Find the message
        const msgIndex = this.data.messages.findIndex(m => m.id === message.id);
        
        if (msgIndex !== -1) {
          // Remove the message
          this.data.messages.splice(msgIndex, 1);
          
          // Save to local storage
          localStorage.setItem("acm_messages", JSON.stringify(this.data.messages));
          
          // If Firebase is configured, save to Firestore
          this.saveToFirebase("messages", this.data.messages);
          
          // Re-render
          this.renderMessages();
          
          // Hide message modal
          this.hideMessageModal();
        }
      }
    },
    
    // Hide Message Modal
    hideMessageModal() {
      this.elements.messageModal.classList.remove("active");
      this.currentMessage = null;
    },
    
    // Show reset password modal
    showResetPasswordModal() {
      // Clear previous message
      this.elements.resetMessage.textContent = "";
      this.elements.resetMessage.className = "form-message";
      
      // Clear email field
      const emailInput = document.getElementById("reset-email");
      if (emailInput) {
        emailInput.value = "";
      }
      
      // Show modal
      this.elements.resetPasswordModal.classList.add("active");
    },
    
    // Hide reset password modal
    hideResetPasswordModal() {
      this.elements.resetPasswordModal.classList.remove("active");
    },
    
    // Handle password reset
    handlePasswordReset() {
      const email = document.getElementById("reset-email").value;
      
      if (!email) {
        this.showResetError("Please enter your email address");
        return;
      }
      
      // Disable submit button during operation
      document.getElementById("reset-submit-btn").disabled = true;
      
      // If running locally or Firebase is not initialized
      if (window.location.protocol === 'file:' || !firebase.apps.length) {
        // Simulate success for development
        setTimeout(() => {
          this.showResetSuccess(`Password reset link sent to ${email}. Please check your email.`);
          document.getElementById("reset-submit-btn").disabled = false;
        }, 1500);
        return;
      }
      
      // Use Firebase Auth to send password reset email
      firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
          this.showResetSuccess(`Password reset link sent to ${email}. Please check your email.`);
          document.getElementById("reset-submit-btn").disabled = false;
          
          // Close the modal after 3 seconds
          setTimeout(() => {
            this.hideResetPasswordModal();
          }, 3000);
        })
        .catch((error) => {
          let errorMessage = "Failed to send password reset email";
          
          // Map Firebase error codes to user-friendly messages
          switch(error.code) {
            case 'auth/invalid-email':
              errorMessage = "Invalid email address format";
              break;
            case 'auth/user-not-found':
              errorMessage = "No account exists with this email address";
              break;
            default:
              errorMessage = error.message;
          }
          
          this.showResetError(errorMessage);
          document.getElementById("reset-submit-btn").disabled = false;
        });
    },
    
    // Show reset error message
    showResetError(message) {
      this.elements.resetMessage.textContent = message;
      this.elements.resetMessage.className = "form-message error";
    },
    
    // Show reset success message
    showResetSuccess(message) {
      this.elements.resetMessage.textContent = message;
      this.elements.resetMessage.className = "form-message success";
    },
    
    // Show toast notification
    showToast(type, title, message, duration = 3000) {
      // Remove any existing toasts
      const existingToast = document.querySelector('.admin-toast');
      if (existingToast) {
        existingToast.remove();
      }
      
      // Create toast element
      const toast = document.createElement('div');
      toast.className = `admin-toast ${type}`;
      
      // Set icon based on type
      let iconSvg = '';
      switch (type) {
        case 'success':
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="admin-toast-icon" style="color: var(--admin-success)"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
          break;
        case 'error':
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="admin-toast-icon" style="color: var(--admin-danger)"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
          break;
        case 'warning':
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="admin-toast-icon" style="color: var(--admin-warning)"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
          break;
        default:
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="admin-toast-icon" style="color: var(--admin-primary)"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
      }
      
      toast.innerHTML = `
        ${iconSvg}
        <div class="admin-toast-content">
          <h4 class="admin-toast-title">${title}</h4>
          <p class="admin-toast-message">${message}</p>
        </div>
        <button class="admin-toast-close">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      `;
      
      // Add to DOM
      document.body.appendChild(toast);
      
      // Add active class after a short delay for transition
      setTimeout(() => {
        toast.classList.add('active');
      }, 10);
      
      // Add close event listener
      const closeBtn = toast.querySelector('.admin-toast-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          toast.classList.remove('active');
          setTimeout(() => {
            toast.remove();
          }, 300);
        });
      }
      
      // Auto-remove after duration
      if (duration > 0) {
        setTimeout(() => {
          if (document.body.contains(toast)) {
            toast.classList.remove('active');
            setTimeout(() => {
              if (document.body.contains(toast)) {
                toast.remove();
              }
            }, 300);
          }
        }, duration);
      }
    }
  };

  // Initialize the AdminDashboard
  AdminDashboard.init();
});
