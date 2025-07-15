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
var projectsSwiper = new Swiper(".projects-swiper", {
  slidesPerView: 3,
  spaceBetween: 20,
  loop: true,
  navigation: {
    nextEl: ".projects .swiper-button-next",
    prevEl: ".projects .swiper-button-prev"
  },
  pagination: {
    el: ".projects .swiper-pagination",
    clickable: true
  },
  breakpoints: {
    0: {
      slidesPerView: 1
    },
    768: {
      slidesPerView: 2
    },
    1024: {
      slidesPerView: 3
    }
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