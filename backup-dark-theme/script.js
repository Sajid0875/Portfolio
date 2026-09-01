/* =====================================================================
   SYNAPSE — script.js  (vanilla JS, no dependencies)
   Modules: boot · cursor · magnetic · nav · neural bg canvas ·
   role typer · reveals · scroll progress · skills constellation ·
   project cores (+3D tilt +modal) · contact terminal
   ===================================================================== */
'use strict';

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none)').matches;
const $  = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

/* ---------------------------------------------------------------
   1) BOOT SEQUENCE — fake consciousness init, then reveal site
   --------------------------------------------------------------- */
(function boot() {
  const el = $('#boot'); if (!el) return;
  const log = $('#bootLog'); const bar = $('#bootBar');
  const lines = ['initializing consciousness', 'loading neural weights', 'calibrating synapses', 'system online'];
  let i = 0, p = 0;
  const finish = () => { el.classList.add('done'); document.body.style.overflow = ''; };
  if (prefersReduced) { finish(); return; }
  document.body.style.overflow = 'hidden';
  const tick = setInterval(() => {
    p += Math.random() * 22;
    bar.style.width = Math.min(p, 100) + '%';
    if (p > (i + 1) * 22 && i < lines.length - 1) log.textContent = lines[++i];
    if (p >= 100) { clearInterval(tick); log.textContent = lines[lines.length - 1]; setTimeout(finish, 500); }
  }, 260);
})();

/* ---------------------------------------------------------------
   2) CUSTOM CURSOR + magnetic buttons
   --------------------------------------------------------------- */
(function cursor() {
  if (isTouch) return;
  const dot = $('#cursorDot'); const ring = $('#cursorRing');
  if (!dot || !ring) return;
  document.body.classList.add('custom-cursor');
  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  });
  (function loop() { // smooth trailing ring
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();
  $$('a, button, .core, input, [data-magnetic]').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('grow'));
    el.addEventListener('mouseleave', () => ring.classList.remove('grow'));
  });
  // Magnetic pull
  $$('[data-magnetic]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
})();

/* ---------------------------------------------------------------
   3) NAV — scrolled state, mobile menu, scroll progress
   --------------------------------------------------------------- */
(function nav() {
  const bar = $('#nav'); const burger = $('#burger'); const links = $('.nav__links');
  const progress = $('#scrollProgress');
  const onScroll = () => {
    bar.classList.toggle('scrolled', window.scrollY > 40);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (window.scrollY / h) * 100 + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  });
  $$('.nav__links a').forEach((a) => a.addEventListener('click', () => {
    links.classList.remove('open'); burger.classList.remove('open');
  }));
})();

/* ---------------------------------------------------------------
   4) NEURAL BACKGROUND — mouse-reactive particle field on canvas
   --------------------------------------------------------------- */
