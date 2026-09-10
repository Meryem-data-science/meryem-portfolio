const root=document.documentElement;
const toggle=document.getElementById('langToggle');
const cv=document.getElementById('cvHeader');
const translatable=[...document.querySelectorAll('[data-fr][data-en]')];
function setLanguage(lang){root.dataset.lang=lang;root.lang=lang;translatable.forEach(el=>{el.textContent=el.dataset[lang]});toggle.textContent=lang==='fr'?'EN':'FR';toggle.setAttribute('aria-label',lang==='fr'?'Switch to English':'Passer en français');cv.href=lang==='fr'?'output/pdf/CV_Meryem_El_Mustad_FR.pdf?v=2':'output/pdf/Resume_Meryem_El_Mustad_EN.pdf?v=2';document.title=lang==='fr'?'Meryem El Mustad — Data & AI':'Meryem El Mustad — Data & AI Portfolio';localStorage.setItem('portfolio-language',lang)}
toggle.addEventListener('click',()=>setLanguage(root.dataset.lang==='fr'?'en':'fr'));
setLanguage(localStorage.getItem('portfolio-language')||'fr');
document.getElementById('year').textContent=new Date().getFullYear();
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
