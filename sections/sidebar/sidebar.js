// Sidebar active spy and navigation handling
export function initSidebar() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.sidebar__icon[href^="#"]');

  const setActive = (id) => {
    navLinks.forEach((link) => {
      const match = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', match);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { threshold: 0.25, rootMargin: '-10% 0px -30% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}

// Auto-run if loaded directly as non-module
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
  });
}
