// ====== Utilidades ======
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];


// Año dinámico
$('#year').textContent = new Date().getFullYear();


// ====== Navegación activa por sección visible ======
const links = $$('a[data-nav]');
const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);


const setActive = (id) => {
links.forEach(a => {
const match = a.getAttribute('href') === `#${id}`;
a.toggleAttribute('aria-current', match);
});
};


const io = new IntersectionObserver((entries) => {
entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
}, { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.5, 1] });


sections.forEach(sec => io.observe(sec));


// ====== Tema claro/oscuro con preferencia guardada ======
const themeBtn = $('#themeBtn');
const KEY = 'theme-preference';


const getPreferred = () => {
const stored = localStorage.getItem(KEY);
if (stored === 'light' || stored === 'dark') return stored;
return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};


const applyTheme = (mode) => {
document.documentElement.dataset.theme = mode;
themeBtn.setAttribute('aria-pressed', String(mode === 'dark'));
document.body.style.transition = 'background .25s ease, color .25s ease';
document.body.offsetHeight; // reflow
setTimeout(() => (document.body.style.transition = ''), 300);
};


const current = getPreferred();
applyTheme(current);


themeBtn.addEventListener('click', () => {
const next = (document.documentElement.dataset.theme === 'dark') ? 'light' : 'dark';
localStorage.setItem(KEY, next);
applyTheme(next);
});


// ====== Envío de formulario (demo) ======
$('#contactForm').addEventListener('submit', (ev) => {
ev.preventDefault();
const form = ev.currentTarget;
if (!form.checkValidity()) { form.reportValidity(); return; }
const data = Object.fromEntries(new FormData(form).entries());
const name = (data.nombre || '');
$('#formMsg').textContent = `¡Gracias${name ? ', ' + name : ''}! Tu mensaje ha sido enviado (simulado).`;
form.reset();
});

// ====== Contador de caracteres ======
const msg = $('#mensaje');
const charCount = $('#charCount');
if (msg && charCount) {
const max = msg.getAttribute('maxlength');
charCount.textContent = `0/${max}`;
msg.addEventListener('input', () => {
charCount.textContent = `${msg.value.length}/${max}`;
});
}

// ====== Botón volver arriba ======
const toTop = $('#toTop');
if (toTop) {
window.addEventListener('scroll', () => {
toTop.classList.toggle('show', window.scrollY > 300);
});
toTop.addEventListener('click', () => {
window.scrollTo({ top: 0, behavior: 'smooth' });
});
}