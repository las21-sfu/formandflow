// Nav scroll effect
const nav = document.querySelector("nav");
const hamburger = document.querySelector(".nav-hamburger");
const navLinks = document.querySelector(".nav-links");

window.addEventListener("scroll", () => {
  if (window.scrollY > 40) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");
});

if (hamburger) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

// Set active nav link
const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links a").forEach((a) => {
  if (a.getAttribute("href") === currentPage) a.classList.add("active");
});

// Scroll reveal
const reveals = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
reveals.forEach((el) => io.observe(el));
