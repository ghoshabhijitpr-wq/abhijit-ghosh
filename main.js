/* ═══════════════════════════════════════════════════════
   Premium Portfolio — main.js
   Stack: GSAP 3 + ScrollTrigger · Lenis · Canvas
   ═══════════════════════════════════════════════════════ */

// ── 1. Lenis smooth scroll ──────────────────────────────
const lenis = new Lenis({
  duration: 1.25,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});
gsap.registerPlugin(ScrollTrigger);
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
lenis.on('scroll', ScrollTrigger.update);

// ── 2. Magnetic buttons ─────────────────────────────────
document.querySelectorAll('.btn-gold, .btn-outline').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) * 0.28;
    const y = (e.clientY - r.top  - r.height / 2) * 0.28;
    gsap.to(btn, { x, y, duration: 0.35, ease: 'power2.out', overwrite: true });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.5)', overwrite: true });
  });
});

// ── 3. Nav: progress bar + active-section highlight ─────
const navProgress = document.getElementById('navProgress');
const navbar      = document.getElementById('navbar');
const navLinks    = document.querySelectorAll('nav ul a');
const sections    = Array.from(document.querySelectorAll('section[id]'));

lenis.on('scroll', ({ scroll, limit }) => {
  navProgress.style.width = (scroll / limit * 100) + '%';
  navbar.classList.toggle('scrolled', scroll > 50);

  let active = sections[0].id;
  sections.forEach(s => { if (scroll >= s.offsetTop - 240) active = s.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + active));
});

// ── 4. Aurora mouse drift ───────────────────────────────
const aBlobs = document.querySelectorAll('.aurora-blob');
document.addEventListener('mousemove', e => {
  const nx = e.clientX / window.innerWidth  - 0.5;
  const ny = e.clientY / window.innerHeight - 0.5;
  aBlobs.forEach((b, i) => {
    const d = (i + 1) * 18;
    gsap.to(b, { x: nx * d, y: ny * d, duration: 4, ease: 'power1.out', overwrite: true });
  });
});

// ── 5. Hero parallax layers ─────────────────────────────
const floatIcons = document.querySelectorAll('.float-icon');
document.addEventListener('mousemove', e => {
  if (window.scrollY > window.innerHeight * 0.6) return;
  const nx = e.clientX / window.innerWidth  - 0.5;
  const ny = e.clientY / window.innerHeight - 0.5;

  gsap.to('#hero-headline', { x: nx * -22, y: ny * -14, duration: 1.1, ease: 'power2.out', overwrite: true });
  gsap.to('.hero-tagline',  { x: nx * -14, y: ny * -9,  duration: 1.3, ease: 'power2.out', overwrite: true });
  gsap.to('.hero-chips',    { x: nx * -9,  y: ny * -6,  duration: 1.5, ease: 'power2.out', overwrite: true });
  gsap.to('.hero-badge',    { x: nx * -5,  y: ny * -3,  duration: 1.7, ease: 'power2.out', overwrite: true });
  floatIcons.forEach((icon, i) => {
    const depth = parseFloat(icon.dataset.depth) || 0.3;
    gsap.to(icon, {
      x: nx * -70 * depth, y: ny * -50 * depth,
      duration: 1.6 + i * 0.08, ease: 'power2.out', overwrite: true,
    });
  });
});

// ── 6. Hero GSAP entrance ────────────────────────────────
const heroTl = gsap.timeline({ delay: 0.2 });
heroTl
  .from('.hero-badge',     { y: 30, opacity: 0, duration: .7, ease: 'power3.out' })
  .from('#hero-headline',  { y: 55, opacity: 0, duration: .8, ease: 'power3.out' }, '-=.35')
  .from('.hero-tagline',   { y: 35, opacity: 0, duration: .7, ease: 'power3.out' }, '-=.4')
  .from('.hero-chips span',{ y: 22, opacity: 0, stagger: .08, duration: .5, ease: 'power2.out' }, '-=.3')
  .from('.hero-cta a',     { y: 20, opacity: 0, stagger: .1,  duration: .5, ease: 'power2.out' }, '-=.2')
  .from(floatIcons,        { scale: 0, opacity: 0, stagger: .09, duration: .55, ease: 'back.out(2)' }, '-=.3')
  .from('.hero-scroll-hint',{ y: 20, opacity: 0, duration: .6, ease: 'power2.out' }, '-=.1');

