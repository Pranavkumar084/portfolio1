// Handle navigation toggle on mobile
const nav = document.querySelector(".nav");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".nav-link");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Close mobile nav when clicking a link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (nav.classList.contains("open")) {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
});

// Basic scroll-based active link highlighting
const sections = document.querySelectorAll("main section[id]");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      const correspondingLink = document.querySelector(
        `.nav-link[href="#${id}"]`
      );
      if (!correspondingLink) return;

      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove("active"));
        correspondingLink.classList.add("active");
      }
    });
  },
  {
    rootMargin: "-50% 0px -50% 0px",
    threshold: 0.2,
  }
);

sections.forEach((section) => sectionObserver.observe(section));

// Contact form validation + mailto handling
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

// Derive contact email from the visible "Email" link in the contact section
let contactEmail = "pranavkumarkassa084@gmail.com";
const emailAnchor = document.querySelector(
  '.contact-info a[href^="mailto:"]'
);
if (emailAnchor) {
  const href = emailAnchor.getAttribute("href");
  if (href && href.startsWith("mailto:")) {
    contactEmail = href.replace("mailto:", "").trim();
  }
}

function showFieldError(fieldName, message) {
  const errorElement = document.querySelector(
    `.field-error[data-error-for="${fieldName}"]`
  );
  if (errorElement) {
    errorElement.textContent = message || "";
  }
}

function clearErrors() {
  document
    .querySelectorAll(".field-error")
    .forEach((el) => (el.textContent = ""));
}

function validateEmail(email) {
  // Simple email pattern for basic validation
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();
    formStatus.textContent = "";

    const name = contactForm.elements["name"].value.trim();
    const email = contactForm.elements["email"].value.trim();
    const message = contactForm.elements["message"].value.trim();

    let isValid = true;

    if (!name) {
      isValid = false;
      showFieldError("name", "Please enter your name.");
    }

    if (!email) {
      isValid = false;
      showFieldError("email", "Please enter your email.");
    } else if (!validateEmail(email)) {
      isValid = false;
      showFieldError("email", "Please enter a valid email address.");
    }

    if (!message) {
      isValid = false;
      showFieldError("message", "Please enter a message.");
    }

    if (!isValid) {
      formStatus.textContent =
        "Please correct the highlighted fields and try again.";
      return;
    }

    // Build a mailto link so the user's email client opens with a pre-filled message
    const subject = `Portfolio contact from ${name}`;
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      "Message:",
      message,
    ];
    const body = bodyLines.join("\n");

    const mailtoUrl = `mailto:${encodeURIComponent(
      contactEmail
    )}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    formStatus.textContent = "Opening your email application…";
    window.location.href = mailtoUrl;
  });
}

// Set dynamic year in footer
const yearElement = document.getElementById("current-year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