(function neuralBg() {
  const canvas = $('#bgCanvas'); if (!canvas || prefersReduced) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  const mouse = { x: -999, y: -999 };
  const COUNT = () => Math.min(90, Math.floor(window.innerWidth / 16));

  function resize() {
    w = canvas.width = window.innerWidth * devicePixelRatio;
    h = canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    build();
  }
  function build() {
    particles = Array.from({ length: COUNT() }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }));
  }
  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseout', () => { mouse.x = mouse.y = -999; });

  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
      if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
      // gentle attraction to cursor
      const dx = mouse.x - p.x, dy = mouse.y - p.y;
      const d = Math.hypot(dx, dy);
      if (d < 160) { p.x += dx / d * 0.4; p.y += dy / d * 0.4; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(140,150,200,0.6)';
      ctx.fill();
    }
    // synapse links
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 130) {
          ctx.strokeStyle = `rgba(108,92,255,${0.14 * (1 - dist / 130)})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  resize(); draw();

  // Parallax on hero core
  const core = $('#heroCore');
  if (core) window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    core.style.transform = `translateY(-50%) translate3d(${x}px, ${y}px, 0)`;
  });
})();

/* ---------------------------------------------------------------
   5) HERO — rotating role typer
   --------------------------------------------------------------- */
(function roleTyper() {
  const el = $('#heroRoles'); if (!el) return;
  const roles = ['AI Engineer', 'Agentic AI Developer', 'Backend Engineer', 'ML Enthusiast', 'Future Founder'];
  if (prefersReduced) { el.textContent = roles[0]; return; }
  let r = 0, c = 0, deleting = false;
  (function type() {
    const word = roles[r];
    c += deleting ? -1 : 1;
    el.innerHTML = `<span class="cursor-blink">${word.slice(0, c)}</span>`;
    let delay = deleting ? 45 : 90;
    if (!deleting && c === word.length) { delay = 1500; deleting = true; }
    else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 300; }
    setTimeout(type, delay);
  })();
})();

/* ---------------------------------------------------------------
   6) REVEAL ON SCROLL — IntersectionObserver
   --------------------------------------------------------------- */
(function reveals() {
  const els = $$('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en, k) => {
      if (en.isIntersecting) {
        setTimeout(() => en.target.classList.add('in'), k * 60);
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach((e) => io.observe(e));
})();

/* ---------------------------------------------------------------
   7) SKILLS — technology ecosystem (nodes + drawn synapses)
   --------------------------------------------------------------- */
(function skills() {
  const stage = $('.skills__stage'); const list = $('#skillNodes'); const canvas = $('#skillsCanvas');
  if (!stage || !list || !canvas) return;
  const ctx = canvas.getContext('2d');
  const data = [
    { label: 'AI Core', tag: 'core', core: true, x: 50, y: 50 },
    { label: 'LLMs & Agents', tag: 'agentic', x: 24, y: 24 },
    { label: 'Python', tag: 'language', x: 76, y: 22 },
    { label: 'PyTorch', tag: 'ml', x: 84, y: 55 },
    { label: 'Backend APIs', tag: 'systems', x: 72, y: 82 },
    { label: 'Vector DBs', tag: 'retrieval', x: 30, y: 80 },
    { label: 'RAG', tag: 'method', x: 16, y: 54 },
    { label: 'Docker', tag: 'infra', x: 50, y: 14 },
    { label: 'SQL / NoSQL', tag: 'data', x: 50, y: 88 },
  ];
  // Build DOM nodes
  data.forEach((d, i) => {
    const li = document.createElement('li');
    li.className = 'skill-node' + (d.core ? ' core' : '');
    li.style.left = d.x + '%'; li.style.top = d.y + '%';
    li.style.setProperty('--dur', (5 + (i % 4)) + 's');
    li.innerHTML = `${d.label}<small>${d.tag}</small>`;
    li.dataset.idx = i;
    list.appendChild(li);
    d.el = li;
  });
  function resize() {
    canvas.width = stage.clientWidth * devicePixelRatio;
    canvas.height = stage.clientHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  function pos(d) { return { x: d.x / 100 * stage.clientWidth, y: d.y / 100 * stage.clientHeight }; }
  function drawLines() {
    ctx.clearRect(0, 0, stage.clientWidth, stage.clientHeight);
    const core = pos(data[0]);
    data.slice(1).forEach((d) => {
      const p = pos(d);
      const active = d.el.classList.contains('active');
      const grad = ctx.createLinearGradient(core.x, core.y, p.x, p.y);
      grad.addColorStop(0, 'rgba(53,224,217,' + (active ? 0.7 : 0.25) + ')');
      grad.addColorStop(1, 'rgba(108,92,255,' + (active ? 0.7 : 0.1) + ')');
      ctx.strokeStyle = grad; ctx.lineWidth = active ? 2 : 1;
      ctx.beginPath(); ctx.moveTo(core.x, core.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    });
    requestAnimationFrame(drawLines);
  }
  list.addEventListener('mouseover', (e) => { const n = e.target.closest('.skill-node'); if (n) n.classList.add('active'); });
  list.addEventListener('mouseout', (e) => { const n = e.target.closest('.skill-node'); if (n) n.classList.remove('active'); });
  window.addEventListener('resize', resize);
  resize(); if (!prefersReduced) drawLines(); else { /* draw once */ resize(); }
})();

/* ---------------------------------------------------------------
   8) PROJECTS — memory cores, 3D tilt, and detail modal
   --------------------------------------------------------------- */
(function projects() {
  const grid = $('#projectGrid'); if (!grid) return;
  const data = [
    { tag: 'Agentic AI', title: 'Orchestra', desc: 'A multi-agent framework where autonomous agents plan, delegate, and execute complex tasks with tool use and memory.', long: 'Orchestra coordinates specialised agents behind a planner-executor loop. Agents share a common memory store, call tools, and self-correct — turning fuzzy goals into reliable multi-step execution.', stack: ['Python', 'LLMs', 'Tool Use', 'Vector Memory'] },
    { tag: 'Machine Learning', title: 'Insight Engine', desc: 'An end-to-end ML pipeline that transforms raw data into predictive insight with automated feature discovery.', long: 'From ingestion to deployment: automated feature engineering, model selection, and monitoring — packaged as a reproducible pipeline with drift detection.', stack: ['PyTorch', 'MLOps', 'Pandas', 'FastAPI'] },
    { tag: 'Backend', title: 'Nexus API', desc: 'A high-throughput, horizontally-scalable backend powering real-time AI features with sub-100ms responses.', long: 'Event-driven architecture with async workers, caching, and rate-limiting. Built to serve model inference at scale without breaking a sweat.', stack: ['Python', 'PostgreSQL', 'Redis', 'Docker'] },
    { tag: 'Retrieval', title: 'Recall', desc: 'A RAG system that gives LLMs long-term, grounded memory over private knowledge with citations.', long: 'Chunking, hybrid search, and re-ranking feed a grounded generation layer that always cites sources — reducing hallucination on private corpora.', stack: ['RAG', 'Vector DB', 'Embeddings', 'LLMs'] },
  ];
  data.forEach((d, i) => {
    const el = document.createElement('article');
    el.className = 'core reveal';
    // Keyboard-operable: the card is the control that opens the detail modal
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', `${d.title} — ${d.tag}. Open project details`);
    el.innerHTML = `
      <span class="core__index">0${i + 1}</span>
      <span class="core__tag">${d.tag}</span>
      <h3 class="core__title">${d.title}</h3>
      <p class="core__desc">${d.desc}</p>
      <div class="core__stack">${d.stack.map((s) => `<span>${s}</span>`).join('')}</div>
      <span class="core__open">Access memory →</span>`;
    grid.appendChild(el);

    // 3D tilt + spotlight follow
    if (!prefersReduced && !isTouch) {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(900px) rotateY(${(px - 0.5) * 12}deg) rotateX(${(0.5 - py) * 12}deg) translateZ(6px)`;
        el.style.setProperty('--mx', px * 100 + '%');
        el.style.setProperty('--my', py * 100 + '%');
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    }
    el.addEventListener('click', () => openModal(d));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(d); }
    });
  });

  // Modal
  const modal = $('#modal'); const panel = $('#modalContent'); const closeBtn = $('#modalClose');
  const FOCUSABLE = 'a[href], button, input, [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;

  function openModal(d) {
    panel.innerHTML = `
      <span class="modal__tag">${d.tag}</span>
      <h3>${d.title}</h3>
      <p>${d.long}</p>
      <ul>${d.stack.map((s) => `<li>${s}</li>`).join('')}</ul>`;
    lastFocused = document.activeElement;
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // The panel is still `visibility: hidden` this tick — focus() would be a no-op.
    requestAnimationFrame(() => closeBtn.focus());
  }
  function close() {
    if (!modal.classList.contains('open')) return;
    modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) { lastFocused.focus(); lastFocused = null; }
  }
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { close(); return; }
    // Trap Tab inside the dialog while it's open
    if (e.key !== 'Tab' || !modal.classList.contains('open')) return;
    const items = $$(FOCUSABLE, modal).filter((n) => n.offsetParent !== null);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();

