document.addEventListener('DOMContentLoaded', () => {
  
  /* ----------------------------------------------------
     1. LOADER & RANDOMIZED CODE SIMULATION
     ---------------------------------------------------- */
  const rail = document.getElementById('code-rail');
  const LINES = 20;

  // Define 3 different styles of code generation
  const themes = [
    // THEME 1: System Boot / Kernel (Hex & Low Level)
    () => {
      const sysOps = ['sys.init', 'mem_alloc', 'kernel.load', 'cpu.check', 'drv.mount', 'bus.write'];
      const hex = () => Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0');
      return `> ${sysOps[Math.floor(Math.random() * sysOps.length)]}(0x${hex()})`;
    },

    // THEME 2: AI/ML Training (Epochs & Tensors)
    () => {
      if (Math.random() > 0.7) {
        // Show metrics occasionally
        const loss = (Math.random() * 0.5).toFixed(4);
        const acc = (0.85 + Math.random() * 0.14).toFixed(4);
        return `> Epoch: ${Math.floor(Math.random() * 100)} | loss: ${loss} | acc: ${acc}`;
      }
      const aiOps = ['Loading Tensor', 'Optimizing weights', 'Backprop...', 'Drop_out layer', 'Tokenizing data'];
      return `> ${aiOps[Math.floor(Math.random() * aiOps.length)]}...`;
    },

    // THEME 3: Network & API (Requests & DB)
    () => {
      const verbs = ['GET', 'POST', 'CONNECT', 'AUTH', 'PING'];
      const eps = ['/api/v1/user', '/db/shard_04', '192.168.0.1', '/auth/handshake', 'gateway.js'];
      const status = Math.random() > 0.1 ? '200 OK' : '403 PENDING';
      return `> ${verbs[Math.floor(Math.random() * verbs.length)]} ${eps[Math.floor(Math.random() * eps.length)]} [${status}]`;
    }
  ];

  // Randomly select ONE theme for this loading session
  const activeThemeGenerator = themes[Math.floor(Math.random() * themes.length)];
  
  function makeLine() {
    const el = document.createElement('div');
    el.className = 'code-line';
    // Use the selected generator
    el.innerText = activeThemeGenerator();
    return el;
  }

  // Fill initial screen
  for(let i=0; i<LINES; i++) rail.appendChild(makeLine());
  
  // Animate lines
  const ticker = setInterval(() => {
    rail.insertBefore(makeLine(), rail.firstChild);
    if(rail.children.length > LINES) rail.removeChild(rail.lastChild);
  }, 200);

  // Stop loader after 2.5s
  setTimeout(() => {
    document.body.classList.add('loaded');
    clearInterval(ticker);
    startTyping(); 
  }, 2500);


  /* ----------------------------------------------------
     2. NAVIGATION VIEW SWITCHER
     ---------------------------------------------------- */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
    const sectionOrder = ['home', 'about', 'portfolio', 'experience', 'contact'];
    let isPaging = false;
    const PAGE_DELAY = 700; // ms between page switches

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      if (href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          sections.forEach(sec => sec.classList.remove('active-section'));
          targetSection.classList.add('active-section');
          // Update active nav highlighting
          navLinks.forEach(n => n.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  });

  // Set initial active state on Home
  const homeLink = document.querySelector('.nav-link[href="#home"]');
  if (homeLink) homeLink.classList.add('active');

  // Fullpage scroll: switch between sections on mouse wheel
  function getCurrentIndex() {
    const active = document.querySelector('section.active-section');
    const id = active ? active.id : 'home';
    const idx = sectionOrder.indexOf(id);
    return idx >= 0 ? idx : 0;
  }

  function activateIndex(idx) {
    const clamped = Math.max(0, Math.min(sectionOrder.length - 1, idx));
    const targetId = sectionOrder[clamped];
    const targetSection = document.getElementById(targetId);
    if (!targetSection) return;
    sections.forEach(sec => sec.classList.remove('active-section'));
    targetSection.classList.add('active-section');
    // nav highlight
    navLinks.forEach(n => n.classList.remove('active'));
    const targetLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
    if (targetLink) targetLink.classList.add('active');
  }

  window.addEventListener('wheel', (e) => {
    // Intercept wheel to paginate between sections smoothly
    if (isPaging) return;
    const dy = e.deltaY || 0;
    if (Math.abs(dy) < 5) return; // ignore tiny scrolls
    e.preventDefault();
    isPaging = true;
    const cur = getCurrentIndex();
    const next = dy > 0 ? cur + 1 : cur - 1;
    activateIndex(next);
    setTimeout(() => { isPaging = false; }, PAGE_DELAY);
  }, { passive: false });


  /* ----------------------------------------------------
     3. TYPING EFFECT
     ---------------------------------------------------- */
  function startTyping() {
    const roles = ['CSE Undergrad', 'AI Engineer', 'Gamer'];
    const el = document.getElementById('typed-roles');
    let roleIdx = 0, charIdx = 0, isDeleting = false;
    
    function type() {
      const current = roles[roleIdx];
      el.textContent = current.substring(0, charIdx);
      
      if (!isDeleting && charIdx < current.length) {
        charIdx++;
        setTimeout(type, 100);
      } else if (isDeleting && charIdx > 0) {
        charIdx--;
        setTimeout(type, 50);
      } else {
        isDeleting = !isDeleting;
        if (!isDeleting) roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(type, isDeleting ? 1000 : 500);
      }
    }
    type();
  }


  /* ----------------------------------------------------
     4. ABOUT TABS LOGIC
     ---------------------------------------------------- */
  const tabBtns = document.querySelectorAll('.about-tab-btn');
  const tabPanels = document.querySelectorAll('.about-tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      tabPanels.forEach(panel => panel.style.display = 'none');
      
      const target = btn.getAttribute('data-tab');
      document.getElementById(target).style.display = 'block';

      // If the tab with progress bars is shown, animate them
      if (target === 'others' || target === 'skills') {
        animateSkillBars();
      }
    });
  });

  // Trigger animation if Others (or Skills) is initially visible via hash navigation
  if (document.querySelector('#others').style.display === 'block' ||
      document.querySelector('#skills').style.display === 'block') {
    animateSkillBars();
  }

  function animateSkillBars() {
    const rows = document.querySelectorAll('.skill-row');
    rows.forEach(row => {
      const percent = row.getAttribute('data-percent');
      const fill = row.querySelector('.skill-fill');
      if (fill) {
        // Kick off transition to target percentage
        requestAnimationFrame(() => {
          fill.style.width = percent + '%';
        });
      }
    });
  }
});