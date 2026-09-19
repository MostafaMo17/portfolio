// Testimonials Section & Recommendation Modal Controller
export function initTestimonials() {
  const modal = document.getElementById('recommendModal');
  const openBtns = document.querySelectorAll('.js-open-recommend-modal');
  const closeBtns = document.querySelectorAll('.js-close-recommend-modal');
  const form = document.getElementById('recommendForm');
  const grid = document.getElementById('testimonialsGrid');
  const starBtns = document.querySelectorAll('.recommend-stars-picker .star-btn');
  const ratingInput = document.getElementById('recRatingValue');
  const ratingText = document.getElementById('recRatingText');

  const ratingLabels = {
    1: '1.0 (Needs Improvement)',
    2: '2.0 (Fair)',
    3: '3.0 (Good Collaboration)',
    4: '4.0 (Great Experience)',
    5: '5.0 (Exceptional)'
  };

  // Helper: Open Modal
  const openModal = () => {
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 80);
  };

  // Helper: Close Modal
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Interactive Stars Picker
  if (starBtns.length && ratingInput && ratingText) {
    const updateStarsVisual = (val) => {
      starBtns.forEach(b => {
        const bVal = parseInt(b.getAttribute('data-val'), 10);
        if (bVal <= val) {
          b.classList.add('is-active');
        } else {
          b.classList.remove('is-active');
        }
      });
      ratingText.textContent = ratingLabels[val] || `${val}.0`;
    };

    starBtns.forEach(b => {
      b.addEventListener('mouseenter', () => {
        const hoverVal = parseInt(b.getAttribute('data-val'), 10);
        starBtns.forEach(sb => {
          const sbVal = parseInt(sb.getAttribute('data-val'), 10);
          if (sbVal <= hoverVal) {
            sb.classList.add('is-hover');
          } else {
            sb.classList.remove('is-hover');
          }
        });
        ratingText.textContent = ratingLabels[hoverVal] || `${hoverVal}.0`;
      });

      b.addEventListener('mouseleave', () => {
        starBtns.forEach(sb => sb.classList.remove('is-hover'));
        const currentVal = parseInt(ratingInput.value, 10) || 5;
        updateStarsVisual(currentVal);
      });

      b.addEventListener('click', () => {
        const clickedVal = parseInt(b.getAttribute('data-val'), 10);
        ratingInput.value = clickedVal;
        updateStarsVisual(clickedVal);
      });
    });
  }

  // Create Recommendation Card HTML
  const buildCardHTML = (data, isNew = false) => {
    const initials = data.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'CP';
    const numStars = Math.max(1, Math.min(5, parseInt(data.rating, 10) || 5));
    const starsHTML = '★'.repeat(numStars) + '☆'.repeat(5 - numStars);

    let tagClass = 'testi-card__tag--cyan';
    if (data.relationship.includes('Client')) tagClass = 'testi-card__tag--green';
    else if (data.relationship.includes('Hackathon')) tagClass = 'testi-card__tag--blue';
    else if (data.relationship.includes('Lead') || data.relationship.includes('Manager')) tagClass = 'testi-card__tag--purple';

    const avatarColors = ['', 'testi-card__avatar--purple', 'testi-card__avatar--cyan', 'testi-card__avatar--emerald'];
    const avatarClass = avatarColors[Math.abs(data.name.length) % avatarColors.length];

    const safeQuote = data.feedback.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const safeName = data.name.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const safeRole = data.role.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return `
      <div class="testi-card glass ${isNew ? 'is-new' : ''}">
        <div class="testi-card__watermark">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
        </div>
        <div class="testi-card__top">
          <div class="testi-card__stars" aria-label="${numStars} stars">
            ${starsHTML}
          </div>
          <span class="testi-card__tag ${tagClass}">${data.relationship}</span>
        </div>
        <p class="testi-card__quote">
          "${safeQuote}"
        </p>
        <div class="testi-card__author">
          <div class="testi-card__avatar ${avatarClass}">
            <span>${initials}</span>
          </div>
          <div class="testi-card__info">
            <div class="testi-card__name-row">
              <h4 class="testi-card__name">${safeName}</h4>
              <span class="testi-card__verified" title="Verified Collaborator">✓ ${isNew ? 'New' : 'Verified'}</span>
            </div>
            <span class="testi-card__role">${safeRole}</span>
          </div>
        </div>
      </div>
    `;
  };

  // Load Saved Endorsements from LocalStorage
  const loadSavedRecommendations = () => {
    if (!grid) return;
    try {
      const saved = JSON.parse(localStorage.getItem('mustafa_custom_testimonials') || '[]');
      if (Array.isArray(saved) && saved.length) {
        saved.forEach(item => {
          grid.insertAdjacentHTML('afterbegin', buildCardHTML(item, false));
        });
      }
    } catch (e) {
      console.warn('Could not load custom testimonials', e);
    }
  };

  loadSavedRecommendations();

  // Form Submit Handler
  if (form && grid) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('recSubmitBtn');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Publish';

      if (submitBtn) {
        submitBtn.innerHTML = '<span>Publishing...</span>';
        submitBtn.disabled = true;
      }

      const recData = {
        name: document.getElementById('recName').value.trim(),
        role: document.getElementById('recRole').value.trim(),
        relationship: document.getElementById('recRelation').value,
        rating: document.getElementById('recRatingValue').value || '5',
        feedback: document.getElementById('recText').value.trim(),
        date: new Date().toISOString()
      };

      // 1. Immediately insert new card into DOM with animated entrance
      const cardHTML = buildCardHTML(recData, true);
      grid.insertAdjacentHTML('afterbegin', cardHTML);

      // 2. Persist in localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('mustafa_custom_testimonials') || '[]');
        existing.unshift(recData);
        localStorage.setItem('mustafa_custom_testimonials', JSON.stringify(existing));
      } catch (err) {
        console.warn('LocalStorage error', err);
      }

      // 3. Asynchronously send copy to Formspree
      try {
        fetch('https://formspree.io/f/xovkpwza', {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            _subject: `New Portfolio Recommendation from ${recData.name} (${recData.relationship})`,
            name: recData.name,
            role: recData.role,
            relationship: recData.relationship,
            rating: `${recData.rating} Stars`,
            recommendation: recData.feedback
          })
        }).catch(() => {});
      } catch (_) {}

      // 4. UI Feedback
      if (typeof window.showToast === 'function') {
        window.showToast(`Thank you, ${recData.name}! Your endorsement has been published ✨`, 'success');
      } else {
        const toast = document.getElementById('toast');
        if (toast) {
          toast.textContent = `Thank you, ${recData.name}! Your endorsement has been published ✨`;
          toast.className = 'toast show is-success';
          setTimeout(() => toast.classList.remove('show'), 4500);
        }
      }

      form.reset();
      if (ratingInput) ratingInput.value = '5';
      if (ratingText) ratingText.textContent = '5.0 (Exceptional)';
      starBtns.forEach(sb => sb.classList.add('is-active'));

      if (submitBtn) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }

      closeModal();

      // Smooth scroll back to testimonials grid to see the card
      const firstCard = grid.firstElementChild;
      if (firstCard) {
        firstCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTestimonials);
  } else {
    initTestimonials();
  }
}
