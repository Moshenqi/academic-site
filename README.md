# Academic Site (Bilingual, Minimal Style)

This is a lightweight academic homepage inspired by `songpoyang.com`.

## Structure

- `index.html`: single-page layout
- `assets/css/style.css`: minimalist styling
- `assets/js/site.js`: rendering and language switch
- `content/zh/*.json`, `content/en/*.json`: maintainable content source
- `public/cv/`: CV files
- `robots.txt`, `sitemap.xml`: SEO basics
- `vercel.json`: static deployment config

## Local Preview

Use any static server. Example (Python 3):

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Update Content

1. Replace email, affiliation, and links in:
   - `content/zh/profile.json`
   - `content/en/profile.json`
2. Update papers in:
   - `content/zh/publications.json`
   - `content/en/publications.json`
3. Replace CV placeholders with real files:
   - `public/cv/cv-zh.pdf`
   - `public/cv/cv-en.pdf`
4. Replace `https://example.com` in:
   - `index.html`
   - `robots.txt`
   - `sitemap.xml`

## Deploy to Vercel

1. Create a GitHub repo and push this folder.
2. Import the repo into Vercel.
3. Bind your domain and redeploy.

## Optional Analytics

Add Google Analytics or Plausible script in `index.html`.
