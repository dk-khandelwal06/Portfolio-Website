// Utility: smooth nav active state & mobile menu, scroll reveal, form validation

document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav__link");
    const sections = document.querySelectorAll("section[id]");
    const navToggle = document.querySelector(".nav__toggle");
    const navMenu = document.querySelector(".nav__menu");
    const yearSpan = document.getElementById("year");
    const contactForm = document.getElementById("contact-form");
    const themeToggle = document.getElementById("theme-toggle");
    const bodyEl = document.body;

    /* Theme handling */
    const applyTheme = (mode) => {
      const isLight = mode === "light";
      bodyEl.classList.toggle("light-theme", isLight);
      if (themeToggle) {
        themeToggle.textContent = isLight ? "☀️" : "🌙";
        themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
      }
      localStorage.setItem("theme", isLight ? "light" : "dark");
    };

    const savedTheme = localStorage.getItem("theme");
    applyTheme(savedTheme === "light" ? "light" : "dark");

    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        const nextTheme = bodyEl.classList.contains("light-theme") ? "dark" : "light";
        applyTheme(nextTheme);
      });
    }
  
    /* Current year in footer */
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  
    /* Mobile nav toggle */
    if (navToggle && navMenu) {
      navToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("open");
        navToggle.classList.toggle("open", isOpen);
      });
  
      // Close menu when clicking a link (mobile)
      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          if (navMenu.classList.contains("open")) {
            navMenu.classList.remove("open");
            navToggle.classList.remove("open");
          }
        });
      });
    }
  
    /* Active section highlighting using IntersectionObserver */
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -55% 0px",
      threshold: 0.2
    };
  
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        if (!id) return;
        const correspondingLink = document.querySelector(`.nav__link[href="#${id}"]`);
        if (!correspondingLink) return;
  
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("active"));
          correspondingLink.classList.add("active");
        }
      });
    }, observerOptions);
  
    sections.forEach((section) => sectionObserver.observe(section));
  
    /* Scroll-reveal animations */
    const revealElements = document.querySelectorAll(".reveal");
  
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
  
    revealElements.forEach((el) => revealObserver.observe(el));
  
    /* Projects view all toggle */
    const viewAllBtn = document.getElementById("view-all-btn");
    const hiddenProjects = document.querySelectorAll(".project-card.hidden");
    
    if (viewAllBtn && hiddenProjects.length > 0) {
      let isExpanded = false;
      
      viewAllBtn.addEventListener("click", () => {
        isExpanded = !isExpanded;
        
        if (isExpanded) {
          viewAllBtn.textContent = "Show Less";
          hiddenProjects.forEach((project, index) => {
            setTimeout(() => {
              project.classList.remove("hidden");
              project.classList.add("show");
            }, index * 100); // Stagger animation
          });
        } else {
          viewAllBtn.textContent = "View All";
          hiddenProjects.forEach((project) => {
            project.classList.remove("show");
            project.classList.add("hidden");
          });
        }
      });
    }
  
    /* Contact form validation (front-end only) */
    if (contactForm) {
      contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
  
        const nameInput = contactForm.querySelector("#name");
        const emailInput = contactForm.querySelector("#email");
        const messageInput = contactForm.querySelector("#message");
        const successEl = contactForm.querySelector(".form__success");
  
        let isValid = true;
  
        // Helper to show error text
        const showError = (input, message) => {
          const errorSpan = input?.parentElement?.querySelector(".form__error");
          if (errorSpan) {
            errorSpan.textContent = message || "";
          }
        };
  
        // Reset old errors
        [nameInput, emailInput, messageInput].forEach((input) => showError(input, ""));
  
        // Name validation
        if (!nameInput.value.trim()) {
          showError(nameInput, "Please enter your name.");
          isValid = false;
        }
  
        // Email validation
        const emailVal = emailInput.value.trim();
        if (!emailVal) {
          showError(emailInput, "Please enter your email.");
          isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
          showError(emailInput, "Please enter a valid email.");
          isValid = false;
        }
  
        // Message validation
        if (!messageInput.value.trim()) {
          showError(messageInput, "Please enter a message.");
          isValid = false;
        }
  
        if (!isValid) {
          if (successEl) {
            successEl.textContent = "";
            successEl.classList.remove("visible");
          }
          return;
        }
  
        // Simulated success (no backend; can be wired later)
        if (successEl) {
          successEl.textContent = "Thank you for reaching out! Your message has been captured locally. I will respond soon.";
          successEl.classList.add("visible");
        }
  
        // Simple success animation on button
        const submitButton = contactForm.querySelector(".form__submit");
        const buttonText = submitButton?.querySelector(".form__submit-text");
        if (submitButton && buttonText) {
          const originalText = buttonText.textContent;
          buttonText.textContent = "Sent!";
          submitButton.disabled = true;
          submitButton.classList.add("sent");
  
          setTimeout(() => {
            buttonText.textContent = originalText;
            submitButton.disabled = false;
            submitButton.classList.remove("sent");
          }, 2000);
        }
  
        // Reset form fields
        contactForm.reset();
      });
    }
  });