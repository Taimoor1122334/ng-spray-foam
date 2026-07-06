/**
 * NG Spray Foam - Premium Form Validation and AJAX Lead Processor
 * Author: Senior Front-End Architect
 */

document.addEventListener('DOMContentLoaded', () => {
  initFormFloatLabels();
  initContactForms();
});

/**
 * 1. Dynamic Float Labels Validation Styling Support
 */
function initFormFloatLabels() {
  const inputs = document.querySelectorAll('.form-floating-premium .form-control, .form-floating-premium .form-select');
  
  const checkValue = (el) => {
    if (el.value.trim() !== "") {
      el.classList.add('has-value');
    } else {
      el.classList.remove('has-value');
    }
  };

  inputs.forEach(input => {
    // Initial check
    checkValue(input);

    // Event listeners
    input.addEventListener('blur', () => checkValue(input));
    input.addEventListener('change', () => checkValue(input));
    input.addEventListener('input', () => checkValue(input));
  });
}

/**
 * 2. High-Performance Contact and Estimate AJAX Form Submissions
 */
function initContactForms() {
  const forms = document.querySelectorAll('.premium-ajax-form');
  if (forms.length === 0) return;

  forms.forEach(form => {
    const submitBtn = form.querySelector('button[type="submit"]');
    const responseContainer = form.querySelector('.form-response-message');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit Request';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Reset response message states
      if (responseContainer) {
        responseContainer.style.display = 'none';
        responseContainer.className = 'form-response-message p-3 mt-3 rounded-md';
        responseContainer.innerHTML = '';
      }

      // Gather form values
      const name = form.querySelector('[name="name"]')?.value.trim();
      const email = form.querySelector('[name="email"]')?.value.trim();
      const phone = form.querySelector('[name="phone"]')?.value.trim();
      const service = form.querySelector('[name="service"]')?.value || 'General inquiry';
      const message = form.querySelector('[name="message"]')?.value.trim() || '';

      // Clean validation checks
      if (!name) {
        showFeedback(responseContainer, 'Please enter your name.', 'danger');
        return;
      }
      if (!email || !validateEmail(email)) {
        showFeedback(responseContainer, 'Please enter a valid email address.', 'danger');
        return;
      }
      if (!phone || !validatePhone(phone)) {
        showFeedback(responseContainer, 'Please enter a valid 10-digit phone number.', 'danger');
        return;
      }

      // Loading state
      setLoading(submitBtn, true, originalBtnText);

      try {
        // Asynchronous POST network request
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, phone, service, message })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Success State display
          showFeedback(responseContainer, data.message, 'success');
          form.reset(); // Reset form fields
          
          // Reset float labels has-value class
          form.querySelectorAll('.form-control, .form-select').forEach(el => {
            el.classList.remove('has-value');
          });

          // Custom scroll response container into view
          responseContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          // Server error display
          showFeedback(responseContainer, data.message || 'Something went wrong. Please try again.', 'danger');
        }
      } catch (error) {
        console.error('AJAX Submit Error:', error);
        showFeedback(responseContainer, 'Could not connect to the server. Please verify your network connection and try again.', 'danger');
      } finally {
        // Reset loading button states
        setLoading(submitBtn, false, originalBtnText);
      }
    });
  });
}

/**
 * Helper: Regular Expression Email Validator
 */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Helper: Regular Expression Phone Number Validator
 */
function validatePhone(phone) {
  // Strip out extra characters
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 10;
}

/**
 * Helper: UI Loading Spinner Switcher
 */
function setLoading(button, isLoading, originalText) {
  if (!button) return;
  if (isLoading) {
    button.disabled = true;
    button.innerHTML = `
      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Processing Estimate...
    `;
  } else {
    button.disabled = false;
    button.innerHTML = originalText;
  }
}

/**
 * Helper: Form response banner feedback display
 */
function showFeedback(container, message, type) {
  if (!container) return;
  container.style.display = 'block';
  
  if (type === 'success') {
    container.classList.add('bg-success', 'text-white', 'pulse-accent');
    container.innerHTML = `
      <div class="d-flex align-items-start gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0"><circle cx="12" cy="12" r="10"></circle><polyline points="12 8 12 12 16 14"></polyline></svg>
        <div>
          <h5 class="font-heading mb-1 text-white" style="font-weight:700;">Estimate Requested Successfully!</h5>
          <p class="m-0 text-white-50" style="font-size: 15px;">${message}</p>
        </div>
      </div>
    `;
  } else {
    container.classList.add('bg-danger', 'text-white');
    container.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <span class="font-heading fw-semibold" style="font-size: 15px;">${message}</span>
      </div>
    `;
  }
}
