Scan my entire workspace — CV, publications, project files, work experience notes, and contribution records — and generate a research summary as a LaTeX file (research_summary.tex), fitting strictly within 1 page, maximum 2 pages, on A4.

SCOPE — Projects:
Only include these projects, and only these, in this order:
1. AGV Fleet (CYBERFLEET)
2. Man-Transportable EOD Robot (Jontro Soinik 2.0)
3. Autonomous Target-Tracking Drone
4. Toll-Booth Automation
5. Jontro Soinik 1.0 EOD ROVs
6. IUT Mars Rover (Project Altair, Team Avijatrik)
Ignore any other projects found in the workspace even if present in CV/files.

DEDUPLICATION:
Identify any contribution/theme/idea repeated across sources and keep it in exactly ONE place. Priority when sources overlap or conflict:
1. CV (most accurate — source of truth)
2. Publications
3. Project files
If the CV covers something, use the CV's version and drop the rest. Never state the same contribution twice.

FORMAT — this is the key change, read carefully:
Do NOT use bullet points for projects or publications. Write them as flowing narrative paragraphs, like a research statement — one contribution leading into the next, showing progression/trajectory over time (chronological or thematic, whichever flows better as a story of my research experience).

1. Projects Paragraph (one paragraph only):
Narrate my work across the six listed projects as a connected flow — what problem each tackled, my specific contribution, and how they build on or relate to each other (e.g., progression from EOD robotics to autonomous systems to fleet management, or whatever the real thread is). Keep it tight — no fluff, no marketing adjectives, just what was done and by whom (me).

2. Publications Paragraph (one paragraph only):
Narrate my publications the same way — as a flow, not a list. Title, venue, year, and contribution woven into sentences. If a publication is the write-up of a project already covered in the Projects paragraph, don't re-explain the work — just mention the publication briefly (e.g., "This work was published as [Title] at [Venue, Year].").

3. Achievements & Certifications — bullet points, separate section, kept minimal (just names/titles, no elaboration, smallest section on the page).

4. Skills — bullet points, separate section, one bullet per category, comma-separated values only, no descriptions:
Languages: ...
ML/DL: ...
Domains: ...
Tools: ...
Merge sparse categories into "Other" if it saves space.

HARD RULES:
- Both paragraphs must read as prose — full sentences with natural transitions, not disguised lists. No bullet points, no bold-per-item, no line breaks per project/publication within these two paragraphs.
- Only bullet points allowed are in Achievements/Certifications and Skills sections.
- Output valid, compilable LaTeX (article class, minimal preamble, geometry package ~1.5cm margins, no title page).
- No adjectives, no marketing language, no filler — dense and factual throughout.
- Fit in 1 page; only spill to a 2nd page if truly unavoidable, and even then trim aggressively first.
- If a detail is missing or ambiguous, mark it [NEED CLARIFICATION] inline rather than guessing.
- Final output is the .tex source only, ready to compile with pdflatex.