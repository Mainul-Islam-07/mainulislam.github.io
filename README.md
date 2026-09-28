# Portfolio

A data-driven single-page portfolio (vanilla HTML + CSS + JS, no build step). **All content lives in one file: [`data/Profile/profile.json`](data/Profile/profile.json).** To update the site you edit that JSON; you never need to touch the HTML.

Structure and behavior are modeled on the reference portfolio at
`https://emon4058.github.io/portfolio_erb4058/`.

## Folder layout

```
index.html                  Main page (renders everything from profile.json)
assets/
  css/style.css             All styling, light + dark theme
  js/main.js                Loads profile.json and renders each section
  img/                      Profile photo + placeholder images
  files/                    CV, paper PDFs, transcripts, course contents
  proofs/                   Certificates / letters linked as "proof"
    achievements/  certifications/  experience/  participation/
  projects/project.html     Project detail page (project.html?i=N)
  education/coursework.html Relevant coursework page
data/
  Profile/profile.json      ← all site content
  Projects/<name>/          Project images + Description.md / Electrical and Mechanical Specs.md
  Gallery/                  Gallery photos
  PCB Designs/              PCB design photos
```

Only files referenced from `profile.json` or the HTML are part of the site. Keep drafts, originals and notes outside this folder.

## How to edit

1. Open [`data/Profile/profile.json`](data/Profile/profile.json) and edit the content.
2. Add files where they belong, then reference them by path in the JSON:
   - Photo → `assets/img/` (`"avatar"`)
   - CV → `assets/files/` (`"cv"`)
   - Paper PDFs → `assets/files/` (a publication's `"pdf"`)
   - Certificates / letters → `assets/proofs/<section>/` (an item's `"proof"`)
   - Project images and Markdown → `data/Projects/<project>/`
   - Gallery / PCB photos → `data/Gallery/`, `data/PCB Designs/`
3. Refresh the page (served locally, see below).

Paths are relative to the site root, e.g. `assets/files/Mainul_Islam_CV.pdf`.

## Sections

Navbar · About/Hero · Research Interests · Publications · Projects · Education · Experience · Skills · Achievements · Certifications · Participation · Supervisors · Blog · Gallery · PCB Designs · Contact · Footer.

Includes a light/dark theme toggle (remembered), mobile menu, "Read more" bio clamp, scroll-reveal animations, a back-to-top button, and per-project detail pages (`assets/projects/project.html?i=N`).

## `profile.json` field reference

| Key | Type | Notes |
|-----|------|-------|
| `name`, `headline`, `summary` | string | Hero identity + bio |
| `brand` | string | Navbar logo text (defaults to `name`) |
| `avatar` | string | Path to your photo |
| `cv` | string | Path to CV PDF (button hidden if empty) |
| `themeColor` | string | Accent color, e.g. `#0ea5e9` |
| `email` | string | Contact details |
| `linkedin`, `github`, `scholar`, `orcid`, `researchgate`, `youtube` | string | Profile URLs (icons hidden if empty) |
| `researchInterests[]` | array | `title, icon` (Font Awesome class) |
| `publications[]` | array | `type, title, authors, venue, year, note, doi, pdf, abstract, highlights[]`: thesis first, then journal articles, then newest first |
| `projects[]` | array | `slug, title, subtitle, description, status, descriptionFile, specsFile, contribution[], links[], image, gallery[], category, collapsed` |
| `skillsGrouped[]` | array | `{ category, items[] }` |
| `experience[]` | array | `company, position, location, period, url, links[], proof, highlights[], collapsed`: entries with the same company merge into one card |
| `education[]` | array | `institution, institutionUrl, location, degree, period, highlights[], links[], collapsed` |
| `certifications[]` | array | `title, issuer, description, proof, collapsed` |
| `achievements[]` | array | `title, position, year, note, proof`: sorted newest first |
| `participation[]` | array | `title, year, proof` |
| `supervisors[]` | array | `name, title, role, affiliation, location, specialization, profileUrl, profileType, topics` |
| `blog[]` | array | `title, excerpt, link` |
| `gallery[]`, `pcbDesigns[]` | array | Image paths; the caption comes from the file name |

Set `"collapsed": true` on any project, experience, education or certification entry to move it into a closed "Other …" dropdown at the end of its section (projects: at the end of its `category` group).

**Links** (`links[]`): `{ "label", "href", "icon" }`, where `icon` is an optional Font Awesome class.

**Period format:** `YYYY-MM-YYYY-MM` (e.g. `2020-01-2024-06`) or `YYYY-MM-present`.

**Projects:** `descriptionFile` and `specsFile` point to Markdown files rendered on the project's detail page. `status` shows as a badge (e.g. `Delivered`). Text in `contribution[]` supports `**bold**`.

## Run locally

The page fetches `profile.json`, so open it through a local server, not `file://`:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Visitor stats

Visits are tracked with [GoatCounter](https://www.goatcounter.com): it's free and uses no cookies.

- **Dashboard (private):** `https://mainulislam.goatcounter.com` shows visits, pages, referrers, countries and devices.
- **Public footer count:** the footer shows "N visits". This needs **Settings → "Allow adding visitor counts on your website"** turned on in the dashboard. If the count can't load, it stays hidden.
- **Site code:** it appears once per page, in the `<script data-goatcounter="https://mainulislam.goatcounter.com/count" …>` line at the end of `index.html`, `assets/projects/project.html` and `assets/education/coursework.html`. Change it in all three if the code ever changes.
- Visits from `localhost` aren't counted.

## Deploy on GitHub Pages

1. Create a repo and push these files.
2. Repo **Settings → Pages → Build and deployment → Deploy from a branch**, then select your branch and `/ (root)`.
3. For a user site, name the repo `<username>.github.io`. For a project site any name works, and the URL becomes `https://<username>.github.io/<repo>/`.

> Everything in this folder becomes public once pushed, including the PDFs in `assets/files/` and `assets/proofs/`.
