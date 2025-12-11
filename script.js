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
	for (let i = 0; i < LINES; i++) rail.appendChild(makeLine());

	// Animate lines
	const ticker = setInterval(() => {
		rail.insertBefore(makeLine(), rail.firstChild);
		if (rail.children.length > LINES) rail.removeChild(rail.lastChild);
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

	// Removed wheel-driven pagination per request; navigation works via clicks only.


	/* ----------------------------------------------------
		 3. TYPING EFFECT
		 ---------------------------------------------------- */
	function startTyping() {
		const roles = ['CSE Undergrad', 'AI Engineer', 'Gamer'];
		const el = document.getElementById('typed-roles');
		let roleIdx = 0;
		let charIdx = 0;
		let isDeleting = false;

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

			tabPanels.forEach(panel => {
				panel.style.display = 'none';
			});

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
		const skillRows = document.querySelectorAll('.skill-row');
		skillRows.forEach(row => {
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

	/* ----------------------------------------------------
		 5. CONTACT FORM CUSTOM VALIDATION
		 ---------------------------------------------------- */
	const contactForm = document.querySelector('.contact-form');
	if (contactForm) {
		const fields = contactForm.querySelectorAll('input[required], textarea[required]');

		// Preserve original placeholders
		fields.forEach(f => {
			if (!f.dataset.origPlaceholder) {
				f.dataset.origPlaceholder = f.placeholder || '';
			}
		});

		// Clear error on focus/input
		fields.forEach(f => {
			const clearError = () => {
				f.classList.remove('field-error');
				f.placeholder = f.dataset.origPlaceholder;
				f.setCustomValidity('');
			};
			f.addEventListener('focus', clearError);
			f.addEventListener('input', clearError);
		});

		contactForm.addEventListener('submit', (e) => {
			let hasError = false;

			fields.forEach(f => {
				const value = f.value.trim();
				if (!value) {
					hasError = true;
					f.classList.add('field-error');
					f.placeholder = 'Please fill out this field';
					// prevent native tooltip
					f.setCustomValidity(' ');
				} else if (f.type === 'email') {
					// Simple email pattern check
					const ok = /.+@.+\..+/.test(value);
					if (!ok) {
						hasError = true;
						f.classList.add('field-error');
						f.placeholder = 'Enter a valid email';
						f.value = '';
						f.setCustomValidity(' ');
					}
				}
			});

			if (hasError) {
				e.preventDefault();
				// Focus first error field
				const firstErr = contactForm.querySelector('.field-error');
				if (firstErr) firstErr.focus();
			}
		});
	}
});
  

