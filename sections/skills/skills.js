// Skills Section Controller - Interactive Filtering
export function initSkills() {
  const filterBtns = document.querySelectorAll('.sk-filter-btn');
  const tiles = document.querySelectorAll('.sk-tile');

  if (!filterBtns.length || !tiles.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button state
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      // Filter tiles
      tiles.forEach(tile => {
        const cat = tile.getAttribute('data-cat');
        if (filter === 'all' || cat === filter) {
          tile.classList.remove('is-hidden');
          tile.style.animation = 'tileFadeIn 0.35s ease forwards';
        } else {
          tile.classList.add('is-hidden');
        }
      });
    });
  });
}

// Add animation keyframe dynamically if not present
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes tileFadeIn {
      from { opacity: 0; transform: translateY(8px) scale(0.98); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
  `;
  document.head.appendChild(styleEl);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSkills);
  } else {
    initSkills();
  }
}
