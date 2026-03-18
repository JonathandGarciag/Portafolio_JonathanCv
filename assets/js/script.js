// Nav active
const sections = document.querySelectorAll("main section");
const navLinks = document.querySelectorAll("header nav a");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${entry.target.id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  },
  { threshold: 0.5 }
);

sections.forEach((section) => observer.observe(section));

// Skills animation
const skillItems = document.querySelectorAll(".skill-item");

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector(".skill-fill");
        const percentText = entry.target.querySelector(".skill-percent");
        const percent = parseInt(entry.target.dataset.percent);
        const color = entry.target.dataset.color;

        if (!fill || !percentText || Number.isNaN(percent)) return;

        fill.style.background = color;
        fill.style.width = percent + "%";

        let current = 0;
        const interval = setInterval(() => {
          if (current >= percent) {
            clearInterval(interval);
          } else {
            current++;
            percentText.textContent = current + "%";
          }
        }, 15);

        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

skillItems.forEach((item) => skillObserver.observe(item));

// Tabs educación
const tabButtons = document.querySelectorAll(".tab-button");
const panels = document.querySelectorAll(".education-panel");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const year = button.dataset.year;

    tabButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    panels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.year === year);
    });
  });
});

function t(key, fallback) {
  return window.i18n?.t ? window.i18n.t(key, fallback) : fallback;
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  if (form.dataset.bound === "true") return;

  form.dataset.bound = "true";

  if (typeof emailjs !== "undefined" && emailjs?.init) {
    emailjs.init("gmmCbinVp-H8S3aJB");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (typeof emailjs === "undefined" || !emailjs?.sendForm) {
      alert(t("footer.emailMissing", "EmailJS no está cargado."));
      return;
    }

    emailjs.sendForm("service_ogiuonl", "template_q4d5l3g", this).then(
      () => alert(t("footer.sendOk", "Mensaje enviado correctamente")),
      (error) => alert(`${t("footer.sendError", "Error al enviar")}: ` + JSON.stringify(error))
    );
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initContactForm);
} else {
  initContactForm();
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

(() => {
  const list = document.getElementById("certList");
  const btn = document.getElementById("certToggle");
  if (!list || !btn) return;

  const extras = Array.from(list.querySelectorAll(".certificate.is-extra"));

  const updateButtonText = () => {
    const collapsed = list.getAttribute("data-collapsed") === "true";
    const target = btn.querySelector("[data-i18n]") || btn;
    target.textContent = collapsed
      ? t("certificates.showAll", "Ver todos los certificados")
      : t("certificates.showLess", "Ver menos");
  };

  const open = () => {
    list.setAttribute("data-collapsed", "false");
    updateButtonText();

    extras.forEach((card, i) => {
      card.classList.remove("cert-hide");
      card.style.animationDelay = `${i * 60}ms`;
      card.classList.add("cert-show");
    });

    setTimeout(() => {
      extras.forEach((card) => {
        card.classList.remove("cert-show");
        card.style.animationDelay = "";
      });
    }, 600 + extras.length * 60);
  };

  const close = () => {
    extras.forEach((card, i) => {
      card.classList.remove("cert-show");
      card.style.animationDelay = `${i * 30}ms`;
      card.classList.add("cert-hide");
    });

    setTimeout(() => {
      list.setAttribute("data-collapsed", "true");
      extras.forEach((card) => {
        card.classList.remove("cert-hide");
        card.style.animationDelay = "";
      });
      updateButtonText();
    }, 200);
  };

  btn.addEventListener("click", () => {
    const collapsed = list.getAttribute("data-collapsed") === "true";
    collapsed ? open() : close();
  });

  document.addEventListener("languageChanged", updateButtonText);
  updateButtonText();
})();

function initSidebarAccountDropdown() {
  const dropdown = document.querySelector(".sidebar-dropdown");
  const toggle = document.querySelector(".sidebar-account-toggle");

  if (!dropdown || !toggle) return;
  if (toggle.dataset.bound === "true") return;

  toggle.dataset.bound = "true";

  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  document.addEventListener("click", function (e) {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSidebarAccountDropdown);
} else {
  initSidebarAccountDropdown();
}