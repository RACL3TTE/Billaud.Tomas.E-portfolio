// Bascule FR/EN (mémorisée) + apparition des sections au scroll + lien de nav actif.
const root = document.documentElement;
root.classList.add('js');

const saved = localStorage.getItem('lang');
if (saved === 'fr' || saved === 'en') root.lang = saved;

document.querySelector('.lang-toggle').addEventListener('click', () => {
    root.lang = root.lang === 'fr' ? 'en' : 'fr';
    localStorage.setItem('lang', root.lang);
});

const sections = document.querySelectorAll('main section[id]');
const links = document.querySelectorAll('.nav nav a');

if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));

    const spy = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (!e.isIntersecting) return;
            links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
} else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
}

