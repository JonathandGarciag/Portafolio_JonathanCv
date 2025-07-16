// Nav active link on scroll
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


//Carrusel
var viewerSwiper = new Swiper(".viewer-swiper", {
  slidesPerView: 2,
  slidesPerGroup: 2,
  spaceBetween: 20,
  loop: true,
  centeredSlides: false,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: ".viewer-swiper .swiper-button-next",
    prevEl: ".viewer-swiper .swiper-button-prev",
  },
  pagination: {
    el: ".viewer-swiper .swiper-pagination",
    clickable: true,
  },
});

mediumZoom('.viewer-swiper .profile-image', {
  margin: 24,
  background: '#000',
  scrollOffset: 0
});


// Carrusel Projects (puedes ajustar como desees)
const projectsSwiper = new Swiper(".projects-swiper", {
  slidesPerView: 1,              // 👈 SOLO UNO visible
  spaceBetween: 40,
  loop: true,
  centeredSlides: true,          // opcional: centra el slide
  navigation: {
    nextEl: ".projects-swiper .swiper-button-next",
    prevEl: ".projects-swiper .swiper-button-prev"
  },
  pagination: {
    el: ".projects-swiper .swiper-pagination",
    clickable: true
  }
});

// Galería modal
const modal = document.getElementById("gallery-modal");
const modalMainImg = document.getElementById("modal-main-img");
const modalThumbnails = document.getElementById("modal-thumbnails");
const modalClose = document.querySelector(".modal-close");

// Abrir galería al hacer clic en cualquier imagen
document.querySelectorAll(".open-gallery").forEach(img => {
  img.addEventListener("click", () => {
    const slide = img.closest(".project-slide");
    const images = JSON.parse(slide.dataset.images);
    modalMainImg.src = images[0]; // Mostrar primera como principal

    // Limpiar thumbnails anteriores
    modalThumbnails.innerHTML = "";

    images.forEach(src => {
      const thumb = document.createElement("img");
      thumb.src = src;
      thumb.addEventListener("click", () => {
        modalMainImg.src = src;
      });
      modalThumbnails.appendChild(thumb);
    });

    modal.style.display = "block";
  });
});

// Cerrar modal
modalClose.addEventListener("click", () => {
  modal.style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
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