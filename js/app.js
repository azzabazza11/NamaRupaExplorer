import {
  APP,
  GROUPS,
  FACTORS,
  PHENOMENA,
  THREADS,
  SUTTAS,
  PHENOMENON_KINDS,
  groupById,
  factorById,
  phenomenonById,
  suttaById,
  factorsInGroup,
  relatedFactors,
  factorsForThread,
  factorsForPhenomenon,
  searchCatalog,
} from "./data.js";

const root = document.getElementById("app");
const THEME_KEY = "nre-theme";

const GROUP_COLORS = {
  magga: "gold",
  bojjhanga: "amber",
  indriya: "moss",
  bala: "teal",
  satipatthana: "clay",
  padhana: "rust",
  iddhipada: "plum",
};

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function parseHash() {
  const raw = (location.hash || "#/").replace(/^#/, "");
  const [pathPart, queryPart] = raw.split("?");
  const parts = pathPart.split("/").filter(Boolean);
  const query = Object.fromEntries(new URLSearchParams(queryPart || ""));
  return { parts, query };
}

function navigate(to) {
  if (!to.startsWith("#")) to = `#${to}`;
  if (location.hash === to) render();
  else location.hash = to;
}

function crumb(items) {
  return `<nav class="crumb">${items
    .map((item, i) =>
      i === items.length - 1
        ? `<span>${esc(item.label)}</span>`
        : `<a href="${esc(item.href)}">${esc(item.label)}</a> · `,
    )
    .join("")}</nav>`;
}

function suttaList(ids) {
  const rows = (ids || []).map((id) => suttaById(id)).filter(Boolean);
  if (!rows.length) return `<p class="muted">No sutta pointers recorded yet.</p>`;
  return rows
    .map(
      (s) => `
      <article class="sutta">
        <div>
          <a href="#/sutta/${esc(s.id)}"><strong>${esc(s.ref)}</strong> ${esc(s.title)}</a>
          <div class="pali">${esc(s.pali)}</div>
          <p class="muted">${esc(s.note)}</p>
        </div>
        <a class="chip" href="${esc(s.sc)}" rel="noopener" target="_blank">SuttaCentral</a>
      </article>`,
    )
    .join("");
}

function factorRow(factor) {
  const group = groupById(factor.group);
  return `
    <a class="factor-row" href="#/factor/${esc(factor.id)}">
      <span class="idx">${factor.n}</span>
      <span>
        <strong>${esc(factor.english)}</strong>
        <div class="pali">${esc(factor.pali)}</div>
      </span>
      <span class="chip"><span class="swatch ${GROUP_COLORS[group.id]}"></span>${esc(group.n)}</span>
    </a>`;
}

function hubSvg() {
  const labels = {
    magga: "Path",
    bojjhanga: "Awakening",
    indriya: "Faculties",
    bala: "Powers",
    satipatthana: "Mindfulness",
    padhana: "Striving",
    iddhipada: "Bases",
  };
  return `
    <div class="hub" role="navigation" aria-label="Seven groups around the 37">
      <div class="hub-ring"></div>
      ${GROUPS.map(
        (g, i) => `
        <a class="hub-node" href="#/group/${g.id}" style="--i:${i}">
          <span class="n">${g.n}</span>
          <span class="lbl">${esc(labels[g.id])}</span>
        </a>`,
      ).join("")}
      <div class="hub-center">
        <strong>37</strong>
        <span>bodhipakkhiyā</span>
      </div>
    </div>`;
}

function viewHome() {
  return `
    <p class="kicker">Theravāda study hub</p>
    <h1>${esc(APP.subtitle)}</h1>
    <p class="lede">${esc(APP.tagline)} Memorize as <strong>${esc(APP.mnemonic)}</strong>. Canonical lists usually run 4-4-4-5-5-7-8; both orders are the same seven sets.</p>
    ${hubSvg()}
    <div class="group-grid">
      ${GROUPS.map(
        (g) => `
        <a class="card" href="#/group/${g.id}">
          <div class="n">${g.n}</div>
          <h2>${esc(g.english)}</h2>
          <div class="pali">${esc(g.pali)}</div>
          <p class="muted">${esc(g.gloss)}</p>
        </a>`,
      ).join("")}
    </div>
    <div class="card-grid">
      <a class="card" href="#/threads"><h3>Cross-links</h3><p class="muted">Follow sati, viriya, samādhi, paññā, saddhā, and sīla across the seven sets.</p></a>
      <a class="card" href="#/phenomena"><h3>Phenomena</h3><p class="muted">Nāma-rūpa, nidānas, aggregates, truths, and hindrances — linked back into the 37.</p></a>
      <a class="card" href="#/plan"><h3>Plan &amp; to-do</h3><p class="muted">PWA now; richer excerpts, maps, and visuals next.</p></a>
    </div>`;
}

function viewGroups() {
  return `
    ${crumb([{ href: "#/", label: "Hub" }, { href: "#/groups", label: "Groups" }])}
    <h1>Seven sets</h1>
    <p class="lede">Eight path factors, seven awakening factors, five faculties, five powers, four satipaṭṭhāna, four right strivings, four bases of power.</p>
    <div class="factor-list" style="margin-top:16px">
      ${GROUPS.map(
        (g) => `
        <a class="factor-row" href="#/group/${g.id}">
          <span class="idx">${g.n}</span>
          <span><strong>${esc(g.english)}</strong><div class="pali">${esc(g.pali)}</div></span>
          <span class="chip"><span class="swatch ${GROUP_COLORS[g.id]}"></span>${g.canonicalOrder === 1 ? "sutta order first" : `sutta #${g.canonicalOrder}`}</span>
        </a>`,
      ).join("")}
    </div>`;
}

function viewGroup(id) {
  const g = groupById(id);
  if (!g) return viewNotFound();
  const factors = factorsInGroup(id);
  return `
    ${crumb([
      { href: "#/", label: "Hub" },
      { href: "#/groups", label: "Groups" },
      { href: `#/group/${g.id}`, label: g.english },
    ])}
    <p class="kicker">${g.n} factors · set ${g.order} in the 8-7-5-5-4-4-4 mnemonic</p>
    <h1>${esc(g.english)}</h1>
    <p class="pali">${esc(g.pali)}</p>
    <div class="two-col">
      <section class="panel">
        <p>${esc(g.essence)}</p>
        <p class="formula">${esc(g.formula)}</p>
        <div class="factor-list">${factors.map(factorRow).join("")}</div>
      </section>
      <aside class="panel">
        <h3>Suttas</h3>
        ${suttaList(g.suttas)}
      </aside>
    </div>`;
}

function viewFactor(id) {
  const f = factorById(id);
  if (!f) return viewNotFound();
  const group = groupById(f.group);
  const same = (f.sameAs || []).map(factorById).filter(Boolean);
  const related = relatedFactors(f).filter((x) => !same.some((s) => s.id === x.id));
  const phenomena = (f.phenomena || []).map(phenomenonById).filter(Boolean);
  const threads = THREADS.filter((t) => f.threads.includes(t.id));
  return `
    ${crumb([
      { href: "#/", label: "Hub" },
      { href: `#/group/${group.id}`, label: group.english },
      { href: `#/factor/${f.id}`, label: f.english },
    ])}
    <p class="kicker">${group.english} · ${f.n} of ${group.n}</p>
    <h1>${esc(f.english)}</h1>
    <p class="pali">${esc(f.pali)}</p>
    <div class="chips">
      ${threads.map((t) => `<a class="chip" href="#/thread/${t.id}">${esc(t.english)}</a>`).join("")}
    </div>
    <div class="two-col">
      <section>
        <article class="panel">
          <h3>Essential meaning</h3>
          <p>${esc(f.essence)}</p>
          <p class="formula">${esc(f.formula)}</p>
        </article>
        <article class="panel">
          <h3>In practice</h3>
          <p>${esc(f.practice)}</p>
        </article>
        <article class="panel">
          <h3>Suttas &amp; excerpts</h3>
          <p class="muted">Short Pali formulas here; full translations on SuttaCentral. Later passes will add more excerpt cards.</p>
          ${suttaList(f.suttas)}
        </article>
      </section>
      <aside>
        <article class="panel">
          <h3>Same quality</h3>
          ${same.length ? same.map(factorRow).join("") : `<p class="muted">This factor is distinctive in its set.</p>`}
        </article>
        <article class="panel">
          <h3>Also linked</h3>
          ${related.slice(0, 8).map(factorRow).join("") || `<p class="muted">No extra cross-links yet.</p>`}
        </article>
        <article class="panel">
          <h3>Phenomena</h3>
          <div class="chips">
            ${phenomena.map((p) => `<a class="chip" href="#/phenomenon/${p.id}">${esc(p.english)}</a>`).join("") || `<span class="muted">—</span>`}
          </div>
        </article>
      </aside>
    </div>`;
}

function viewThreads() {
  return `
    ${crumb([{ href: "#/", label: "Hub" }, { href: "#/threads", label: "Threads" }])}
    <h1>Cross-linked qualities</h1>
    <p class="lede">The 37 are seven windows on a smaller set of faculties. Follow a thread to see the same dhamma in each office.</p>
    <div class="group-grid">
      ${THREADS.map(
        (t) => `
        <a class="card" href="#/thread/${t.id}">
          <h2>${esc(t.english)}</h2>
          <div class="pali">${esc(t.pali)}</div>
          <p class="muted">${esc(t.essence)}</p>
        </a>`,
      ).join("")}
    </div>`;
}

function viewThread(id) {
  const t = THREADS.find((x) => x.id === id);
  if (!t) return viewNotFound();
  const factors = factorsForThread(id);
  return `
    ${crumb([
      { href: "#/", label: "Hub" },
      { href: "#/threads", label: "Threads" },
      { href: `#/thread/${t.id}`, label: t.english },
    ])}
    <h1>${esc(t.english)}</h1>
    <p class="pali">${esc(t.pali)}</p>
    <p class="lede">${esc(t.essence)}</p>
    <div class="factor-list" style="margin-top:16px">${factors.map(factorRow).join("")}</div>`;
}

function viewPhenomena() {
  const kinds = Object.keys(PHENOMENON_KINDS);
  return `
    ${crumb([{ href: "#/", label: "Hub" }, { href: "#/phenomena", label: "Phenomena" }])}
    <h1>Phenomena &amp; Dhamma</h1>
    <p class="lede">Dependent origination, aggregates, truths, and related teachings, joined to the 37 so study can move without breaking the thread.</p>
    ${kinds
      .map((kind) => {
        const items = PHENOMENA.filter((p) => p.kind === kind);
        if (!items.length) return "";
        return `
          <h2 style="margin-top:22px">${esc(PHENOMENON_KINDS[kind])}</h2>
          <div class="chips">
            ${items.map((p) => `<a class="chip" href="#/phenomenon/${p.id}">${esc(p.english)}</a>`).join("")}
          </div>`;
      })
      .join("")}
    <p style="margin-top:28px"><a class="chip" href="./legacy/paticca.html">Open the original paṭiccasamuppāda sketch</a></p>`;
}

function viewPhenomenon(id) {
  const p = phenomenonById(id);
  if (!p) return viewNotFound();
  const factors = factorsForPhenomenon(id);
  const related = (p.related || []).map(phenomenonById).filter(Boolean);
  return `
    ${crumb([
      { href: "#/", label: "Hub" },
      { href: "#/phenomena", label: "Phenomena" },
      { href: `#/phenomenon/${p.id}`, label: p.english },
    ])}
    <p class="kicker">${esc(PHENOMENON_KINDS[p.kind] || p.kind)}</p>
    <h1>${esc(p.english)}</h1>
    <p class="pali">${esc(p.pali)}</p>
    <div class="two-col">
      <section class="panel">
        <p>${esc(p.essence)}</p>
        <h3>Linked factors</h3>
        <div class="factor-list">${factors.map(factorRow).join("") || `<p class="muted">No factor links yet.</p>`}</div>
      </section>
      <aside class="panel">
        <h3>Related phenomena</h3>
        <div class="chips">
          ${related.map((r) => `<a class="chip" href="#/phenomenon/${r.id}">${esc(r.english)}</a>`).join("") || `<span class="muted">—</span>`}
        </div>
      </aside>
    </div>`;
}

function viewSutta(id) {
  const s = suttaById(id);
  if (!s) return viewNotFound();
  const usedByFactors = FACTORS.filter((f) => f.suttas.includes(id));
  const usedByGroups = GROUPS.filter((g) => g.suttas.includes(id));
  return `
    ${crumb([{ href: "#/", label: "Hub" }, { href: `#/sutta/${s.id}`, label: s.ref }])}
    <p class="kicker">Sutta pointer</p>
    <h1>${esc(s.ref)} · ${esc(s.title)}</h1>
    <p class="pali">${esc(s.pali)}</p>
    <div class="panel">
      <p>${esc(s.note)}</p>
      <p><a class="chip" href="${esc(s.sc)}" rel="noopener" target="_blank">Read on SuttaCentral</a></p>
    </div>
    <div class="two-col">
      <section class="panel">
        <h3>Groups that cite this</h3>
        ${usedByGroups.map((g) => `<a class="chip" href="#/group/${g.id}">${esc(g.english)}</a>`).join(" ") || `<p class="muted">—</p>`}
      </section>
      <section class="panel">
        <h3>Factors that cite this</h3>
        <div class="factor-list">${usedByFactors.map(factorRow).join("") || `<p class="muted">—</p>`}</div>
      </section>
    </div>`;
}

function viewSearch(q) {
  const found = searchCatalog(q || "");
  const any = found.groups.length + found.factors.length + found.phenomena.length + found.suttas.length + found.threads.length;
  return `
    ${crumb([{ href: "#/", label: "Hub" }, { href: "#/search", label: "Search" }])}
    <h1>Search</h1>
    <p class="lede">Look across groups, factors, phenomena, threads, and sutta pointers. Works offline once the app is cached.</p>
    <p class="search-wrap show-mobile" style="position:static;padding:0;border:0;background:transparent">
      <input id="search-page-input" type="search" placeholder="sati, MN 10, craving…" value="${esc(q || "")}" />
    </p>
    ${!q ? `<p class="empty">Type a Pali term, English name, or sutta number.</p>` : ""}
    ${q && !any ? `<p class="empty">No matches for “${esc(q)}”.</p>` : ""}
    ${found.groups.length ? `<h2>Groups</h2><div class="chips">${found.groups.map((g) => `<a class="chip" href="#/group/${g.id}">${esc(g.english)}</a>`).join("")}</div>` : ""}
    ${found.threads.length ? `<h2>Threads</h2><div class="chips">${found.threads.map((t) => `<a class="chip" href="#/thread/${t.id}">${esc(t.english)}</a>`).join("")}</div>` : ""}
    ${found.factors.length ? `<h2>Factors</h2><div class="factor-list">${found.factors.map(factorRow).join("")}</div>` : ""}
    ${found.phenomena.length ? `<h2>Phenomena</h2><div class="chips">${found.phenomena.map((p) => `<a class="chip" href="#/phenomenon/${p.id}">${esc(p.english)}</a>`).join("")}</div>` : ""}
    ${found.suttas.length ? `<h2>Suttas</h2>${suttaList(found.suttas.map((s) => s.id))}` : ""}`;
}

function viewPlan() {
  return `
    ${crumb([{ href: "#/", label: "Hub" }, { href: "#/plan", label: "Plan" }])}
    <h1>Plan forward</h1>
    <p class="lede">A static HTML/JS PWA on GitHub Pages. Content first; maps and richer visuals after the 37 are solid.</p>
    <ul class="todo">
      <li><span class="badge now">Now</span><span>Ship the hub: 8-7-5-5-4-4-4 groups, 37 factor pages, threads, phenomena, sutta pointers, installable PWA.</span></li>
      <li><span class="badge next">Next</span><span>Expand excerpt cards (Pali + short original English) and add more Saṃyutta/Aṅguttara citations per factor.</span></li>
      <li><span class="badge next">Next</span><span>Rebuild the paṭiccasamuppāda map with complete nidāna positions and click-through into this catalog.</span></li>
      <li><span class="badge later">Later</span><span>Visual layers: overlap diagram of the 14 unique qualities, faculty/power slider, bojjhaṅga nutriment map.</span></li>
      <li><span class="badge later">Later</span><span>Study aids: recitation order, bookmarks, last-read, optional dark-retreat palette.</span></li>
      <li><span class="badge later">Later</span><span>Desktop packaging if needed (PWA install covers most cases). Keep the app CDN-free and offline-first.</span></li>
    </ul>
    <div class="panel">
      <h3>Doctrinal guardrails</h3>
      <p>Original essential notes, public-domain Pali formulas, and outbound SuttaCentral links. No copyrighted translation blocks. Canonical order 4-4-4-5-5-7-8 remains available beside the 8-7-5-5-4-4-4 mnemonic.</p>
    </div>`;
}

function viewAbout() {
  return `
    ${crumb([{ href: "#/", label: "Hub" }, { href: "#/about", label: "About" }])}
    <h1>About this hub</h1>
    <p>${esc(APP.title)} is a Theravāda educational PWA. It grows out of an early nāma-rūpa / paṭiccasamuppāda sketch and now centres on the 37 bodhipakkhiyā dhammā.</p>
    <p>Install it from the browser on a phone or desktop. After the first visit it works offline. GPL-3.0.</p>
    <p><a class="chip" href="#/plan">Open the to-do list</a> <a class="chip" href="./legacy/paticca.html">Legacy visualization</a></p>`;
}

function viewNotFound() {
  return `<h1>Not found</h1><p class="muted">That page is not in the catalog.</p><p><a href="#/">Return to the hub</a></p>`;
}

function render() {
  const { parts, query } = parseHash();
  const [a, b] = parts;
  let title = APP.title;
  let html;
  if (!a) {
    html = viewHome();
  } else if (a === "groups") {
    html = viewGroups();
    title = `Groups · ${APP.title}`;
  } else if (a === "group" && b) {
    html = viewGroup(b);
    title = `${groupById(b)?.english || "Group"} · ${APP.title}`;
  } else if (a === "factor" && b) {
    html = viewFactor(b);
    title = `${factorById(b)?.english || "Factor"} · ${APP.title}`;
  } else if (a === "threads") {
    html = viewThreads();
    title = `Threads · ${APP.title}`;
  } else if (a === "thread" && b) {
    html = viewThread(b);
    title = `${THREADS.find((t) => t.id === b)?.english || "Thread"} · ${APP.title}`;
  } else if (a === "phenomena") {
    html = viewPhenomena();
    title = `Phenomena · ${APP.title}`;
  } else if (a === "phenomenon" && b) {
    html = viewPhenomenon(b);
    title = `${phenomenonById(b)?.english || "Phenomenon"} · ${APP.title}`;
  } else if (a === "sutta" && b) {
    html = viewSutta(b);
    title = `${suttaById(b)?.ref || "Sutta"} · ${APP.title}`;
  } else if (a === "search") {
    html = viewSearch(query.q || "");
    title = `Search · ${APP.title}`;
  } else if (a === "plan") {
    html = viewPlan();
    title = `Plan · ${APP.title}`;
  } else if (a === "about") {
    html = viewAbout();
    title = `About · ${APP.title}`;
  } else {
    html = viewNotFound();
  }

  root.innerHTML = html;
  document.title = title;
  syncNav(a);
  const pageSearch = document.getElementById("search-page-input");
  if (pageSearch) {
    pageSearch.addEventListener("change", (e) => navigate(`#/search?q=${encodeURIComponent(e.target.value)}`));
    pageSearch.addEventListener("keydown", (e) => {
      if (e.key === "Enter") navigate(`#/search?q=${encodeURIComponent(e.target.value)}`);
    });
  }
  window.scrollTo(0, 0);
}

