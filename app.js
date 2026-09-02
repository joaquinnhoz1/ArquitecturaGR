/* ===========================================================================
   ESTUDIO GR — app.js
   Render de contenido + motor de scroll cinematográfico + interacciones
   =========================================================================== */
(function () {
  "use strict";
  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]
  ));

  /* ---------------------------------------------------------------------- *
   *  0 · CONTENIDO EDITABLE (content.json → override de data.js)
   * ---------------------------------------------------------------------- */
  // content.json es la fuente de verdad editable desde /admin. Si no existe
  // o falla, el sitio usa los valores por defecto de data.js + el HTML.
  window.CONTENT = null;
  async function loadContent() {
    try {
      const r = await fetch("content.json", { cache: "no-store" });
      if (!r.ok) return;
      const c = await r.json();
      window.CONTENT = c;
      if (Array.isArray(c.servicios) && c.servicios.length) window.SERVICIOS = c.servicios;
      if (Array.isArray(c.metodo) && c.metodo.length) window.METODO = c.metodo;
      if (Array.isArray(c.chips) && c.chips.length) window.CHIPS = c.chips;
      if (Array.isArray(c.projects) && c.projects.length) window.PROJECTS = c.projects;
    } catch (e) {
      /* offline / archivo ausente → defaults */
    }
  }

  const setText = (sel, val) => { const el = $(sel); if (el != null && val != null) el.textContent = val; };
  const setHTML = (sel, val) => { const el = $(sel); if (el != null && val != null) el.innerHTML = val; };
  const setAttr = (sel, attr, val) => { const el = $(sel); if (el != null && val != null) el.setAttribute(attr, val); };

  function applyContent() {
    const c = window.CONTENT;
    if (!c) return;
    const t = c.texts || {};

    if (t.hero) {
      setText('.film__cap[data-cap="hero"] .film__eyebrow', t.hero.eyebrow);
      setHTML('.film__cap[data-cap="hero"] .film__title', t.hero.title);
      setText('.film__cap[data-cap="hero"] .film__sub', t.hero.sub);
      const b = $('.film__cap[data-cap="hero"] .btn'); if (b && t.hero.ctaPrimary) b.childNodes[0].nodeValue = t.hero.ctaPrimary + " ";
      const l = $('.film__cap[data-cap="hero"] .hero__link'); if (l && t.hero.ctaSecondary) l.textContent = t.hero.ctaSecondary;
    }
    if (t.filmEstudio) {
      setText('.film__cap[data-cap="estudio"] .film__eyebrow', t.filmEstudio.eyebrow);
      setHTML('.film__cap[data-cap="estudio"] .film__title', t.filmEstudio.title);
      setText('.film__cap[data-cap="estudio"] .film__sub', t.filmEstudio.sub);
      const st = $$('.film__cap[data-cap="estudio"] .stat');
      if (st[0]) { setText('.film__cap[data-cap="estudio"] .stat:nth-child(1) .n', t.filmEstudio.stat1n); setText('.film__cap[data-cap="estudio"] .stat:nth-child(1) .l', t.filmEstudio.stat1l); }
      if (st[1]) { setText('.film__cap[data-cap="estudio"] .stat:nth-child(2) .n', t.filmEstudio.stat2n); setText('.film__cap[data-cap="estudio"] .stat:nth-child(2) .l', t.filmEstudio.stat2l); }
    }
    if (t.filmCocina) {
      setText('.film__cap[data-cap="cocina"] .film__eyebrow', t.filmCocina.eyebrow);
      setHTML('.film__cap[data-cap="cocina"] .film__title', t.filmCocina.title);
      setText('.film__cap[data-cap="cocina"] .film__sub', t.filmCocina.sub);
    }
    if (t.filmPatio) {
      setText('.film__cap[data-cap="patio"] .film__eyebrow', t.filmPatio.eyebrow);
      setHTML('.film__cap[data-cap="patio"] .film__title', t.filmPatio.title);
      setText('.film__cap[data-cap="patio"] .film__sub', t.filmPatio.sub);
    }
    if (t.servicios) {
      setText('#espacios .eyebrow', t.servicios.eyebrow);
      setHTML('#espacios .section__head h2', t.servicios.title);
      setHTML('#espacios .lede', t.servicios.lede);
    }
    if (t.portfolio) {
      setText('#portfolio .eyebrow', t.portfolio.eyebrow);
      setHTML('#portfolio .section__head h2', t.portfolio.title);
      setHTML('#portfolio .lede', t.portfolio.lede);
    }
    if (t.metodo) {
      setText('#metodo .eyebrow', t.metodo.eyebrow);
      setHTML('#metodo .metodo__aside h2', t.metodo.title);
      setHTML('#metodo .metodo__aside .lede', t.metodo.lede);
    }
    if (t.contacto) {
      setText('#contacto .eyebrow', t.contacto.eyebrow);
      setHTML('#contacto .contacto__intro h2', t.contacto.title);
      setText('#contacto .contacto__intro > p', t.contacto.text);
      const whys = $$('#contacto .why li');
      (t.contacto.why || []).forEach((w, i) => {
        if (whys[i]) {
          const svg = whys[i].querySelector("svg");
          whys[i].textContent = "";
          if (svg) whys[i].appendChild(svg);
          whys[i].appendChild(document.createTextNode(w));
        }
      });
    }
    if (t.footer) {
      setHTML('.footer__cta', t.footer.cta);
      setHTML('.footer__slogan', t.footer.slogan);
      setText('.footer__brand > p:last-child', t.footer.desc);
    }

    const ct = c.contact || {};
    if (ct.email) { setText('.footer__col a[href^="mailto"]', ct.email); setAttr('.footer__col a[href^="mailto"]', "href", "mailto:" + ct.email); }
    if (ct.phone) { setText('.footer__col a[href^="tel"]', ct.phone); setAttr('.footer__col a[href^="tel"]', "href", "tel:" + (ct.phoneHref || ct.phone).replace(/[^\d+]/g, "")); }
    if (ct.location) setText('.footer__col a[href^="tel"] ~ p', ct.location);
    if (ct.instagram) setAttr('.footer__social a[aria-label="Instagram"]', "href", ct.instagram);
    if (ct.facebook) setAttr('.footer__social a[aria-label="Facebook"]', "href", ct.facebook);
    if (ct.whatsapp) setAttr('.footer__social a[aria-label="WhatsApp"]', "href", ct.whatsapp);
    if (ct.handle) setText('.footer__col:last-child > p:last-child', ct.handle);

    const f = c.film || {};
    const fm = { fachada: f.fachada, living: f.living, cocina: f.cocina, patio: f.patio };
    $$(".film__layer").forEach((l) => {
      const src = fm[l.dataset.shot];
      const img = l.querySelector(".scene-img");
      if (src && img && img.getAttribute("src") !== src) img.setAttribute("src", src);
    });
  }

  /* ---------------------------------------------------------------------- *
   *  1 · RENDER DE CONTENIDO
   * ---------------------------------------------------------------------- */
  function renderServicios() {
    const ul = $("#servicios");
    if (!ul || !window.SERVICIOS) return;
    ul.innerHTML = window.SERVICIOS.map((s, i) => `
      <li class="servicio reveal" style="--delay:${(i % 4) * 0.05}s">
        <span class="servicio__num">${String(i + 1).padStart(2, "0")}</span>
        <div>
          <div class="servicio__name">${s.name}</div>
        </div>
        <p class="servicio__desc">${s.desc}</p>
        <svg class="servicio__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </li>`).join("");
  }

  function renderSteps() {
    const wrap = $("#steps");
    if (!wrap || !window.METODO) return;
    wrap.innerHTML = window.METODO.map((s, i) => `
      <div class="step reveal" style="--delay:${(i % 2) * 0.08}s">
        <div class="step__n">${String(i + 1).padStart(2, "0")}</div>
        <div>
          <h3 class="step__t">${s.t}</h3>
          <p class="step__d">${s.d}</p>
        </div>
      </div>`).join("");
  }

  function renderChips() {
    const box = $("#chips");
    if (!box || !window.CHIPS) return;
    box.innerHTML = window.CHIPS.map((c) => `<span class="chip" data-on="false" role="checkbox" aria-checked="false">${c}</span>`).join("");
  }

  // Proyectos visibles = los que no están ocultos (p.ej. sin fotos todavía).
  function visibleProjects() {
    return (window.PROJECTS || []).filter((p) => !p.hidden);
  }

  function renderFolio() {
    const folio = $("#folio");
    if (!folio || !window.PROJECTS) return;
    const list = visibleProjects();
    const total = list.length;
    folio.innerHTML = list.map((p, i) => `
      <article class="proj reveal" data-proj="${p.id}" data-scene data-screen-label="Proyecto ${i + 1}">
        <div class="proj__media">
          <div class="proj__img ph" data-ph="${esc(p.name)}">
            ${p.image ? `<img class="proj__photo" src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" />` : ""}
          </div>
          <div class="proj__scrim"></div>
          <span class="proj__no">${String(i + 1).padStart(2, "0")} <i>/ ${String(total).padStart(2, "0")}</i></span>
          <div class="proj__cap">
            <div class="proj__loc">${p.location} &nbsp;·&nbsp; ${p.type}</div>
            <h3 class="proj__name">${p.name}</h3>
            <span class="proj__view">Ver obra <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
          </div>
        </div>
      </article>`).join("");
    $$(".proj", folio).forEach((el) =>
      el.addEventListener("click", () => openLightbox(el.dataset.proj))
    );
  }

  /* ---------------------------------------------------------------------- *
   *  2 · MOTOR DE SCROLL (--p por escena)
   * ---------------------------------------------------------------------- */
  let scenes = [];
  function collectScenes() {
    scenes = $$("[data-scene]").map((el) => ({
      el,
      pinned: el.classList.contains("scene"),
    }));
  }

  function updateScenes() {
    const vh = window.innerHeight;
    for (const s of scenes) {
      const r = s.el.getBoundingClientRect();
      let p;
      if (s.pinned) {
        const dist = r.height - vh;
        p = dist > 0 ? clamp(-r.top / dist, 0, 1) : (r.top < 0 ? 1 : 0);
      } else {
        p = clamp((vh - r.top) / (vh + r.height), 0, 1);
      }
      s.el.style.setProperty("--p", p.toFixed(4));
    }
    // método: barra de progreso ligada al recorrido de los pasos
    const steps = $("#steps");
    const bar = $(".metodo__progress");
    if (steps && bar) {
      const r = steps.getBoundingClientRect();
      const span = r.height - vh * 0.4;
      const mp = clamp((vh * 0.55 - r.top) / (span > 0 ? span : 1), 0, 1);
      bar.style.setProperty("--p", mp.toFixed(4));
    }
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        updateScenes();
        updateFilm();
        updateChrome();
        ticking = false;
      });
    }
  }

  /* ---------------------------------------------------------------------- *
   *  3 · CÁMARA CINEMATOGRÁFICA (film) + NAV / RECORRIDO / CHROME
   * ---------------------------------------------------------------------- */
  const nav = $("#nav");
  const recorrido = $("#recorrido");
  const filmEl = $("#film");

  // referencias del film
  const filmLayers = {};
  const filmLayerEls = {};
  $$(".film__layer", filmEl).forEach((l) => {
    filmLayers[l.dataset.shot] = l.querySelector(".scene-img");
    filmLayerEls[l.dataset.shot] = l;
  });
  const filmCaps = {};
  $$(".film__cap", filmEl).forEach((c) => (filmCaps[c.dataset.cap] = c));
  const filmTag = filmEl ? filmEl.querySelector(".film__tag") : null;
  const filmCue = filmEl ? filmEl.querySelector(".film__scrollcue") : null;
  const motionDamp = prefersReduced ? 0.4 : 1;

  const ramp = (P, a, b) => clamp((P - a) / (b - a), 0, 1);
  const smooth = (t) => t * t * (3 - 2 * t);

  function setImg(img, scale, x) {
    if (!img) return;
    img.style.transform = `translate3d(${x}%, 0, 0) scale(${scale})`;
  }
  function setCap(cap, opacity, tyMul) {
    if (!cap) return;
    cap.style.opacity = clamp(opacity, 0, 1).toFixed(3);
    cap.style.transform = `translateY(${(tyMul * 26).toFixed(1)}px)`;
  }

  function updateFilm() {
    if (!filmEl) return;
    const range = filmEl.offsetHeight - window.innerHeight;
    const top = filmEl.getBoundingClientRect().top;
    const P = clamp(-top / (range > 0 ? range : 1), 0, 1);
    filmEl.style.setProperty("--P", P.toFixed(4));

    // crossfades (trapezoides solapados → una sola toma continua)
    const inLiving = smooth(ramp(P, 0.17, 0.31));
    const inCocina = smooth(ramp(P, 0.45, 0.59));
    const inPatio  = smooth(ramp(P, 0.69, 0.82));
    const op = {
      fachada: 1 - inLiving,
      living: inLiving - inCocina,
      cocina: inCocina - inPatio,
      patio: inPatio,
    };
    for (const k in filmLayerEls) filmLayerEls[k].style.opacity = clamp(op[k], 0, 1).toFixed(3);

    // dolly continuo de cámara (empuje hacia adelante por la casa)
    const d = motionDamp;
    setImg(filmLayers.fachada, 1.05 + P * 2.6 * d, 0);                          // atraviesa el vidrio
    setImg(filmLayers.living,  1.08 + P * 0.85 * d, 0);                         // avanza por el interior
    setImg(filmLayers.cocina,  1.06 + P * 0.95 * d, -ramp(P, 0.55, 0.84) * 4 * d); // deriva hacia las aberturas
    setImg(filmLayers.patio,   1.26 - smooth(ramp(P, 0.69, 1)) * 0.2 * d, 0);   // llega y respira

    // capítulos
    setCap(filmCaps.hero,    1 - smooth(ramp(P, 0.07, 0.15)), 0);
    setCap(filmCaps.estudio, smooth(ramp(P, 0.25, 0.33)) - smooth(ramp(P, 0.41, 0.49)), 1 - smooth(ramp(P, 0.25, 0.33)));
    setCap(filmCaps.cocina,  smooth(ramp(P, 0.53, 0.61)) - smooth(ramp(P, 0.65, 0.73)), 1 - smooth(ramp(P, 0.53, 0.61)));
    setCap(filmCaps.patio,   smooth(ramp(P, 0.80, 0.88)), 1 - smooth(ramp(P, 0.80, 0.88)));

    if (filmCue) filmCue.style.opacity = (1 - smooth(ramp(P, 0, 0.05))).toFixed(3);

    // etiqueta del capítulo
    let ix = "01", lbl = "Exterior";
    if (P >= 0.74) { ix = "04"; lbl = "Patio"; }
    else if (P >= 0.5) { ix = "03"; lbl = "Cocina"; }
    else if (P >= 0.24) { ix = "02"; lbl = "Living"; }
    if (filmTag) {
      filmTag.querySelector(".ix").textContent = ix;
      filmTag.querySelector(".lbl").textContent = lbl;
    }
  }

  const navBtns = $$("#recorrido button");
  function targetScroll(b) {
    const el = document.getElementById(b.dataset.go);
    if (!el) return 0;
    const base = el.offsetTop;
    if (b.dataset.go === "film" && b.dataset.frac != null) {
      return base + parseFloat(b.dataset.frac) * (el.offsetHeight - window.innerHeight);
    }
    return base;
  }

  function updateChrome() {
    const y = window.scrollY;
    const overFilm = filmEl ? filmEl.getBoundingClientRect().bottom > 120 : false;
    nav.dataset.light = overFilm ? "true" : "false";
    nav.dataset.solid = overFilm ? "false" : "true";

    recorrido.dataset.show = y > window.innerHeight * 0.7 ? "true" : "false";

    const probe = y + window.innerHeight * 0.42;
    let activeBtn = navBtns[0];
    navBtns.forEach((b) => { if (targetScroll(b) <= probe) activeBtn = b; });
    navBtns.forEach((b) => b.setAttribute("data-active", b === activeBtn ? "true" : "false"));
  }

  function initRecorrido() {
    navBtns.forEach((b) => {
      b.addEventListener("click", () => {
        window.scrollTo({ top: targetScroll(b) + 2, behavior: prefersReduced ? "auto" : "smooth" });
      });
    });
  }

  function initBurger() {
    const burger = $("#burger");
    const menu = $("#menu");
    if (!burger || !menu) return;
    const toggle = (open) => {
      menu.dataset.open = open ? "true" : "false";
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", () => toggle(menu.dataset.open !== "true"));
    $$("a", menu).forEach((a) => a.addEventListener("click", () => toggle(false)));
  }

  /* ---------------------------------------------------------------------- *
   *  4 · REVEALS
   * ---------------------------------------------------------------------- */
  function initReveals() {
    const els = $$(".reveal, .reveal-line");
    if (prefersReduced || !("IntersectionObserver" in window)) {
      els.forEach((e) => (e.dataset.in = "true"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.dataset.in = "true";
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((e) => io.observe(e));
  }

  /* ---------------------------------------------------------------------- *
   *  5 · LIGHTBOX
   * ---------------------------------------------------------------------- */
  const lb = $("#lightbox");
  const lbInner = $("#lbInner");
  let currentIdx = -1;

  const lbImg = (src, alt) => (src
    ? `<img class="lb__photo" src="${esc(src)}" alt="${esc(alt)}" loading="lazy" />`
    : `<div class="lb__photo lb__photo--empty" data-ph="${esc(alt)}"></div>`);

  function shotMarkup(proj, shot, n) {
    // shot puede ser el string "tall"/"duo" (data.js viejo) o {type,src,src2}.
    const kind = typeof shot === "string" ? shot : shot.type;
    if (kind === "duo") {
      return `<div class="lb__shot duo">
        <div>${lbImg(shot.src, proj.name + " — detalle")}</div>
        <div>${lbImg(shot.src2, proj.name + " — detalle")}</div>
      </div>`;
    }
    return `<div class="lb__shot tall">${lbImg(shot.src, proj.name + " — fotografía " + (n + 1))}</div>`;
  }

  function buildLightbox(proj) {
    lbInner.innerHTML = `
      <div class="lb__head">
        <div>
          <div class="lb__loc">${proj.location} · ${proj.year}</div>
          <h2 class="lb__title">${proj.name}</h2>
        </div>
        <div>
          <p class="lb__desc">${proj.description}</p>
          <dl class="lb__facts">
            <div class="lb__fact"><dt>Tipo de obra</dt><dd>${proj.type}</dd></div>
            <div class="lb__fact"><dt>Superficie</dt><dd>${proj.area}</dd></div>
            <div class="lb__fact"><dt>Ubicación</dt><dd>${proj.location}</dd></div>
            <div class="lb__fact"><dt>Año</dt><dd>${proj.year}</dd></div>
          </dl>
        </div>
      </div>
      <div class="lb__gallery">
        ${proj.gallery.map((k, n) => shotMarkup(proj, k, n)).join("")}
      </div>`;
  }

  function openLightbox(id) {
    const list = visibleProjects();
    const idx = list.findIndex((p) => p.id === id);
    if (idx < 0) return;
    currentIdx = idx;
    buildLightbox(list[idx]);
    lb.dataset.open = "true";
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lb.scrollTop = 0;
  }
  function closeLightbox() {
    lb.dataset.open = "false";
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    currentIdx = -1;
  }
  function navLightbox(dir) {
    if (currentIdx < 0) return;
    const list = visibleProjects();
    const n = (currentIdx + dir + list.length) % list.length;
    openLightbox(list[n].id);
  }

  function initLightbox() {
    $("#lbClose").addEventListener("click", closeLightbox);
    $("#lbPrev").addEventListener("click", () => navLightbox(-1));
    $("#lbNext").addEventListener("click", () => navLightbox(1));
    document.addEventListener("keydown", (e) => {
      if (lb.dataset.open !== "true") return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navLightbox(-1);
      if (e.key === "ArrowRight") navLightbox(1);
    });
  }

  /* ---------------------------------------------------------------------- *
   *  6 · FORMULARIO
   * ---------------------------------------------------------------------- */
  function initForm() {
    const form = $("#form");
    if (!form) return;

    // chips
    $$(".chip", form).forEach((chip) => {
      chip.addEventListener("click", () => {
        const on = chip.dataset.on !== "true";
        chip.dataset.on = on ? "true" : "false";
        chip.setAttribute("aria-checked", on ? "true" : "false");
      });
    });

    // file input
    const drop = $("#filedrop");
    const input = $("#fileinput");
    const list = $("#filelist");
    let files = [];
    const render = () => {
      list.innerHTML = files.map((f, i) =>
        `<div class="fitem"><span>${f.name}</span><button type="button" data-i="${i}" aria-label="Quitar">Quitar</button></div>`
      ).join("");
      $$("button", list).forEach((b) =>
        b.addEventListener("click", () => { files.splice(+b.dataset.i, 1); render(); })
      );
    };
    drop.addEventListener("click", () => input.click());
    input.addEventListener("change", () => { files = files.concat(Array.from(input.files)); render(); });
    ["dragenter", "dragover"].forEach((ev) =>
      drop.addEventListener(ev, (e) => { e.preventDefault(); drop.dataset.over = "true"; }));
    ["dragleave", "drop"].forEach((ev) =>
      drop.addEventListener(ev, (e) => { e.preventDefault(); drop.dataset.over = "false"; }));
    drop.addEventListener("drop", (e) => { files = files.concat(Array.from(e.dataTransfer.files)); render(); });

    // validación
    const setError = (name, on) => {
      const f = form.querySelector(`[name="${name}"]`);
      if (f) f.closest(".field").dataset.error = on ? "true" : "false";
    };
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      let ok = true;
      const nombre = (data.get("nombre") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const tipo = (data.get("tipo") || "").toString().trim();
      if (!nombre) { setError("nombre", true); ok = false; } else setError("nombre", false);
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setError("email", true); ok = false; } else setError("email", false);
      if (!tipo) { setError("tipo", true); ok = false; } else setError("tipo", false);

      if (!ok) {
        const firstErr = form.querySelector('.field[data-error="true"]');
        if (firstErr) {
          const top = firstErr.getBoundingClientRect().top + window.scrollY - 120;
          window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
        }
        return;
      }
      // éxito
      form.style.display = "none";
      const ok2 = $("#success");
      ok2.dataset.show = "true";
      ok2.scrollIntoView ? null : null;
      const top = $("#contacto").getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
    });
  }

  /* ---------------------------------------------------------------------- *
   *  7 · INIT
   * ---------------------------------------------------------------------- */
  async function init() {
    const yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();
    await loadContent();
    applyContent();
    renderServicios();
    renderSteps();
    renderChips();
    renderFolio();
    collectScenes();
    initReveals();
    initRecorrido();
    initBurger();
    initLightbox();
    initForm();
    updateScenes();
    updateFilm();
    updateChrome();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => { collectScenes(); updateScenes(); updateFilm(); updateChrome(); }, { passive: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
