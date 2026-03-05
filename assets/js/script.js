// Nav active 
const sections = document.querySelectorAll("main section");
const navLinks = document.querySelectorAll("header nav a");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${entry.target.id}`) {
          link.classList.add("active");
        }
      });
    }
  });
}, {
  threshold: 0.5
});

sections.forEach(section => observer.observe(section));

// Skills animation
const skillItems = document.querySelectorAll(".skill-item");

const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector(".skill-fill");
      const percentText = entry.target.querySelector(".skill-percent");
      const percent = parseInt(entry.target.dataset.percent);
      const color = entry.target.dataset.color;

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
}, {
  threshold: 0.5
});

skillItems.forEach(item => skillObserver.observe(item));

// Tabs educación (2023/2024/2025)
const tabButtons = document.querySelectorAll('.tab-button');
const panels = document.querySelectorAll('.education-panel');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const year = button.dataset.year;

    tabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    panels.forEach(panel => {
      panel.classList.toggle('active', panel.dataset.year === year);
    });
  });
});

// Formulario para contactar email (robusto)
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  // Evita doble binding si el script corre 2 veces.
  if (form.dataset.bound === "true") return;
  form.dataset.bound = "true";

  if (typeof emailjs !== "undefined" && emailjs?.init) {
    emailjs.init("gmmCbinVp-H8S3aJB");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (typeof emailjs === "undefined" || !emailjs?.sendForm) {
      alert("EmailJS no está cargado.");
      return;
    }

    emailjs
      .sendForm("service_ogiuonl", "template_q4d5l3g", this)
      .then(
        () => alert("Mensaje enviado correctamente"),
        (error) => alert("Error al enviar: " + JSON.stringify(error))
      );
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initContactForm);
} else {
  initContactForm();
}

// Smooth anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Toggle certificados (con animación limpia)
(() => {
  const list = document.getElementById("certList");
  const btn  = document.getElementById("certToggle");
  if (!list || !btn) return;

  const extras = Array.from(list.querySelectorAll(".certificate.is-extra"));
  const OPEN_TEXT = "Ver menos";
  const CLOSE_TEXT = "Ver todos los certificados";

  const open = () => {
    list.setAttribute("data-collapsed", "false");
    btn.textContent = OPEN_TEXT;

    extras.forEach((card, i) => {
      card.classList.remove("cert-hide");
      card.style.animationDelay = `${i * 60}ms`;
      card.classList.add("cert-show");
    });

    // Limpia clases al terminar
    setTimeout(() => {
      extras.forEach(card => {
        card.classList.remove("cert-show");
        card.style.animationDelay = "";
      });
    }, 600 + extras.length * 60);
  };

  const close = () => {
    // primero animamos salida, luego ocultamos con data-collapsed
    extras.forEach((card, i) => {
      card.classList.remove("cert-show");
      card.style.animationDelay = `${i * 30}ms`;
      card.classList.add("cert-hide");
    });

    btn.textContent = CLOSE_TEXT;

    setTimeout(() => {
      list.setAttribute("data-collapsed", "true");
      extras.forEach(card => {
        card.classList.remove("cert-hide");
        card.style.animationDelay = "";
      });
    }, 200);
  };

  btn.addEventListener("click", () => {
    const collapsed = list.getAttribute("data-collapsed") === "true";
    collapsed ? open() : close();
  });
})();