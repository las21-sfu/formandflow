// Fallback observer for antidote rows
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.1 }
);
document
  .querySelectorAll(".ap-row.reveal")
  .forEach((el) => observer.observe(el));
