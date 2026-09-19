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
  // 2) SCROLL PROGRESS BAR & BACK TO TOP
  // ==========================================
  const progressBar = document.getElementById('scrollProgress');
  const backToTopBtn = document.getElementById('backToTop');

  const updateScrollState = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${scrollPercent}%`;
    }

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
});