// ── 7. Typewriter ────────────────────────────────────────
(function typewriter() {
  const el = document.getElementById('typed-name');
  const name = 'Abhijit Ghosh';
  let i = 0;
  const type = () => {
    el.textContent = name.slice(0, i);
    if (i <= name.length) { i++; setTimeout(type, i === 1 ? 700 : 70); }
  };
  type();
})();

// ── 8. Section title word-reveal ────────────────────────
document.querySelectorAll('.section-title').forEach(title => {
  const words = title.textContent.trim().split(/\s+/);
  title.innerHTML = words.map(w =>
    `<span class="word-outer"><span class="word-inner">${w}</span></span>`
  ).join(' ');

  gsap.from(title.querySelectorAll('.word-inner'), {
    scrollTrigger: { trigger: title, start: 'top 88%' },
    y: '105%', opacity: 0, filter: 'blur(8px)',
    stagger: .08, duration: .8, ease: 'power3.out',
  });
});

// ── 9. Section label slide-in ───────────────────────────
document.querySelectorAll('.section-label').forEach(el => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 88%' },
    x: -30, opacity: 0, duration: .6, ease: 'power2.out',
  });
});

// ── 10. About ────────────────────────────────────────────
gsap.from('#about .about-text p', {
  scrollTrigger: { trigger: '#about .about-text', start: 'top 78%' },
  y: 38, opacity: 0, stagger: .18, duration: .9, ease: 'power2.out',
});
gsap.from('#about .stat-card', {
  scrollTrigger: { trigger: '#about .about-stats', start: 'top 80%' },
  y: 50, opacity: 0, scale: .88, stagger: .12, duration: .75, ease: 'back.out(1.5)',
});

// ── 11. Skills — stagger + bar fill + pct glow ───────────
gsap.from('#skills .skill-group', {
  scrollTrigger: { trigger: '#skills .skills-grid', start: 'top 78%' },
  y: 65, opacity: 0, scale: .95, stagger: .14, duration: .85, ease: 'power3.out',
});

(function skillBars() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.bar-fill').forEach((bar, i) => {
        setTimeout(() => {
          bar.style.width = bar.dataset.w + '%';
          setTimeout(() => {
            bar.style.boxShadow = '0 0 18px rgba(245,182,66,.7)';
            setTimeout(() => { bar.style.boxShadow = ''; }, 500);
          }, 1200 + i * 100);
        }, 300 + i * 80);
      });
      entry.target.querySelectorAll('.skill-pct').forEach((pct, i) => {
        const target = parseInt(pct.textContent);
        const t0 = performance.now();
        const dur = 1200;
        const tick = now => {
          const p = Math.min((now - t0) / dur, 1);
          pct.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + '%';
          if (p < 1) requestAnimationFrame(tick);
          else pct.textContent = target + '%';
        };
        setTimeout(() => requestAnimationFrame(tick), 300 + i * 80);
      });
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-group').forEach(g => obs.observe(g));
})();

// ── 12. Experience — timeline draw + alternating slide ───
gsap.to('.timeline-fill', {
  scaleY: 1,
  transformOrigin: 'top center',
  ease: 'none',
  scrollTrigger: {
    trigger: '.timeline',
    start: 'top 72%',
    end: 'bottom 65%',
    scrub: 1.8,
  },
});

gsap.from('.timeline-dot', {
  scrollTrigger: { trigger: '.timeline', start: 'top 72%' },
  scale: 0, opacity: 0, stagger: .28,
  duration: .55, delay: .1, ease: 'back.out(2)',
});

