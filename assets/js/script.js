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

// Formulario para contactar email
(function(){
    emailjs.init("gmmCbinVp-H8S3aJB");
})();

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contact-form");
    if(form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            emailjs.sendForm("service_ogiuonl", "template_q4d5l3g", this)
            .then(() => {
                alert("Mensaje enviado correctamente");
            }, (error) => {
                alert("Error al enviar: " + JSON.stringify(error));
            });
        });
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


(() => {
  const list = document.getElementById("certList");
  const btn  = document.getElementById("certToggle");
  if (!list || !btn) return;

  btn.addEventListener("click", () => {
    const collapsed = list.getAttribute("data-collapsed") === "true";
    list.setAttribute("data-collapsed", collapsed ? "false" : "true");
    btn.textContent = collapsed ? "Ver menos" : "Ver todos los certificados";
  });
})();
