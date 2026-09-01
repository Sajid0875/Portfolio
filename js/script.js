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
   6) REVEAL ON SCROLL
   A plain scroll sweep rather than IntersectionObserver: content that fails to
   reveal is invisible content, so this trades a little efficiency for a path
   that cannot silently leave a section blank. rAF-throttled, the pending list
   shrinks as it goes, and the listeners detach once everything is shown.
   --------------------------------------------------------------- */
(function reveals() {
  let pending = $$('.reveal');
  if (!pending.length) return;
  if (prefersReduced) { pending.forEach((e) => e.classList.add('in')); return; }

  const sweep = () => {
    let shown = 0;
    pending = pending.filter((el) => {
      const r = el.getBoundingClientRect();
      // Trigger a little before the element is fully on screen.
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
        setTimeout(() => el.classList.add('in'), shown++ * 60);
        return false;
      }
      return true;
    });
    if (!pending.length) {
      window.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', onScroll);
    }
  };

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; sweep(); });
  }
  // Capture phase: `body` carries overflow-y:auto, so the scroll may originate
  // on an element rather than the window. Capture sees both.
  window.addEventListener('scroll', onScroll, { passive: true, capture: true });
  window.addEventListener('resize', onScroll, { passive: true });
  sweep();
  // Late webfont/layout shifts can move elements into view without a scroll.
  window.addEventListener('load', sweep);
})();

/* ---------------------------------------------------------------
   7) SKILLS — technology ecosystem (nodes + drawn synapses)
   --------------------------------------------------------------- */
(function skills() {
  const stage = $('.skills__stage'); const list = $('#skillNodes'); const canvas = $('#skillsCanvas');
  if (!stage || !list || !canvas) return;
  const ctx = canvas.getContext('2d');
  // Nodes are authored in the HTML (so crawlers and AI agents can read them as
  // text); this module only positions them and draws the synapses between.
  const data = $$('.skill-node', list).map((el, i) => {
    const x = Number(el.dataset.x), y = Number(el.dataset.y);
    el.style.left = x + '%'; el.style.top = y + '%';
    el.style.setProperty('--dur', (5 + (i % 4)) + 's');
    return { x, y, el };
  });
  if (!data.length) return;
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
  // Cards are authored in the HTML so search engines and AI agents can read the
  // full project text without running JavaScript. This module only makes them
  // keyboard-operable and wires each one to the detail modal.
  $$('.core', grid).forEach((el) => {
    const title = $('.core__title', el).textContent.trim();
    const tag = $('.core__tag', el).textContent.trim();
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', `${title} — ${tag}. Open project details`);
    el.addEventListener('click', () => openModal(el));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(el); }
    });
  });

  // Modal
  const modal = $('#modal'); const panel = $('#modalContent'); const closeBtn = $('#modalClose');
  const FOCUSABLE = 'a[href], button, input, [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;

  // Built from the card's own markup, so the modal and the crawlable page
  // content can never drift apart.
  function openModal(card) {
    const long = $('.core__long', card);
    const repo = card.dataset.repo;
    const stack = $$('.core__stack span', card).map((s) => s.textContent);
    panel.innerHTML = `
      <span class="modal__tag">${$('.core__tag', card).textContent}</span>
      <h3>${$('.core__title', card).textContent}</h3>
      ${long ? long.innerHTML : ''}
      <ul>${stack.map((s) => `<li>${s}</li>`).join('')}</ul>
      ${repo ? `<a class="btn btn--primary modal__link" href="${repo}" target="_blank" rel="noopener">View project source on GitHub →</a>` : ''}`;
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
    kaggle:   'https://www.kaggle.com/sajid75',
  };
  const EMAIL = 'sajidislam0875@gmail.com';

  const commands = {
    help:    'available commands: about · education · experience · skills · projects · writing · links · github · linkedin · kaggle · medium · hashnode · devto · contact · email · resume · clear',
    about:   'Sajid Islam — Computer Science undergraduate at FAST NUCES, Pakistan, and an AI engineer building generative and agentic AI systems: LLM agents, RAG pipelines, and Python backends.',
    education: 'BS Computer Science, FAST National University of Computing and Emerging Sciences (NUCES), Pakistan — Aug 2024 to expected May 2028. Also completed the GIKI × Skylabs Advanced AI Bootcamp (2026).',
    experience: 'Data / IT Intern at Inter-Services Public Relations (ISPR), Pakistan Army (Jan–Feb 2026), Peshawar — data pipelines and IT operations. Shipped an agentic AI copilot in Comebck Pakistan Cohort 1 (Top 5 of cohort).',
    skills:  'AI & agents: LangChain, OpenAI & Anthropic APIs, RAG pipelines, vector DBs (FAISS, Chroma), prompt engineering, n8n. ML: Python, Pandas, NumPy, scikit-learn, TensorFlow, Keras, OpenCV. Backend: PostgreSQL, MySQL, MongoDB, FastAPI, ETL. Languages: Python, C++, Java, PHP, JavaScript.',
    projects:'WhatsApp Commerce Copilot (agentic AI, Top 5 of Comebck Pakistan Cohort 1) · Entropy-Aware Data Preservation System (PostgreSQL ETL) · GIKI × Skylabs Advanced AI Bootcamp (completed). Scroll up to open a memory core.',
    writing: `I write at medium (${LINKS.medium}), hashnode (${LINKS.hashnode}), and dev.to (${LINKS.devto}). type a platform name to open it.`,
    links:   `github: ${LINKS.github} · linkedin: ${LINKS.linkedin} · kaggle: ${LINKS.kaggle} · medium: ${LINKS.medium} · hashnode: ${LINKS.hashnode} · dev.to: ${LINKS.devto}`,
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
