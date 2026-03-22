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
  const dropdowns = document.querySelectorAll(".sidebar-dropdown");
  if (!dropdowns.length) return;

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".sidebar-account-toggle");

    if (!toggle) return;
    if (toggle.dataset.bound === "true") return;

    toggle.dataset.bound = "true";

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();

      const isAlreadyOpen = dropdown.classList.contains("open");

      dropdowns.forEach((item) => {
        item.classList.remove("open");

        const itemToggle = item.querySelector(".sidebar-account-toggle");
        if (itemToggle) {
          itemToggle.setAttribute("aria-expanded", "false");
        }
      });

      const contactPopover = document.getElementById("sidebar-contact-popover");
      const contactToggle = document.querySelector(".sidebar-contact-toggle");
      if (contactPopover) contactPopover.classList.remove("open");
      if (contactToggle) contactToggle.setAttribute("aria-expanded", "false");

      if (!isAlreadyOpen) {
        dropdown.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
      }
    });
  });
}

function copyTextFallback(text) {
  const input = document.createElement("input");
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
}

function positionContactPopover() {
  const toggle = document.querySelector(".sidebar-contact-toggle");
  const popover = document.getElementById("sidebar-contact-popover");

  if (!toggle || !popover) return;

  const rect = toggle.getBoundingClientRect();
  const popoverHeight = popover.offsetHeight || 180;

  let top = rect.top + (rect.height / 2) - (popoverHeight / 2);
  const minTop = 12;
  const maxTop = window.innerHeight - popoverHeight - 12;

  if (top < minTop) top = minTop;
  if (top > maxTop) top = maxTop;

  popover.style.top = `${top}px`;
}

function initSidebarContactPopover() {
  const toggle = document.querySelector(".sidebar-contact-toggle");
  const popover = document.getElementById("sidebar-contact-popover");

  if (!toggle || !popover) return;
  if (toggle.dataset.bound === "true") return;

  toggle.dataset.bound = "true";

  toggle.addEventListener("click", function (e) {
    e.stopPropagation();

    const isOpen = popover.classList.contains("open");

    document.querySelectorAll(".sidebar-dropdown").forEach((dropdown) => {
      dropdown.classList.remove("open");
      const githubToggle = dropdown.querySelector(".sidebar-account-toggle");
      if (githubToggle) githubToggle.setAttribute("aria-expanded", "false");
    });

    if (isOpen) {
      popover.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    } else {
      popover.classList.add("open");
      positionContactPopover();
      toggle.setAttribute("aria-expanded", "true");
    }
  });

  window.addEventListener("resize", function () {
    if (popover.classList.contains("open")) {
      positionContactPopover();
    }
  });
}

function showSidebarToast(message) {
  let toast = document.querySelector(".sidebar-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "sidebar-toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 1600);
}

function ensureSidebarContactButtons() {
  const wrapper = document.querySelector("#sidebar-contact-popover .sidebar-contact-actions");
  if (!wrapper) return;

  let copyBtn = wrapper.querySelector(".sidebar-contact-action--copy");
  let callBtn = wrapper.querySelector(".sidebar-contact-action--call");

  if (!copyBtn) {
    copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "sidebar-contact-action sidebar-contact-action--copy";
    copyBtn.setAttribute("data-copy-phone", "+502 5931-8205");
    copyBtn.setAttribute("aria-label", "Copiar número");
    copyBtn.innerHTML = `
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path fill="currentColor" d="M368 448H112c-26.5 0-48-21.5-48-48V144h48v256h256v48zm80-336v208c0 26.5-21.5 48-48 48H176c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h224c26.5 0 48 21.5 48 48z"/>
      </svg>
      <span>${t("sidebar.copyPhone", "Copiar")}</span>
    `;
    wrapper.appendChild(copyBtn);
  }

  if (!callBtn) {
    callBtn = document.createElement("button");
    callBtn.type = "button";
    callBtn.className = "sidebar-contact-action sidebar-contact-action--call";
    callBtn.setAttribute("data-call-phone", "+50259318205");
    callBtn.setAttribute("data-call-label", "+502 5931-8205");
    callBtn.setAttribute("aria-label", "Llamar al número");
    callBtn.innerHTML = `
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path fill="currentColor" d="M391 351c-15-15-32-15-47-15-9 0-17 4-24 10l-36 36c-49-26-89-66-115-115l36-36c15-15 15-32 15-47 0-15 0-32-15-47L191 56c-15-15-32-15-47-15-9 0-17 4-24 10l-56 56c-15 15-15 32-15 47 0 152 123 275 275 275 15 0 32 0 47-15l56-56c6-6 10-15 10-24 0-15 0-32-15-47z"/>
      </svg>
      <span>${t("sidebar.callPhone", "Llamar")}</span>
    `;
    wrapper.appendChild(callBtn);
  }

  if (!copyBtn.querySelector("span")) {
    copyBtn.insertAdjacentHTML("beforeend", `<span>${t("sidebar.copyPhone", "Copiar")}</span>`);
  }

  if (!callBtn.querySelector("span")) {
    callBtn.insertAdjacentHTML("beforeend", `<span>${t("sidebar.callPhone", "Llamar")}</span>`);
  }
}

