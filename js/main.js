document.addEventListener("DOMContentLoaded", () => {
  // Declare AOS
  const AOS = window.AOS

  // Initialize AOS animations
  AOS.init({
    duration: 800,
    easing: "ease-in-out",
    once: true,
    mirror: false,
  })

  // Page loader
  const pageLoader = document.querySelector(".page-loader")
  const loaderProgress = document.querySelector(".loader-progress")

  let progress = 0
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 10) + 5
    if (progress >= 100) {
      progress = 100
      clearInterval(interval)
      loaderProgress.style.width = `${progress}%`
      
      // Delay hiding the loader slightly for a smooth transition
      setTimeout(() => {
        pageLoader.classList.add("loaded")
      }, 500)
    }
  }, 50)

  // Header scroll effect
  const header = document.getElementById("site-header")
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  })

  // Back to top button
  const backToTopButton = document.getElementById("back-to-top")
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add("visible")
    } else {
      backToTopButton.classList.remove("visible")
    }
  })

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  // Logo click to scroll to top
  const headerLogo = document.getElementById("header-logo")
  if (headerLogo) {
    headerLogo.addEventListener("click", (e) => {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  // Mobile menu toggle
  const menuToggle = document.querySelector(".mobile-menu-toggle")
  const mobileMenu = document.createElement("div")
  mobileMenu.className = "mobile-menu"
  mobileMenu.innerHTML = `
    <div class="mobile-menu-container">
      <div class="mobile-menu-header">
        <a href="#" class="logo-container" id="mobile-logo">
          <div class="logo-glow">
            <img src="images/acm-logo.svg" alt="ACM Logo" class="logo">
          </div>
          <span class="logo-text">
            <span class="gradient-text">ACM</span> | <span class="text-highlight">USAR</span>
          </span>
        </a>
        <button class="mobile-menu-close">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <nav class="mobile-nav">
        <a href="#about" class="mobile-nav-link">About</a>
        <a href="#achievements" class="mobile-nav-link">Achievements</a>
        <a href="#team" class="mobile-nav-link">Team</a>
        <a href="#events" class="mobile-nav-link">Events</a>
        <a href="#contact" class="mobile-nav-link">Contact</a>
        <a href="admin/index.html" class="mobile-nav-link admin-mobile-link">Admin Portal</a>
      </nav>
    </div>
  `
  document.body.appendChild(mobileMenu)

  const mobileMenuContainer = document.querySelector(".mobile-menu")
  const mobileMenuClose = document.querySelector(".mobile-menu-close")
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link")

  menuToggle.addEventListener("click", () => {
    mobileMenuContainer.classList.add("active")
    document.body.style.overflow = "hidden"
  })

  mobileMenuClose.addEventListener("click", () => {
    mobileMenuContainer.classList.remove("active")
    document.body.style.overflow = ""
  })

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenuContainer.classList.remove("active")
      document.body.style.overflow = ""
    })
  })

  // Mobile logo click to scroll to top
  const mobileLogo = document.getElementById("mobile-logo")
  if (mobileLogo) {
    mobileLogo.addEventListener("click", (e) => {
      e.preventDefault()
      mobileMenuContainer.classList.remove("active")
      document.body.style.overflow = ""
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  // Initialize particles.js
  const particlesJS = window.particlesJS
  if (typeof particlesJS !== "undefined") {
    // Hero particles
    if (document.getElementById("hero-particles")) {
      particlesJS("hero-particles", {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: "#6366f1" },
          shape: { type: "circle" },
          opacity: { value: 0.5, random: true },
          size: { value: 3, random: true },
          line_linked: { enable: true, distance: 150, color: "#6366f1", opacity: 0.4, width: 1 },
          move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "grab" },
            onclick: { enable: true, mode: "push" },
            resize: true,
          },
          modes: {
            grab: { distance: 140, line_linked: { opacity: 1 } },
            push: { particles_nb: 4 },
          },
        },
        retina_detect: true,
      })
    }

    // About particles
    if (document.getElementById("about-particles")) {
      particlesJS("about-particles", {
        particles: {
          number: { value: 30, density: { enable: true, value_area: 800 } },
          color: { value: "#3b82f6" },
          shape: { type: "circle" },
          opacity: { value: 0.3, random: true },
          size: { value: 5, random: true },
          line_linked: { enable: false },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "bubble" },
            onclick: { enable: true, mode: "repulse" },
            resize: true,
          },
          modes: {
            bubble: { distance: 250, size: 6, duration: 2, opacity: 0.8, speed: 3 },
            repulse: { distance: 200, duration: 0.4 },
          },
        },
        retina_detect: true,
      })
    }
  }

  // Counter animation
  const counters = document.querySelectorAll(".counter")
  const animateCounter = (counter) => {
    const target = Number.parseInt(counter.getAttribute("data-target"))
    const duration = 2000 // 2 seconds
    const step = target / (duration / 16) // 60fps
    let current = 0

    const updateCounter = () => {
      current += step
      if (current < target) {
        counter.textContent = Math.ceil(current)
        requestAnimationFrame(updateCounter)
      } else {
        counter.textContent = target
      }
    }

    updateCounter()
  }

  const observerOptions = {
    threshold: 0.5,
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target)
        counterObserver.unobserve(entry.target)
      }
    })
  }, observerOptions)

  counters.forEach((counter) => {
    counterObserver.observe(counter)
  })

  // Hardcoded team data for fallback
  const fallbackTeamData = {
    teams: [
      {
        name: "Executive Board",
        members: [
          {
            name: "Harshit Tyagi",
            position: "Chapter Chair",
            image: "images/harshit.jpg",
            linkedin: "https://www.linkedin.com/in/harshitism"
          },
          {
            name: "Sumit Kumar",
            position: "Vice Chair",
            image: "images/sumit.jpg",
            linkedin: "https://www.linkedin.com/in/sumit-kumar-3b835b251"
          },
          {
            name: "Rahul Gupta",
            position: "Secretary",
            image: "images/acm-logo.svg",
            linkedin: "https://linkedin.com/in/rahul-gupta"
          },
          {
            name: "Neha Singh",
            position: "Treasurer",
            image: "images/acm-logo.svg",
            linkedin: "https://linkedin.com/in/neha-singh"
          }
        ]
      }
    ]
  };

  // Function to render team members
  function renderTeamMembers(data) {
    const teamGrid = document.getElementById("team-members");
    if (!teamGrid) return;
    
    teamGrid.innerHTML = ""; // Clear any existing content
    
    const executiveTeam = data.teams.find((team) => team.name === "Executive Board");

    if (executiveTeam && executiveTeam.members) {
      // Preload images with cache busting
      executiveTeam.members.forEach(member => {
        if (member.image) {
          const img = new Image();
          img.src = member.image + "?t=" + new Date().getTime();
        }
      });
      
      executiveTeam.members.forEach((member, index) => {
        const memberCard = document.createElement("div");
        memberCard.className = "team-card";
        memberCard.setAttribute("data-aos", "fade-up");
        memberCard.setAttribute("data-aos-delay", (index * 100).toString());
        
        // Use fallback image if member.image is missing or invalid
        const imageUrl = member.image ? (member.image + "?t=" + new Date().getTime()) : "images/acm-logo.svg";
        
        memberCard.innerHTML = `
          <div class="team-image-container">
            <div class="team-image-overlay"></div>
            <img src="${imageUrl}" alt="${member.name}" class="team-image" onerror="this.src='images/acm-logo.svg'">
          </div>
          <div class="team-info">
            <h3 class="team-name">${member.name}</h3>
            <p class="team-role">${member.position}</p>
            <div class="team-social">
              <a href="${member.linkedin || "#"}" class="social-link" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="#" class="social-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" class="social-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
            </div>
          </div>
        `;
        teamGrid.appendChild(memberCard);
      });
    }
  }

  // Load team members with fallback
  fetch("data/team.json?v=" + Math.floor(Date.now() / 1000))
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      renderTeamMembers(data);
    })
    .catch((error) => {
      console.error("Error loading team data:", error);
      console.log("Using fallback team data");
      renderTeamMembers(fallbackTeamData);
    });

  // Hardcoded events data for fallback
  const fallbackEventsData = {
    events: [
      {
        id: "1",
        title: "Web Development Workshop",
        description: "Learn the basics of HTML, CSS, and JavaScript in this hands-on workshop.",
        date: "2025-06-15",
        location: "Computer Science Building, Room 101",
        attendees: 30,
        image: "images/6.jpg"
      },
      {
        id: "2",
        title: "AI/ML Hackathon",
        description: "Build innovative solutions using artificial intelligence and machine learning.",
        date: "2025-07-20",
        location: "Engineering Center, Main Hall",
        attendees: 50,
        image: "images/5.jpg"
      },
      {
        id: "3",
        title: "Tech Talk: Future of Computing",
        description: "Join us for an engaging discussion on emerging technologies and trends.",
        date: "2025-08-10",
        location: "Virtual Event",
        attendees: 100,
        image: "images/1.jpg"
      }
    ]
  };

  // Function to render events
  function renderEvents(data) {
    const eventsSlider = document.getElementById("events-slider");
    const eventsDots = document.getElementById("events-dots");
    
    if (!eventsSlider || !eventsDots) return;
    
    // Clear existing content
    eventsSlider.innerHTML = "";
    eventsDots.innerHTML = "";

    if (data.events && data.events.length > 0) {
      data.events.forEach((event, index) => {
        // Format date
        let formattedDate = "Coming Soon";
        if (event.date) {
          try {
            const eventDate = new Date(event.date);
            formattedDate = eventDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
          } catch (e) {
            console.error("Error formatting date:", e);
          }
        }

        // Create event slide
        const eventSlide = document.createElement("div");
        eventSlide.className = `events-slide ${index === 0 ? "active" : ""}`;
        eventSlide.setAttribute("data-index", index.toString());
        
        // Use fallback image if event.image is missing or invalid
        const imageUrl = event.image || "images/acm-logo.svg";
        // Add cache-busting parameter to ensure the image is refreshed
        const cachedImageUrl = imageUrl + "?t=" + new Date().getTime();
        
        eventSlide.innerHTML = `
          <div class="event-card">
            <div class="event-image">
              <img src="${cachedImageUrl}" alt="${event.title}" onerror="this.src='images/acm-logo.svg'">
            </div>
            <div class="event-content">
              <span class="event-date">${formattedDate}</span>
              <h3 class="event-title">${event.title}</h3>
              <p class="event-description">${event.description}</p>
              <div class="event-footer">
                <div class="event-location">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>${event.location}</span>
                </div>
                <div class="event-attendees">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span>${event.attendees} attendees</span>
                </div>
              </div>
            </div>
          </div>
        `;
        eventsSlider.appendChild(eventSlide);

        // Create dot for navigation
        const dot = document.createElement("div");
        dot.className = `events-dot ${index === 0 ? "active" : ""}`;
        dot.setAttribute("data-index", index.toString());
        dot.addEventListener("click", () => {
          showSlide(index);
        });
        eventsDots.appendChild(dot);
      });

      // Events navigation
      const prevBtn = document.getElementById("prev-event");
      const nextBtn = document.getElementById("next-event");
      const slides = document.querySelectorAll(".events-slide");
      const dots = document.querySelectorAll(".events-dot");
      let currentSlide = 0;

      const showSlide = (index) => {
        slides.forEach((slide) => slide.classList.remove("active"));
        dots.forEach((dot) => dot.classList.remove("active"));

        slides[index].classList.add("active");
        dots[index].classList.add("active");
        currentSlide = index;

        // Disable/enable navigation buttons
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === slides.length - 1;
      };

      prevBtn.addEventListener("click", () => {
        if (currentSlide > 0) {
          showSlide(currentSlide - 1);
        }
      });

      nextBtn.addEventListener("click", () => {
        if (currentSlide < slides.length - 1) {
          showSlide(currentSlide + 1);
        }
      });

      // Initialize first slide
      showSlide(0);
    }
  }

  // Load events with fallback
  fetch("data/events.json?v=" + Math.floor(Date.now() / 1000))
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      renderEvents(data);
    })
    .catch((error) => {
      console.error("Error loading events data:", error);
      console.log("Using fallback events data");
      renderEvents(fallbackEventsData);
    });

  // Form submission handlers
  const joinForm = document.getElementById("join-form")
  const contactForm = document.getElementById("contact-form")

  // Initialize Firebase if available
  let db = null
  const firebase = window.firebase
  try {
    if (typeof firebase !== "undefined") {
      // Firebase initialization code remains, but we'll use Go API instead
      console.log("Firebase is available but using Go API instead");
    }
  } catch (error) {
    console.warn("Firebase not available, using Go API:", error)
  }

  if (joinForm) {
    joinForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      const formData = new FormData(joinForm)
      const formMessage = document.getElementById("form-message")
      const formDataObj = Object.fromEntries(formData)

      // Show loading state
      const submitButton = joinForm.querySelector('button[type="submit"]')
      const originalButtonText = submitButton.innerHTML
      submitButton.innerHTML = `
        <div class="loading-spinner"></div>
        <span>Submitting...</span>
      `
      submitButton.disabled = true

      try {
        // Send to Go backend API
        const response = await fetch("http://localhost:8081/api/applications", {
          method: "POST",
          body: JSON.stringify(formDataObj),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        formMessage.className = "form-message success";
        formMessage.textContent = data.message || "Application submitted successfully! We'll be in touch soon.";
        joinForm.reset();
      } catch (error) {
        console.error("Error submitting form:", error);
        formMessage.className = "form-message error";
        formMessage.textContent = "An error occurred. Please try again.";
      } finally {
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;

        // Scroll to message
        formMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    })
  }

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      const formData = new FormData(contactForm)
      const formMessage = document.getElementById("contact-message")
      const formDataObj = Object.fromEntries(formData)

      // Show loading state
      const submitButton = contactForm.querySelector('button[type="submit"]')
      const originalButtonText = submitButton.innerHTML
      submitButton.innerHTML = `
        <div class="loading-spinner"></div>
        <span>Sending...</span>
      `
      submitButton.disabled = true

      try {
        // Send to Go backend API
        const response = await fetch("http://localhost:8081/api/contact", {
          method: "POST",
          body: JSON.stringify(formDataObj),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        formMessage.className = "form-message success";
        formMessage.textContent = data.message || "Message sent successfully! We'll get back to you soon.";
        contactForm.reset();
      } catch (error) {
        console.error("Error sending message:", error);
        formMessage.className = "form-message error";
        formMessage.textContent = "An error occurred. Please try again.";
      } finally {
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;

        // Scroll to message
        formMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    })
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
})
