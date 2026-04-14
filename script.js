/**
 * ARIK PRODUCIENDO — script.js
 * Senior Creative Frontend
 *
 * Secciones:
 *  0. Init & helpers
 *  1. Loader
 *  2. Custom cursor
 *  3. Nav scroll behavior
 *  4. Mobile menu
 *  5. Hero entrance (GSAP timeline)
 *  6. Scroll reveals (GSAP ScrollTrigger)
 *  7. Stat counters
 *  8. Waveform generator
 *  9. Video cards (YouTube embed on click)
 * 10. Contact canvas particles
 * 11. Contact form tabs + submit
 * 12. Magnetic button effect
 * 13. Reduce-motion fallback
 */

'use strict';

/* ═══════════════════════════════════════════
   0. Init & helpers
   ═══════════════════════════════════════════ */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// Detectar si el usuario prefiere movimiento reducido
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Detectar touch (cursor solo en non-touch)
const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

/* ═══════════════════════════════════════════
   1. Loader
   ═══════════════════════════════════════════ */
function initLoader() {
  const loader   = $('#loader');
  const loaderName = $('.loader-name');
  if (!loader) return;

  // Aparecer nombre
  gsap.to(loaderName, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    ease: 'power2.out',
    delay: 0.2
  });

  // Ocultar loader y arrancar la web
  gsap.to(loader, {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.in',
    delay: 1.1,
    onComplete: () => {
      loader.style.display = 'none';
      document.body.style.overflow = '';
      initHeroEntrance();
    }
  });

  // Bloquear scroll mientras carga
  document.body.style.overflow = 'hidden';
}

/* ═══════════════════════════════════════════
   2. Custom cursor (solo desktop)
   ═══════════════════════════════════════════ */
function initCursor() {
  if (isTouch) return;

  const cursor    = $('#cursor');
  const cursorDot = $('#cursor-dot');
  if (!cursor || !cursorDot) return;

  let mx = 0, my = 0; // posición real del ratón
  let cx = 0, cy = 0; // posición suavizada del cursor grande

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;

    // Dot sigue inmediatamente
    gsap.set(cursorDot, { x: mx, y: my });

    document.body.classList.add('cursor-ready');
  });

  // Cursor grande con lag (lerp manual via ticker)
  gsap.ticker.add(() => {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    gsap.set(cursor, { x: cx, y: cy });
  });

  // Hover en elementos interactivos
  $$('a, button, [data-magnetic], .show-card, .video-card, .contact-option').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Click feedback
  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
}

/* ═══════════════════════════════════════════
   3. Nav — scroll behavior
   ═══════════════════════════════════════════ */
function initNav() {
  const nav = $('#nav');
  if (!nav) return;

  ScrollTrigger.create({
    start: '80px top',
    onEnter:     () => nav.classList.add('scrolled'),
    onLeaveBack: () => nav.classList.remove('scrolled'),
  });

  // Active link highlight
  $$('#nav .nav-link').forEach(link => {
    const target = $(link.getAttribute('href'));
    if (!target) return;
    ScrollTrigger.create({
      trigger: target,
      start: 'top 60%',
      end: 'bottom 60%',
      onEnter:      () => link.style.color = 'var(--text)',
      onLeave:      () => link.style.color = '',
      onEnterBack:  () => link.style.color = 'var(--text)',
      onLeaveBack:  () => link.style.color = '',
    });
  });
}

/* ═══════════════════════════════════════════
   4. Mobile menu
   ═══════════════════════════════════════════ */
