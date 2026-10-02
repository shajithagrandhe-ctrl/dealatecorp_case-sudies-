const revealItems = document.querySelectorAll(".reveal");
const caseSections = Array.from(document.querySelectorAll(".case-study"));

function showCurrentPoc() {
  const targetId = window.location.hash.slice(1);
  const target = caseSections.find((section) => section.id === targetId);

  document.body.classList.toggle("detail-view", Boolean(target));
  caseSections.forEach((section) => {
    section.classList.toggle("is-active", section === target);
  });

  if (target) {
    target.scrollIntoView({ block: "start" });
  }
}

window.addEventListener("hashchange", showCurrentPoc);
showCurrentPoc();

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
