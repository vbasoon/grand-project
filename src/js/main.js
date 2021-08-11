const app = document.getElementById("app");
const menuBtn = document.getElementById("btn-menu");
const sidebar = document.getElementById("sidebar");
const closeBtn = document.getElementById("btn-close");

const gallery_tab = document.querySelectorAll(".gallery__items");

const gallery_btn = document.querySelectorAll(".gallery__btn");

gallery_btn.forEach(function (item) {
  item.addEventListener("click", () => {
    let currentBtn = item;
    let galleryId = currentBtn.getAttribute("data-tab");
    let currentGallery = document.querySelector(galleryId);

    if (!currentBtn.classList.contains("active")) {
      gallery_btn.forEach(function (item) {
        item.classList.remove("active");
      });

      gallery_tab.forEach(function (item) {
        item.classList.remove("active");
      });

      currentBtn.classList.add("active");
      currentGallery.classList.add("active");
    }
  });
});

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("sidebar__open");
});

closeBtn.addEventListener("click", () => {
  sidebar.classList.remove("sidebar__open");
});

const swiper = new Swiper(".swiper-container", {
  // Optional parameters
  // effect: "fade",
  // fadeEffect: {
  //   crossFade: true,
  // },
  autoplay: {
    delay: 5000,
  },
  loop: true,

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
    type: "bullets",
    clickable: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
