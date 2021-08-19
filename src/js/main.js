const app = document.getElementById("app");
const menuBtn = document.getElementById("btn-menu");
const sidebar = document.getElementById("sidebar");
const closeBtn = document.getElementById("btn-close");

const gallery_tab = document.querySelectorAll(".gallery__items");

const gallery_btn = document.querySelectorAll(".gallery__btn");
const heroSlider = document.querySelector(".slider-one");
const contactSlider = document.querySelector(".slider-two");
const blogSlider = document.querySelector(".slider-three");

gallery_btn.forEach(onTabClick);
function onTabClick(item) {
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
}

if (gallery_tab.length !== 0) {
  document.querySelector(".gallery__btn:nth-child(2)").click();
}

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("sidebar__open");
});

closeBtn.addEventListener("click", () => {
  sidebar.classList.remove("sidebar__open");
});

const slider1 = new Swiper(".slider-one", {
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

const slider2 = new Swiper(".slider-two", {
  slidesPerView: 10,
  slidesPerGroup: 10,

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
    el: ".swiper-pagination2",
    type: "bullets",
    clickable: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

const slider3 = new Swiper(".slider-three", {
  slidesPerView: 1,

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
    el: ".swiper-pagination2",
    type: "bullets",
    clickable: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
