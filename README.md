# Xinyang Gao — Academic Homepage

Bilingual (EN/中文) academic homepage, deployed at <https://www.xinyanggao.com>.

Pure static site: no build step, no framework. All content lives in JSON files,
so day-to-day maintenance never touches HTML/CSS/JS.

## Structure

```
index.html              cover page (full-screen photo + entry nav)
about.html              bio, research interests, links, talk photo
publications.html       publications + working papers
cv.html                 CV download
contact.html            contact info
assets/css/style.css    design: colors, typography, layout
assets/js/site.js       rendering, language switch, dark mode, UI labels (i18n)
assets/img/             banner.jpg (cover/banners), portrait.jpg, talk.jpg
content/en/*.json       English content  ← edit these
content/zh/*.json       Chinese content  ← edit these
public/cv/              cv-en.pdf, cv-zh.pdf
public/papers/          paper PDFs hosted on the site
vercel.json             static deployment config
```

All five pages share the same nav/footer markup and are rendered by
`site.js` from the JSON files — routine updates never touch HTML.

## How to update content (the common cases)

Always edit **both** `content/en/` and `content/zh/` so the two languages stay in sync.

### Add a publication or working paper

1. (Optional) Drop the PDF into `public/papers/` with a short kebab-case name,
   e.g. `gao-2027-some-paper.pdf`.
2. Edit `content/en/publications.json` **and** `content/zh/publications.json`.
   Add an entry to `publications` or `workingPapers` (newest first):

```json
{
  "title": "Paper Title",
  "authors": "Coauthor Name, Xinyang Gao",
  "venue": "Journal Name",
  "year": 2027,
  "status": "265: 235–246",
  "abstract": "One-paragraph abstract shown behind the Abstract toggle...",
  "links": [
    { "label": "PDF", "url": "./public/papers/gao-2027-some-paper.pdf" },
    { "label": "DOI", "url": "https://doi.org/..." }
  ]
}
```

Notes:
- Your name ("Xinyang Gao" / "高昕阳") is **bolded automatically** in author lists.
- Mark corresponding authors by appending `*` to the name in `authors`
  (e.g. `"Wenhui Yang, Xinyang Gao*"`); the "* Corresponding author"
  footnote on the Publications page is fixed text.
- `abstract` is optional — when present, an "Abstract / 摘要" toggle appears.
- `links` can hold several items (PDF, DOI, Appendix, Replication, ...); `[]` for none.
- `status` is optional free text (volume/pages, "Forthcoming", "R&R", ...).
- To link a coauthor's homepage, add their exact name to the `authorLinks` map
  at the top of both publications.json files:
  `"authorLinks": { "Weilin Xiao": "https://xwl822.github.io/" }`.

### Update bio / research interests / links

All in `content/{en,zh}/profile.json` (`about` is an array of paragraphs;
HTML allowed).

### Update CV

Replace `public/cv/cv-en.pdf` and `public/cv/cv-zh.pdf` (keep the filenames).

### Replace photos

Overwrite files in `assets/img/` (keep the filenames):
- `banner.jpg` — cover page + page-top banners (~1500px wide is plenty)
- `portrait.jpg` — headshot on the About page (~800px)
- `talk.jpg` — the captioned photo on the About page

Tip (macOS) to compress a large photo before committing:

```bash
sips -Z 1600 -s format jpeg -s formatOptions 78 photo.jpg --out assets/img/banner.jpg
```

Photo captions and other fixed UI labels live in the `i18n` object at the top
of `assets/js/site.js`.

## Local preview

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000> (use `?lang=zh` / `?lang=en` to force a language).

## Deploy

Push to GitHub `main`; Vercel auto-deploys:

```bash
git add -A && git commit -m "Update content" && git push
```

## Design notes

- Palette is drawn from the Xin'anjiang banner photo (slate blue / teal / warm paper).
- Typography: Source Serif 4 + Noto Serif SC for headings, Source Sans 3 for body.
- Dark mode follows system preference; manual toggle is stored in `localStorage`.
