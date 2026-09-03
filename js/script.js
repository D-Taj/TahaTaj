/* ==========================================================================
   TAHA TAJ — SITE SCRIPT
   1. Loading screen  → hidden once the page is ready.
   2. i18n            → English by default; the language button swaps every
                         [data-i18n] string and flips direction to Persian.
   3. Portfolio data  → rendered into the DOM (edit the WORK array to add
                         or remove a project; each item re-renders in the
                         current language automatically).
   4. Island nav       → expanding pill menu (from Animation 1).
   5. Magnetic buttons → hover-follow effect (from Animation 2).
   ========================================================================== */

let currentLang = "en";
document.addEventListener('contextmenu', e => e.preventDefault());


document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initLangToggle(); // also does the first renderWork() call, in the saved language
  initIslandNav();
  initMagneticButtons();
  initScrollReveal();
  initAnchorButtons();
});

/* --------------------------------------------------------------------------
   1. LOADING SCREEN
   -------------------------------------------------------------------------- */
function initLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;
  const hide = () => loader.classList.add("is-hidden");
  // Wait for full load (fonts/images/GSAP), but never make someone wait
  // more than ~1.2s on a fast connection — this is a polish animation,
  // not a real progress bar.
  const minDelay = new Promise((resolve) => setTimeout(resolve, 600));
  const pageReady = new Promise((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", resolve, { once: true });
  });
  Promise.all([minDelay, pageReady]).then(hide);
}

/* --------------------------------------------------------------------------
   2. i18n — English (default) / Persian
   Edit the dictionaries below to change any wording. Keys match the
   data-i18n="..." attributes in index.html.
   -------------------------------------------------------------------------- */
const I18N = {
  en: {
    "nav.home": "Home",
    "nav.work": "Work",
    "nav.contact": "Contact",
    "nav.test": "Test",
    "hero.eyebrow": "Web designer, programmer, penetration tester",
    "hero.about": "Full-Stack Web Development, Application Design and Development, Penetration Testing and Ethical Hacking, Python and C Development, Robotics and Electronics, Linux Administration, and Kali Linux.",
    "hero.cta.work": "See my work",
    "hero.cta.contact": "Contact me",
    "skills.title": "Skills",
    "skills.web": "Web design",
    "skills.hack": "Hacking & security",
    "skills.linux": "Linux",
    "skills.kali": "Kali Linux",
    "skills.arduino": "Arduino",
    "skills.kotlin": "Kotlin",
    "skills.python": "Python",
    "skills.c": "C",
    "work.eyebrow": "Selected work",
    "work.title": "A few things I've built",
    "work.desc": "Scroll sideways to browse. Swap in real projects any time.",
    "work.more": "View more and video on YouTube →",
    "contact.eyebrow": "Let's talk",
    "contact.title": "Get in touch",
    "contact.telegram": "Telegram / Bale",
    "contact.youtube": "YouTube",
    "contact.linkedin": "Linkedin",
    "contact.email": "Email",
    "contact.emailSoon": "mrtahataj@gmail.com",
    "footer.rights": "All rights reserved.",
  },
  fa: {
    "nav.home": "خانه",
    "nav.work": "نمونه‌کارها",
    "nav.contact": "ارتباط",
    "nav.test": "آزمایش",
    "hero.eyebrow": "طراح وب ، برنامه نویس ، تست نفوذ",
    "hero.about": "توسعه وب به صورت فول استک، طراحی و توسعه اپلیکیشن، تست نفوذ و هک اخلاقی، توسعه پایتون و سی، رباتیک و الکترونیک، مدیریت لینوکس و کالی لینوکس.",
    "hero.cta.work": "نمونه‌کارها",
    "hero.cta.contact": "تماس با من",
    "skills.title": "مهارت‌ها",
    "skills.web": "طراحی سایت",
    "skills.hack": "هک و امنیت",
    "skills.linux": "لینوکس",
    "skills.kali": "کالی لینوکس",
    "skills.arduino": "آردوینو",
    "skills.kotlin": "کاتلین",
    "skills.python": "پایتون",
    "skills.c": "سی",
    "work.eyebrow": "نمونه‌کارهای منتخب",
    "work.title": "چند تا از کارهایی که ساختم",
    "work.desc": "برای دیدن بقیه، به‌صورت افقی اسکرول کن.",
    "work.more": "مشاهده‌ی بیشتر و ویدئو در یوتیوب←",
    "contact.eyebrow": "بیا صحبت کنیم",
    "contact.title": "در ارتباط باش",
    "contact.telegram": "تلگرام / بله",
    "contact.youtube": "یتیوب",
    "contact.linkedin": "لینکدین",
    "contact.email": "ایمیل",
    "contact.emailSoon": "mrtahataj@gmail.com",
    "footer.rights": "تمامی حقوق محفوظ است.",
  },
};

