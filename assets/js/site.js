const i18n = {
  zh: {
    name: "高昕阳",
    nameAlt: "Xinyang Gao",
    title: "博士研究生",
    affiliation: "北京大学",
    aboutHeading: "个人简介",
    researchHeading: "研究兴趣",
    pubHeading: "发表论文",
    wpHeading: "工作论文",
    cvHeading: "简历",
    contactHeading: "联系方式",
    linksHeading: "外部链接",
    emailLabel: "邮箱",
    institutionLabel: "机构",
    cvButton: "下载简历",
  },
  en: {
    name: "Xinyang Gao",
    nameAlt: "高昕阳",
    title: "PhD Student",
    affiliation: "Peking University",
    aboutHeading: "About",
    researchHeading: "Research Interests",
    pubHeading: "Publications",
    wpHeading: "Working Papers",
    cvHeading: "CV",
    contactHeading: "Contact",
    linksHeading: "External Links",
    emailLabel: "Email",
    institutionLabel: "Institution",
    cvButton: "Download CV",
  },
};

/* ── Helpers ── */
function readQueryLang() {
  const p = new URLSearchParams(window.location.search);
  const l = p.get("lang");
  return l === "zh" || l === "en" ? l : null;
}

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

/* ── Render ── */
function renderText(lang) {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  const t = i18n[lang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key && t[key]) el.textContent = t[key];
  });

  // Alternate name in sidebar
  document.getElementById("name-alt").textContent = t.nameAlt;

  // Lang toggle buttons
  const label = lang === "zh" ? "EN" : "中文";
  document.getElementById("lang-toggle").textContent = label;
  document.getElementById("lang-toggle-mobile").textContent = label;
}

function renderProfile(profile, lang) {
  document.getElementById("about-text").textContent = profile.about;
  document.getElementById("institution-text").textContent = profile.affiliation;

  const emailLink = document.getElementById("email-link");
  emailLink.href = `mailto:${profile.email}`;
  emailLink.textContent = profile.email;

  // Sidebar email
  document.getElementById("sidebar-email").href = `mailto:${profile.email}`;

  const cvLink = document.getElementById("cv-link");
  cvLink.href = profile.cv;
  cvLink.textContent = i18n[lang].cvButton;

  const researchList = document.getElementById("research-list");
  researchList.innerHTML = profile.researchInterests
    .map((item) => `<li>${item}</li>`)
    .join("");

  // External links
  const externalLinks = document.getElementById("external-links-list");
  externalLinks.innerHTML = profile.externalLinks
    .map(
      (item) =>
        `<li><a href="${item.url}" target="_blank" rel="noopener">${item.name}</a></li>`
    )
    .join("");

  // Update sidebar social links from profile
  profile.externalLinks.forEach((link) => {
    if (link.name.toLowerCase().includes("google scholar")) {
      document.getElementById("sidebar-scholar").href = link.url;
    }
    if (link.name.toLowerCase().includes("researchgate")) {
      document.getElementById("sidebar-researchgate").href = link.url;
    }
  });
}

function paperItem(paper) {
  const links =
    paper.links && paper.links.length
      ? `<span class="paper-links">${paper.links
          .map(
            (l) =>
              `[<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>]`
          )
          .join(" ")}</span>`
      : "";
  return `<li>
    <div class="paper-title">${paper.title}</div>
    <div class="paper-meta">${paper.authors}. <em>${paper.venue}</em>, ${paper.year}. ${paper.status || ""}</div>
    ${links}
  </li>`;
}

function renderPapers(data) {
  document.getElementById("publications-list").innerHTML = data.publications
    .map(paperItem)
    .join("");
  document.getElementById("working-papers-list").innerHTML = data.workingPapers
    .map(paperItem)
    .join("");
}

/* ── Dark mode ── */
function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") document.documentElement.setAttribute("data-theme", "dark");
  updateThemeIcon();
}

function toggleTheme() {
  const isDark =
    document.documentElement.getAttribute("data-theme") === "dark";
  if (isDark) {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
  updateThemeIcon();
}

function updateThemeIcon() {
  const isDark =
    document.documentElement.getAttribute("data-theme") === "dark";
  const icon = isDark ? "\u2600" : "\u263E"; // ☀ or ☾
  const btn = document.getElementById("theme-toggle");
  const btnMobile = document.getElementById("theme-toggle-mobile");
  if (btn) btn.querySelector(".theme-icon").textContent = icon;
  if (btnMobile) btnMobile.textContent = icon;
}

/* ── Mobile menu ── */
function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");

  function close() {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
  }

  toggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("active");
  });

  overlay.addEventListener("click", close);

  // Close on nav link click (mobile)
  sidebar.querySelectorAll(".sidebar-nav a").forEach((a) => {
    a.addEventListener("click", close);
  });
}

/* ── Fade-in on scroll ── */
function initFadeIn() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
}

/* ── Bootstrap ── */
async function bootstrap() {
  initTheme();
  initMobileMenu();

  const local = localStorage.getItem("lang");
  const query = readQueryLang();
  const lang = query || local || "en";

  renderText(lang);

  const [profile, papers] = await Promise.all([
    loadJson(`./content/${lang}/profile.json`),
    loadJson(`./content/${lang}/publications.json`),
  ]);

  renderProfile(profile, lang);
  renderPapers(papers);

  // Footer year
  document.getElementById("footer-year").textContent =
    new Date().getFullYear();
  document.getElementById("footer-name").textContent = i18n[lang].name;

  // Lang toggle
  function switchLang() {
    const next = lang === "en" ? "zh" : "en";
    localStorage.setItem("lang", next);
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("lang", next);
    window.location.href = nextUrl.toString();
  }

  document.getElementById("lang-toggle").addEventListener("click", switchLang);
  document
    .getElementById("lang-toggle-mobile")
    .addEventListener("click", switchLang);

  // Theme toggle
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
  document
    .getElementById("theme-toggle-mobile")
    .addEventListener("click", toggleTheme);

  // Fade in
  initFadeIn();
}

bootstrap().catch((err) => {
  document.body.innerHTML = `<pre style="padding:16px;color:#900;">${err.message}</pre>`;
});
