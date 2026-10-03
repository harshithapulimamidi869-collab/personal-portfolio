const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = document.querySelector(".theme-label");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const filterButtons = document.querySelectorAll(".filter-button");
const projectItems = document.querySelectorAll(".project-item");
const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");

function setTheme(theme) {
  const isDark = theme === "dark";
  document.body.dataset.theme = isDark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
  themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
  document.querySelector('meta[name="theme-color"]').content = isDark ? "#17221f" : "#f7f7f2";
}

let savedTheme = "light";
try {
  savedTheme = localStorage.getItem("harshitha-portfolio-theme") || "light";
} catch {
  savedTheme = "light";
}
setTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  try {
    localStorage.setItem("harshitha-portfolio-theme", nextTheme);
  } catch {
    // Theme switching still works when browser storage is unavailable.
  }
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  siteNav.classList.toggle("is-open", !isOpen);
});

siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    siteNav.classList.remove("is-open");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    siteNav.classList.remove("is-open");
    menuToggle.focus();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    projectItems.forEach((project) => {
      project.hidden = filter !== "all" && project.dataset.category !== filter;
    });
  });
});

const fields = [...contactForm.querySelectorAll("input, textarea")];

function validateField(field) {
  const error = document.getElementById(`${field.name}-error`);
  const value = field.value.trim();
  let message = "";
  if (!value) {
    message = "Please fill out this field.";
  } else if (field.type === "email" && !field.validity.valid) {
    message = "Enter a valid email address.";
  } else if (field.minLength > 0 && value.length < field.minLength) {
    message = `Please enter at least ${field.minLength} characters.`;
  }
  error.textContent = message;
  field.setAttribute("aria-invalid", String(Boolean(message)));
  return !message;
}

fields.forEach((field) => {
  field.addEventListener("input", () => {
    if (field.hasAttribute("aria-invalid")) validateField(field);
    formStatus.textContent = "";
  });
  field.addEventListener("blur", () => validateField(field));
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const isValid = fields.map(validateField).every(Boolean);
  if (!isValid) {
    formStatus.textContent = "Please check the highlighted fields.";
    contactForm.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  const formData = new FormData(contactForm);
  const subject = encodeURIComponent(formData.get("subject").trim());
  const body = encodeURIComponent(`From: ${formData.get("name").trim()}\nEmail: ${formData.get("email").trim()}\n\n${formData.get("message").trim()}`);
  const draftLink = document.createElement("a");
  draftLink.href = `mailto:harshithapulimamidi869@gmail.com?subject=${subject}&body=${body}`;
  draftLink.textContent = "Open email draft";
  formStatus.replaceChildren(document.createTextNode("Your message is ready. "), draftLink);
  contactForm.reset();
  fields.forEach((field) => field.removeAttribute("aria-invalid"));
  fields.forEach((field) => {
    document.getElementById(`${field.name}-error`).textContent = "";
  });
});