// hero.title uses innerHTML because it contains a <span class="accent">.
const I18N_HTML = {
  en: { "hero.title": 'Hi, I\'m <span class="accent">Taha Taj</span>' },
  fa: { "hero.title": 'سلام، من <span class="accent">طاها تاج</span> هستم' },
};

function applyLang(lang) {
  currentLang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (I18N[lang][key]) el.textContent = I18N[lang][key];
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.dataset.i18nHtml;
    if (I18N_HTML[lang][key]) el.innerHTML = I18N_HTML[lang][key];
  });

  const root = document.getElementById("html-root");
  root.lang = lang;
  root.dir = lang === "fa" ? "rtl" : "ltr";

  const toggleBtn = document.getElementById("langToggle");
  if (toggleBtn) toggleBtn.textContent = lang === "fa" ? "EN" : "FA";

  try { localStorage.setItem("site-lang", lang); } catch (e) { /* private mode etc. — safe to ignore */ }

  renderWork(); // portfolio text is bilingual too, re-render in the new language
}

function initLangToggle() {
  const btn = document.getElementById("langToggle");
  let saved = "en";
  try { saved = localStorage.getItem("site-lang") || "en"; } catch (e) { /* ignore */ }
  applyLang(saved);
  if (btn) btn.addEventListener("click", () => applyLang(currentLang === "fa" ? "en" : "fa"));
}

/* --------------------------------------------------------------------------
   3. PORTFOLIO DATA — edit this array to add or remove a project. Each
   item has an English and Persian title, an image, and an (optional,
   currently empty) link.
   -------------------------------------------------------------------------- */
const WORK = [
  {
    en: { title: "Sample" },
    fa: { title: "نمونه" },
    image: "assets/work/project-01.webp",
    link: "assets/work/project-01.webp",
  },
  {
    en: { title: "Jammer" },
    fa: { title: "جمر" },
    image: "assets/work/project-02.webp",
    link: "assets/work/project-02.webp",
  },
  {
    en: { title: "Admin Panel" },
    fa: { title: "پنل مدیریت" },
    image: "assets/work/project-03.webp",
    link: "assets/work/project-03.webp",
  },
  {
    en: { title: "Smart robot" },
    fa: { title: "ربات هوشمند" },
    image: "assets/work/project-04.webp",
    link: "assets/work/project-04.webp",
  },

  {
    en: { title: "Game console" },
    fa: { title: "کنسول بازی" },
    image: "assets/work/project-05.webp",
    link: "assets/work/project-05.webp",
  },

  {
    en: { title: "Article site" },
    fa: { title: "سایت مقاله " },
    image: "assets/work/project-06.webp",
    link: "assets/work/project-06.webp",
  },

  {
    en: { title: "Mini robot" },
    fa: { title: "مینی ربات" },
    image: "assets/work/project-07.webp",
    link: "assets/work/project-07.webp",
  },

  {
    en: { title: "3D design" },
    fa: { title: "طراحی سه بعدی" },
    image: "assets/work/project-08.webp",
    link: "assets/work/project-08.webp",
  },

  {
    en: { title: "Website design" },
    fa: { title: "طراحی سایت" },
    image: "assets/work/project-09.webp",
    link: "assets/work/project-09.webp",
  },

  {
    en: { title: "School website" },
    fa: { title: "سایت مدرسه" },
    image: "assets/work/project-10.webp",
    link: "assets/work/project-10.webp",
  },

  {
    en: { title: "Android programming" },
    fa: { title: "برنامه‌نویسی اندروید" },
    image: "assets/work/project-11.webp",
    link: "assets/work/project-11.webp",
  },

  {
    en: { title: "3D design of catia" },
    fa: { title: "طراحی سه بعدی کتیا" },
    image: "assets/work/project-12.webp",
    link: "assets/work/project-12.webp",
  },
];

// Shown instead of a broken-image icon whenever a photo file isn't there yet.
const IMG_FALLBACK = 'this.onerror=null;this.src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'300\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%230d1416\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' fill=\'%234d5f5e\' font-family=\'sans-serif\' font-size=\'16\' text-anchor=\'middle\'%3EAdd photo%3C/text%3E%3C/svg%3E"';

function renderWork() {
  const track = document.getElementById("work-track");
  if (!track) return;
  track.innerHTML = WORK.map((item) => {
    const t = item[currentLang] || item.en;
    return `
    <a class="work-card mag-zone" href="${item.link || '#'}" ${item.link ? 'target="_blank" rel="noopener"' : ''}>
      <div class="work-thumb">
        <img src="${item.image}" alt="${t.title}" loading="lazy" onerror="${IMG_FALLBACK}" />
      </div>
      <p class="work-title">${t.title}</p>
    </a>
  `;
  }).join("");
}

/* --------------------------------------------------------------------------
   4. ANCHOR BUTTONS — hero CTA buttons smooth-scroll like nav links do.
   -------------------------------------------------------------------------- */
