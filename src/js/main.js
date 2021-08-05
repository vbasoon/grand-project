const app = document.getElementById("app");
console.log(app);
const menuBtn = document.getElementById("btn-menu");
console.log(menuBtn);
const sidebar = document.getElementById("sidebar");
console.log(sidebar);
const closeBtn = document.getElementById("btn-close");
console.log(closeBtn);

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("sidebar__open");
});

closeBtn.addEventListener("click", () => {
  console.log("click");
  sidebar.classList.remove("sidebar__open");
});

const swiper = new Swiper(".swiper-container", {
  // Optional parameters

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
