(function () {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  /* ------------------------------------------------------------------ *
   * Theme toggle (persisted in localStorage)
   * ------------------------------------------------------------------ */
  const savedTheme = localStorage.getItem("theme");
  const prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", savedTheme || (prefersDark ? "dark" : "light"));
  updateThemeIcon();

  function updateThemeIcon() {
    themeToggle.innerHTML =
      root.getAttribute("data-theme") === "light"
        ? '<i class="fa-regular fa-moon"></i>'
        : '<i class="fa-regular fa-sun"></i>';
  }

  themeToggle.addEventListener("click", () => {
    const theme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    updateThemeIcon();
  });

  /* ------------------------------------------------------------------ *
   * Mobile nav
   * ------------------------------------------------------------------ */
  navToggle.addEventListener("click", () => navMenu.classList.toggle("show"));
  navMenu.addEventListener("click", (e) => {
    if (e.target.closest("a")) navMenu.classList.remove("show");
  });

  /* ------------------------------------------------------------------ *
   * Small helpers
   * ------------------------------------------------------------------ */
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
    );
  const setText = (sel, val) => {
    if (val == null) return;
    document.querySelectorAll(sel).forEach((n) => (n.textContent = val));
  };

  function formatPeriod(period) {
    // "YYYY-MM-present" -> "YYYY-MM – Present" | "YYYY-MM-YYYY-MM" -> "YYYY-MM – YYYY-MM"
    if (!period) return "";
    const p = String(period).split("-");
    if (p.length === 3 && p[2].toLowerCase() === "present")
      return `${p[0]}-${p[1]} – Present`;
    if (p.length === 4) return `${p[0]}-${p[1]} – ${p[2]}-${p[3]}`;
    return period;
  }
  function formatEduPeriod(period) {
    const p = String(period || "").split("-");
    if (p.length === 4) return `${p[0]} – ${p[2]}`;
    if (p.length === 2) return `${p[0]} – ${p[1]}`;
    return period || "";
  }

  /* ------------------------------------------------------------------ *
   * Load and render profile.json
   * ------------------------------------------------------------------ */
  fetch("data/profile.json")
    .then((r) => {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(render)
    .catch((err) => {
      console.error("Failed to load profile.json:", err);
      showLoadError();
    });

  // Visible banner when the JSON can't be fetched — almost always because the
  // page was opened via file:// (double-clicked) instead of over a local server.
  function showLoadError() {
    const isFile = location.protocol === "file:";
    const banner = document.createElement("div");
    banner.style.cssText =
      "position:fixed;top:0;left:0;right:0;z-index:9999;background:#b91c1c;color:#fff;" +
      "padding:12px 16px;font:500 14px/1.5 Inter,sans-serif;text-align:center";
    banner.innerHTML = isFile
      ? "⚠️ This page was opened as a file, so the content (data/profile.json) can't load. " +
        "Run it through a local server instead — e.g. <code>python -m http.server 8000</code> " +
        "in this folder, then open <b>http://localhost:8000</b>. In VS Code you can also right-click " +
        "index.html → <b>Open with Live Server</b>."
      : "⚠️ Couldn't load data/profile.json. Check the file exists and the browser console for details.";
    document.body.appendChild(banner);
  }

  function render(profile) {
    /* --- Identity / hero --- */
    setText('[data-bind="name"]', profile.name);
    setText('[data-bind="headline"]', profile.headline);
    setText('[data-bind="brand"]', profile.brand || profile.name);
    setText('[data-bind="email"]', profile.email);
    setText('[data-bind="linkedin"]', profile.linkedin);
    setText('[data-bind="github"]', profile.github);

    if (profile.themeColor) {
      // Optional: override the accent color from JSON.
      root.style.setProperty("--primary", profile.themeColor);
    }

    const avatar = document.getElementById("avatar");
    if (avatar && profile.avatar) avatar.src = profile.avatar;

    const cv = document.getElementById("cv-link");
    if (cv) {
      if (profile.cv) cv.href = profile.cv;
      else cv.style.display = "none";
    }

    /* --- Links --- */
    if (profile.email)
      document.querySelectorAll("[data-bind-mailto]").forEach(
        (a) => (a.href = `mailto:${profile.email}`)
      );
    if (profile.linkedin)
      document.querySelectorAll('[data-bind-href="linkedin"]').forEach(
        (a) => (a.href = profile.linkedin)
      );
    if (profile.github)
      document.querySelectorAll('[data-bind-href="github"]').forEach(
        (a) => (a.href = profile.github)
      );

    /* --- About summary: clamp + read more / read less --- */
    setupSummary(profile);

    /* --- Hero social icons --- */
    renderSocial(profile);

    /* --- Research interests --- */
    renderResearch(profile.researchInterests || profile.research);

    /* --- Publications --- */
    renderPublications(profile.publications);

    /* --- Participation --- */
    renderParticipation(profile.participation);

    /* --- Supervisors / references --- */
    renderSupervisors(profile.supervisors);

    /* --- Blog --- */
    renderBlog(profile.blog);

    /* --- Projects --- */
    const projectsGrid = document.getElementById("projects-grid");
    if (projectsGrid && Array.isArray(profile.projects)) {
      projectsGrid.innerHTML = "";
      profile.projects.forEach((p, i) => {
        const href = p.url ? p.url : `assets/projects/project.html?i=${i}`;
        const card = el("a", "card");
        card.href = href;
        if (p.url) {
          card.target = "_blank";
          card.rel = "noopener noreferrer";
        }
        card.innerHTML = `
          ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.title || "Project")}" loading="lazy" decoding="async">` : ""}
          <div class="card-body">
            <h3 class="card-title">${esc(p.title)}</h3>
            ${p.subtitle ? `<p class="card-subtitle">${esc(p.subtitle)}</p>` : ""}
            <p class="card-text">${esc(p.description)}</p>
            <div class="card-tags">${(p.tags || []).map((t) => `<span>${esc(t)}</span>`).join("")}</div>
            <span class="a-link" style="margin-top:8px;display:inline-block">View details →</span>
          </div>`;
        projectsGrid.appendChild(card);
      });
    }

    /* --- Experience (grouped by company) --- */
    renderExperience(profile.experience);

    /* --- Education --- */
    const eduList = document.getElementById("education-list");
    if (eduList && Array.isArray(profile.education)) {
      eduList.innerHTML = "";
      profile.education.forEach((e) => {
        const card = el("div", "education-item");
        const hl =
          Array.isArray(e.highlights) && e.highlights.length
            ? `<ul class="highlights">${e.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>`
            : "";
        // Support a single `url` (legacy) or a `links` array of { label, href }.
        const links = Array.isArray(e.links)
          ? e.links.slice()
          : e.url
          ? [{ label: "View", href: e.url }]
          : [];
        const linksHtml = links.length
          ? `<div class="edu-links">${links
              .map(
                (l) =>
                  `<a href="${esc(l.href)}" target="_blank" rel="noopener noreferrer">${esc(l.label)}</a>`
              )
              .join("")}</div>`
          : "";
        const instLink = e.institutionUrl
          ? ` <a class="inst-link" href="${esc(e.institutionUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Visit ${esc(e.institution)} website" title="Visit website"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>`
          : "";
        card.innerHTML = `
          <h4><span class="institution">${esc(e.institution)}</span>${instLink}${
          e.location ? ` <span class="location">${esc(e.location)}</span>` : ""
        }</h4>
          <div class="degree-line"><span class="degree">${esc(e.degree)}</span>
            <span class="dotline"></span>
            <span class="period">${esc(formatEduPeriod(e.period))}</span></div>
          ${hl}${linksHtml}`;
        eduList.appendChild(card);
      });
    }

    /* --- Skills --- */
    const skillsGrid = document.getElementById("skills-grid");
    if (skillsGrid) {
      skillsGrid.innerHTML = "";
      let groups = [];
      if (Array.isArray(profile.skillsGrouped) && profile.skillsGrouped.length)
        groups = profile.skillsGrouped;
      else if (Array.isArray(profile.skills) && profile.skills.length)
        groups = [{ category: "Skills", items: profile.skills }];
      groups.forEach((g) => {
        skillsGrid.appendChild(
          el(
            "div",
            "skill-group",
            `<h3 class="skill-cat">${esc(g.category)}</h3>
             <ul class="skill-items">${(g.items || []).map((it) => `<li>${esc(it)}</li>`).join("")}</ul>`
          )
        );
      });
    }

    /* --- Certifications --- */
    const certList = document.getElementById("certifications-list");
    if (certList && Array.isArray(profile.certifications)) {
      certList.innerHTML = "";
      profile.certifications.forEach((c) => {
        const card = el(c.link ? "a" : "div", "cert-card");
        if (c.link) {
          card.href = c.link;
          card.target = "_blank";
          card.rel = "noopener noreferrer";
        }
        card.innerHTML = `
          <h4 class="cert-title">${esc(c.title)}</h4>
          ${c.issuer ? `<div class="cert-issuer">${esc(c.issuer)}</div>` : ""}
          ${c.description ? `<p class="cert-desc">${esc(c.description)}</p>` : ""}
          ${c.link ? `<div class="cert-link">View Certificate →</div>` : ""}`;
        certList.appendChild(card);
      });
    }

    /* --- Achievements (sorted newest-first) --- */
    const achList = document.getElementById("achievements-list");
    if (achList && Array.isArray(profile.achievements)) {
      achList.innerHTML = "";
      const sorted = [...profile.achievements].sort((a, b) => {
        const ya = parseInt((String(a.year || "").match(/\d{4}/) || [0])[0], 10);
        const yb = parseInt((String(b.year || "").match(/\d{4}/) || [0])[0], 10);
        return yb - ya;
      });
      sorted.forEach((a) => {
        const wrap = el("div", "achievement-item");
        const top = el(a.link ? "a" : "div", "achievement-topblock");
        if (a.link) {
          top.href = a.link;
          top.target = "_blank";
          top.rel = "noopener noreferrer";
        }
        top.innerHTML = `
          <h4 class="achievement-title">${esc(a.title)}</h4>
          <div class="achievement-meta">
            ${a.position ? `<span class="ach-badge position">${esc(a.position)}</span>` : ""}
            ${a.year ? `<span class="ach-badge year">${esc(a.year)}</span>` : ""}
          </div>
          ${a.note ? `<div class="achievement-extra">${esc(a.note)}</div>` : ""}`;
        wrap.appendChild(top);

        if (a.organizer) {
          const orgHref =
            a.organizerUrl ||
            `https://www.google.com/search?q=${encodeURIComponent(a.organizer)}`;
          const bottom = el("a", "achievement-bottomblock", esc(a.organizer));
          bottom.href = orgHref;
          bottom.target = "_blank";
          bottom.rel = "noopener noreferrer";
          wrap.appendChild(bottom);
        }
        achList.appendChild(wrap);
      });
    }
  }

  /* ------------------------------------------------------------------ *
   * Experience rendering (merge multiple roles under one company)
   * ------------------------------------------------------------------ */
  function renderExperience(list) {
    const expList = document.getElementById("experience-list");
    if (!expList || !Array.isArray(list)) return;

    const map = new Map();
    list.forEach((item) => {
      const key = `${item.company || ""}|${item.location || ""}`.toLowerCase();
      const entry =
        map.get(key) ||
        {
          company: item.company || "",
          location: item.location || "",
          roles: [],
          highlights: item.highlights || [],
          tech: item.tech || [],
          url: item.url || "",
        };
      const posArr = Array.isArray(item.position) ? item.position : [item.position];
      const perArr = Array.isArray(item.period) ? item.period : [item.period];
      const len = Math.max(posArr.length, perArr.length);
      for (let i = 0; i < len; i++) {
        const pos = (posArr[i] ?? posArr[0] ?? "").trim();
        const per = (perArr[i] ?? perArr[0] ?? "").trim();
        if (pos || per) entry.roles.push({ position: pos, period: per });
      }
      if (!entry.highlights.length && item.highlights) entry.highlights = item.highlights;
      if (!entry.tech.length && item.tech) entry.tech = item.tech;
      if (!entry.url && item.url) entry.url = item.url;
      map.set(key, entry);
    });

    expList.innerHTML = "";
    map.forEach((e) => {
      const card = el(e.url ? "a" : "div", "experience-card");
      if (e.url) {
        card.href = e.url;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
      }
      const roles = e.roles
        .map(
          (r) => `
          <div class="role-line">
            <span class="position">${esc(r.position)}</span>
            <span class="dotline"></span>
            <span class="period">${esc(formatPeriod(r.period))}</span>
          </div>`
        )
        .join("");
      const hl =
        Array.isArray(e.highlights) && e.highlights.length
          ? `<ul class="highlights">${e.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>`
          : "";
      const tech =
        Array.isArray(e.tech) && e.tech.length
          ? `<p class="exp-tech"><strong>Technical Skills:</strong> ${e.tech.map(esc).join(", ")}</p>`
          : "";
      card.innerHTML = `
        <h4><span class="company">${esc(e.company)}</span>${
        e.location ? ` <span class="location">${esc(e.location)}</span>` : ""
      }</h4>
        ${roles}${hl}${tech}`;
      expList.appendChild(card);
    });
  }

  /* ------------------------------------------------------------------ *
   * Hero social icons
   * ------------------------------------------------------------------ */
  function renderSocial(profile) {
    const box = document.getElementById("hero-social");
    if (!box) return;
    const links = [];
    if (profile.email) links.push({ icon: "fa-solid fa-envelope", href: `mailto:${profile.email}`, label: "Email" });
    if (profile.linkedin) links.push({ icon: "fa-brands fa-linkedin-in", href: profile.linkedin, label: "LinkedIn" });
    if (profile.github) links.push({ icon: "fa-brands fa-github", href: profile.github, label: "GitHub" });
    if (profile.scholar) links.push({ icon: "fa-solid fa-graduation-cap", href: profile.scholar, label: "Google Scholar" });
    if (profile.orcid) links.push({ icon: "fa-brands fa-orcid", href: profile.orcid, label: "ORCID" });
    if (profile.researchgate) links.push({ icon: "fa-brands fa-researchgate", href: profile.researchgate, label: "ResearchGate" });
    (profile.socials || []).forEach((s) => links.push(s));
    box.innerHTML = links
      .map(
        (l) =>
          `<a class="icon-btn" href="${esc(l.href)}"${
            l.href.startsWith("mailto:") ? "" : ' target="_blank" rel="noopener"'
          } aria-label="${esc(l.label || "")}" title="${esc(l.label || "")}"><i class="${esc(l.icon)}"></i></a>`
      )
      .join("");
  }

  /* ------------------------------------------------------------------ *
   * Research interests
   * ------------------------------------------------------------------ */
  function renderResearch(items) {
    const box = document.getElementById("research-list");
    if (!box || !Array.isArray(items)) return;
    box.innerHTML = "";
    items.forEach((it) => {
      const obj = typeof it === "string" ? { title: it } : it || {};
      const card = el("div", "research-item");
      card.innerHTML = `
        ${obj.icon ? `<i class="${esc(obj.icon)} research-icon"></i>` : `<i class="fa-solid fa-flask research-icon"></i>`}
        <div>
          <h4>${esc(obj.title)}</h4>
          ${obj.description ? `<p>${esc(obj.description)}</p>` : ""}
        </div>`;
      box.appendChild(card);
    });
  }

  /* ------------------------------------------------------------------ *
   * Publications (sorted newest-first)
   * ------------------------------------------------------------------ */
  function renderPublications(items) {
    const box = document.getElementById("publications-list");
    if (!box || !Array.isArray(items)) return;
    // Keep each item's ORIGINAL index so the PDF viewer subpage (paper.html?i=N)
    // reads the correct entry even after we sort for display.
    const withIdx = items.map((p, idx) => ({ p, idx }));
    const yearOf = (p) => parseInt((String(p.year || "").match(/\d{4}/) || [0])[0], 10);
    // Order: thesis first, then journal articles, then the rest by year (newest first).
    const rank = (p) => {
      if (/thesis/i.test(p.note || "")) return 0;
      if (/journal/i.test(p.type || "")) return 1;
      return 2;
    };
    withIdx.sort((a, b) => {
      const ra = rank(a.p);
      const rb = rank(b.p);
      if (ra !== rb) return ra - rb;
      return yearOf(b.p) - yearOf(a.p);
    });
    box.innerHTML = "";
    withIdx.forEach(({ p, idx }) => {
      const card = el("div", "publication-item");

      // Links: View PDF (subpage viewer), DOI / arXiv, external link, code.
      const links = [];
      if (p.pdf) links.push({ label: "View PDF", href: `assets/papers/paper.html?i=${idx}`, self: true, icon: "fa-solid fa-file-pdf" });
      if (p.doi) {
        if (/^arxiv:/i.test(p.doi)) {
          links.push({ label: "arXiv", href: "https://arxiv.org/abs/" + p.doi.replace(/^arxiv:/i, ""), icon: "fa-solid fa-arrow-up-right-from-square" });
        } else {
          links.push({ label: "DOI", href: p.doi.startsWith("http") ? p.doi : `https://doi.org/${p.doi}`, icon: "fa-solid fa-arrow-up-right-from-square" });
        }
      }
      if (p.link) links.push({ label: "Link", href: p.link, icon: "fa-solid fa-arrow-up-right-from-square" });
      if (p.code) links.push({ label: "Code", href: p.code, icon: "fa-brands fa-github" });
      const linksHtml = links.length
        ? `<div class="pub-links">${links
            .map(
              (l) =>
                `<a href="${esc(l.href)}"${l.self ? "" : ' target="_blank" rel="noopener"'}>${
                  l.icon ? `<i class="${esc(l.icon)}"></i> ` : ""
                }${esc(l.label)}</a>`
            )
            .join("")}</div>`
        : "";

      // Collapsible technical summary (native <details> dropdown).
      const detailsHtml =
        Array.isArray(p.highlights) && p.highlights.length
          ? `<details class="pub-details">
               <summary>Technical summary</summary>
               <ul>${p.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
             </details>`
          : "";

      card.innerHTML = `
        ${p.type ? `<span class="pub-type">${esc(p.type)}</span>` : ""}
        <h4 class="pub-title">${esc(p.title)}</h4>
        ${p.authors ? `<p class="pub-authors">${esc(p.authors)}</p>` : ""}
        <p class="pub-venue">${[p.venue, p.year].filter(Boolean).map(esc).join(", ")}${
        p.note ? ` <span class="pub-badge">${esc(p.note)}</span>` : ""
      }</p>
        ${detailsHtml}
        ${linksHtml}`;
      box.appendChild(card);
    });
  }

  /* ------------------------------------------------------------------ *
   * Participation (workshops, competitions, volunteering)
   * ------------------------------------------------------------------ */
  function renderParticipation(items) {
    const box = document.getElementById("participation-list");
    if (!box || !Array.isArray(items)) return;
    const sorted = [...items].sort((a, b) => {
      const ya = parseInt((String(a.year || "").match(/\d{4}/) || [0])[0], 10);
      const yb = parseInt((String(b.year || "").match(/\d{4}/) || [0])[0], 10);
      return yb - ya;
    });
    box.innerHTML = "";
    sorted.forEach((p) => {
      const card = el(p.link ? "a" : "div", "participation-item");
      if (p.link) {
        card.href = p.link;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
      }
      const meta = [p.role, p.organizer, p.location].filter(Boolean).map(esc).join(" · ");
      card.innerHTML = `
        <div class="part-main">
          <h4>${esc(p.title)}</h4>
          ${meta ? `<p class="part-meta">${meta}</p>` : ""}
          ${p.note ? `<p class="part-note">${esc(p.note)}</p>` : ""}
        </div>
        ${p.year ? `<span class="ach-badge year">${esc(p.year)}</span>` : ""}`;
      box.appendChild(card);
    });
  }

  /* ------------------------------------------------------------------ *
   * Supervisors / references
   * ------------------------------------------------------------------ */
  function renderSupervisors(items) {
    const box = document.getElementById("supervisors-list");
    if (!box || !Array.isArray(items)) return;
    box.innerHTML = "";
    items.forEach((s) => {
      const card = el(s.url ? "a" : "div", "card supervisor-card");
      if (s.url) {
        card.href = s.url;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
      }
      card.innerHTML = `
        <div class="sup-avatar">${
          s.image
            ? `<img src="${esc(s.image)}" alt="${esc(s.name)}" loading="lazy">`
            : `<i class="fa-solid fa-user"></i>`
        }</div>
        <div class="sup-body">
          <h4>${esc(s.name)}</h4>
          ${s.role ? `<p class="sup-role">${esc(s.role)}</p>` : ""}
          ${s.affiliation ? `<p class="sup-aff">${esc(s.affiliation)}</p>` : ""}
          ${s.email ? `<p class="sup-email"><a href="mailto:${esc(s.email)}">${esc(s.email)}</a></p>` : ""}
        </div>`;
      box.appendChild(card);
    });
  }

  /* ------------------------------------------------------------------ *
   * Blog
   * ------------------------------------------------------------------ */
  function renderBlog(items) {
    const box = document.getElementById("blog-list");
    if (!box || !Array.isArray(items)) return;
    box.innerHTML = "";
    items.forEach((b) => {
      const card = el(b.link ? "a" : "div", "card blog-card");
      if (b.link) {
        card.href = b.link;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
      }
      card.innerHTML = `
        ${b.image ? `<img src="${esc(b.image)}" alt="${esc(b.title)}" loading="lazy">` : ""}
        <div class="card-body">
          ${b.date ? `<span class="blog-date">${esc(b.date)}</span>` : ""}
          <h3 class="card-title">${esc(b.title)}</h3>
          ${b.excerpt ? `<p class="card-text">${esc(b.excerpt)}</p>` : ""}
          ${b.link ? `<span class="a-link" style="margin-top:8px;display:inline-block">Read →</span>` : ""}
        </div>`;
      box.appendChild(card);
    });
  }

  /* ------------------------------------------------------------------ *
   * About summary clamp / read more toggle
   * ------------------------------------------------------------------ */
  function setupSummary(profile) {
    const summaryEl = document.querySelector('[data-bind="summary"]');
    const readMore = document.getElementById("about-readmore");
    const readLess = document.getElementById("about-readless");
    if (!summaryEl) return;

    summaryEl.textContent = profile.summary || "";
    summaryEl.classList.add("clamp");
    let expanded = false;

    function updateToggle() {
      const clamped = summaryEl.scrollHeight > summaryEl.clientHeight + 1;
      readMore.style.display = !expanded && clamped ? "inline" : "none";
      readLess.style.display = expanded ? "inline" : "none";
    }
    readMore.addEventListener("click", (e) => {
      e.preventDefault();
      expanded = true;
      summaryEl.classList.remove("clamp");
      updateToggle();
    });
    readLess.addEventListener("click", (e) => {
      e.preventDefault();
      expanded = false;
      summaryEl.classList.add("clamp");
      updateToggle();
    });
    window.addEventListener("resize", updateToggle);
    updateToggle();
  }

  /* ------------------------------------------------------------------ *
   * Footer year, scroll reveal, back-to-top
   * ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    const y = document.getElementById("footer-year");
    if (y) y.textContent = new Date().getFullYear();
  });

  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  const toTop = document.getElementById("to-top");
  window.addEventListener("scroll", () => {
    const yy = window.scrollY || document.documentElement.scrollTop;
    toTop.classList.toggle("show", yy > 400);
  });
  toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
})();
