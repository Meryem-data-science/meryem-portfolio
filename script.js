const root = document.documentElement;
const langToggle = document.getElementById("langToggle");
const cvHeader = document.getElementById("cvHeader");
const progress = document.getElementById("progress");

const cvPaths = {
  fr: "output/pdf/CV_Meryem_El_Mustad_FR.pdf?v=2",
  en: "output/pdf/Resume_Meryem_El_Mustad_EN.pdf?v=2"
};

function setLanguage(language) {
  const lang = language === "en" ? "en" : "fr";
  root.lang = lang;
  root.dataset.lang = lang;

  document.querySelectorAll("[data-fr][data-en]").forEach((element) => {
    element.textContent = element.dataset[lang];
  });

  langToggle.textContent = lang === "fr" ? "EN" : "FR";
  langToggle.setAttribute("aria-label", lang === "fr" ? "Switch to English" : "Passer en français");
  cvHeader.href = cvPaths[lang];
  document.title = lang === "fr" ? "Meryem El Mustad — Data & IA" : "Meryem El Mustad — Data & AI";

  try {
    localStorage.setItem("portfolio-language", lang);
  } catch (_) {
    // The portfolio remains fully usable when storage is unavailable.
  }
}

let savedLanguage = "fr";
try {
  savedLanguage = localStorage.getItem("portfolio-language") || "fr";
} catch (_) {
  savedLanguage = "fr";
}
setLanguage(savedLanguage);

langToggle.addEventListener("click", () => {
  setLanguage(root.lang === "fr" ? "en" : "fr");
});

document.getElementById("year").textContent = new Date().getFullYear();

root.classList.add("motion-ready");
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -7%" });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
}

updateProgress();
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