/* ---------------------------------------------------------------
   9) CONTACT — interactive AI terminal
   --------------------------------------------------------------- */
(function terminal() {
  const body = $('#termBody'); const form = $('#termForm'); const field = $('#termField');
  if (!body || !form) return;
  const print = (text, cls = 'sys') => {
    const p = document.createElement('p'); p.className = cls; p.textContent = text;
    body.appendChild(p); body.scrollTop = body.scrollHeight;
  };
  const typePrint = (text) => new Promise((res) => {
    if (prefersReduced) { print(text); return res(); }
    const p = document.createElement('p'); p.className = 'sys'; body.appendChild(p);
    let i = 0; const t = setInterval(() => {
      p.textContent = text.slice(0, ++i); body.scrollTop = body.scrollHeight;
      if (i >= text.length) { clearInterval(t); res(); }
    }, 14);
  });
  const LINKS = {
    github:   'https://github.com/Sajid0875',
    linkedin: 'https://www.linkedin.com/in/sajid-islam0875/',
    medium:   'https://medium.com/@sajidislam0875',
    hashnode: 'https://hashnode.com/@sajid0875',
    devto:    'https://dev.to/sajid0875',
  };
  const EMAIL = 'hello@sajidislam.dev'; // TODO: replace with your real address

  const commands = {
    help:    'available commands: about · skills · projects · writing · links · github · linkedin · medium · hashnode · devto · contact · email · resume · clear',
    about:   'Sajid Islam — CS student, AI & agentic-AI engineer, backend developer, future founder. Mission: AI that solves meaningful real-world problems.',
    skills:  'core: LLMs & agents, Python, PyTorch, backend APIs, RAG, vector DBs, Docker.',
    projects:'Orchestra (agents) · Insight Engine (ML) · Nexus API (backend) · Recall (RAG). Scroll up to open a memory core.',
    writing: `I write at medium (${LINKS.medium}), hashnode (${LINKS.hashnode}), and dev.to (${LINKS.devto}). type a platform name to open it.`,
    links:   `github: ${LINKS.github} · linkedin: ${LINKS.linkedin} · medium: ${LINKS.medium} · hashnode: ${LINKS.hashnode} · dev.to: ${LINKS.devto}`,
    contact: `email: ${EMAIL} · type "links" for every profile, or use the buttons below.`,
    email:   `opening mail client → ${EMAIL}`,
    resume:  'fetching résumé → assets/resume/Sajid_Islam_Resume.pdf',
  };
  (async function greet() {
    await typePrint('SYNAPSE channel established.');
    await typePrint("You're speaking with Sajid's system. Type \"help\" to begin.");
  })();
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const raw = field.value.trim(); if (!raw) return;
    print(raw, 'you'); field.value = '';
    const cmd = raw.toLowerCase();
    if (cmd === 'clear') { body.innerHTML = ''; return; }
    if (cmd === 'email') { await typePrint(commands.email); window.location.href = `mailto:${EMAIL}`; return; }
    if (cmd === 'resume') { await typePrint(commands.resume); window.open('assets/resume/Sajid_Islam_Resume.pdf', '_blank', 'noopener'); return; }
    // Profile shortcuts: "github", "dev.to", "linkedin", …
    const key = cmd.replace(/[.\s]/g, '') === 'devto' ? 'devto' : cmd;
    if (LINKS[key]) {
      await typePrint(`opening ${key} → ${LINKS[key]}`);
      window.open(LINKS[key], '_blank', 'noopener');
      return;
    }
    if (commands[cmd]) { await typePrint(commands[cmd]); }
    else { await typePrint(`command not found: "${raw}". type "help" for options.`); }
  });
})();

/* ---------------------------------------------------------------
   10) MISC — footer year
   --------------------------------------------------------------- */
$('#year').textContent = new Date().getFullYear();
