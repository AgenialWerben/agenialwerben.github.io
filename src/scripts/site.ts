
/* Progressive enhancements for a fully static, bilingual site. */
function required<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error('Missing required element ' + selector);
  return element;
}
type Lang = 'es' | 'en';
const languageButton = required<HTMLButtonElement>('#language');
const menu = required<HTMLButtonElement>('#menu');
const nav = required<HTMLElement>('#navlinks');
const overlay = required<HTMLElement>('#lightbox');
const image = required<HTMLImageElement>('#lightbox-image');
const caption = required<HTMLElement>('#lightbox-caption');
const closer = required<HTMLButtonElement>('#close-lightbox');
const previous = required<HTMLButtonElement>('#previous-image');
const next = required<HTMLButtonElement>('#next-image');
const shots = Array.from(document.querySelectorAll<HTMLButtonElement>('.gallery-grid button[data-full]'));
let lang: Lang = navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
let selected = 0;
let focusBefore: HTMLElement | null = null;
try {
  const stored = localStorage.getItem('tfoc-language');
  if (stored === 'es' || stored === 'en') lang = stored;
} catch { /* Storage is optional. */ }
function refreshImage(): void {
  const shot = shots[selected];
  if (!shot) return;
  image.src = shot.dataset.full ?? '';
  caption.textContent = shot.getAttribute('data-caption-' + lang) ?? '';
  image.alt = caption.textContent;
}
function changeLanguage(to: Lang): void {
  lang = to;
  document.documentElement.lang = to;
  document.body.classList.toggle('en', to === 'en');
  languageButton.textContent = to === 'es' ? 'EN' : 'ES';
  languageButton.setAttribute('aria-label', to === 'es' ? 'Cambiar idioma a inglés' : 'Switch language to Spanish');
  if (overlay.hasAttribute('open')) refreshImage();
}
languageButton.addEventListener('click', () => {
  changeLanguage(lang === 'es' ? 'en' : 'es');
  try { localStorage.setItem('tfoc-language', lang); } catch { /* Storage is optional. */ }
});
function closeMenu(): void {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.textContent = '☰';
}
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? '×' : '☰';
  menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});
nav.querySelectorAll<HTMLAnchorElement>('a').forEach(a => a.addEventListener('click', closeMenu));
function openImage(index: number): void {
  selected = index;
  focusBefore = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  refreshImage();
  overlay.setAttribute('open', '');
  document.body.classList.add('modal-open');
  closer.focus();
}
function closeImage(): void {
  overlay.removeAttribute('open');
  document.body.classList.remove('modal-open');
  focusBefore?.focus();
}
function advance(step: number): void {
  if (!shots.length) return;
  selected = (selected + step + shots.length) % shots.length;
  refreshImage();
}
shots.forEach((shot, i) => shot.addEventListener('click', () => openImage(i)));
closer.addEventListener('click', closeImage);
previous.addEventListener('click', () => advance(-1));
next.addEventListener('click', () => advance(1));
overlay.addEventListener('click', event => { if (event.target === overlay) closeImage(); });
document.addEventListener('keydown', event => {
  if (!overlay.hasAttribute('open')) return;
  if (event.key === 'Escape') { closeImage(); return; }
  if (event.key === 'ArrowRight') advance(1);
  if (event.key === 'ArrowLeft') advance(-1);
  if (event.key === 'Tab') {
    const first = closer, last = next;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  }
});
let scheduled = false;
function setScrollProgress(): void {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    required<HTMLElement>('#progress').style.width =
      (max > 0 ? Math.max(0, Math.min(100, 100 * scrollY / max)) : 0) + '%';
    scheduled = false;
  });
}
window.addEventListener('scroll', setScrollProgress, { passive: true });
window.addEventListener('resize', setScrollProgress);
required<HTMLElement>('#year').textContent = String(new Date().getFullYear());
changeLanguage(lang);
setScrollProgress();