document.querySelectorAll('.timeline-item').forEach((item, i) => {
  gsap.from(item.querySelector('.timeline-content'), {
    scrollTrigger: { trigger: item, start: 'top 82%' },
    x: i % 2 === 0 ? -55 : 55,
    opacity: 0, duration: .9, ease: 'power3.out',
  });
});

// ── 13. Projects — scale reveal + shine on hover ─────────
gsap.from('#projects .project-card', {
  scrollTrigger: { trigger: '#projects .projects-grid', start: 'top 78%' },
  y: 72, opacity: 0, scale: .9, stagger: .13, duration: .95, ease: 'power3.out',
});

document.querySelectorAll('.project-card').forEach(card => {
  const shine = card.querySelector('.card-shine');
  card.addEventListener('mouseenter', () => {
    gsap.fromTo(shine,
      { x: '-120%', opacity: 1 },
      { x: '160%',  opacity: 1, duration: .65, ease: 'power2.inOut' }
    );
  });
});

// ── 14. Contact — fade + glow ────────────────────────────
gsap.from('#contact .contact-sub', {
  scrollTrigger: { trigger: '#contact', start: 'top 80%' },
  y: 30, opacity: 0, duration: .7, ease: 'power2.out',
});
gsap.from('#contact .contact-card', {
  scrollTrigger: { trigger: '#contact .contact-grid', start: 'top 82%' },
  y: 55, opacity: 0, scale: .93, stagger: .14, duration: .8, ease: 'power3.out',
});

// ── 15. Footer statement ─────────────────────────────────
gsap.from('.footer-statement', {
  scrollTrigger: { trigger: 'footer', start: 'top 90%' },
  y: 25, opacity: 0, duration: .9, ease: 'power3.out',
});

// ── 16. Enhanced particle canvas (mouse-attracted) ───────
(function particleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, dots;
  let mx = -999, my = -999;

  const GOLD = '245,182,66', SILVER = '190,210,255';

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };

  const makeDot = () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 1.8 + .5,
    vx: (Math.random() - .5) * .22,
    vy: (Math.random() - .5) * .22,
    ax: 0, ay: 0,
    alpha: Math.random() * .45 + .08,
    c: Math.random() > .35 ? GOLD : SILVER,
  });

  resize();
  dots = Array.from({ length: 75 }, makeDot);

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => {
      const dx = mx - d.x, dy = my - d.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 190) {
        const f = (190 - dist) / 190 * 0.014;
        d.ax = dx * f; d.ay = dy * f;
      } else { d.ax *= .88; d.ay *= .88; }

      d.vx = (d.vx + d.ax) * .992;
      d.vy = (d.vy + d.ay) * .992;
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
      if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${d.c},${d.alpha})`;
      ctx.fill();
    });

    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 115) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(${dots[i].c},${.07 * (1 - dist / 115)})`;
          ctx.lineWidth = .7;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  };

  window.addEventListener('resize', resize, { passive: true });
  draw();
})();

// ── 17. Footer star field ────────────────────────────────
(function starField() {
  const canvas = document.getElementById('footer-stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars;

  const resize = () => {
    const ft = canvas.parentElement;
    canvas.width  = ft.offsetWidth;
    canvas.height = ft.offsetHeight;
  };

  const makeStar = () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.3 + .2,
    a: Math.random(),
    spd: Math.random() * .007 + .002,
    dir: Math.random() > .5 ? 1 : -1,
  });

  resize();
  stars = Array.from({ length: 65 }, makeStar);

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.a += s.spd * s.dir;
      if (s.a >= 1 || s.a <= 0) s.dir *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245,182,66,${s.a * .55})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };

  window.addEventListener('resize', () => {
    resize();
    stars = Array.from({ length: 65 }, makeStar);
  }, { passive: true });

  draw();
})();

