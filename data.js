/* ===========================================================================
   ESTUDIO GR — CONTENIDO EDITABLE
   Cambiá textos, proyectos y servicios desde acá. Las imágenes se reemplazan
   arrastrando una foto sobre cada placeholder (se guardan solas).
   =========================================================================== */

/* ---- SERVICIOS (sección Espacios) ---------------------------------------- */
window.SERVICIOS = [
  { name: "Proyecto desde cero",      desc: "Diseñamos tu vivienda o local desde la primera idea hasta el plano final." },
  { name: "Reformas",                 desc: "Renovamos espacios existentes con una mirada nueva y funcional." },
  { name: "Ampliaciones",             desc: "Sumamos metros y posibilidades respetando el carácter de la obra." },
  { name: "Interiorismo",             desc: "Materiales, mobiliario y luz para que cada ambiente tenga alma." },
  { name: "Dirección de obra",        desc: "Coordinamos y supervisamos la construcción cuidando plazos y calidad." },
  { name: "Documentación municipal",  desc: "Gestionamos planos, permisos y trámites para que construyas tranquilo." },
  { name: "Renderizados",             desc: "Visualizá tu proyecto con realismo antes de poner el primer ladrillo." },
  { name: "Asesoramiento integral",   desc: "Te acompañamos en cada decisión, desde el terreno hasta la entrega." },
];

/* ---- MÉTODO DE TRABAJO ---------------------------------------------------- */
window.METODO = [
  { t: "Reunión inicial",        d: "Nos sentamos a escuchar. Entendemos cómo querés vivir o trabajar, tus tiempos y tu presupuesto." },
  { t: "Desarrollo de propuesta",d: "Traducimos tus ideas en una propuesta espacial: plantas, volúmenes y carácter del proyecto." },
  { t: "Proyecto ejecutivo",     d: "Documentación técnica precisa y detallada para construir sin sorpresas ni improvisaciones." },
  { t: "Ejecución y seguimiento",d: "Dirigimos la obra y coordinamos al equipo, cuidando cada detalle, plazo y material." },
  { t: "Entrega final",          d: "Te entregamos un espacio listo para habitar, fiel a lo que imaginamos juntos." },
];

/* ---- SERVICIOS REQUERIDOS (chips del formulario) ------------------------- */
window.CHIPS = [
  "Proyecto", "Reforma", "Ampliación", "Interiorismo",
  "Dirección de obra", "Documentación", "Renders", "Asesoramiento",
];

/* ---- PORTFOLIO -----------------------------------------------------------
   Cada proyecto: id, name, location, type, year, area, excerpt, description.
   gallery = cantidad/forma de fotos en la vista ampliada.
   Las imágenes se cargan arrastrando fotos sobre cada placeholder.
   --------------------------------------------------------------------------- */
window.PROJECTS = [
  {
    id: "casa-ribera",
    name: "Portfolio 1",
    location: "Ubicación 1",
    type: "Vivienda unifamiliar",
    year: "2024",
    area: "320 m²",
    excerpt: "Una casa de patio que respira: el agua, la piedra y la vegetación entran al living.",
    description: "Casa Ribera nace de un terreno largo y angosto. Organizamos la vida alrededor de un patio central que lleva luz y aire al corazón de la planta baja. Materiales nobles —hormigón visto, madera y piedra local— construyen una atmósfera serena y atemporal.",
    gallery: ["tall", "duo", "tall"],
  },
  {
    id: "loft-andes",
    name: "Portfolio 2",
    location: "Ubicación 2",
    type: "Reforma integral",
    year: "2023",
    area: "140 m²",
    excerpt: "Un antiguo depósito convertido en un loft luminoso de techos altos.",
    description: "Recuperamos la estructura original de un depósito de principios de siglo y la pusimos en valor. Los techos altos y las aberturas existentes guiaron un programa abierto, donde lo nuevo y lo viejo dialogan sin disfraces.",
    gallery: ["tall", "duo"],
  },
  {
    id: "casa-mirador",
    name: "Portfolio 3",
    location: "Ubicación 3",
    type: "Vivienda + ampliación",
    year: "2024",
    area: "410 m²",
    excerpt: "Una ampliación que abraza el paisaje con grandes paños de vidrio.",
    description: "Sumamos una planta superior pensada como mirador. Los grandes ventanales enmarcan la vista y difuminan el límite entre el interior y el jardín, mientras los aleros protegen del sol del verano.",
    gallery: ["tall", "duo", "tall"],
  },
  {
    id: "estudio-pampa",
    name: "Portfolio 4",
    location: "Ubicación 4",
    type: "Espacio comercial",
    year: "2023",
    area: "260 m²",
    excerpt: "Oficinas cálidas que rompen con la frialdad corporativa tradicional.",
    description: "Un espacio de trabajo concebido como una casa: rincones de distinta escala, materiales táctiles y mucha luz natural. La identidad de la marca aparece en los detalles, nunca impuesta.",
    gallery: ["tall", "duo"],
  },
  {
    id: "casa-olivos",
    name: "Portfolio 5",
    location: "Ubicación 5",
    type: "Vivienda unifamiliar",
    year: "2022",
    area: "290 m²",
    excerpt: "Volúmenes blancos y sombra fresca alrededor de un olivo centenario.",
    description: "El proyecto gira en torno a un olivo preexistente. Los volúmenes se separan para dejarle su espacio y generan recorridos sombreados y patios íntimos. El blanco y la cal refrescan los días más cálidos.",
    gallery: ["tall", "duo", "tall"],
  },
  {
    id: "refugio-sur",
    name: "Portfolio 6",
    location: "Ubicación 6",
    type: "Casa de fin de semana",
    year: "2024",
    area: "180 m²",
    excerpt: "Una casa de montaña en madera y piedra, pensada para desconectar.",
    description: "Refugio Sur se apoya suavemente sobre la ladera. La madera, la piedra y un gran hogar central crean un interior cálido, mientras las aberturas estratégicas capturan el amanecer y el atardecer sobre las sierras.",
    gallery: ["tall", "duo"],
  },
];
