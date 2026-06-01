/**
* Template Name: Strategy
* Template URL: https://bootstrapmade.com/strategy-bootstrap-agency-template/
* Updated: Jun 06 2025 with Bootstrap v5.3.6
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);


  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox',
    loop: false // do not loop between galleries; stops at last slide
  });

  /**
   * Gallery: Pixel Transition hover effect (keeps overlay + expand button as-is)
   */
  function initGalleryPixelTransition() {
    const entries = document.querySelectorAll('.gallery .gallery-entry');
    if (!entries.length) return;

    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;

    const GRID_SIZE = 8; // similar feel to the snippet you shared
    const STEP_MS = 420; // should match CSS animation duration-ish
    const OVERLAY_DELAY_MS = STEP_MS + 60; // overlay reveals after pixel effect starts/finishes

    function ensurePixelLayer(entryEl) {
      const figure = entryEl.querySelector('.entry-image');
      if (!figure) return null;

      let pixelsLayer = figure.querySelector(':scope > .pt-pixels');
      if (pixelsLayer) return pixelsLayer;

      pixelsLayer = document.createElement('div');
      pixelsLayer.className = 'pt-pixels';

      const size = 100 / GRID_SIZE;
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          const px = document.createElement('div');
          px.className = 'pt-pixel';
          px.style.width = `${size}%`;
          px.style.height = `${size}%`;
          px.style.left = `${col * size}%`;
          px.style.top = `${row * size}%`;
          pixelsLayer.appendChild(px);
        }
      }

      figure.appendChild(pixelsLayer);
      return pixelsLayer;
    }

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    function run(entryEl) {
      if (entryEl.classList.contains('pt-animating')) return;
      const layer = ensurePixelLayer(entryEl);
      if (!layer) return;

      const pixels = Array.from(layer.querySelectorAll('.pt-pixel'));
      if (!pixels.length) return;

      entryEl.classList.add('pt-animating');

      // Random stagger via animation delays (no extra deps like GSAP)
      const order = shuffle(pixels.slice());
      const stagger = Math.max(6, Math.floor(STEP_MS / order.length));
      order.forEach((px, idx) => {
        px.style.animationDelay = `${idx * stagger}ms`;
      });

      window.setTimeout(() => {
        entryEl.classList.remove('pt-animating');
        // cleanup delays so re-hover feels fresh
        pixels.forEach(px => (px.style.animationDelay = ''));
      }, STEP_MS + order.length * stagger + 50);
    }

    entries.forEach(entryEl => {
      // Build once up-front so hover is instant
      ensurePixelLayer(entryEl);
      entryEl.classList.add('pt-enhanced');

      const setHovered = (on) => entryEl.classList.toggle('pt-hovered', on);
      const setOverlayShown = (on) => entryEl.classList.toggle('pt-show-overlay', on);

      let overlayTimer = null;
      const scheduleOverlay = () => {
        if (overlayTimer) window.clearTimeout(overlayTimer);
        overlayTimer = window.setTimeout(() => {
          // After the pixel effect, switch to the "second state":
          // yellow bg + image hidden + show title/expand overlay
          setHovered(true);
          setOverlayShown(true);
        }, OVERLAY_DELAY_MS);
      };
      const clearOverlayTimer = () => {
        if (overlayTimer) window.clearTimeout(overlayTimer);
        overlayTimer = null;
      };

      const onEnter = () => {
        // Keep image visible initially; pixel effect plays on top of it.
        // The yellow bg + overlay will appear after `OVERLAY_DELAY_MS`.
        setHovered(false);
        setOverlayShown(false);
        run(entryEl);
        scheduleOverlay();
      };
      const onLeave = () => setHovered(false);
      const onFocusIn = () => {
        setHovered(false);
        setOverlayShown(false);
        run(entryEl);
        scheduleOverlay();
      };
      const onFocusOut = () => setHovered(false);

      if (!isTouchDevice) {
        entryEl.addEventListener('mouseenter', onEnter);
        entryEl.addEventListener('mouseleave', () => {
          clearOverlayTimer();
          setOverlayShown(false);
          setHovered(false);
          onLeave();
        });
        entryEl.addEventListener('focusin', onFocusIn);
        entryEl.addEventListener('focusout', () => {
          clearOverlayTimer();
          setOverlayShown(false);
          setHovered(false);
          onFocusOut();
        });
      } else {
        // On touch devices, run on tap (but don't break the expand button)
        entryEl.addEventListener('click', e => {
          if (e.target && e.target.closest && e.target.closest('a.glightbox')) return;
          setHovered(false);
          setOverlayShown(false);
          run(entryEl);
          scheduleOverlay();
          window.setTimeout(() => {
            clearOverlayTimer();
            setOverlayShown(false);
            setHovered(false);
          }, 1400);
        });
      }
    });
  }

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle, .faq-item .faq-header').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  window.addEventListener('load', initGalleryPixelTransition);

})();