// ── 18. Gallery scroll reveal ────────────────────────
document.querySelectorAll('.g-reveal').forEach((el, i) => {
  gsap.fromTo(el,
    { y: 80, opacity: 0, scale: .88, rotationY: 8 },
    {
      y: 0, opacity: 1, scale: 1, rotationY: 0,
      duration: 1, ease: 'expo.out',
      delay: i * 0.15,
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      onComplete() { el.classList.add('in-view'); }
    }
  );
  // gold shimmer border on hover
  el.addEventListener('mouseenter', () =>
    gsap.to(el, { borderColor: 'rgba(245,182,66,.45)', boxShadow: '0 0 30px rgba(245,182,66,.18)', duration: .3 }));
  el.addEventListener('mouseleave', () =>
    gsap.to(el, { borderColor: 'rgba(245,182,66,.1)', boxShadow: 'none', duration: .4 }));
});

// ── Gallery lightbox ─────────────────────────────────
(function galleryLightbox() {
  const lb      = document.getElementById('gallery-lightbox');
  const lbImg   = document.getElementById('lightbox-img');
  const lbCap   = document.getElementById('lightbox-caption');
  const lbClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      lbImg.src = item.querySelector('img').src;
      lbImg.alt = item.querySelector('img').alt;
      lbCap.textContent = item.dataset.caption || '';
      lb.classList.add('open');
      lenis.stop();
      document.body.style.overflow = 'hidden';
    });
  });

  const close = () => {
    lb.classList.remove('open');
    lenis.start();
    document.body.style.overflow = '';
  };

  lbClose.addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

// ── 19. Hero profile image entrance ──────────────────
gsap.from('.hero-profile-img', {
  delay: .5, scale: .5, opacity: 0, rotation: -15,
  duration: 1, ease: 'back.out(1.8)',
});

// ── 20. 3-D tilt on skill cards ──────────────────────
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    gsap.to(card, {
      rotateY: x * 12, rotateX: -y * 12,
      transformPerspective: 700,
      duration: .25, ease: 'power1.out', overwrite: true,
    });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateY: 0, rotateX: 0, duration: .7, ease: 'elastic.out(1,.5)', overwrite: true });
  });
});

// ── 19. Floating icons continuous bob + parallax-scroll fade ──
lenis.on('scroll', ({ scroll }) => {
  const heroH = document.getElementById('hero').offsetHeight;
  const pct   = Math.min(scroll / heroH, 1);
  document.querySelector('.hero-floats').style.opacity = 1 - pct * 1.5;
  document.querySelector('.hero-bg-img').style.transform = `translateY(${scroll * 0.18}px)`;
});

// ── 20. Contact card glow on hover ───────────────────
document.querySelectorAll('.contact-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, { boxShadow: '0 0 30px rgba(245,182,66,.25)', duration: .3 });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { boxShadow: '0 0 0px rgba(245,182,66,0)', duration: .4 });
  });
});

// ── 21. Modal system ─────────────────────────────────────
(function modalSystem() {
  function openModal(id) {
    const overlay = document.getElementById('modal-' + id);
    if (!overlay) return;
    lenis.stop();
    overlay.classList.add('open');
    // allow native scroll inside modal box
    const box = overlay.querySelector('.modal-box');
    if (box) {
      box.style.overflowY = 'scroll';
      box.style.webkitOverflowScrolling = 'touch';
      box.scrollTop = 0;
    }
  }

  function closeModal(overlay) {
    overlay.classList.remove('open');
    lenis.start();
  }

  document.querySelectorAll('[data-modal]').forEach(el => {
    el.addEventListener('click', () => openModal(el.dataset.modal));
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay);
    });
    const closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', () => closeModal(overlay));
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.modal-overlay.open').forEach(closeModal);
  });
})();

