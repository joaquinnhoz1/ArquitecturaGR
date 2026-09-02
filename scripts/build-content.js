/* ===========================================================================
   Migración única: .image-slots.state.json (base64) -> archivos + content.json
   ---------------------------------------------------------------------------
   - Extrae cada imagen base64 a uploads/portfolio/<slug>.webp
   - Genera content.json (fuente única de contenido editable del sitio)
   Uso:  node scripts/build-content.js [--force]

   ⚠️  Ya se corrió. content.json ahora se edita desde el panel /admin.
       Volver a correrlo SIN --force está bloqueado para no pisar esos cambios.
   =========================================================================== */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

if (fs.existsSync(path.join(ROOT, "content.json")) && !process.argv.includes("--force")) {
  console.error("content.json ya existe. Se edita desde /admin.\n" +
    "Si REALMENTE querés regenerarlo desde data.js, corré: node scripts/build-content.js --force");
  process.exit(1);
}
const OUT_DIR = path.join(ROOT, "uploads", "portfolio");
fs.mkdirSync(OUT_DIR, { recursive: true });

// --- cargar data.js (define window.*) --------------------------------------
const window = {};
global.window = window;
require(path.join(ROOT, "data.js"));

// --- cargar estado de imágenes -------------------------------------------
let slots = {};
try {
  slots = JSON.parse(fs.readFileSync(path.join(ROOT, ".image-slots.state.json"), "utf8"));
} catch {
  console.warn("No se encontró .image-slots.state.json — sin imágenes que migrar.");
}

function writeImage(key, outName) {
  const v = slots[key];
  const url = typeof v === "string" ? v : v && v.u;
  if (!url || !/^data:image\//.test(url)) return null;
  const b64 = url.slice(url.indexOf(",") + 1);
  const buf = Buffer.from(b64, "base64");
  const file = outName + ".webp";
  fs.writeFileSync(path.join(OUT_DIR, file), buf);
  return "uploads/portfolio/" + file;
}

// --- construir proyectos -------------------------------------------------
const projects = (window.PROJECTS || []).map((p) => {
  const image = writeImage("ph-" + p.id, p.id) || "";
  const gallery = (p.gallery || []).map((kind, n) => {
    if (kind === "duo") {
      return {
        type: "duo",
        src: writeImage(`lbph-${p.id}-${n}a`, `${p.id}-g${n}a`) || "",
        src2: writeImage(`lbph-${p.id}-${n}b`, `${p.id}-g${n}b`) || "",
      };
    }
    return { type: "tall", src: writeImage(`lbph-${p.id}-${n}`, `${p.id}-g${n}`) || "" };
  });
  return {
    id: p.id,
    name: p.name,
    location: p.location,
    type: p.type,
    year: p.year,
    area: p.area || "",
    excerpt: p.excerpt || "",
    description: p.description || "",
    hidden: !!p.hidden,
    image,
    gallery,
  };
});

// --- textos de las secciones (valores actuales del index.html) ----------
const texts = {
  hero: {
    eyebrow: "Arq. Giannina Ricci · Daireaux",
    title: "Espacios con <em>alma.</em>",
    sub: "Arquitectura que transforma: del primer boceto a la entrega de obra.",
    ctaPrimary: "Iniciar Proyecto",
    ctaSecondary: "Ver obras",
  },
  filmEstudio: {
    eyebrow: "El Estudio · Interior",
    title: "Soñar despierta junto a mis <em>clientes.</em>",
    sub: "Cada obra empieza por escuchar cómo querés habitar, y se traduce en luz, materiales nobles y una funcionalidad cuidada.",
    stat1n: "+10", stat1l: "Obras y proyectos",
    stat2n: "86", stat2l: "Publicaciones en obra",
  },
  filmCocina: {
    eyebrow: "Avanzamos por la casa",
    title: "El corazón <em>cotidiano</em><br />de la casa.",
    sub: "Cocina y comedor en continuidad con el estar: los espacios donde, todos los días, sucede la vida.",
  },
  filmPatio: {
    eyebrow: "Y salimos al exterior",
    title: "El patio como<br /><em>último ambiente.</em>",
    sub: "El recorrido termina afuera: la piscina, el estar al aire libre y la vida que continúa más allá del vidrio.",
  },
  servicios: {
    eyebrow: "Qué hacemos",
    title: "Un estudio integral,<br /><em>de la idea a la entrega.</em>",
    lede: "Diseñamos espacios para la forma en que querés vivirlos. No todos los proyectos empiezan de la misma manera. A veces es una casa que necesita crecer, otras veces un espacio que ya no funciona como antes, o simplemente la necesidad de empezar de cero. Desde el estudio te acompaño a transformar esa idea en un proyecto concreto, funcional y pensado para vos.",
  },
  portfolio: {
    eyebrow: "Portfolio",
    title: "Cada proyecto cuenta una <em>historia.</em>",
    lede: "Horas de diseño, planificación y dedicación... y un toque final que nos encanta cuidar.",
  },
  metodo: {
    eyebrow: "Método de Trabajo",
    title: "Cómo nace<br />un proyecto.",
    lede: "Planificar cada detalle es soñar despierta junto a mis clientes.",
  },
  contacto: {
    eyebrow: "Iniciar Proyecto",
    title: "Contanos qué<br />querés construir.",
    text: "Llegaste al corazón de la casa. Completá el formulario y preparamos una evaluación inicial de tu proyecto, sin compromiso.",
    why: [
      "Respuesta dentro de las 48 horas hábiles.",
      "Evaluación y presupuesto sin compromiso.",
      "Atención personalizada en cada etapa.",
    ],
  },
  footer: {
    cta: "Soñemos despiertos tu <em>próximo proyecto.</em>",
    slogan: "<em>Espacios con alma.</em>",
    desc: "arq.estudio.gr — Arquitectura que transforma. Arq. Giannina Ricci, Daireaux, Buenos Aires.",
  },
};

const content = {
  texts,
  contact: {
    email: "hola@estudiogr.com",
    phone: "+54 9 000 000 0000",
    phoneHref: "+540000000000",
    location: "Ciudad · Provincia",
    instagram: "https://instagram.com/arq.estudio.gr",
    facebook: "#",
    whatsapp: "#",
    handle: "@arq.estudio.gr",
  },
  film: {
    // Fondo del recorrido: video cinematográfico scrubbeado por scroll.
    video: "uploads/recorrido/hero.mp4",
    poster: "uploads/recorrido/hero-poster.webp",
  },
  servicios: window.SERVICIOS || [],
  metodo: window.METODO || [],
  chips: window.CHIPS || [],
  projects,
};

fs.writeFileSync(path.join(ROOT, "content.json"), JSON.stringify(content, null, 2) + "\n");
console.log("content.json generado:");
console.log("  proyectos:", projects.length, "(" + projects.filter((p) => !p.hidden).length + " visibles)");
console.log("  imágenes escritas en uploads/portfolio/:", fs.readdirSync(OUT_DIR).length);
