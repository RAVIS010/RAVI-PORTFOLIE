const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = [...document.querySelectorAll(".nav-links a")];
const revealItems = document.querySelectorAll(".reveal");
const sections = [...document.querySelectorAll("main section[id], header[id]")];
const contactForm = document.querySelector(".contact-form");
const formNote = document.querySelector(".form-note");
const contactEmail = "raviak213@gmail.com";

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });
}

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navLinks?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  });
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -60px 0px",
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const setActiveLink = () => {
  const checkpoint = window.scrollY + window.innerHeight * 0.35;

  let activeId = sections[0]?.id ?? "home";
  sections.forEach((section) => {
    if (checkpoint >= section.offsetTop) {
      activeId = section.id;
    }
  });

  navItems.forEach((item) => {
    const isActive = item.getAttribute("href") === `#${activeId}`;
    item.classList.toggle("active", isActive);
  });
};

window.addEventListener("scroll", setActiveLink, { passive: true });
window.addEventListener("load", setActiveLink);

if (contactForm && formNote) {
  const fieldNames = ["name", "email", "message"];

  const getField = (name) => contactForm.querySelector(`[name="${name}"]`);
  const getError = (name) => contactForm.querySelector(`[data-error-for="${name}"]`);

  const validateField = (field) => {
    const value = field.value.trim();
    let message = "";

    if (field.name === "name") {
      if (!value) {
        message = "Please enter your name.";
      } else if (value.length < 2) {
        message = "Name must be at least 2 characters.";
      }
    }

    if (field.name === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        message = "Please enter your email address.";
      } else if (!emailPattern.test(value)) {
        message = "Please enter a valid email address.";
      }
    }

    if (field.name === "message") {
      if (!value) {
        message = "Please enter your message.";
      } else if (value.length < 10) {
        message = "Message must be at least 10 characters.";
      }
    }

    field.classList.toggle("is-invalid", Boolean(message));
    const error = getError(field.name);
    if (error) {
      error.textContent = message;
    }

    return !message;
  };

  fieldNames.forEach((name) => {
    const field = getField(name);
    if (!field) {
      return;
    }

    field.addEventListener("input", () => {
      validateField(field);
      formNote.textContent = "";
    });

    field.addEventListener("blur", () => {
      validateField(field);
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = fieldNames.map(getField).filter(Boolean);
    const isValid = fields.every((field) => validateField(field));

    if (!isValid) {
      formNote.textContent = "Please correct the highlighted fields before sending.";
      return;
    }

    const name = getField("name").value.trim();
    const email = getField("email").value.trim();
    const message = getField("message").value.trim();
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    formNote.textContent = "Opening your email app to send the message.";
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    contactForm.reset();
  });
}
