// Toggle "is-active" state on sidebar icons based on which section is in view.
document.addEventListener('DOMContentLoaded', () => {
  // ---- Typewriter effect for hero name ----
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
        // Stop blinking cursor after typing is done
        setTimeout(() => nameEl.classList.remove('typewriter-active'), 1200);
      }
    }
    setTimeout(type, 400); // small initial delay
  }

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.sidebar__icon[href^="#"]');

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
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
    { threshold: 0.5 }
  );

  sections.forEach((section) => observer.observe(section));

  // ---- Contact form submission (works with Basin or any endpoint that accepts JSON/FormData) ----
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('.contact__submit');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      status.textContent = '';
      status.className = 'contact__status';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          status.textContent = 'Message sent successfully! I\'ll get back to you soon.';
          status.classList.add('is-success');
          form.reset();
        } else {
          throw new Error('Submission failed');
        }
      } catch (err) {
        status.textContent = 'Something went wrong. Please try again or email me directly.';
        status.classList.add('is-error');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});