function initMobileMenu() {
  const burger = $('.nav-burger');
  const menu   = $('#mobileMenu');
  const links  = $$('.mm-link', menu);
  if (!burger || !menu) return;

  let open = false;

  function toggleMenu(state) {
    open = state ?? !open;
    burger.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  burger.addEventListener('click', () => toggleMenu());
  links.forEach(link => link.addEventListener('click', () => toggleMenu(false)));
}

/* ═══════════════════════════════════════════
   5. Hero entrance — GSAP timeline
   (se llama después del loader)
   ═══════════════════════════════════════════ */
function initHeroEntrance() {
  if (prefersReducedMotion) {
    // Sin animaciones: mostrar todo inmediatamente
    $$('.hero-label, .hero-title, .hero-sub, .hero-cta-wrap, .hero-scroll').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl
    .fromTo('.hero-label', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
    .fromTo('.hero-title',
      { y: 60, opacity: 0, skewY: 3 },
      { y: 0, opacity: 1, skewY: 0, duration: 0.9 },
      '-=0.4'
    )
    .fromTo('.hero-sub',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.5'
    )
    .fromTo('.hero-cta-wrap',
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.4'
    )
    .fromTo('.hero-scroll',
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      '-=0.2'
    );
}

/* ═══════════════════════════════════════════
   6. Scroll reveals — GSAP ScrollTrigger
   ═══════════════════════════════════════════ */
function initScrollReveals() {
  if (!window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  if (prefersReducedMotion) {
    $$('[data-reveal]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  // Reveal genérico
  $$('[data-reveal]').forEach(el => {
    const delay  = parseFloat(el.dataset.delay || 0);
    const dir    = el.dataset.reveal;

    const fromVars = { opacity: 0, duration: 0.75, ease: 'power2.out', delay };

    if (dir === 'left')  fromVars.x = -32;
    else if (dir === 'right') fromVars.x = 32;
    else fromVars.y = 28;

    const toVars = { opacity: 1, x: 0, y: 0, duration: 0.75, ease: 'power2.out', delay };

    gsap.fromTo(el,
      { opacity: 0, x: dir === 'left' ? -32 : dir === 'right' ? 32 : 0, y: (!dir || dir === '') ? 28 : 0 },
      {
        ...toVars,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        }
      }
    );
  });

  // Show cards — stagger
  const showCards = $$('.show-card');
  if (showCards.length) {
    gsap.fromTo(showCards,
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.shows-grid',
          start: 'top 80%',
          once: true,
        }
      }
    );
  }

  // Parallax sutil en el hero-video (solo si existe)
  const heroBg = $('#heroBg');
  if (heroBg) {
    gsap.to(heroBg, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });
  }

  // Waveform react-to-scroll
  ScrollTrigger.create({
    trigger: '#waveform',
    start: 'top 80%',
    onEnter: () => startWaveform(),
  });
}

/* ═══════════════════════════════════════════
   7. Stat counters
   ═══════════════════════════════════════════ */
function initCounters() {
  $$('.stat[data-count]').forEach(stat => {
    const target  = parseInt(stat.dataset.count, 10);
    const numEl   = $('.stat-num', stat);
    if (!numEl) return;

    ScrollTrigger.create({
      trigger: stat,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        if (prefersReducedMotion) { numEl.textContent = target; return; }
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: function() {
            numEl.textContent = Math.round(this.targets()[0].val);
          }
        });
      }
    });
  });
}

/* ═══════════════════════════════════════════
   8. Waveform generator + animation
   ═══════════════════════════════════════════ */
function buildWaveform() {
  const container = $('#waveform');
  if (!container) return;

  const BAR_COUNT = 48;
  // Crear barras con alturas aleatorias
  for (let i = 0; i < BAR_COUNT; i++) {
    const bar = document.createElement('div');
    bar.className = 'wave-bar';
    const h = Math.random() * 70 + 15; // 15%–85%
    const dur = (Math.random() * 0.8 + 0.4).toFixed(2); // 0.4s–1.2s
    bar.style.cssText = `
      height: ${h}%;
      animation-duration: ${dur}s;
      animation-delay: ${(Math.random() * 0.5).toFixed(2)}s;
      opacity: ${(Math.random() * 0.5 + 0.4).toFixed(2)};
    `;
    container.appendChild(bar);
  }
}

function startWaveform() {
  // Activar la animación en las barras
  $$('.wave-bar').forEach(bar => {
    bar.style.animationPlayState = 'running';
  });
}

// Parar por defecto (se activan al entrar en viewport)
function pauseWaveform() {
  $$('.wave-bar').forEach(bar => {
    bar.style.animationPlayState = 'paused';
  });
}

/* ═══════════════════════════════════════════
   9. Video cards — YouTube embed al hacer click
   ═══════════════════════════════════════════ */
function initVideoCards() {
  $$('.video-thumb[data-yt-id]').forEach(thumb => {
    const ytId = thumb.dataset.ytId;
    const btn  = $('.video-play-btn', thumb);
    if (!btn || !ytId || ytId.startsWith('VIDEO_ID')) return; // placeholder

    btn.addEventListener('click', () => {
      // Crear iframe de YouTube
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.loading = 'lazy';
      iframe.title = 'Vídeo de ARIK';

      // Reemplazar placeholder
      const placeholder = $('.video-placeholder', thumb);
      if (placeholder) placeholder.remove();
      btn.remove();
      thumb.appendChild(iframe);
    });
  });
}

/* ═══════════════════════════════════════════
   10. Contact canvas — partículas sutiles
   ═══════════════════════════════════════════ */
