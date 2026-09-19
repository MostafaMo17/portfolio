// Hero Typewriter Logic
export function initHero() {
  const nameEl = document.querySelector('.hero__title-gradient');
  if (!nameEl) return;

  const fullText = nameEl.textContent.trim();
  nameEl.textContent = '';
  nameEl.classList.add('typewriter-active');

  let i = 0;
  const speed = 55; // ms per char
  function type() {
    if (i < fullText.length) {
      nameEl.textContent += fullText[i++];
      setTimeout(type, speed);
    } else {
      setTimeout(() => nameEl.classList.remove('typewriter-active'), 1200);
    }
  }
  setTimeout(type, 400);
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initHero();
  });
}