// ── 22. Chatbot ───────────────────────────────────────────
(function chatbot() {
  const toggle   = document.getElementById('chatbot-toggle');
  const win      = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chatbot-close');
  const input    = document.getElementById('chatbot-input');
  const sendBtn  = document.getElementById('chatbot-send');
  const messages = document.getElementById('chatbot-messages');

  const KB = [
    {
      keys: ['who','name','abhijit','yourself','introduce','about'],
      ans: "I'm Abhijit Ghosh — born 04 October 2001, from West Bengal 🇮🇳. I'm a Supply Chain professional currently working as Management Trainee SCM at Neo Metaliks Limited. I did my BBA in Marketing (Burdwan University, 75%) and am pursuing an MBA in Transportation & Logistics at IISWBM, Kolkata (2024–2026). I also co-founded Janani Ghee, a homemade ghee brand. 🎓",
    },
    {
      keys: ['work','job','company','neo','metaliks','trainee','current','role'],
      ans: "Abhijit works as Management Trainee — SCM at Neo Metaliks Limited, a steel manufacturer in West Bengal. He handles inbound raw material procurement (sponge iron, scrap, ferro-alloys), vendor coordination, logistics tracking, and SCM performance reporting. It's a live role he's currently in. 🏭",
    },
    {
      keys: ['education','study','studied','degree','college','university','academic'],
      ans: "Abhijit's academics: 📚 MBA (Transportation & Logistics) — IISWBM, Kolkata, 2024–2026. 🎓 BBA Marketing — Cyber Research & Training Institute, Burdwan University, 75%, 2021–2024. 📗 Higher Secondary — Gantar B.M. High School, 87%, 2019. 📘 Secondary — Gantar B.M. High School, 70%, 2017.",
    },
    {
      keys: ['mba','iiswbm','transportation','logistics','kolkata'],
      ans: "His MBA is in Transportation & Logistics from IISWBM, Kolkata (2024–2026). Subjects include Logistics & Distribution Management, Transportation Management Systems, Warehouse & Inventory Management, Procurement, Operations Research, and International Logistics. IISWBM was established in 1953 — one of India's oldest management institutes! 📚",
    },
    {
      keys: ['bba','burdwan','marketing','bachelor'],
      ans: "Abhijit did his BBA in Marketing Management from Cyber Research & Training Institute, Burdwan (Burdwan University) — scoring 75% from 2021 to 2024. He studied Consumer Behaviour, Brand Management, Market Research, and Sales & Distribution. This marketing background is what makes him sharp at communicating SCM value. 🏛️",
    },
    {
      keys: ['janani','ghee','entrepreneur','startup','founder','brand'],
      ans: "Janani Ghee was Abhijit's entrepreneurial venture (2021–2023) — a homemade ghee brand he co-founded. He managed everything: procurement, production coordination with 12 housewives, distribution to 10+ retail outlets, and 200+ direct customers. He reduced delivery lead times by 25%! This was his real-world SCM MBA before the actual MBA. 🧈",
    },
    {
      keys: ['certificate','certified','cscmp','nestle','nestlé','award','achievement'],
      ans: "Abhijit has two certifications: 🏅 CSCMP Bronze Level — 2025 CSCMP Global Learning Challenge (SCPro™ Foundations, signed by Mark Baxa, CEO of CSCMP — globally recognised!). 📜 Nestlé Certificate — Running an Efficient Supply Chain (supply chain optimisation & sustainability, 2025). Big credentials for an MBA student!",
    },
    {
      keys: ['ai','artificial intelligence','claude','chatbot','automation','integrate','productivity','tool'],
      ans: "AI integration is one of Abhijit's standout skills! 🤖 He uses Claude AI at 92% proficiency for workflow automation, built this entire portfolio with AI (including this chatbot!), does AI-assisted SCM research, and applies prompt engineering in supply chain contexts. He believes AI is a productivity multiplier — not just a search tool.",
    },
    {
      keys: ['project','built','tool','work'],
      ans: "Abhijit's projects: 1️⃣ Emami COPQ Study — ₹10.03 crore waste mapped, 14 interventions. 2️⃣ Expiry Tracker Tool — browser inventory app. 3️⃣ Neo Metaliks SCM — live MT role. 4️⃣ SAMA SRN Portal — sales return & credit note digitisation at Emami. 5️⃣ SCM Knowledge Base — AI-assisted exam prep. 6️⃣ Janani Ghee — co-founded ghee brand. 7️⃣ This AI Portfolio! 💪",
    },
    {
      keys: ['skill','know','good','expertise','excel','sap','python','power bi'],
      ans: "Abhijit's top skills: ⛓️ Supply Chain & Operations (COPQ, logistics, procurement — 80-90%). 📊 Data Tools (Excel 92%, Power BI 78%, SAP 72%, Python 65%). 🤖 AI Integration (Claude AI 92%, AI research 90%, prompt engineering 88%). 🤝 Soft Skills (communication, negotiation, root cause analysis). CSCMP & Nestlé certified too!",
    },
    {
      keys: ['contact','email','phone','linkedin','reach','connect','hire'],
      ans: "📧 ghoshabhijitpr@gmail.com\n📱 +91 78640 84892\n💼 linkedin.com/in/ghoshabhijitpr\n📍 Boys Hostel, IISWBM, Kolkata 700073\n\nAbhijit is open to supply chain, logistics, and operations opportunities. Don't hesitate to reach out! 🤝",
    },
    {
      keys: ['emami','copq','haldia','internship','intern','agrotech'],
      ans: "At Emami Agrotech (March–May 2026), Abhijit did India's first COPQ study for an edible oil network — analysed 5,167 SRN lines worth ₹773.38 lakhs, quantified ₹10.03 crore annual COPQ across 15 depots, and gave 14 interventions saving ₹4.5–6 crore in Year 1. Also designed the SAMA SRN Portal to fix the return & credit note process. 6 weeks at Haldia Plant + Dhulagarh CFA! 🔍",
    },
    {
      keys: ['dr soma','homeopathic','stock manager','assistant'],
      ans: "In 2024, before joining Neo Metaliks, Abhijit worked as Assistant Stock Manager at Dr Soma Singha's homeopathic clinic — managing inventory of 200+ homeopathic products, ensuring accurate tracking and timely replenishment. His first formal inventory management role! 📦",
    },
    {
      keys: ['hello','hi','hey','hii','helo','hola'],
      ans: "Hey! 👋 I'm Abhi's little assistant — the one with a butterfly on my head! Ask me anything about Abhijit: his work at Neo Metaliks, his education, projects, certifications, or AI skills. I know everything about him! 🦋",
    },
    {
      keys: ['thank','thanks','great','nice','awesome','cool'],
      ans: "You're welcome! 😊 Feel free to ask anything else about Abhijit — or scroll up the page to explore his full portfolio!",
    },
  ];

  function findAnswer(q) {
    const lq = q.toLowerCase();
    for (const item of KB) {
      if (item.keys.some(k => lq.includes(k))) return item.ans;
    }
    return "Hmm, I'm not sure about that one! 🤔 Try asking about Abhijit's education, job, skills, or projects — or reach out directly at ghoshabhijitpr@gmail.com 📧";
  }

  function appendMsg(text, who) {
    const div = document.createElement('div');
    div.className = `chat-msg ${who}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const t = document.createElement('div');
    t.className = 'chat-typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    t.id = 'typing-indicator';
    messages.appendChild(t);
    messages.scrollTop = messages.scrollHeight;
    return t;
  }

  function handleSend() {
    const q = input.value.trim();
    if (!q) return;
    input.value = '';
    const sugg = messages.querySelector('.chatbot-suggestions');
    if (sugg) sugg.remove();
    appendMsg(q, 'user');
    const typing = showTyping();
    setTimeout(() => {
      typing.remove();
      appendMsg(findAnswer(q), 'bot');
    }, 650 + Math.random() * 450);
  }

  messages.addEventListener('click', e => {
    if (!e.target.matches('.suggestion-chip')) return;
    input.value = e.target.dataset.q;
    handleSend();
  });

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });

  toggle.addEventListener('click', () => {
    win.classList.toggle('open');
    if (win.classList.contains('open')) setTimeout(() => input.focus(), 50);
  });
  closeBtn.addEventListener('click', () => win.classList.remove('open'));
})();
