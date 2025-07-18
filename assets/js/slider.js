// ----------------------
// Carrusel VIEW
// ----------------------
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
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

// Zoom opcional
const zoom = mediumZoom('.viewer-swiper .profile-image', {
  margin: 24,
  background: '#000',
  scrollOffset: 0
});

// ----------------------
// Carrusel PROJECTS
// ----------------------
const projectsSwiper = new Swiper(".swiper-container.projects-swiper", {
  slidesPerView: 1,
  spaceBetween: 0,
  loop: true,
  centeredSlides: false,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: ".projects-swiper .swiper-button-next",
    prevEl: ".projects-swiper .swiper-button-prev"
  },
  pagination: {
    el: ".projects-swiper .swiper-pagination",
    clickable: true
  }
});

// ----------------------
// MODAL VIEW
// ----------------------
const modalView = document.getElementById("modal-view");
const modalImgView = document.getElementById("modal-main-img-view");

document.querySelectorAll(".viewer-swiper .profile-image").forEach(img => {
  img.classList.add("open-gallery-view");
  img.addEventListener("click", () => {
    zoom.detach();
    modalImgView.src = img.src;
    modalView.classList.add("show");
    modalView.style.display = "flex";
  });
});

document.querySelector(".close-view").addEventListener("click", () => {
  modalView.classList.remove("show");
  setTimeout(() => modalView.style.display = "none", 300);
});
window.addEventListener("click", (e) => {
  if (e.target === modalView) {
    modalView.classList.remove("show");
    setTimeout(() => modalView.style.display = "none", 300);
  }
});

// ----------------------
// MODAL PROJECT
// ----------------------
const modalProject = document.getElementById("modal-project");
const modalImgProject = document.getElementById("modal-main-img-project");
const modalThumbnails = document.getElementById("modal-thumbnails");

document.querySelectorAll(".project-slide .open-gallery").forEach(img => {
  img.addEventListener("click", () => {
    const slide = img.closest(".project-slide");
    const images = JSON.parse(slide.dataset.images);
    const clickedSrc = img.getAttribute("src");

    modalThumbnails.innerHTML = "";

    images.forEach(src => {
      const thumb = document.createElement("img");
      thumb.src = src;
      thumb.classList.add("thumb-img");
      thumb.addEventListener("click", () => {
        modalImgProject.src = src;
      });
      modalThumbnails.appendChild(thumb);
    });

    modalImgProject.src = images.includes(clickedSrc) ? clickedSrc : images[0];
    modalProject.classList.add("show");
    modalProject.style.display = "flex";
  });
});

document.querySelector(".close-project").addEventListener("click", () => {
  modalProject.classList.remove("show");
  setTimeout(() => modalProject.style.display = "none", 300);
});

window.addEventListener("click", (e) => {
  if (e.target === modalProject) {
    modalProject.classList.remove("show");
    setTimeout(() => modalProject.style.display = "none", 300);
  }
});