function initAnchorButtons() {
  document.querySelectorAll(".mag-btn[data-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.querySelector(btn.dataset.target);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
}

/* --------------------------------------------------------------------------
   5. ISLAND NAVIGATION — adapted from the "Orchestrated easeReverse" demo.
   Expands on click, scrolls to the target section, closes itself again.
   -------------------------------------------------------------------------- */
function initIslandNav() {
  const island = document.querySelector(".island");
  const menuBtn = document.getElementById("menuToggle");
  const backdrop = document.querySelector(".menu-backdrop");
  if (!island || !menuBtn || typeof gsap === "undefined") return;

  let isOpen = false;
  const expandedWidth = Math.min(window.innerWidth * 0.9, 190);

  gsap.set(".menu-overlay", { pointerEvents: "none" });

  const tl = gsap.timeline({ paused: true })
    .set(".menu-overlay", { pointerEvents: "auto" })
    .to(".island", { width: expandedWidth, duration: 0.7, ease: "back.out(1.8)", easeReverse: "power2.out" }, 0)
    .to(".island-logo", { opacity: 1, duration: 0.4, ease: "power2.out", easeReverse: "power2.out" }, 0.1)
    .to(".bar-mid", { opacity: 0, duration: 0.15, ease: "power2.in" }, 0)
    .to(".bar-top", { attr: { x1: 3, y1: 3, x2: 13, y2: 13 }, duration: 0.28, ease: "power3.inOut" }, 0)
    .to(".bar-bot", { attr: { x1: 13, y1: 3, x2: 3, y2: 13 }, duration: 0.28, ease: "power3.inOut" }, 0)
    .to(".menu-backdrop", { opacity: 1, duration: 0.3, ease: "power2.out" }, 0)
    .set(".menu-panel", { visibility: "visible" }, 0.05)
    .from(".menu-panel", { autoAlpha: 0, yPercent: -8, scale: 0.7, duration: 0.7, transformOrigin: "top center", ease: "back.out(1.8)", easeReverse: "power3.out" }, 0.08)
    .from(".menu-link", { opacity: 0, y: 6, duration: 0.3, ease: "power2.out", stagger: 0.05 }, 0.2);

  function openMenu() {
    isOpen = true;
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.setAttribute("aria-label", "Close navigation menu");
    document.querySelectorAll(".menu-link").forEach((l) => l.setAttribute("tabindex", "0"));
    tl.timeScale(1).play();
  }

  function closeMenu() {
    isOpen = false;
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open navigation menu");
    document.querySelectorAll(".menu-link").forEach((l) => l.setAttribute("tabindex", "-1"));
    tl.eventCallback("onReverseComplete", () => gsap.set(".menu-overlay", { pointerEvents: "none" }));
    tl.timeScale(1).reverse();
  }

  menuBtn.addEventListener("click", () => (isOpen ? closeMenu() : openMenu()));
  backdrop.addEventListener("click", () => isOpen && closeMenu());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) { closeMenu(); menuBtn.focus(); }
  });

  // Smooth-scroll to the matching section, then close the menu.
  document.querySelectorAll(".menu-link[data-target]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.dataset.target);
      if (isOpen) closeMenu();
      if (target) {
        setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), isOpen ? 200 : 0);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. MAGNETIC BUTTONS — adapted from the "GSAP Dynamic Tweens" demo.
   Applies to every element with the `.mag-zone` class (CTA buttons and
   portfolio cards alike).
   -------------------------------------------------------------------------- */
function initMagneticButtons() {
  if (typeof gsap === "undefined") return;
  const strength = 0.28;

  // Re-run whenever the portfolio re-renders (language switch), since
  // those cards are recreated each time.
  function bind(zone) {
    const target = zone.classList.contains("work-card") ? zone : zone.querySelector(".mag-btn") || zone;

    zone.addEventListener("mousemove", (e) => {
      const rect = zone.getBoundingClientRect();
      const x = gsap.utils.mapRange(rect.left, rect.right, -rect.width / 2, rect.width / 2, e.clientX);
      const y = gsap.utils.mapRange(rect.top, rect.bottom, -rect.height / 2, rect.height / 2, e.clientY);
      gsap.to(target, { x: x * strength, y: y * strength, duration: 0.4, ease: "power2.out", overwrite: "auto" });
    });

    zone.addEventListener("mouseleave", () => {
      gsap.to(target, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)", overwrite: "auto" });
    });
  }

  document.querySelectorAll(".mag-zone").forEach(bind);

  // Portfolio cards are rebuilt on every language switch, so re-bind then.
  const track = document.getElementById("work-track");
  if (track) {
    const observer = new MutationObserver(() => {
      track.querySelectorAll(".mag-zone").forEach(bind);
    });
    observer.observe(track, { childList: true });
  }
}

/* --------------------------------------------------------------------------
   7. SCROLL REVEAL — light fade/rise-in for sections and cards.
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 24,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });
}
