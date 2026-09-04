/* ===========================================================================
   ESTUDIO GR — MODO PRESENTACIÓN (kiosk / exposición)
   ---------------------------------------------------------------------------
   Capa audiovisual automática sobre la web actual. Cuando NO está activa no
   existe en el DOM: cero impacto en el comportamiento normal del sitio.

   - Un único requestAnimationFrame maneja tiempos + progreso (con un reloj de
     respaldo de baja frecuencia sólo si el rAF está estrangulado).
   - Un único timeout maneja el ocultado de controles / auto-reanudar.
   - Registro de listeners → se limpian todos al salir. Sin memory leaks.
   - Reutiliza tokens, tipografía, imágenes, video y textos (content.json) del sitio.

   Activar:  botón/enlace [data-present] o .present-trigger  ·  Shift + P
   Teclado en presentación:  Espacio = pausa/continúa · ← → = escena · Esc = salir
   =========================================================================== */
(function () {
  "use strict";

  /* ---- Configuración centralizada de tiempos (ms) --------------------- */
  var CFG = {
    url: "https://arquitectura-gr.vercel.app",
    scene: {
      intro: 9000,
      estudio: 11000,
      servicios: 12000,
      contacto: 16000,
    },
    perProject: 4600,       // escena PROYECTOS = perProject × (nº de proyectos visibles)
    perGalleryImg: 3600,    // escena GALERÍAS  = perGalleryImg × (nº de imágenes)
    transitionMs: 1500,     // crossfade entre escenas (debe coincidir con --pf-trans del CSS)
    controlsHideMs: 4000,   // inactividad → ocultar controles y reanudar
    kenBurns: 1.075,        // zoom sutil objetivo
  };

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) CFG.kenBurns = 1.0;

  /* ---- Estado -------------------------------------------------------- */
  var state = null;
  var els = {};
  var SCENES = [];
  var bag = [];               // listeners de la sesión de presentación
  var seen = Object.create(null); // urls ya precargadas

  /* ---- Utilidades --------------------------------------------------- */
  function h(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "class") n.className = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else if (k === "style") n.setAttribute("style", attrs[k]);
      else if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) {
      if (c == null) return;
      n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return n;
  }
  function on(target, ev, fn, opts) {
    target.addEventListener(ev, fn, opts || false);
    bag.push([target, ev, fn, opts || false]);
  }
  function unbindAll() {
    bag.forEach(function (b) { b[0].removeEventListener(b[1], b[2], b[3]); });
    bag.length = 0;
  }
  function pad(n) { return String(n).padStart(2, "0"); }
  function preload(url) {
    if (!url || seen[url]) return;
    seen[url] = 1;
    var i = new Image();
    i.decoding = "async";
    i.src = url;
  }
  function restart(el, anim) {
    if (!el) return;
    el.style.animation = "none";
    void el.offsetWidth;              // reflow
    el.style.animation = anim || "";
  }

  /* ---- Acceso a contenido (content.json → fallback DOM / data.js) ---- */
  function C() { return window.CONTENT || {}; }
  function T() { return C().texts || {}; }
  function contact() { return C().contact || {}; }
  function projects() { return (window.PROJECTS || []).filter(function (p) { return !p.hidden; }); }
  function domHTML(sel) { var e = document.querySelector(sel); return e ? e.innerHTML : ""; }
  function domTxt(sel) { var e = document.querySelector(sel); return e ? e.textContent.trim() : ""; }

  var FALLBACK_IMG = "uploads/recorrido/hero-poster.webp";
  function projImg(p) { return (p && p.image) || FALLBACK_IMG; }

  function galleryImages() {
    var out = [];
    projects().slice(0, 5).forEach(function (p) {
      (p.gallery || []).forEach(function (g) {
        if (typeof g === "string") return;
        if (g.src) out.push({ src: g.src, name: p.name });
        if (g.src2) out.push({ src: g.src2, name: p.name });
      });
    });
    if (!out.length) projects().forEach(function (p) { if (p.image) out.push({ src: p.image, name: p.name }); });
    return out.slice(0, 10);
  }

  /* ---- Iconos (coherentes con el sitio) ----------------------------- */
  var IC = {
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14"/><path d="m3 6 9 7 9-7"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l2.1-5.4A8.5 8.5 0 1 1 21 11.5Z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
    prev: '<svg viewBox="0 0 24 24"><path d="M14 6 8 12l6 6zM8 6v12" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    next: '<svg viewBox="0 0 24 24"><path d="M10 6l6 6-6 6zM16 6v12" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    exit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  };

  /* ======================================================================
     CONSTRUCCIÓN DE ESCENAS
     ==================================================================== */
  function bgLayers(n) {
    var arr = [];
    for (var i = 0; i < (n || 1); i++) arr.push(h("img", { class: "pf-bg__img", alt: "", decoding: "async" }));
    return arr;
  }

  function sceneIntro() {
    var video = h("video", {
      class: "pf-bg__video", muted: "", loop: "", playsinline: "", "webkit-playsinline": "",
      preload: "auto", poster: "uploads/recorrido/hero-poster.webp",
    }, [h("source", { src: "uploads/recorrido/hero.mp4", type: "video/mp4" })]);
    video.muted = true;
    els.video = video;

    var el = h("div", { class: "pf-scene", id: "pf-s-intro" }, [
      h("div", { class: "pf-bg" }, [video]),
      h("div", { class: "pf-scrim" }),
      h("div", { class: "pf-frame" }),
      h("div", { class: "pf-copy" }, [
        h("img", { class: "pf-logo pf-in", style: "--i:0", src: "uploads/logo-gr.png", alt: "Estudio GR" }),
        h("span", { class: "pf-eyebrow pf-in", style: "--i:1", html: T().hero && T().hero.eyebrow || domTxt('.film__cap[data-cap="hero"] .film__eyebrow') || "Arq. Giannina Ricci" }),
        h("h1", { class: "pf-title pf-in", style: "--i:2", html: (T().hero && T().hero.title) || domHTML('.film__cap[data-cap="hero"] .film__title') || "Espacios con <em>alma.</em>" }),
        h("p", { class: "pf-sub pf-in", style: "--i:3", text: (T().hero && T().hero.sub) || domTxt('.film__cap[data-cap="hero"] .film__sub') }),
      ]),
    ]);

    return {
      el: el, light: false,
      duration: function () { return CFG.scene.intro; },
      preload: function () {},
      enter: function () {
        try { video.currentTime = 0; } catch (e) {}
        try { var p = video.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
      },
      leave: function () { try { video.pause(); } catch (e) {} },
      sync: function (v) { try { v ? video.play().catch(function () {}) : video.pause(); } catch (e) {} },
    };
  }

  function sceneEstudio() {
    var img = h("img", { class: "pf-bg__img is-shown", alt: "", decoding: "async" });
    var t = T().filmEstudio || {};
    var heroImg = (projects()[2] || projects()[0] || {}).image || FALLBACK_IMG;

    var el = h("div", { class: "pf-scene", id: "pf-s-estudio" }, [
      h("div", { class: "pf-bg" }, [img]),
      h("div", { class: "pf-scrim" }),
      h("div", { class: "pf-frame" }),
      h("div", { class: "pf-copy" }, [
        h("span", { class: "pf-eyebrow pf-in", style: "--i:0", html: t.eyebrow || "El Estudio" }),
        h("h2", { class: "pf-title pf-title--sm pf-in", style: "--i:1", html: t.title || domHTML('.film__cap[data-cap="estudio"] .film__title') || "Soñar despierta junto a mis <em>clientes.</em>" }),
        h("p", { class: "pf-sub pf-in", style: "--i:2", text: t.sub || domTxt('.film__cap[data-cap="estudio"] .film__sub') }),
        h("div", { class: "pf-stats pf-in", style: "--i:3" }, [
          h("div", { class: "pf-stat" }, [
            h("div", { class: "pf-stat__n", text: t.stat1n || "+10" }),
            h("div", { class: "pf-stat__l", text: t.stat1l || "Obras y proyectos" }),
          ]),
          h("div", { class: "pf-stat" }, [
            h("div", { class: "pf-stat__n", text: t.stat2n || "86" }),
            h("div", { class: "pf-stat__l", text: t.stat2l || "Publicaciones en obra" }),
          ]),
        ]),
      ]),
    ]);

    return {
      el: el, light: false,
      duration: function () { return CFG.scene.estudio; },
      preload: function () { preload(heroImg); },
      enter: function () {
        el.style.setProperty("--pf-dur", (CFG.scene.estudio / 1000) + "s");
        el.style.setProperty("--pf-zoom", CFG.kenBurns);
        if (img.getAttribute("src") !== heroImg) img.src = heroImg;
        restart(img);
      },
      leave: function () {},
    };
  }

  function sceneProjects() {
    var layers = bgLayers(2);
    var cur = 0;
    var capEyebrow = h("span", { class: "pf-eyebrow" });
    var capName = h("h2", { class: "pf-title pf-title--sm" });
    var cap = h("div", { class: "pf-proj-cap" }, [capEyebrow, capName]);
    var index = h("div", { class: "pf-index" });

    var el = h("div", { class: "pf-scene", id: "pf-s-proyectos" }, [
      h("div", { class: "pf-bg" }, layers),
      h("div", { class: "pf-scrim" }),
      h("div", { class: "pf-frame" }),
      index,
      h("div", { class: "pf-copy" }, [cap]),
    ]);

    function show(k) {
      var list = projects();
      if (!list.length) return;
      k = ((k % list.length) + list.length) % list.length;
      var p = list[k];
      var inc = layers[cur], out = layers[1 - cur];
      var src = projImg(p);
      if (inc.getAttribute("src") !== src) inc.src = src;
      inc.classList.add("is-shown");
      out.classList.remove("is-shown");
      cur = 1 - cur;
      el.style.setProperty("--pf-dur", (CFG.perProject / 1000) + "s");
      el.style.setProperty("--pf-zoom", CFG.kenBurns);
      restart(inc);
      capEyebrow.textContent = [p.location, p.type].filter(Boolean).join("  ·  ") + (p.year ? "  ·  " + p.year : "");
      capName.textContent = p.name;
      index.innerHTML = pad(k + 1) + " <i>/ " + pad(list.length) + "</i>";
      restart(cap, "pf-capIn 900ms var(--pf-ease) forwards");
      preload(projImg(list[(k + 1) % list.length]));
    }

    return {
      el: el, light: false, cyclic: true,
      count: function () { return Math.max(1, projects().length); },
      subDur: function () { return CFG.perProject; },
      duration: function () { return CFG.perProject * this.count(); },
      preload: function () { preload(projImg(projects()[0])); },
      enter: function () { cur = 0; layers[0].classList.remove("is-shown"); layers[1].classList.remove("is-shown"); show(0); },
      leave: function () {},
      showItem: function (k) { show(k); },
    };
  }

  function sceneGallery() {
    var layers = bgLayers(2);
    var cur = 0;
    var label = h("span", { class: "pf-eyebrow" });
    var index = h("div", { class: "pf-index" });
    var el = h("div", { class: "pf-scene", id: "pf-s-galeria" }, [
      h("div", { class: "pf-bg" }, layers),
      h("div", { class: "pf-scrim pf-scrim--soft" }),
      h("div", { class: "pf-frame" }),
      index,
      h("div", { class: "pf-copy" }, [label]),
    ]);

    function show(k) {
      var imgs = galleryImages();
      if (!imgs.length) return;
      k = ((k % imgs.length) + imgs.length) % imgs.length;
      var it = imgs[k];
      var inc = layers[cur], out = layers[1 - cur];
      if (inc.getAttribute("src") !== it.src) inc.src = it.src;
      inc.classList.add("is-shown");
      out.classList.remove("is-shown");
      cur = 1 - cur;
      el.style.setProperty("--pf-dur", (CFG.perGalleryImg / 1000) + "s");
      el.style.setProperty("--pf-zoom", reduced ? 1.0 : 1.05);
      restart(inc);
      label.textContent = it.name || "";
      restart(label, "pf-capIn 900ms var(--pf-ease) forwards");
      index.innerHTML = pad(k + 1) + " <i>/ " + pad(imgs.length) + "</i>";
      preload((imgs[(k + 1) % imgs.length] || {}).src);
    }

    return {
      el: el, light: false, cyclic: true,
      count: function () { return Math.max(1, galleryImages().length); },
      subDur: function () { return CFG.perGalleryImg; },
      duration: function () { return CFG.perGalleryImg * this.count(); },
      preload: function () { preload((galleryImages()[0] || {}).src); },
      enter: function () { cur = 0; layers[0].classList.remove("is-shown"); layers[1].classList.remove("is-shown"); show(0); },
      leave: function () {},
      showItem: function (k) { show(k); },
    };
  }

  function sceneServices() {
    var t = T().servicios || {};
    var list = (window.SERVICIOS || []).slice(0, 8);
    var items = list.map(function (s, i) {
      var d = (s.desc || "").trim();
      if (d.length > 120) d = d.slice(0, 117).replace(/[\s,.;:]+\S*$/, "") + "…";
      return h("div", { class: "pf-serv__item", style: "--i:" + i }, [
        h("div", { class: "pf-serv__num", text: pad(i + 1) }),
        h("div", {}, [
          h("div", { class: "pf-serv__name", text: s.name }),
          h("div", { class: "pf-serv__desc", text: d }),
        ]),
      ]);
    });

    var el = h("div", { class: "pf-scene pf-scene--light", id: "pf-s-servicios" }, [
      h("div", { class: "pf-serv" }, [
        h("div", { class: "pf-serv__head" }, [
          h("span", { class: "pf-eyebrow", html: t.eyebrow || "Qué hacemos" }),
          h("h2", { class: "pf-title pf-title--sm", html: t.title || "Un estudio integral,<br><em>de la idea a la entrega.</em>" }),
        ]),
        h("div", { class: "pf-serv__list" }, items),
      ]),
    ]);

    return {
      el: el, light: true,
      duration: function () { return CFG.scene.servicios; },
      preload: function () {},
      enter: function () {
        items.forEach(function (it, i) {
          restart(it, "pf-serv-in 950ms var(--pf-ease) " + (i * 110) + "ms forwards");
        });
      },
      leave: function () {},
    };
  }

  function sceneContact() {
    var c = contact();
    var ig = (c.instagram || "").replace(/^https?:\/\/(www\.)?instagram\.com\//, "@").replace(/\/$/, "") || c.handle || "@arq.estudio.gr";
    var urlShort = CFG.url.replace(/^https?:\/\//, "");

    var info = [
      h("span", { class: "pf-eyebrow pf-in", style: "--i:0", text: "Contacto" }),
      h("div", { class: "pf-contact__name pf-in", style: "--i:1", html: "arq.estudio.gr<br><span style='font-size:.5em;letter-spacing:.02em'>Arq. Giannina Ricci</span>" }),
    ];
    [[IC.mail, c.email], [IC.phone, c.phone], [IC.ig, ig], [IC.pin, c.location]].forEach(function (r, k) {
      if (!r[1]) return;
      info.push(h("div", { class: "pf-contact__row pf-in", style: "--i:" + (k + 2) }, [h("span", { html: r[0] }), h("span", { text: r[1] })]));
    });

    var el = h("div", { class: "pf-scene pf-scene--contact", id: "pf-s-contacto" }, [
      h("div", { class: "pf-contact" }, [
        h("div", { class: "pf-contact__info" }, info),
        h("figure", { class: "pf-qr pf-in", style: "--i:2" }, [
          h("img", { src: "uploads/qr-site.svg", alt: "Código QR — " + urlShort }),
          h("figcaption", { html: "Escaneá para ver la web<br><b style='letter-spacing:.06em'>" + urlShort + "</b>" }),
        ]),
      ]),
    ]);

    return {
      el: el, light: false,
      duration: function () { return CFG.scene.contacto; },
      preload: function () { preload("uploads/qr-site.svg"); },
      enter: function () {}, leave: function () {},
    };
  }

  /* ======================================================================
     MOTOR
     ==================================================================== */
  function build() {
    seen = Object.create(null);
    var stage = h("div", { class: "pf-stage" });

    SCENES = [sceneIntro(), sceneEstudio(), sceneProjects(), sceneGallery(), sceneServices(), sceneContact()];
    SCENES.forEach(function (s) { stage.appendChild(s.el); });

    var bar = h("div", { class: "pf-progress__bar" });
    var count = h("div", { class: "pf-count", text: "01  /  " + pad(SCENES.length) });

    function cbtn(key, label, fn) {
      var b = h("button", { class: "pf-btn" + (key === "prev" ? "" : key === "exit" ? " pf-btn--sep" : ""), "aria-label": label, html: IC[key] });
      on(b, "click", function (e) { e.stopPropagation(); fn(); });
      return b;
    }
    var playBtn = cbtn("pause", "Pausar", toggle);
    var controls = h("div", { class: "pf-controls" }, [
      cbtn("prev", "Escena anterior", function () { manual(-1); }),
      playBtn,
      cbtn("next", "Escena siguiente", function () { manual(1); }),
      cbtn("exit", "Salir", exit),
    ]);
    var hint = h("div", { class: "pf-hint", text: "Espacio: pausa · ← → escena · Esc: salir" });

    var root = h("div", { id: "pf" }, [
      stage,
      h("div", { class: "pf-grain" }),
      h("div", { class: "pf-progress" }, [bar]),
      count,
      controls,
      hint,
    ]);

    els.root = root; els.bar = bar; els.count = count; els.controls = controls; els.playBtn = playBtn;
    document.body.appendChild(root);
  }

  function sceneDuration(i) { return SCENES[i].duration(); }

  function setPlayIcon() {
    els.playBtn.innerHTML = state.playing ? IC.pause : IC.play;
    els.playBtn.setAttribute("aria-label", state.playing ? "Pausar" : "Continuar");
    els.root.classList.toggle("pf--paused", !state.playing);
  }

  function goto(idx, isManual) {
    var N = SCENES.length;
    idx = ((idx % N) + N) % N;
    var prev = state.i;
    if (prev !== idx && SCENES[prev] && SCENES[prev].leave) SCENES[prev].leave();

    state.i = idx;
    state.tScene = 0;
    state.tSub = 0;
    state.subIdx = 0;

    SCENES.forEach(function (s, k) { s.el.classList.toggle("is-active", k === idx); });

    var sc = SCENES[idx];
    if (!sc.cyclic) {
      sc.el.style.setProperty("--pf-dur", (sceneDuration(idx) / 1000) + "s");
      sc.el.style.setProperty("--pf-zoom", CFG.kenBurns);
    }
    sc.enter && sc.enter();
    if (sc.sync) sc.sync(state.playing);

    els.count.textContent = pad(idx + 1) + "  /  " + pad(N);
    els.count.style.color = sc.light ? "rgba(29,27,22,0.42)" : "";

    var nx = SCENES[(idx + 1) % N];
    if (nx.preload) nx.preload();
  }

  function manual(dir) {
    wake();
    goto(state.i + dir, true);
  }

  function toggle() {
    state.userPaused = !state.userPaused;
    state.softPaused = false;
    setPlaying(!state.userPaused);
    showControls();
  }

  function setPlaying(v) {
    state.playing = v;
    setPlayIcon();
    var sc = SCENES[state.i];
    if (sc && sc.sync) sc.sync(v);
  }

  /* ---- Núcleo de tiempo (compartido por rAF y el reloj de respaldo) -- */
  function tickBy(dt) {
    if (!state || !state.active) return;
    if (state.playing) {
      state.tScene += dt;
      var sc = SCENES[state.i];
      var dur = sceneDuration(state.i);
      if (state.tScene >= dur) {
        goto(state.i + 1);
      } else if (sc.cyclic) {
        state.tSub += dt;
        var sd = sc.subDur();
        if (state.tSub >= sd) {
          state.tSub -= sd;
          state.subIdx = (state.subIdx + 1) % sc.count();
          sc.showItem(state.subIdx);
        }
      }
    }
    var d = sceneDuration(state.i);
    if (els.bar) els.bar.style.width = (100 * Math.min(1, state.tScene / d)).toFixed(2) + "%";
  }

  function frame(ts) {
    if (!state || !state.active) return;
    var dt = state.lastTs ? Math.min(80, ts - state.lastTs) : 16;
    state.lastTs = ts;
    if (state.fbTimer) { clearInterval(state.fbTimer); state.fbTimer = 0; } // rAF vivo → matar respaldo
    tickBy(dt);
    state.raf = requestAnimationFrame(frame);
  }

  /* ---- Controles: mostrar / ocultar + auto-reanudar ---------------- */
  function showControls() {
    els.controls.classList.add("is-visible");
    els.root.classList.add("pf--cursor");
    clearTimeout(state.idle);
    state.idle = setTimeout(sleep, CFG.controlsHideMs);
  }
  function wake() {
    // interacción ambiente (mover mouse / tocar) → controles + pausa suave
    if (!state.userPaused && state.playing) {
      state.softPaused = true;
      setPlaying(false);
    }
    showControls();
  }
  function sleep() {
    els.controls.classList.remove("is-visible");
    els.root.classList.remove("pf--cursor");
    if (state.softPaused && !state.userPaused) {
      state.softPaused = false;
      setPlaying(true);
    }
  }

  /* ---- Fullscreen -------------------------------------------------- */
  function enterFS() {
    var el = document.documentElement;
    var fn = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen;
    if (!fn) return;
    try { var p = fn.call(el); if (p && p.catch) p.catch(function () {}); } catch (e) {}
  }
  function exitFS() {
    if (!(document.fullscreenElement || document.webkitFullscreenElement)) return;
    var fn = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen;
    if (fn) try { fn.call(document); } catch (e) {}
  }

  /* ---- Entrada / salida ------------------------------------------ */
  function start() {
    if (state && state.active) return;
    state = {
      active: true, playing: true, i: 0,
      tScene: 0, tSub: 0, subIdx: 0, lastTs: 0, raf: 0, idle: 0,
      userPaused: false, softPaused: false, wasFS: false,
      prevOverflow: document.body.style.overflow,
    };
    els = {}; bag = [];

    // congelar el sitio detrás
    var menu = document.querySelector("#menu");
    if (menu) menu.setAttribute("data-open", "false");
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("pf-lock");
    var siteVideo = document.querySelector(".film__video");
    if (siteVideo) try { siteVideo.pause(); } catch (e) {}

    build();

    // precarga puntual
    preload("uploads/recorrido/hero-poster.webp");
    preload(projImg(projects()[0]));
    preload(projImg(projects()[2]));
    preload("uploads/qr-site.svg");

    enterFS();

    // listeners de la sesión
    //  · mover el mouse  → sólo revela los controles (no interrumpe)
    //  · tocar / clic     → además pausa suave, se reanuda tras la inactividad
    on(document, "keydown", onKey, true);
    on(els.root, "pointermove", showControls, { passive: true });
    on(els.root, "pointerdown", function (e) {
      if (e.target.closest(".pf-controls")) return;
      wake();
    });
    on(els.root, "touchstart", function (e) {
      if (e.target.closest(".pf-controls")) return;
      wake();
    }, { passive: true });
    on(document, "fullscreenchange", onFsChange);
    on(document, "webkitfullscreenchange", onFsChange);
    on(document, "visibilitychange", onVisibility);

    // arranque — commit del estado inicial (opacity 0) y luego activar escena 0
    void els.root.offsetWidth;
    goto(0);
    setPlayIcon();
    state.lastTs = 0;
    state.raf = requestAnimationFrame(frame);
    // fallback: si rAF está estrangulado (algún navegador embebido), avanzar con timeout
    startTimeFallback();

    // muestra los controles unos segundos al inicio (sin pausar)
    showControls();
  }

  // Reloj de respaldo: si en 1.2 s el rAF no avanzó el tiempo, tomamos el mando
  // con un setInterval de baja frecuencia (se cancela solo si el rAF revive).
  function startTimeFallback() {
    var fbLast = Date.now();
    var probe = state.tScene;
    setTimeout(function () {
      if (!state || !state.active) return;
      if (state.tScene !== probe) return;          // rAF funciona → no hace falta
      state.fbTimer = setInterval(function () {
        if (!state || !state.active) { clearInterval(state.fbTimer); return; }
        var now = Date.now();
        tickBy(Math.min(200, now - fbLast));
        fbLast = now;
      }, 100);
    }, 1200);
  }

  function exit() {
    if (!state || !state.active) return;
    state.active = false;
    cancelAnimationFrame(state.raf);
    clearTimeout(state.idle);
    if (state.fbTimer) clearInterval(state.fbTimer);
    unbindAll();

    if (els.video) {
      try { els.video.pause(); els.video.removeAttribute("src");
        while (els.video.firstChild) els.video.removeChild(els.video.firstChild);
        els.video.load();
      } catch (e) {}
    }
    exitFS();
    document.body.style.overflow = state.prevOverflow || "";
    document.documentElement.classList.remove("pf-lock");
    if (els.root && els.root.parentNode) els.root.parentNode.removeChild(els.root);

    els = {}; SCENES = []; seen = Object.create(null);
  }

  function onKey(e) {
    if (!state || !state.active) return;
    if (e.key === "Escape") { e.preventDefault(); exit(); return; }
    if (e.key === " " || e.code === "Space") { e.preventDefault(); toggle(); return; }
    if (e.key === "ArrowRight") { e.preventDefault(); manual(1); return; }
    if (e.key === "ArrowLeft") { e.preventDefault(); manual(-1); return; }
  }
  function onFsChange() {
    if (!state || !state.active) return;
    if (document.fullscreenElement || document.webkitFullscreenElement) { state.wasFS = true; return; }
    if (state.wasFS) exit();      // salió de fullscreen (Esc / F11) → salir de la presentación
  }
  function onVisibility() {
    if (!state || !state.active) return;
    // al volver a la pestaña, evitar un salto de tiempo acumulado
    if (!document.hidden) state.lastTs = 0;
  }

  /* ---- Activadores permanentes (fuera de la capa) ---------------- */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-present], .present-trigger");
    if (t) { e.preventDefault(); start(); }
  });
  document.addEventListener("keydown", function (e) {
    if (!e.shiftKey || (e.key !== "P" && e.key !== "p")) return;
    var tag = (e.target && e.target.tagName) || "";
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag) || e.target.isContentEditable) return;
    if (state && state.active) return;
    e.preventDefault();
    start();
  });

  window.Presentation = { start: start, exit: exit, toggle: function () { state && state.active ? exit() : start(); } };
})();
