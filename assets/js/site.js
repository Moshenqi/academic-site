const i18n = {
  zh: {
    name: "高昕阳",
    nameAlt: "Xinyang Gao",
    title: "博士研究生",
    affiliation: "北京大学",
    affiliationFull: "北京大学政府管理学院",
    aboutHeading: "个人简介",
    researchHeading: "研究兴趣",
    pubHeading: "发表论文",
    wpHeading: "工作论文",
    cvHeading: "简历",
    contactHeading: "联系方式",
    linksHeading: "链接",
    emailLabel: "邮箱",
    institutionLabel: "机构",
    addressLabel: "地址",
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
    affiliationFull: "School of Government, Peking University",
    aboutHeading: "About",
    researchHeading: "Research Interests",
    pubHeading: "Publications",
    wpHeading: "Working Papers",
    cvHeading: "CV",
    contactHeading: "Contact",
    linksHeading: "Links",
    emailLabel: "Email",
    institutionLabel: "Institution",
    addressLabel: "Address",
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

/* ── Shared rendering ── */
function renderText(lang) {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  const t = i18n[lang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key && t[key]) el.textContent = t[key];
  });

  document.querySelectorAll(".js-name-alt").forEach((el) => {
    el.textContent = t.nameAlt;
  });

  document.querySelectorAll(".js-lang-toggle").forEach((btn) => {
    btn.textContent = lang === "zh" ? "EN" : "中文";
  });

  const footerYear = document.getElementById("footer-year");
  if (footerYear) footerYear.textContent = new Date().getFullYear();
  const footerName = document.getElementById("footer-name");
  if (footerName) footerName.textContent = t.name;
}

function markActiveNav() {
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href.includes(page) && page !== "index.html") a.classList.add("active");
  });
}

/* ── Profile-driven sections (guarded per page) ── */
function renderProfile(profile, lang) {
  const aboutText = document.getElementById("about-text");
  if (aboutText) {
    const paragraphs = Array.isArray(profile.about) ? profile.about : [profile.about];
    aboutText.innerHTML = paragraphs.map((p) => `<p>${p}</p>`).join("");
  }

  const institution = document.getElementById("institution-text");
  if (institution) institution.textContent = profile.affiliation;

  const address = document.getElementById("address-text");
  if (address && profile.address) address.textContent = profile.address;

  const emailLink = document.getElementById("email-link");
  if (emailLink) {
    emailLink.href = `mailto:${profile.email}`;
    emailLink.textContent = profile.email;
  }
  const iconEmail = document.getElementById("link-email");
  if (iconEmail) iconEmail.href = `mailto:${profile.email}`;

  const cvLink = document.getElementById("cv-link");
  if (cvLink) {
    cvLink.href = profile.cv;
    cvLink.textContent = i18n[lang].cvButton;
  }

  const researchList = document.getElementById("research-list");
  if (researchList) {
    researchList.innerHTML = profile.researchInterests
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");
  }

  const linksInline = document.getElementById("external-links-inline");
  if (linksInline) {
    linksInline.innerHTML = profile.externalLinks
      .map(
        (item) =>
          `<a href="${item.url}" target="_blank" rel="noopener">${escapeHtml(item.name)}</a>`
      )
      .join("");
  }

  profile.externalLinks.forEach((link) => {
    const n = link.name.toLowerCase();
    const set = (id) => {
      const el = document.getElementById(id);
      if (el) el.href = link.url;
    };
    if (n.includes("google scholar")) set("link-scholar");
    if (n.includes("researchgate")) set("link-researchgate");
    if (n.includes("pku") || n.includes("北大")) set("link-pku");
  });
}

/* ── Publications ── */
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
  const icon = isDark ? "☀" : "☾";
  document.querySelectorAll(".js-theme-toggle .theme-icon").forEach((el) => {
    el.textContent = icon;
  });
}

/* ── Nav shadow on scroll ── */
function initNavScroll() {
  const nav = document.getElementById("topnav");
  if (!nav) return;
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
  markActiveNav();

  const local = localStorage.getItem("lang");
  const query = readQueryLang();
  const lang = query || local || "en";

  renderText(lang);

  const needsProfile =
    document.getElementById("about-text") ||
    document.getElementById("email-link") ||
    document.getElementById("cv-link");
  const needsPapers = document.getElementById("publications-list");

  const [profile, papers] = await Promise.all([
    needsProfile ? loadJson(`./content/${lang}/profile.json`) : null,
    needsPapers ? loadJson(`./content/${lang}/publications.json`) : null,
  ]);

  if (profile) renderProfile(profile, lang);
  if (papers) renderPapers(papers, lang);

  // Language toggle: stay on the current page
  document.querySelectorAll(".js-lang-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = lang === "en" ? "zh" : "en";
      localStorage.setItem("lang", next);
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set("lang", next);
      window.location.href = nextUrl.toString();
    });
  });

  document.querySelectorAll(".js-theme-toggle").forEach((btn) => {
    btn.addEventListener("click", toggleTheme);
  });

  initFadeIn();
}

bootstrap().catch((err) => {
  document.body.innerHTML = `<pre style="padding:16px;color:#900;">${err.message}</pre>`;
});
