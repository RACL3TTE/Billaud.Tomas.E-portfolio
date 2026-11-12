// =========================================================
// E-portfolio Tomas Billaud · Gestion des onglets & bilingue
// =========================================================

const root = document.documentElement;
root.classList.add('js');

// --- 1. Gestion de la langue (FR / EN) ---
const savedLang = localStorage.getItem('lang');
if (savedLang === 'fr' || savedLang === 'en') {
    root.lang = savedLang;
}

const langToggle = document.querySelector('.lang-toggle');
if (langToggle) {
    langToggle.addEventListener('click', () => {
        root.lang = root.lang === 'fr' ? 'en' : 'fr';
        localStorage.setItem('lang', root.lang);
    });
}

// --- 2. Gestion des modes : Vrais Onglets vs Défilement continu ---
const tabButtons = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('main section[id]');
const viewButtons = document.querySelectorAll('.view-btn');
const hero = document.getElementById('top');

// Mode par défaut : 'tabs' (vrais onglets)
let currentMode = localStorage.getItem('view_mode') || 'tabs';
let currentTab = localStorage.getItem('active_tab') || 'about';

// Si l'URL a un hash direct (ex: #projects), on sélectionne cet onglet
if (window.location.hash) {
    const hash = window.location.hash.replace('#', '');
    if (document.getElementById(hash) || hash === 'all') {
        currentTab = hash;
    }
}

function setViewMode(mode) {
    currentMode = mode;
    localStorage.setItem('view_mode', mode);
    document.body.classList.toggle('mode-tabs', mode === 'tabs');
    document.body.classList.toggle('mode-scroll', mode === 'scroll');

    viewButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    if (mode === 'tabs') {
        activateTab(currentTab, false);
    } else {
        // En mode défilement continu : toutes les sections visibles
        sections.forEach(sec => sec.classList.remove('tab-hidden'));
        if (hero) hero.classList.remove('tab-hidden');
    }
}

function activateTab(tabId, scrollIntoView = true) {
    currentTab = tabId;
    localStorage.setItem('active_tab', tabId);

    // Mettre à jour l'état actif des boutons d'onglets
    tabButtons.forEach(btn => {
        const isMatch = btn.dataset.target === tabId;
        btn.classList.toggle('active', isMatch);
        btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    if (currentMode === 'tabs') {
        if (tabId === 'all') {
            // Vue d'ensemble : tout afficher
            sections.forEach(sec => {
                sec.classList.remove('tab-hidden');
            });
            if (hero) hero.classList.remove('tab-hidden');
        } else {
            // Vrai onglet : afficher uniquement la section sélectionnée
            sections.forEach(sec => {
                if (sec.id === tabId) {
                    sec.classList.remove('tab-hidden');
                } else {
                    sec.classList.add('tab-hidden');
                }
            });

            // Afficher le Hero uniquement sur l'onglet "about" ou "top"
            if (hero) {
                if (tabId === 'about' || tabId === 'top') {
                    hero.classList.remove('tab-hidden');
                } else {
                    hero.classList.add('tab-hidden');
                }
            }
        }

        if (scrollIntoView) {
            const targetEl = tabId === 'about' && hero ? hero : document.getElementById(tabId);
            if (targetEl) {
                const navHeight = document.querySelector('.nav') ? document.querySelector('.nav').offsetHeight : 70;
                const topPos = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
                window.scrollTo({ top: Math.max(0, topPos), behavior: 'smooth' });
            }
        }
    } else {
        // Mode scroll continu : navigation fluide vers l'ancre
        const targetEl = document.getElementById(tabId);
        if (targetEl && scrollIntoView) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Garder le bouton d'onglet visible dans le défilement horizontal de la barre
    const activeBtn = document.querySelector(`.tab-btn[data-target="${tabId}"]`);
    if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
    }
}

// Écouteurs sur les boutons d'onglets
tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.dataset.target;
        activateTab(target, true);
        if (history.pushState) {
            history.pushState(null, null, '#' + target);
        }
    });
});

// Écouteurs sur le sélecteur de mode (Onglets vs Continu)
viewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        setViewMode(btn.dataset.mode);
    });
});

// Navigation pagination bas de page (Précédent / Suivant)
document.addEventListener('click', (e) => {
    const pagerBtn = e.target.closest('[data-goto]');
    if (pagerBtn) {
        e.preventDefault();
        const target = pagerBtn.dataset.goto;
        activateTab(target, true);
        if (history.pushState) {
            history.pushState(null, null, '#' + target);
        }
    }
});

// Initialiser au chargement
setViewMode(currentMode);
if (currentMode === 'tabs') {
    activateTab(currentTab, false);
}

// --- 3. Scroll Spy (uniquement actif en mode défilement continu) ---
if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
        if (currentMode !== 'scroll') return;
        entries.forEach((e) => {
            if (!e.isIntersecting) return;
            const id = e.target.id;
            tabButtons.forEach((a) => {
                a.classList.toggle('active', a.dataset.target === id);
            });
        });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach((s) => spy.observe(s));
}
