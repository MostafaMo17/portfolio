// Portfolio Interactive Engine - Mustafa Mohamed
document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1) TYPEWRITER EFFECT FOR HERO TITLE
  // ==========================================
  const nameEl = document.querySelector('.hero__title-gradient');
  if (nameEl) {
    const fullText = nameEl.textContent.trim();
    nameEl.textContent = '';
    nameEl.classList.add('typewriter-active');

    let i = 0;
    const speed = 55; // ms per character
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

  // ==========================================
  // 2) BACK TO TOP BUTTON
  // ==========================================
  const backToTopBtn = document.getElementById('backToTop');

  const updateScrollState = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (backToTopBtn) {
      if (scrollTop > 380) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }
  };

  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================
  // 3) SCROLL REVEAL ANIMATIONS (INTER-SECTION)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');

            // Trigger skill bars fill animation if inside
            const fills = entry.target.querySelectorAll('.skill-bar__fill');
            fills.forEach((fill) => {
              const pct = fill.style.getPropertyValue('--pct');
              if (pct) {
                fill.style.width = pct;
              }
            });

            // Once revealed, unobserve to keep DOM performant
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // ==========================================
  // 4) SIDEBAR ACTIVE STATE & CLICK BOUNCE
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.sidebar__icon[href^="#"]');

  const setActive = (id) => {
    navLinks.forEach((link) => {
      const match = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', match);
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { threshold: 0.25, rootMargin: '-10% 0px -30% 0px' }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  // Smooth click response for sidebar
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((l) => l.classList.remove('is-active'));
      link.classList.add('is-active');
    });
  });

  // ==========================================
  // 5) CERTIFICATE LIGHTBOX MODAL
  // ==========================================
  const certModal = document.getElementById('certModal');
  const modalImg = document.getElementById('certModalImg');
  const modalTitle = document.getElementById('certModalTitle');
  const modalPdf = document.getElementById('certModalPdf');
  const modalClose = document.getElementById('certModalClose');

  const openCertModal = (imgSrc, title, pdfSrc) => {
    if (!certModal) return;
    if (modalImg) modalImg.src = imgSrc;
    if (modalTitle) modalTitle.textContent = title;
    if (modalPdf) modalPdf.href = pdfSrc;
    certModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeCertModal = () => {
    if (!certModal) return;
    certModal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.js-cert-trigger').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const el = trigger.closest('[data-cert]') || trigger;
      const certSrc = el.getAttribute('data-cert');
      const certTitle = el.getAttribute('data-title') || 'Certificate of Achievement';
      const certPdf = el.getAttribute('data-pdf') || '#';
      if (certSrc) {
        openCertModal(certSrc, certTitle, certPdf);
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeCertModal);
  }

  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) {
        closeCertModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal && certModal.classList.contains('is-open')) {
      closeCertModal();
    }
  });

  // ==========================================
  // 6) COPY EMAIL TO CLIPBOARD
  // ==========================================
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  const myEmail = 'mo77mohamed66@gmail.com';

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(myEmail);
        if (copyBtnText) copyBtnText.textContent = 'Copied! ✓';
        showToast('Email copied to clipboard! 📋', 'success');
        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = 'Copy';
        }, 2500);
      } catch (err) {
        showToast(`Email: ${myEmail}`, 'info');
      }
    });
  }

  // ==========================================
  // 7) INQUIRY TYPE PILLS SELECTOR
  // ==========================================
  const inquiryPills = document.querySelectorAll('.inquiry-pill');
  const inquiryTypeInput = document.getElementById('inquiryTypeInput');

  inquiryPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      inquiryPills.forEach((p) => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      if (inquiryTypeInput) {
        inquiryTypeInput.value = pill.getAttribute('data-value') || 'Full-Time Role';
      }
    });
  });

  // ==========================================
  // 8) TOAST NOTIFICATION SYSTEM
  // ==========================================
  let toastTimer = null;
  const showToast = (message, type = 'success') => {
    const toast = document.getElementById('toast');
    if (!toast) return;

    if (toastTimer) clearTimeout(toastTimer);

    toast.textContent = message;
    toast.className = `toast show is-${type}`;

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  };

  // ==========================================
  // 9) CONTACT FORM SUBMISSION (FORMSPREE)
  // ==========================================
  const form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('.contact__submit-btn') || form.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;

      submitBtn.innerHTML = '<span>Sending Message...</span>';
      submitBtn.disabled = true;

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          showToast('Thank you! Your message was sent successfully. I will get back to you soon.', 'success');
          form.reset();
        } else {
          throw new Error('Submission failed');
        }
      } catch (err) {
        showToast('Something went wrong. Please reach out to me directly on WhatsApp or email.', 'error');
      } finally {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
      }
    });
  }

  // ==========================================
  // 10) RECOMMENDATION MODAL & TESTIMONIALS
  // ==========================================
  const recModal = document.getElementById('recommendModal');
  const openRecBtns = document.querySelectorAll('.js-open-recommend-modal');
  const closeRecBtns = document.querySelectorAll('.js-close-recommend-modal');
  const recForm = document.getElementById('recommendForm');
  const testiGrid = document.getElementById('testimonialsGrid');
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

  const openRecModal = () => {
    if (!recModal) return;
    recModal.classList.add('is-open');
    recModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstInput = recModal.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 80);
  };

  const closeRecModal = () => {
    if (!recModal) return;
    recModal.classList.remove('is-open');
    recModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openRecBtns.forEach(btn => btn.addEventListener('click', openRecModal));
  closeRecBtns.forEach(btn => btn.addEventListener('click', closeRecModal));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && recModal && recModal.classList.contains('is-open')) {
      closeRecModal();
    }
  });

  // Star Rating Interaction
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

  // Build card DOM string
  const buildTestiCard = (data, isNew = false) => {
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

  // Restore stored recommendations
  if (testiGrid) {
    try {
      const stored = JSON.parse(localStorage.getItem('mustafa_custom_testimonials') || '[]');
      if (Array.isArray(stored) && stored.length) {
        stored.forEach(item => {
          testiGrid.insertAdjacentHTML('afterbegin', buildTestiCard(item, false));
        });
      }
    } catch (_) {}
  }

  // Handle Form Submission
  if (recForm && testiGrid) {
    recForm.addEventListener('submit', async (e) => {
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

      // 1. Immediately insert new card into DOM
      const cardHTML = buildTestiCard(recData, true);
      testiGrid.insertAdjacentHTML('afterbegin', cardHTML);

      // 2. Persist in localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('mustafa_custom_testimonials') || '[]');
        existing.unshift(recData);
        localStorage.setItem('mustafa_custom_testimonials', JSON.stringify(existing));
      } catch (_) {}

      // 3. Optional async notification via Formspree
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

      // 4. UI Toast
      showToast(`Thank you, ${recData.name}! Your endorsement has been published ✨`, 'success');

      recForm.reset();
      if (ratingInput) ratingInput.value = '5';
      if (ratingText) ratingText.textContent = '5.0 (Exceptional)';
      starBtns.forEach(sb => sb.classList.add('is-active'));

      if (submitBtn) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }

      closeRecModal();

      const firstCard = testiGrid.firstElementChild;
      if (firstCard) {
        firstCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
});