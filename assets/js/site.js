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
    linksHeading: "链接",
    emailLabel: "邮箱",
    institutionLabel: "机构",
    pkuLabel: "北大主页",
    absToggle: "摘要",
    cvLead: "完整简历请见：",
    cvButton: "下载简历（PDF）",
    heroCredit: "新安江水电站 —— 新中国第一座自主设计建设的大型水电站 · 作者摄于 2024 年 1 月",
    talkCaption: "于北京大学政府管理学院作学术报告",
    footerCredit: "页首照片：浙江建德 · 新安江水电站（作者自摄）",
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
    linksHeading: "Links",
    emailLabel: "Email",
    institutionLabel: "Institution",
    pkuLabel: "PKU Scholar",
    absToggle: "Abstract",
    cvLead: "My full curriculum vitae is available here:",
    cvButton: "Download CV (PDF)",
    heroCredit:
      "Xin'anjiang Hydropower Station — the first large hydropower station designed and built by New China · Photo by the author, Jan 2024",
    talkCaption: "Presenting at the School of Government, Peking University",
    footerCredit: "Banner: Xin'anjiang Hydropower Station, Jiande, Zhejiang (photo by the author)",
  },
};

// Names to highlight in author lists (both languages).
const SELF_NAMES = ["Xinyang Gao", "高昕阳"];

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

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function highlightSelf(authors) {
  let out = escapeHtml(authors);
  SELF_NAMES.forEach((n) => {
    out = out.replaceAll(n, `<strong>${n}</strong>`);
  });
  return out;
}

/* ── Render ── */
function renderText(lang) {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  const t = i18n[lang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key && t[key]) el.textContent = t[key];
  });

  // Alternate name in hero and nav brand
  document.getElementById("hero-name-alt").textContent = t.nameAlt;
  document.getElementById("brand-alt").textContent = t.nameAlt;

  // Lang toggle button
  document.getElementById("lang-toggle").textContent = lang === "zh" ? "EN" : "中文";
}

function renderProfile(profile, lang) {
  // Bio: accepts a string or an array of paragraphs.
  const paragraphs = Array.isArray(profile.about) ? profile.about : [profile.about];
  document.getElementById("about-text").innerHTML = paragraphs
    .map((p) => `<p>${p}</p>`)
    .join("");

  document.getElementById("institution-text").textContent = profile.affiliation;

  const emailLink = document.getElementById("email-link");
  emailLink.href = `mailto:${profile.email}`;
  emailLink.textContent = profile.email;
  document.getElementById("link-email").href = `mailto:${profile.email}`;

  const cvLink = document.getElementById("cv-link");
  cvLink.href = profile.cv;
  cvLink.textContent = i18n[lang].cvButton;

  document.getElementById("research-list").innerHTML = profile.researchInterests
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  // Contact links (inline)
  document.getElementById("external-links-inline").innerHTML = profile.externalLinks
    .map(
      (item) =>
        `<a href="${item.url}" target="_blank" rel="noopener">${escapeHtml(item.name)}</a>`
    )
    .join("");

  // About icon row from profile
  profile.externalLinks.forEach((link) => {
    const n = link.name.toLowerCase();
    if (n.includes("google scholar")) document.getElementById("link-scholar").href = link.url;
    if (n.includes("researchgate")) document.getElementById("link-researchgate").href = link.url;
    if (n.includes("pku") || n.includes("北大")) document.getElementById("link-pku").href = link.url;
  });
}

function renderAuthors(authors, authorLinks) {
  let out = highlightSelf(authors);
  Object.entries(authorLinks || {}).forEach(([name, url]) => {
    out = out.replaceAll(
      escapeHtml(name),
      `<a href="${url}" target="_blank" rel="noopener">${escapeHtml(name)}</a>`
    );
  });
  return out;
}

function paperItem(paper, lang, authorLinks) {
  const linkItems = (paper.links || []).map(
    (l) => `<a href="${l.url}" target="_blank" rel="noopener">${escapeHtml(l.label)}</a>`
  );
  if (paper.abstract) {
    linkItems.unshift(
      `<button type="button" class="abs-toggle" aria-expanded="false">${i18n[lang].absToggle}</button>`
    );
  }
  const links = linkItems.length
    ? `<span class="paper-links">${linkItems.join("")}</span>`
    : "";
  const status = paper.status ? `, ${escapeHtml(paper.status)}` : "";
  const abstract = paper.abstract
    ? `<div class="paper-abstract" hidden><p>${escapeHtml(paper.abstract)}</p></div>`
    : "";
  return `<li>
    <div class="paper-title">${escapeHtml(paper.title)}</div>
    <div class="paper-authors">${renderAuthors(paper.authors, authorLinks)}</div>
    <div class="paper-venue"><em>${escapeHtml(paper.venue)}</em>, ${paper.year}${status}${links}</div>
    ${abstract}
  </li>`;
}

function renderPapers(data, lang) {
  const links = data.authorLinks || {};
  document.getElementById("publications-list").innerHTML = data.publications
    .map((p) => paperItem(p, lang, links))
    .join("");
  document.getElementById("working-papers-list").innerHTML = data.workingPapers
    .map((p) => paperItem(p, lang, links))
    .join("");

  // Abstract toggles
  document.querySelectorAll(".abs-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = btn.closest("li").querySelector(".paper-abstract");
      const open = panel.hasAttribute("hidden");
      panel.toggleAttribute("hidden", !open);
      btn.setAttribute("aria-expanded", String(open));
      btn.classList.toggle("open", open);
    });
  });
}

/* ── Dark mode ── */
function toggleTheme() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
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
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const icon = isDark ? "☀" : "☾"; // ☀ or ☾
  document.querySelector("#theme-toggle .theme-icon").textContent = icon;
}

/* ── Nav shadow on scroll ── */
function initNavScroll() {
  const nav = document.getElementById("topnav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
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
    { threshold: 0.08 }
  );
  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
}

/* ── Bootstrap ── */
async function bootstrap() {
  updateThemeIcon();
  initNavScroll();

  const local = localStorage.getItem("lang");
  const query = readQueryLang();
  const lang = query || local || "en";

  renderText(lang);

  const [profile, papers] = await Promise.all([
    loadJson(`./content/${lang}/profile.json`),
    loadJson(`./content/${lang}/publications.json`),
  ]);

  renderProfile(profile, lang);
  renderPapers(papers, lang);

  // Footer
  document.getElementById("footer-year").textContent = new Date().getFullYear();
  document.getElementById("footer-name").textContent = i18n[lang].name;

  // Lang toggle
  document.getElementById("lang-toggle").addEventListener("click", () => {
    const next = lang === "en" ? "zh" : "en";
    localStorage.setItem("lang", next);
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("lang", next);
    window.location.href = nextUrl.toString();
  });

  // Theme toggle
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

  initFadeIn();
}

bootstrap().catch((err) => {
  document.body.innerHTML = `<pre style="padding:16px;color:#900;">${err.message}</pre>`;
});
