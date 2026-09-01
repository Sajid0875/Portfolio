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
   1) NAV — scrolled state, mobile menu, scroll progress
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
   2) HERO PLATE — subtle parallax on the drafted figure
   --------------------------------------------------------------- */
(function heroPlate() {
  const core = $('#heroCore');
  if (!core || prefersReduced || isTouch) return;
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 14;
    const y = (e.clientY / window.innerHeight - 0.5) * 14;
    core.style.transform = `translateY(-50%) translate3d(${x}px, ${y}px, 0)`;
  }, { passive: true });
})();

/* ---------------------------------------------------------------
   5) HERO — rotating role typer
   --------------------------------------------------------------- */
(function roleTyper() {
  const el = $('#heroRoles'); if (!el) return;
  const roles = ['AI Engineer', 'Agentic AI Developer', 'Backend Engineer', 'ML Enthusiast'];
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
    { label: 'Math Foundations', tag: 'algebra · calculus', x: 50, y: 10 },
    { label: 'Transformers', tag: 'self-attention', x: 72, y: 18 },
    { label: 'LLMs', tag: 'GPT · BERT', x: 86, y: 38 },
    { label: 'Fine-Tuning', tag: 'PEFT', x: 86, y: 62 },
    { label: 'Alignment', tag: 'RLHF', x: 72, y: 82 },
    { label: 'Agentic AI', tag: 'ReAct · multi-agent', x: 50, y: 90 },
    { label: 'RAG', tag: 'agentic RAG', x: 28, y: 82 },
    { label: 'LLMOps', tag: 'deploy · CI/CD', x: 14, y: 62 },
    { label: 'Prompt Engineering', tag: 'CoT reasoning', x: 14, y: 38 },
    { label: 'Python', tag: 'language', x: 28, y: 18 },
  ];
  // Build DOM nodes
  data.forEach((d, i) => {
    const li = document.createElement('li');
    // 'hub' (not 'core') — `.core` is the project-card class; sharing it collided
    li.className = 'skill-node' + (d.core ? ' hub' : '');
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
  // Drawn as ink on paper: hairline rules from the hub, darker when traced.
  function drawLines() {
    ctx.clearRect(0, 0, stage.clientWidth, stage.clientHeight);
    const hub = pos(data[0]);
    data.slice(1).forEach((d) => {
      const p = pos(d);
      const active = d.el.classList.contains('active');
      ctx.strokeStyle = active ? 'rgba(27,46,216,0.55)' : 'rgba(22,24,28,0.18)';
      ctx.lineWidth = active ? 1.5 : 1;
      ctx.beginPath(); ctx.moveTo(hub.x, hub.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    });
  }
  // Redraw on demand rather than on a permanent rAF loop
  const redraw = () => requestAnimationFrame(drawLines);
  list.addEventListener('mouseover', (e) => { const n = e.target.closest('.skill-node'); if (n) { n.classList.add('active'); redraw(); } });
  list.addEventListener('mouseout', (e) => { const n = e.target.closest('.skill-node'); if (n) { n.classList.remove('active'); redraw(); } });
  window.addEventListener('resize', () => { resize(); drawLines(); });
  resize(); drawLines();
})();

/* ---------------------------------------------------------------
   8) PROJECTS — memory cores, 3D tilt, and detail modal
   --------------------------------------------------------------- */
(function projects() {
  const grid = $('#projectGrid'); if (!grid) return;
  const data = [
    { tag: 'Agentic AI', title: 'WhatsApp Commerce Copilot', desc: 'An AI-powered WhatsApp commerce platform — auto-replies, instant human handoff, and live stock management from a modern dashboard.', long: 'A full commerce copilot for WhatsApp: a React/Vite dashboard talks to a Python/FastAPI backend and the Evolution API gateway to run a store over chat. AI auto-replies (optional LangChain + Gemini) answer catalog questions against store-scoped products, a one-tap Human Mode hands the conversation to a person, and real-time stock edits sync live across the platform. Fully containerised — the whole backend stack (Redis, gateway, database) spins up with a single Docker command.', stack: ['React', 'FastAPI', 'LangChain', 'Redis', 'Docker'], link: 'https://github.com/comebck-pakistan/cohort-1-squad-margalla/tree/main/whatsapp-commerce-copilot' },
    { tag: 'Data Systems', title: 'Adaptive Data Preservation', desc: 'An entropy-aware DBMS that scores state snapshots and automatically decides whether to discard, compress, preserve, or archive them.', long: 'A "Universe State Compression & Entropy-Aware Data Preservation" system: it tracks state snapshots, records every change, and computes an entropy score per snapshot to drive an automated preservation decision engine — discard, compress, preserve, or archive. Built on PostgreSQL with PL/pgSQL functions, triggers, and views, a PHP 8 backend, and a Chart.js dashboard, plus integrity verification, audit logging, snapshot comparison, and export. Ships with Docker Compose for a one-command PHP + PostgreSQL environment.', stack: ['PHP', 'PostgreSQL', 'PL/pgSQL', 'Chart.js', 'Docker'], link: 'https://github.com/Sajid0875/adaptive-data-preservation' },
    { tag: 'Completed · 8 Weeks', title: 'GIKI-SkyLabs AI Bootcamp', desc: 'An 8-week intensive taking me from the math of modern AI to deploying autonomous agents — completed end to end.', long: 'An 8-week journey from first principles to production agents: Weeks 1–2 build the mathematical foundations (linear algebra, calculus, probability, information theory, convex optimization) behind attention and training; Weeks 3–4 cover NLP and transformer architectures (self-attention, BERT, GPT) with hands-on fine-tuning, pretraining, and scaling laws; Week 5 goes into post-training and alignment (instruction tuning, RLHF/RLAIF, PEFT, and Chain/Tree/Graph-of-Thought reasoning); Week 6 covers agentic AI (ReAct, tool-using agents, memory, multi-agent orchestration) and advanced RAG; Week 7 is inference and deployment (ML/LLMOps — versioning, CI/CD, serving, observability, cost and security); and Week 8 is a capstone building and deploying an autonomous agent system. Completed the full program end to end, capping it with a capstone autonomous agent system.', stack: ['Python', 'Transformers', 'RLHF', 'Agentic AI', 'LLMOps'] },
  ];
  data.forEach((d, i) => {
    const el = document.createElement('article');
    el.className = 'core reveal';
    // Keyboard-operable: the card is the control that opens the detail modal
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', `${d.title} — ${d.tag}. Open project details`);
    el.innerHTML = `
      <span class="core__tag">${d.tag}</span>
      <h3 class="core__title">${d.title}</h3>
      <p class="core__desc">${d.desc}</p>
      <div class="core__stack">${d.stack.map((s) => `<span>${s}</span>`).join('')}</div>
      <span class="core__open">Access memory →</span>`;
    grid.appendChild(el);

    el.addEventListener('click', () => openModal(d));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(d); }
    });
  });

  // The global reveal observer ran before these cards existed, so reveal them here.
  const cards = $$('.core', grid);
  if (prefersReduced || !('IntersectionObserver' in window)) {
    cards.forEach((c) => c.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    cards.forEach((c) => io.observe(c));
  }

  // Modal
  const modal = $('#modal'); const panel = $('#modalContent'); const closeBtn = $('#modalClose');
  const FOCUSABLE = 'a[href], button, input, [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;

  function openModal(d) {
    panel.innerHTML = `
      <span class="modal__tag">${d.tag}</span>
      <h3>${d.title}</h3>
      <p>${d.long}</p>
      <ul>${d.stack.map((s) => `<li>${s}</li>`).join('')}</ul>
      ${d.link ? `<a class="btn btn--primary modal__link" href="${d.link}" target="_blank" rel="noopener">View on GitHub →</a>` : ''}`;
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
  const EMAIL = 'sajidislam0875@gmail.com';

  const commands = {
    help:    'available commands: about · skills · projects · writing · links · github · linkedin · medium · hashnode · devto · contact · email · resume · clear',
    about:   'Sajid Islam — CS student, AI & agentic-AI engineer, backend developer. Mission: AI that solves meaningful real-world problems.',
    skills:  'core: math foundations, transformers, LLMs, fine-tuning (PEFT), alignment (RLHF), prompt engineering, agentic AI, RAG, LLMOps, Python.',
    projects:'WhatsApp Commerce Copilot (agentic AI) · Adaptive Data Preservation (data systems) · Agentic Systems Bootcamp (in progress). Scroll up to open a memory core.',
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
