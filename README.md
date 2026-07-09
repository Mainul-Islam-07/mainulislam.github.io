# Portfolio

A data-driven single-page portfolio (vanilla HTML + CSS + JS). **All content lives in one file — [`data/profile.json`](data/profile.json).** You never edit HTML to update the site; just edit the JSON.

Structure and behavior are modeled on the reference portfolio at
`https://emon4058.github.io/portfolio_erb4058/`.

## How to edit

1. Open [`data/profile.json`](data/profile.json) and replace the placeholder content with your own.
2. Add your assets to `assets/`:
   - Photo → `assets/img/` (then point `"avatar"` to it, e.g. `assets/img/me.jpg`)
   - CV/résumé PDF → `assets/files/` (then set `"cv"`, e.g. `assets/files/cv.pdf`)
   - Project images → `assets/img/` (referenced by each project's `"image"`)
3. Refresh the page.

## Sections

Navbar · About/Hero · Projects · Experience · Education · Skills · Certifications · Achievements · Contact · Footer.
Includes light/dark theme toggle (remembered), mobile menu, "Read more" bio clamp,
scroll-reveal animations, back-to-top button, and per-project detail pages
(`assets/projects/project.html?i=N`).

## `profile.json` field reference

| Key | Type | Notes |
|-----|------|-------|
| `name`, `headline`, `summary` | string | Hero identity + bio |
| `brand` | string | Navbar logo text (defaults to `name`) |
| `avatar` | string | Path to your photo |
| `cv` | string | Path to CV PDF (hides button if empty) |
| `themeColor` | string | Accent color, e.g. `#0ea5e9` |
| `email`, `linkedin`, `github` | string | Contact + social links |
| `projects[]` | array | `slug, title, subtitle, description, longDescription, image, gallery[], tags[], specs{}, url` |
| `skillsGrouped[]` | array | `{ category, items[] }` |
| `experience[]` | array | `company, position, location, period, url, highlights[], tech[]` — same company merges into one card |
| `education[]` | array | `institution, location, degree, period, url, highlights[]` |
| `certifications[]` | array | `title, issuer, description, link` |
| `achievements[]` | array | `title, position, year, organizer, organizerUrl, link, note` — auto-sorted newest first |

**Period format:** `YYYY-MM-YYYY-MM` (e.g. `2020-09-2024-06`) or `YYYY-MM-present`.

**Projects:** a project links to its detail page automatically. Set `"url"` to make a card link to an external site instead.

## Run locally

Because the page fetches `profile.json`, open it via a local server (not `file://`):

```bash
# Python
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy on GitHub Pages

1. Create a repo and push these files.
2. Repo **Settings → Pages → Build and deployment → Deploy from a branch**, select your branch and `/root`.
3. For a user site, name the repo `<username>.github.io`; for a project site, any name works (URL becomes `https://<username>.github.io/<repo>/`).
