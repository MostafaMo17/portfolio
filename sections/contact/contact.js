// Contact Form Controller
export function initContact(showToast) {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('.contact__submit');
    const originalHTML = submitBtn.innerHTML;

    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        if (typeof showToast === 'function') {
          showToast('Thank you! Your message was sent successfully. I will get back to you soon.', 'success');
        } else {
          alert('Message sent successfully!');
        }
        form.reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      if (typeof showToast === 'function') {
        showToast('Something went wrong. Please reach out to me directly on LinkedIn or email.', 'error');
      } else {
        alert('Failed to send message.');
      }
    } finally {
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;
    }
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initContact(window.showToast);
  });
}