function syncNav(route) {
  const map = {
    "": "home",
    groups: "groups",
    group: "groups",
    threads: "threads",
    thread: "threads",
    phenomena: "phenomena",
    phenomenon: "phenomena",
    search: "search",
  };
  const key = map[route || ""] || "";
  document.querySelectorAll(".nav a").forEach((a) => {
    a.classList.toggle("active", a.dataset.nav === key);
  });
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
}

function setupChrome() {
  const search = document.getElementById("global-search");
  search.addEventListener("keydown", (e) => {
    if (e.key === "Enter") navigate(`#/search?q=${encodeURIComponent(search.value)}`);
  });
  document.getElementById("search-toggle").addEventListener("click", () => {
    const wrap = document.getElementById("mobile-search");
    wrap.classList.toggle("show-mobile");
    wrap.querySelector("input").focus();
  });
  document.getElementById("mobile-search-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") navigate(`#/search?q=${encodeURIComponent(e.target.value)}`);
  });
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    applyTheme(next);
  });
  applyTheme(localStorage.getItem(THEME_KEY) || "dark");
  window.addEventListener("hashchange", render);
  window.addEventListener("online", () => document.body.classList.remove("offline"));
  window.addEventListener("offline", () => document.body.classList.add("offline"));
  if (!navigator.onLine) document.body.classList.add("offline");
}

function registerWorker() {
  if (!("serviceWorker" in navigator)) return;
  const swUrl = new URL("./sw.js", document.baseURI);
  navigator.serviceWorker.register(swUrl.href).catch(() => {});
}

setupChrome();
render();
registerWorker();
