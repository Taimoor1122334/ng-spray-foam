/**
 * NG Spray Foam - Premium Project Gallery, Lightbox, and Before/After Slider Engine
 * Author: Senior Front-End Architect
 */

document.addEventListener('DOMContentLoaded', () => {
  initBeforeAfterSlider();
  initGalleryFilter();
  initLightroomLightbox();
});

/**
 * 1. Premium Interactive Before/After Image Slider Drag calculation
 */
function initBeforeAfterSlider() {
  const sliders = document.querySelectorAll('.ba-slider-container');
  if (sliders.length === 0) return;

  sliders.forEach(slider => {
    const overlay = slider.querySelector('.ba-slider-overlay');
    const handle = slider.querySelector('.ba-slider-handle');
    const overlayImg = overlay ? overlay.querySelector('.ba-slider-image') : null;
    let isDragging = false;

    // Update inner image width to match container width
    const updateDimensions = () => {
      if (overlayImg && slider) {
        const sliderWidth = slider.getBoundingClientRect().width || slider.offsetWidth;
        overlayImg.style.width = `${sliderWidth}px`;
      }
    };

    // Helper function to set width
    const setWidth = (clientX) => {
      const rect = slider.getBoundingClientRect();
      const positionX = clientX - rect.left;
      let percentage = (positionX / rect.width) * 100;

      // Constrain inside bounds
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;

      overlay.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    };

    // Event listeners
    const startDrag = (e) => {
      isDragging = true;
      e.preventDefault();
    };

    const stopDrag = () => {
      isDragging = false;
    };

    const drag = (e) => {
      if (!isDragging) return;
      
      let clientX;
      if (e.type === 'touchmove') {
        clientX = e.touches[0].clientX;
      } else {
        clientX = e.clientX;
      }
      
      requestAnimationFrame(() => setWidth(clientX));
    };

    // Mouse events
    handle.addEventListener('mousedown', startDrag);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('mousemove', drag);

    // Touch events
    handle.addEventListener('touchstart', startDrag);
    window.addEventListener('touchend', stopDrag);
    window.addEventListener('touchmove', drag, { passive: false });

    // Slider container click moves slider
    slider.addEventListener('click', (e) => {
      if (e.target !== handle && !handle.contains(e.target)) {
        setWidth(e.clientX);
      }
    });

    // Handle resize
    window.addEventListener('resize', updateDimensions);

    // Initialize dimensions and center position
    updateDimensions();
    overlay.style.width = '50%';
    handle.style.left = '50%';
  });
}

/**
 * 2. Animated Category Filtering for Portfolio Items
 */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-grid-item');
  if (filterBtns.length === 0 || galleryItems.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filterValue === 'all' || itemCategory === filterValue) {
          // Show item
          item.style.display = 'block';
          item.classList.add('animate-scale-in');
          item.style.animationPlayState = 'running';
        } else {
          // Hide item
          item.style.display = 'none';
          item.classList.remove('animate-scale-in');
        }
      });
    });
  });
}

/**
 * 3. Lightweight Lightroom Project Lightbox Zoom-In Modal
 */
function initLightroomLightbox() {
  const galleryTriggers = document.querySelectorAll('.lightbox-trigger');
  if (galleryTriggers.length === 0) return;

  // Create Lightroom elements dynamically in DOM
  const modal = document.createElement('div');
  modal.className = 'lightroom-modal';
  modal.id = 'lightroomLightbox';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Project Image Lightbox');
  
  modal.innerHTML = `
    <div class="lightroom-content animate-scale-in">
      <span class="lightroom-close" id="lightroomClose" aria-label="Close Lightbox">&times;</span>
      <img class="lightroom-img" id="lightroomImg" src="" alt="Zoomed Project Image">
    </div>
  `;

  document.body.appendChild(modal);

  const modalImg = document.getElementById('lightroomImg');
  const closeBtn = document.getElementById('lightroomClose');

  // Open lightbox click event
  galleryTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = trigger.getAttribute('href') || trigger.querySelector('img').src;
      const imgAlt = trigger.getAttribute('data-title') || trigger.querySelector('img').alt;

      modalImg.src = imgSrc;
      modalImg.alt = imgAlt;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock background scroll
    });
  });

  // Close lightbox helper
  const closeLightbox = () => {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
    modalImg.src = '';
  };

  closeBtn.addEventListener('click', closeLightbox);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeLightbox();
    }
  });

  // Escape key closes modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });
}