function initContactCanvas() {
  const canvas = $('#contactCanvas');
  if (!canvas || prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const PARTICLE_COUNT = 35;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(randomY = false) {
      this.x    = Math.random() * W;
      this.y    = randomY ? Math.random() * H : H + 10;
      this.size = Math.random() * 1.5 + 0.5;
      this.vy   = -(Math.random() * 0.4 + 0.15);
      this.vx   = (Math.random() - 0.5) * 0.2;
      this.alpha = Math.random() * 0.3 + 0.05;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -5) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = '#e8183c';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  init();
  animate();
}

/* ═══════════════════════════════════════════
   11. Contact form — tabs + submit
   ═══════════════════════════════════════════ */
function activateTab(type) {
  $$('.form-tab').forEach(tab => {
    const isActive = tab.dataset.formTab === type;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });
  const djFields   = $('#dj-fields');
  const beatFields = $('#beat-fields');
  if (djFields)   djFields.style.display   = type === 'dj'   ? 'flex' : 'none';
  if (beatFields) beatFields.style.display = type === 'beat' ? 'flex' : 'none';
}
// Hacer global para que el HTML inline la use
window.activateTab = activateTab;

function initContactForm() {
  const form = $('#contactForm');
  const btn  = $('#submitBtn');
  if (!form || !btn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validación básica
    const name  = $('#f-name').value.trim();
    const email = $('#f-email').value.trim();
    if (!name || !email) {
      shakeField(!name ? '#f-name' : '#f-email');
      return;
    }

    // Simular envío (reemplazar por fetch a tu backend/Formspree)
    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = 'Enviando...';

    setTimeout(() => {
      btn.classList.add('sent');
      btn.querySelector('.btn-text').textContent = '¡Mensaje enviado! ✓';
      // Aquí conectarías con Formspree, EmailJS, etc.:
      // fetch('https://formspree.io/f/TU_ID', { method: 'POST', body: new FormData(form) })
      setTimeout(() => {
        btn.disabled = false;
        btn.classList.remove('sent');
        btn.querySelector('.btn-text').textContent = 'Enviar mensaje';
        form.reset();
      }, 4000);
    }, 1000);
  });
}

function shakeField(selector) {
  const el = $(selector);
  if (!el || prefersReducedMotion) return;
  gsap.fromTo(el,
    { x: -6 },
    { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)',
      keyframes: [{ x: -6 }, { x: 6 }, { x: -4 }, { x: 4 }, { x: 0 }]
    }
  );
  el.focus();
}

/* ═══════════════════════════════════════════
   12. Magnetic button effect
   (solo en desktop y elementos [data-magnetic])
   ═══════════════════════════════════════════ */
function initMagnetic() {
  if (isTouch || prefersReducedMotion) return;

  $$('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect     = el.getBoundingClientRect();
      const cx       = rect.left + rect.width  / 2;
      const cy       = rect.top  + rect.height / 2;
      const dx       = (e.clientX - cx) * 0.3;
      const dy       = (e.clientY - cy) * 0.3;
      gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* ═══════════════════════════════════════════
   13. Smooth scroll para links internos
   ═══════════════════════════════════════════ */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = $(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 68;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ═══════════════════════════════════════════
   Boot — todo arranca aquí
   ═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  // Registrar ScrollTrigger si GSAP está disponible
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Construir waveform antes de que se vea
  buildWaveform();
  pauseWaveform(); // pausar hasta que entre en viewport

  // Inicializar todo
  initLoader();        // 1. Loader (llama a heroEntrance cuando termina)
  initCursor();        // 2. Cursor personalizado
  initNav();           // 3. Nav scroll
  initMobileMenu();    // 4. Mobile menu
  // initHeroEntrance se llama desde initLoader
  initScrollReveals(); // 6. Scroll reveals
  initCounters();      // 7. Counters
  initVideoCards();    // 9. Videos
  initContactCanvas(); // 10. Canvas partículas
  initContactForm();   // 11. Formulario
  initMagnetic();      // 12. Magnetic
  initSmoothScroll();  // 13. Smooth scroll

  // Activar tab DJ por defecto en el form
  activateTab('dj');
});

/* ═══════════════════════════════════════════
   NOTAS PARA PERSONALIZAR
   ═══════════════════════════════════════════

   Vídeo hero:
   → Descomenta las líneas <source> en index.html
   → Usa un clip de 10–20s, 1280×720, <15MB
   → ffmpeg -i input.mp4 -vf scale=1280:-2 -c:v libx264 -crf 28 -an hero-bg.mp4

   Fotos:
   → about-img-placeholder → <img src="foto.jpg" class="about-img">
   → show-placeholder      → <img src="show1.jpg" class="show-img">
   → studio img            → añade <img src="estudio.jpg" class="studio-img"> en .prod-visual

   Videos YouTube:
   → data-yt-id en cada .video-thumb → el ID de youtube.com/watch?v=ESTE_ID

   Spotify:
   → Ve a tu perfil → Share → Embed → copia el src del iframe
   → Pégalo en el iframe.spotify-embed

   SoundCloud:
   → Ve a tu perfil → Share → Embed → copia el src
   → Pégalo en el iframe.sc-embed

   Formulario:
   → En initContactForm(), reemplaza el setTimeout por:
   fetch('https://formspree.io/f/TU_FORM_ID', {
     method: 'POST',
     headers: { 'Accept': 'application/json' },
     body: new FormData(form)
   })

   Redes sociales:
   → Busca class="cs-link" en index.html → añade href reales

   ═══════════════════════════════════════════ */