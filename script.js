(() => {
  'use strict';
  const root = document.documentElement;
  const cards = [...document.querySelectorAll('.project-card')];
  const projectIds = new Set(cards.map(card => card.dataset.id));
  const filters = [...document.querySelectorAll('[data-filter]')];
  const dialog = document.getElementById('projectDialog');
  const navigation = document.getElementById('navigation');
  const menuToggle = document.getElementById('menuToggle');
  const mobileQuery = window.matchMedia('(max-width: 760px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const email = 'meryem.elmustad@usmba.ac.ma';
  let language = 'fr';
  let theme = 'light';
  let activeFilter = 'all';
  let activeProject = null;
  let dialogTrigger = null;
  let toastTimer;
  let storageAvailable = true;
  let saved = new Set();

  // These preferences stay on the visitor's device. No analytics or requests.
  function readPreference(key) {
    try { return window.localStorage.getItem(key); }
    catch { storageAvailable = false; return null; }
  }
  function writePreference(key, value) {
    try { window.localStorage.setItem(key, value); }
    catch { storageAvailable = false; }
  }
  language = readPreference('portfolio-language') === 'en' ? 'en' : 'fr';
  theme = readPreference('portfolio-theme') === 'dark' ? 'dark' : 'light';
  try {
    const stored = JSON.parse(readPreference('portfolio-shortlist') || '[]');
    if (Array.isArray(stored)) saved = new Set(stored.filter(id => projectIds.has(id)));
  } catch { saved = new Set(); }

  const copy = {
    fr: {
      projects: n => `${n} projet${n > 1 ? 's' : ''} à explorer`,
      selected: n => `${n} projet${n > 1 ? 's' : ''} dans votre sélection`,
      save: title => `Ajouter ${title} à ma sélection`,
      unsave: title => `Retirer ${title} de ma sélection`,
      added: 'Projet ajouté à votre sélection.',
      removed: 'Projet retiré de votre sélection.',
      cleared: 'Votre sélection a été effacée.',
      saveButton: '♡ Garder ce projet',
      savedButton: '♥ Projet sélectionné',
      copied: 'Adresse email copiée.',
      copyFailed: 'Copie indisponible. Vous pouvez sélectionner l’adresse affichée.',
      dark: 'Activer le thème sombre',
      light: 'Activer le thème clair',
      menuOpen: 'Ouvrir le menu',
      menuClose: 'Fermer le menu',
      selectionContact: n => `${n} projet${n > 1 ? 's' : ''} sélectionné${n > 1 ? 's' : ''} : ${n > 1 ? 'leurs titres seront ajoutés' : 'son titre sera ajouté'} au brouillon de votre email.`,
      emailBody: titles => `Bonjour Meryem,\n\nJe souhaite échanger avec vous au sujet d’un stage PFE 2027.\n\nProjets qui ont retenu mon attention :\n${titles.map(title => '• ' + title).join('\n')}\n\nNotre besoin :\n`,
      storageNote: 'Votre sélection reste dans ce navigateur. Aucune donnée n’est envoyée.',
      storageUnavailable: 'Stockage indisponible : votre sélection sera conservée seulement pendant cette visite.',
      title: 'Meryem El Mustad — Data Science & IA',
      description: 'Meryem El Mustad, élève ingénieure Data Science & IA à l’ENSA Fès. Projets Python, SQL, Power BI, Machine Learning et agents IA. Recherche de stage PFE 2027.'
    },
    en: {
      projects: n => `${n} project${n === 1 ? '' : 's'} to explore`,
      selected: n => `${n} project${n === 1 ? '' : 's'} in your shortlist`,
      save: title => `Add ${title} to my shortlist`,
      unsave: title => `Remove ${title} from my shortlist`,
      added: 'Project added to your shortlist.',
      removed: 'Project removed from your shortlist.',
      cleared: 'Your shortlist has been cleared.',
      saveButton: '♡ Save this project',
      savedButton: '♥ Project saved',
      copied: 'Email address copied.',
      copyFailed: 'Copy is unavailable. You can select the displayed email address.',
      dark: 'Use dark theme',
      light: 'Use light theme',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
      selectionContact: n => `${n} project${n === 1 ? '' : 's'} shortlisted: their titles will be added to your email draft.`,
      emailBody: titles => `Hello Meryem,\n\nI would like to discuss a final-year internship in 2027.\n\nProjects that caught my attention:\n${titles.map(title => '• ' + title).join('\n')}\n\nOur needs:\n`,
      storageNote: 'Your shortlist stays in this browser. No data is sent.',
      storageUnavailable: 'Storage is unavailable: your shortlist will only last for this visit.',
      title: 'Meryem El Mustad — Data Science & AI',
      description: 'Meryem El Mustad, Data Science & AI engineering student at ENSA Fez. Python, SQL, Power BI, Machine Learning and AI agents. Seeking a final-year internship in 2027.'
    }
  };
  const t = () => copy[language];
  const projectTitle = card => card.querySelector('h3').textContent;

  function showToast(message) {
    const toast = document.getElementById('toast');
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
  }

  function translate(container = document) {
    container.querySelectorAll('[data-fr][data-en]').forEach(element => {
      element.textContent = element.dataset[language];
    });
    container.querySelectorAll('[data-fr-label][data-en-label]').forEach(element => {
      element.setAttribute('aria-label', element.dataset[language + 'Label']);
    });
  }

  function updateTheme() {
    root.dataset.theme = theme;
    const button = document.getElementById('themeToggle');
    button.setAttribute('aria-label', theme === 'light' ? t().dark : t().light);
    button.setAttribute('title', button.getAttribute('aria-label'));
    document.querySelector('meta[name="theme-color"]').content = theme === 'light' ? '#f7f8f2' : '#101e19';
  }

  function updateMenuLabel() {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-label', isOpen ? t().menuClose : t().menuOpen);
  }

  function updateSaveControls() {
    document.querySelectorAll('[data-save]').forEach(button => {
      const card = cards.find(item => item.dataset.id === button.dataset.save);
      const isSaved = saved.has(card.dataset.id);
      button.textContent = isSaved ? '♥' : '♡';
      button.setAttribute('aria-pressed', String(isSaved));
      button.setAttribute('aria-label', isSaved ? t().unsave(projectTitle(card)) : t().save(projectTitle(card)));
      button.setAttribute('title', button.getAttribute('aria-label'));
    });
    document.getElementById('savedCount').textContent = String(saved.size);
    document.getElementById('clearSelection').hidden = saved.size === 0;
    document.querySelector('.storage-note').textContent = storageAvailable ? t().storageNote : t().storageUnavailable;
    const contactNote = document.getElementById('selectionContact');
    contactNote.hidden = saved.size === 0;
    contactNote.textContent = t().selectionContact(saved.size);
    const selectedTitles = cards.filter(card => saved.has(card.dataset.id)).map(projectTitle);
    const subject = language === 'fr' ? 'Stage PFE 2027 — échange avec Meryem' : 'Final-year internship 2027 — conversation with Meryem';
    const body = selectedTitles.length ? '&body=' + encodeURIComponent(t().emailBody(selectedTitles)) : '';
    document.getElementById('contactMail').href = `mailto:${email}?subject=${encodeURIComponent(subject)}${body}`;
    if (activeProject) updateDialogSave();
  }

  function visibleCards() {
    return cards.filter(card => !card.hidden);
  }

  function applyFilter(filter) {
    activeFilter = filter;
    filters.forEach(button => {
      const active = button.dataset.filter === filter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    cards.forEach(card => {
      card.hidden = !(filter === 'all' || (filter === 'saved' ? saved.has(card.dataset.id) : card.dataset.category.split(' ').includes(filter)));
    });
    const count = visibleCards().length;
    document.getElementById('filterStatus').textContent = filter === 'saved' ? t().selected(count) : t().projects(count);
    document.getElementById('emptySelection').hidden = count > 0;
    document.getElementById('projectInvitation').hidden = filter !== 'all';
    updateProgress();
    if (dialog.open) document.getElementById('nextProject').hidden = count < 2;
  }

  function toggleSave(id) {
    if (!projectIds.has(id)) return;
    const wasSaved = saved.has(id);
    if (wasSaved) saved.delete(id); else saved.add(id);
    writePreference('portfolio-shortlist', JSON.stringify([...saved]));
    updateSaveControls();
    applyFilter(activeFilter);
    showToast(wasSaved ? t().removed : t().added);
  }

  function updateDialogSave() {
    const button = document.getElementById('dialogSave');
    const isSaved = saved.has(activeProject.dataset.id);
    button.textContent = isSaved ? t().savedButton : t().saveButton;
    button.setAttribute('aria-pressed', String(isSaved));
  }

  function renderDialog(card) {
    activeProject = card;
    document.getElementById('dialogTitle').textContent = projectTitle(card);
    document.getElementById('dialogMeta').textContent = card.querySelector('.project-meta>span').textContent;
    document.getElementById('dialogContent').replaceChildren(card.querySelector('.study-content').cloneNode(true));
    document.getElementById('nextProject').hidden = visibleCards().length < 2;
    updateDialogSave();
  }

  function openStudy(card, trigger) {
    dialogTrigger = trigger;
    renderDialog(card);
    dialog.showModal();
    document.body.classList.add('dialog-open');
    document.getElementById('closeDialog').focus();
  }

  function setLanguage(nextLanguage, persist = true) {
    language = nextLanguage === 'en' ? 'en' : 'fr';
    root.lang = language;
    root.dataset.lang = language;
    translate();
    const button = document.getElementById('langToggle');
    button.textContent = language === 'fr' ? 'EN' : 'FR';
    button.setAttribute('aria-label', language === 'fr' ? 'Switch to English' : 'Passer en français');
    document.title = t().title;
    document.querySelector('meta[name="description"]').content = t().description;
    document.querySelector('meta[property="og:title"]').content = t().title;
    document.querySelector('meta[property="og:description"]').content = t().description;
    if (persist) writePreference('portfolio-language', language);
    updateTheme();
    updateMenuLabel();
    updateSaveControls();
    applyFilter(activeFilter);
    if (dialog.open) renderDialog(activeProject);
  }

  function closeMenu(restoreFocus = false) {
    navigation.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    updateMenuLabel();
    if (restoreFocus) menuToggle.focus();
  }

  document.getElementById('langToggle').addEventListener('click', () => setLanguage(language === 'fr' ? 'en' : 'fr'));
  document.getElementById('themeToggle').addEventListener('click', () => {
    theme = theme === 'light' ? 'dark' : 'light';
    writePreference('portfolio-theme', theme);
    updateTheme();
  });
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
    navigation.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    updateMenuLabel();
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  mobileQuery.addEventListener('change', () => closeMenu());
  filters.forEach(button => button.addEventListener('click', () => applyFilter(button.dataset.filter)));
  document.querySelectorAll('[data-lens]').forEach(link => link.addEventListener('click', () => applyFilter(link.dataset.lens)));
  document.querySelectorAll('[data-save]').forEach(button => button.addEventListener('click', () => toggleSave(button.dataset.save)));
  document.getElementById('showAll').addEventListener('click', () => {
    applyFilter('all');
    filters[0].focus();
  });
  document.getElementById('clearSelection').addEventListener('click', () => {
    saved.clear();
    writePreference('portfolio-shortlist', '[]');
    updateSaveControls();
    applyFilter(activeFilter);
    if (activeFilter === 'saved') document.getElementById('showAll').focus();
    else filters.find(button => button.dataset.filter === activeFilter).focus();
    showToast(t().cleared);
  });
  // Native <details> remain available if JavaScript or <dialog> is unsupported.
  if (typeof dialog.showModal === 'function') {
    cards.forEach(card => {
      const summary = card.querySelector('.project-study>summary');
      summary.setAttribute('aria-haspopup', 'dialog');
      summary.addEventListener('click', event => {
        event.preventDefault();
        openStudy(card, summary);
      });
    });
    document.getElementById('closeDialog').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const bounds = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('dialog-open');
      activeProject = null;
      if (dialogTrigger && !dialogTrigger.closest('.project-card').hidden) dialogTrigger.focus();
      else filters.find(button => button.dataset.filter === activeFilter).focus();
    });
    document.getElementById('dialogSave').addEventListener('click', () => toggleSave(activeProject.dataset.id));
    document.getElementById('nextProject').addEventListener('click', () => {
      const visible = visibleCards();
      if (visible.length < 2) return;
      const index = visible.indexOf(activeProject);
      const card = visible[(index + 1) % visible.length];
      dialogTrigger = card.querySelector('summary');
      renderDialog(card);
      dialog.scrollTop = 0;
      document.getElementById('closeDialog').focus();
    });
  }

  document.getElementById('copyEmail').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(email); showToast(t().copied); }
    catch { showToast(t().copyFailed); }
  });
  document.getElementById('year').textContent = String(new Date().getFullYear());

  let progressScheduled = false;
  function updateProgress() {
    const scrollable = root.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    document.getElementById('progress').style.width = `${Math.max(0, Math.min(100, ratio * 100))}%`;
  }
  window.addEventListener('scroll', () => {
    if (!progressScheduled) {
      progressScheduled = true;
      window.requestAnimationFrame(() => { updateProgress(); progressScheduled = false; });
    }
  }, { passive: true });
  window.addEventListener('resize', updateProgress);

  if ('IntersectionObserver' in window) {
    const navigationObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navigation.querySelectorAll('a').forEach(link => {
          if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-12% 0px -65% 0px', threshold: 0 });
    document.querySelectorAll('#projets,#expertise,#parcours,#contact').forEach(section => navigationObserver.observe(section));
    if (!reducedMotion.matches) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {entry.target.classList.add('visible');observer.unobserve(entry.target);}
        });
      }, { threshold: 0.05 });
      document.querySelectorAll('.section-heading,.expertise-grid>article,.timeline>article').forEach(element => {
        element.classList.add('reveal');
        revealObserver.observe(element);
      });
    }
  }
  root.classList.add('js-enabled');
  setLanguage(language, false);
  window.addEventListener('load', updateProgress, { once: true });
})();
