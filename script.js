/**
 * THE GRILL THEORY — script.js (v2)
 * ============================================================
 * 1. Loader de entrada
 * 2. Custom cursor con efecto magnético en botones
 * 3. Navbar scroll
 * 4. Mobile nav
 * 5. Scroll reveal (Intersection Observer)
 * 6. Menu preview: imagen flotante en hover de items
 * 7. Story parallax
 * 8. Stats counter
 * 9. Testimonials carousel mejorado
 * ============================================================
 */

(function () {
  'use strict';

  /* ============================================================
     UTILIDADES
     ============================================================ */

  /** Clampa un valor entre min y max */
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  /** rAF throttle — evita ejecuciones múltiples por frame */
  let rafPending = false;
  const rafThrottle = (fn) => (...args) => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      fn(...args);
      rafPending = false;
    });
  };


  /* ============================================================
     1. LOADER
     Muestra una pantalla de carga y la oculta cuando el DOM
     + las fuentes están listos.
     ============================================================ */
  const loader = document.getElementById('loader');

  const hideLoader = () => {
    if (!loader) return;
    // Un pequeño delay para que la barra de progreso se complete
    setTimeout(() => {
      loader.classList.add('hidden');
      // Revelar el hero inmediatamente tras ocultar el loader
      document.querySelectorAll('.clip-reveal').forEach(el => {
        el.classList.add('is-visible');
      });
    }, 1600);
  };

  if (document.fonts?.ready) {
    document.fonts.ready.then(hideLoader);
  } else {
    window.addEventListener('load', hideLoader);
  }


  /* ============================================================
     2. CUSTOM CURSOR + EFECTO MAGNÉTICO
     El punto sigue el mouse exactamente.
     El anillo sigue con un leve retraso (lerp).
     Los botones .btn-magnetic atraen el cursor hacia su centro.
     ============================================================ */
  const cursor    = document.getElementById('cursor');
  const cursorDot = cursor?.querySelector('.cursor__dot');
  const cursorRing = cursor?.querySelector('.cursor__ring');

  // Posición actual del cursor
  let mouseX = 0, mouseY = 0;
  // Posición interpolada del anillo
  let ringX = 0, ringY = 0;

  // Solo inicializar en dispositivos pointer (no touch)
  // Cursor personalizado desactivado — se usa el cursor nativo del sistema
  if (cursor) cursor.style.display = 'none';

  // Efecto magnético en botones .btn-magnetic (independiente del cursor custom)
  const magneticBtns = document.querySelectorAll('.btn-magnetic');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect    = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top  + rect.height / 2;
      const distX   = (e.clientX - centerX) * 0.3;
      const distY   = (e.clientY - centerY) * 0.3;
      btn.style.transform = `translate(${distX}px, ${distY}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });


  /* ============================================================
     3. NAVBAR — Scroll behavior
     ============================================================ */
  const navbar = document.getElementById('navbar');

  const onNavbarScroll = rafThrottle(() => {
    navbar?.classList.toggle('scrolled', window.scrollY > 60);
  });

  window.addEventListener('scroll', onNavbarScroll, { passive: true });
  onNavbarScroll();


  /* ============================================================
     4. MOBILE NAV
     ============================================================ */
  const navToggle   = document.getElementById('navToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (navToggle && mobileDrawer) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      mobileDrawer.setAttribute('aria-hidden', String(!isOpen));
    });

    // Cerrar al hacer clic en cualquier enlace del drawer
    mobileDrawer.querySelectorAll('.drawer-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      });
    });
  }


  /* ============================================================
     5. SCROLL REVEAL — Intersection Observer
     Observa .reveal y .reveal-left, añade .is-visible al entrar.
     Las animaciones .clip-reveal se activan desde el loader.
     ============================================================ */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-left').forEach(el => {
    revealObserver.observe(el);
  });


  /* ============================================================
     6. MENU PREVIEW — Imagen flotante en hover
     Al hacer hover sobre un item del menú, carga la imagen
     definida en data-img y muestra el panel preview.
     ============================================================ */
  const menuList    = document.getElementById('menuList');
  const menuPreview = document.getElementById('menuImagePreview');
  const previewImg  = document.getElementById('menuPreviewImg');

  // Solo en desktop (pointer:fine), en móvil el preview está oculto via CSS
  if (menuList && menuPreview && previewImg && window.matchMedia('(pointer: fine)').matches) {

    const PREVIEW_W  = 300;
    const PREVIEW_H  = 360;
    const OFFSET_X   = 28;  // distancia horizontal al cursor
    const MARGIN     = 16;  // margen mínimo con los bordes del viewport

    const menuItems = menuList.querySelectorAll('.menu__item');

    menuItems.forEach(item => {
      const imgSrc = item.dataset.img;

      item.addEventListener('mouseenter', () => {
        if (imgSrc) {
          previewImg.src = imgSrc;
          previewImg.alt = item.querySelector('.menu__name')?.textContent || '';
        }
        menuPreview.classList.add('visible');
      });

      item.addEventListener('mouseleave', () => {
        menuPreview.classList.remove('visible');
      });
    });

    // Sigue el cursor con position:fixed, siempre dentro del viewport
    document.addEventListener('mousemove', rafThrottle((e) => {
      if (!menuPreview.classList.contains('visible')) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Intentar a la derecha del cursor; si no cabe, ir a la izquierda
      let x = e.clientX + OFFSET_X;
      if (x + PREVIEW_W > vw - MARGIN) {
        x = e.clientX - PREVIEW_W - OFFSET_X;
      }

      // Centrar verticalmente sobre el cursor, clampeado dentro del viewport
      let y = e.clientY - PREVIEW_H / 2;
      y = clamp(y, MARGIN, vh - PREVIEW_H - MARGIN);

      menuPreview.style.left = `${x}px`;
      menuPreview.style.top  = `${y}px`;
    }));
  }


  /* ============================================================
     7. STORY PARALLAX
     La imagen de la sección Story se desplaza a velocidad
     reducida para crear profundidad visual.
     Solo en pantallas > 768px para preservar performance móvil.
     ============================================================ */
  const storyParallax = document.getElementById('storyParallax');
  const storySection  = document.querySelector('.story');

  if (storyParallax && storySection && window.matchMedia('(min-width: 769px)').matches) {

    const applyStoryParallax = rafThrottle(() => {
      const rect    = storySection.getBoundingClientRect();
      const viewH   = window.innerHeight;
      if (rect.bottom < 0 || rect.top > viewH) return;

      const progress = (viewH - rect.top) / (viewH + rect.height);
      const offset   = (progress - 0.5) * 70; // ±35px

      storyParallax.style.transform = `translateY(${offset}px)`;
    });

    window.addEventListener('scroll', applyStoryParallax, { passive: true });
    applyStoryParallax();
  }


  /* ============================================================
     8. STATS COUNTER
     Cuenta del 0 al valor en data-target con easing.
     Se activa una sola vez al entrar al viewport.
     ============================================================ */
  const statsSection = document.querySelector('.stats');
  const statEls      = document.querySelectorAll('.stats__num[data-target]');
  let statsTriggered = false;

  /**
   * Anima un contador de 0 a target.
   * @param {HTMLElement} el
   * @param {number} target
   * @param {number} duration  ms
   * @param {number} delay     ms antes de arrancar
   */
  const animateCount = (el, target, duration = 2000, delay = 0) => {
    setTimeout(() => {
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        // easeOutQuart
        const eased    = 1 - Math.pow(1 - progress, 4);
        el.textContent = Math.round(eased * target).toLocaleString('es-CO');
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }, delay);
  };

  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !statsTriggered) {
            statsTriggered = true;
            statEls.forEach((el, i) => {
              animateCount(el, parseInt(el.dataset.target, 10), 2000, i * 150);
            });
            statsObserver.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    statsObserver.observe(statsSection);
  }


  /* ============================================================
     9. TESTIMONIALS CAROUSEL (versión mejorada)
     - Barra de progreso en lugar de dots
     - Counter "01 / 04"
     - Autoplay con pausa en hover / focus
     - Soporte completo de teclado y swipe táctil
     ============================================================ */
  const carouselEl      = document.getElementById('carousel');
  const track           = document.getElementById('carouselTrack');
  const prevBtn         = document.getElementById('prevBtn');
  const nextBtn         = document.getElementById('nextBtn');
  const currentDisplay  = document.getElementById('carouselCurrent');
  const progressBar     = document.getElementById('carouselProgressBar');

  if (!track) return; // guard

  const slides     = Array.from(track.children);
  const total      = slides.length;
  let index        = 0;
  let autoplayId   = null;
  const AUTOPLAY   = 6000;

  /** Formatea número con cero inicial "01", "04" */
  const pad = (n) => String(n + 1).padStart(2, '0');

  /** Navega al slide indicado y actualiza la UI */
  const goTo = (i) => {
    index = ((i % total) + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
    if (currentDisplay)  currentDisplay.textContent  = pad(index);
    if (progressBar)     progressBar.style.width     = `${((index + 1) / total) * 100}%`;
  };

  /** Inicia autoplay */
  const startAutoplay = () => {
    autoplayId = setInterval(() => goTo(index + 1), AUTOPLAY);
  };

  /** Detiene y reinicia el autoplay */
  const resetAutoplay = () => {
    clearInterval(autoplayId);
    startAutoplay();
  };

  // Botones
  prevBtn?.addEventListener('click', () => { goTo(index - 1); resetAutoplay(); });
  nextBtn?.addEventListener('click', () => { goTo(index + 1); resetAutoplay(); });

  // Pausa al hacer hover/focus sobre el carrusel
  carouselEl?.addEventListener('mouseenter', () => clearInterval(autoplayId));
  carouselEl?.addEventListener('focusin',    () => clearInterval(autoplayId));
  carouselEl?.addEventListener('mouseleave', startAutoplay);
  carouselEl?.addEventListener('focusout',   startAutoplay);

  // Teclado
  carouselEl?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { goTo(index - 1); resetAutoplay(); }
    if (e.key === 'ArrowRight') { goTo(index + 1); resetAutoplay(); }
  });

  // Touch swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 48) {
      goTo(diff > 0 ? index + 1 : index - 1);
      resetAutoplay();
    }
  }, { passive: true });

  // Init
  goTo(0);
  startAutoplay();

})();