function updateSidebarContactLabels() {
  document.querySelectorAll("[data-copy-phone]").forEach((button) => {
    const label = button.querySelector("span");
    if (label) {
      label.textContent = t("sidebar.copyPhone", "Copiar");
    }
    button.setAttribute("aria-label", t("sidebar.copyPhone", "Copiar"));
  });

  document.querySelectorAll("[data-call-phone]").forEach((button) => {
    const label = button.querySelector("span");
    if (label) {
      label.textContent = t("sidebar.callPhone", "Llamar");
    }
    button.setAttribute("aria-label", t("sidebar.callPhone", "Llamar"));
  });
}

function initSidebarContactActions() {
    ensureSidebarContactButtons();

    const copyButtons = document.querySelectorAll("[data-copy-phone]");
    const callButtons = document.querySelectorAll("[data-call-phone]");

  copyButtons.forEach((button) => {
    if (button.dataset.bound === "true") return;
    button.dataset.bound = "true";

    button.addEventListener("click", async function (e) {
      e.preventDefault();
      e.stopPropagation();

      const phone = this.dataset.copyPhone || "";
      const textNode = this.querySelector("span");
      const originalText = textNode ? textNode.textContent : t("sidebar.copyPhone", "Copiar");
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(phone);
        } else {
          copyTextFallback(phone);
        }

        if (textNode) {
          const originalText = textNode ? textNode.textContent : t("sidebar.copyPhone", "Copiar");
          setTimeout(() => {
            textNode.textContent = originalText;
          }, 1400);
        }

        showSidebarToast(t("sidebar.copyPhoneToast", "Número copiado"));
      } catch (error) {
        if (textNode) {
          textNode.textContent = "Error";
          setTimeout(() => {
            textNode.textContent = originalText;
          }, 1400);
        }

        showSidebarToast(t("sidebar.copyErrorToast", "No se pudo copiar"));
      }
    });
  });

  callButtons.forEach((button) => {
    if (button.dataset.bound === "true") return;
    button.dataset.bound = "true";

    button.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const rawPhone = this.dataset.callPhone || "";
      const phoneLabel = this.dataset.callLabel || rawPhone;

      const shouldCall = window.confirm(
        `${t("sidebar.callConfirmPrefix", "Este botón es para llamar al número")} ${phoneLabel}.\n\n${t("sidebar.callConfirmQuestion", "¿Deseas continuar con la llamada?")}`
      );

      if (shouldCall) {
        window.location.href = `tel:${rawPhone}`;
      }
    });
  });

    if (document.body.dataset.sidebarContactI18nBound !== "true") {
    document.body.dataset.sidebarContactI18nBound = "true";

    document.addEventListener("languageChanged", () => {
      updateSidebarContactLabels();
    });
  }
}


function initSidebarEmailActions() {
  const emailButtons = document.querySelectorAll("[data-copy-email]");

  emailButtons.forEach((button) => {
    if (button.dataset.bound === "true") return;
    button.dataset.bound = "true";

    button.addEventListener("click", async function (e) {
      e.preventDefault();
      e.stopPropagation();

      const email = this.dataset.copyEmail || "";
      const label = this.querySelector(".sidebar-email-copy-label");
      const originalText = label ? label.textContent : "Copiar correo";

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          copyTextFallback(email);
        }

        if (label) {
          label.textContent = "Ya copiado";
          setTimeout(() => {
            label.textContent = originalText;
          }, 1400);
        }

        showSidebarToast("Correo copiado");
      } catch (error) {
        if (label) {
          label.textContent = "Error";
          setTimeout(() => {
            label.textContent = originalText;
          }, 1400);
        }

        showSidebarToast("No se pudo copiar");
      }
    });
  });
}

function initSidebarOutsideClose() {
  if (document.body.dataset.sidebarOutsideBound === "true") return;
  document.body.dataset.sidebarOutsideBound = "true";

  document.addEventListener("click", function (e) {
    document.querySelectorAll(".sidebar-dropdown").forEach((dropdown) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("open");
        const toggle = dropdown.querySelector(".sidebar-account-toggle");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      }
    });

    const popover = document.getElementById("sidebar-contact-popover");
    const contactToggle = document.querySelector(".sidebar-contact-toggle");

    if (popover && contactToggle) {
      const clickedInsidePopover = popover.contains(e.target);
      const clickedToggle = contactToggle.contains(e.target);

      if (!clickedInsidePopover && !clickedToggle) {
        popover.classList.remove("open");
        contactToggle.setAttribute("aria-expanded", "false");
      }
    }
  });
}

function initSidebarFeatures() {
  initSidebarAccountDropdown();
  initSidebarContactPopover();
  initSidebarContactActions();
  initSidebarEmailActions();
  initSidebarOutsideClose();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSidebarFeatures);
} else {
  initSidebarFeatures();
}