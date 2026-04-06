const i18n = {
  zh: {
    name: "高昕阳",
    title: "研究者",
    affiliation: "北京大学",
    motto: "LIFE IS SHORT, KEEP FORWARD.",
    navPublications: "论文",
    navContact: "联系",
    aboutHeading: "个人简介",
    researchHeading: "研究兴趣",
    pubHeading: "发表论文",
    wpHeading: "工作论文",
    teachingHeading: "教学",
    cvHeading: "简历",
    contactHeading: "联系方式",
    linksHeading: "外部链接",
    emailLabel: "邮箱",
    institutionLabel: "机构",
    footerText: "学术主页",
    cvButton: "下载简历",
  },
  en: {
    name: "Xinyang Gao",
    title: "Researcher",
    affiliation: "Peking University",
    motto: "LIFE IS SHORT, KEEP FORWARD.",
    navPublications: "Publications",
    navContact: "Contact",
    aboutHeading: "About",
    researchHeading: "Research Interests",
    pubHeading: "Publications",
    wpHeading: "Working Papers",
    teachingHeading: "Teaching",
    cvHeading: "CV",
    contactHeading: "Contact",
    linksHeading: "External Links",
    emailLabel: "Email",
    institutionLabel: "Institution",
    footerText: "Academic Homepage",
    cvButton: "Download CV",
  },
};

function readQueryLang() {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get("lang");
  return lang === "zh" || lang === "en" ? lang : null;
}

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

function renderText(lang) {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key && i18n[lang][key]) el.textContent = i18n[lang][key];
  });
  document.getElementById("lang-toggle").textContent = lang === "zh" ? "EN" : "中文";
}

function renderProfile(profile, lang) {
  document.getElementById("about-text").textContent = profile.about;
  document.getElementById("institution-text").textContent = profile.affiliation;

  const emailLink = document.getElementById("email-link");
  emailLink.href = `mailto:${profile.email}`;
  emailLink.textContent = profile.email;

  const cvLink = document.getElementById("cv-link");
  cvLink.href = profile.cv;
  cvLink.textContent = i18n[lang].cvButton;

  const researchList = document.getElementById("research-list");
  researchList.innerHTML = profile.researchInterests
    .map((item) => `<li>${item}</li>`)
    .join("");

  const teachingList = document.getElementById("teaching-list");
  teachingList.innerHTML = profile.teaching.map((item) => `<li>${item}</li>`).join("");

  const externalLinks = document.getElementById("external-links-list");
  externalLinks.innerHTML = profile.externalLinks
    .map((item) => `<li><a href="${item.url}" target="_blank" rel="noopener">${item.name}</a></li>`)
    .join("");
}

function paperItem(paper) {
  const links =
    paper.links && paper.links.length
      ? ` [${paper.links.map((l) => `<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`).join(" · ")}]`
      : "";
  return `<li>${paper.authors}. "${paper.title}." ${paper.venue}, ${paper.year}. ${paper.status || ""}${links}</li>`;
}

function renderPapers(data) {
  document.getElementById("publications-list").innerHTML = data.publications.map(paperItem).join("");
  document.getElementById("working-papers-list").innerHTML = data.workingPapers.map(paperItem).join("");
}

async function bootstrap() {
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

  const toggle = document.getElementById("lang-toggle");
  toggle.addEventListener("click", () => {
    const next = lang === "en" ? "zh" : "en";
    localStorage.setItem("lang", next);
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("lang", next);
    window.location.href = nextUrl.toString();
  });
}

bootstrap().catch((err) => {
  // Keep failure visible for quick manual debugging in static deployment.
  document.body.innerHTML = `<pre style="padding:16px;color:#900;">${err.message}</pre>`;
});
