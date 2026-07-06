/**
 * NG Spray Foam - Premium Main Javascript Engine
 * Author: Senior Front-End Architect
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initScrollReveal();
  initCounters();
  initTestimonialCarousel();
  initSmoothScroll();
});

/**
 * 1. Sticky Transparent Navigation Header Behavior
 */
function initStickyHeader() {
  const header = document.querySelector('.navbar-premium');
  if (!header) return;

  const toggleHeaderClass = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Run on initial load and on scroll
  toggleHeaderClass();
  window.addEventListener('scroll', toggleHeaderClass);
}

/**
 * 2. Scroll Reveal Animations with IntersectionObserver
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Once animated, no need to watch it again
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px' // Trigger slightly before element enters viewport
    });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    reveals.forEach(el => el.classList.add('revealed'));
  }
}

/**
 * 3. High Performance Vanilla Counter Animator
 */
function initCounters() {
  const counterSections = document.querySelectorAll('.stat-box');
  if (counterSections.length === 0) return;

  const countUp = (counterEl) => {
    const target = parseInt(counterEl.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds
    const start = 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quad formula
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(start + easeProgress * (target - start));

      counterEl.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        counterEl.textContent = target; // Ensure exact final value
      }
    };

    requestAnimationFrame(animate);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const numberEls = entry.target.querySelectorAll('.counter-number');
          numberEls.forEach(num => countUp(num));
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });

    counterSections.forEach(section => counterObserver.observe(section));
  } else {
    // Fallback: immediately show target numbers
    document.querySelectorAll('.counter-number').forEach(num => {
      num.textContent = num.getAttribute('data-target');
    });
  }
}

/**
 * 4. Touch-Friendly, Lightweight Testimonial Slider
 */
function initTestimonialCarousel() {
  const container = document.querySelector('.testimonial-slider');
  if (!container) return;

  const slides = container.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.nav-dot');
  if (slides.length <= 1) return;

  let currentIndex = 0;
  let autoplayTimer = null;

  const showSlide = (index) => {
    // Ensure loop limits
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    currentIndex = index;

    // Slide transition
    slides.forEach((slide, i) => {
      slide.style.display = i === currentIndex ? 'block' : 'none';
      if (i === currentIndex) {
        slide.classList.add('animate-fade-in');
      } else {
        slide.classList.remove('animate-fade-in');
      }
    });

    // Update indicators
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      showSlide(currentIndex + 1);
    }, 6000); // Transition every 6 seconds
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
    }
  };

  // Wire dot clicks
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showSlide(i);
      startAutoplay(); // Reset timer on click
    });
  });

  // Mouse over pauses slide
  container.addEventListener('mouseenter', stopAutoplay);
  container.addEventListener('mouseleave', startAutoplay);

  // Initialize
  showSlide(0);
  startAutoplay();
}

/**
 * 5. Smooth Scroll-To-Anchor with Focus Management
 */
function initSmoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  anchors.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      
      if (targetEl) {
        // Offset for sticky navigation bar (approx 85px)
        const headerOffset = 85;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Set focus to target for accessibility
        targetEl.setAttribute('tabindex', '-1');
        targetEl.focus({ preventScroll: true });
      }
    });
  });
}
