# Xinyang Gao — Academic Homepage

Bilingual (EN/中文) academic homepage, deployed at <https://www.xinyanggao.com>.

Pure static site: no build step, no framework. All content lives in JSON files,
so day-to-day maintenance never touches HTML/CSS/JS.

## Structure

```
index.html              page skeleton (edit rarely)
assets/css/style.css    design: colors, typography, layout
assets/js/site.js       rendering, language switch, dark mode, UI labels (i18n)
assets/img/             banner.jpg (hero), portrait.jpg (about), talk.jpg (moment)
content/en/*.json       English content  ← edit these
content/zh/*.json       Chinese content  ← edit these
public/cv/              cv-en.pdf, cv-zh.pdf
vercel.json             static deployment config
```

## How to update content (the common cases)

Always edit **both** `content/en/` and `content/zh/` so the two languages stay in sync.

### Add a publication or working paper

Edit `content/en/publications.json` and `content/zh/publications.json`.
Add an entry to `publications` or `workingPapers`:

```json
{
  "title": "Paper Title",
  "authors": "Coauthor Name, Xinyang Gao",
  "venue": "Journal Name",
  "year": 2026,
  "status": "Forthcoming",
  "links": [{ "label": "PDF", "url": "https://..." }]
}
```

Notes:
- Your name ("Xinyang Gao" / "高昕阳") is **bolded automatically** in author lists.
- `links` can hold several items (PDF, Appendix, Replication, ...); leave `[]` for none.
- `status` is optional free text (e.g. "First Online", "Vol. 128", "R&R").

### Add a news item

Edit `news` in `content/{en,zh}/profile.json`. Newest first. `text` may contain
simple HTML (`<em>`, `<a>`):

```json
{ "date": "2026-06", "text": "Presented at <em>XYZ Conference</em>." }
```

### Update bio / research interests / links

All in `content/{en,zh}/profile.json` (`about` is an array of paragraphs;
HTML allowed).

### Update CV

Replace `public/cv/cv-en.pdf` and `public/cv/cv-zh.pdf` (keep the filenames).

### Replace photos

Overwrite files in `assets/img/` (keep the filenames):
- `banner.jpg` — hero image (~1500px wide is plenty)
- `portrait.jpg` — headshot (~800px)
- `talk.jpg` — the captioned photo before the CV section

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
