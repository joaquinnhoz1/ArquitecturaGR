/* ===========================================================================
   ESTUDIO GR — CONTENIDO EDITABLE
   Cambiá textos, proyectos y servicios desde acá. Las imágenes se reemplazan
   arrastrando una foto sobre cada placeholder (se guardan solas).
   =========================================================================== */

/* ---- SERVICIOS (sección Espacios) ---------------------------------------- */
window.SERVICIOS = [
  { name: "Proyectos desde cero",     desc: "Diseño y desarrollo de viviendas nuevas, desde las primeras ideas hasta la documentación necesaria para llevarlas a obra. Trabajamos sobre la distribución, orientación, iluminación, materialidad y relación entre los espacios para crear una vivienda que se adapte a tu forma de vivir." },
  { name: "Reformas y ampliaciones",  desc: "Si tu casa ya no responde a tus necesidades, no necesariamente tenés que mudarte. Analizamos el espacio existente y proyectamos ampliaciones, reformas y redistribuciones para mejorar su funcionalidad, aprovechando al máximo lo que ya tenés. La casa tiene que adaptarse a vos, no vos a la casa." },
  { name: "Interiorismo",             desc: "Materiales, mobiliario y luz para que cada ambiente tenga alma." },
  { name: "Dirección de obra",        desc: "Acompañamiento durante la ejecución para controlar que lo proyectado se lleve adelante correctamente. Se realiza seguimiento del avance, coordinación con equipos de trabajo y registro del proceso mediante informes y fotografías." },
  { name: "Empadronamientos",         desc: "Documentación y gestión de construcciones existentes que necesitan ser declaradas o regularizadas. Analizamos el estado actual, relevamos la construcción y desarrollamos la documentación correspondiente para iniciar el proceso." },
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
  "Proyecto desde cero", "Reforma / ampliación", "Interiorismo",
  "Dirección de obra", "Empadronamiento", "Renders", "Asesoramiento",
];

/* ---- PORTFOLIO -----------------------------------------------------------
   Cada proyecto: id, name, location, type, year, area, excerpt, description.
   gallery = cantidad/forma de fotos en la vista ampliada.
   Las imágenes se cargan arrastrando fotos sobre cada placeholder.
   --------------------------------------------------------------------------- */
window.PROJECTS = [
  {
    id: "reforma-vivienda-transicion",
    name: "Reforma y Ampliación",
    location: "Buenos Aires",
    type: "Reforma · Ampliación",
    year: "2026",
    area: "",
    excerpt: "Espacios que se conectan, se integran y se viven. Un patio de luz como pulmón verde define el corazón de la casa.",
    description: "Este proyecto nació de la necesidad de transformar una vivienda existente en un hogar contemporáneo, orgánico y fluido. La intervención reorganizó completamente los ambientes: un patio de luz central actúa como articulador visual y ventilador natural, mientras la cocina integrada, el quincho flexible y la habitación principal —que dialoga directamente con el exterior— configuran una secuencia espacial memorable.",
    gallery: ["tall", "duo", "tall"],
  },
  {
    id: "puma-energy",
    name: "PUMA Energy Vagnoni",
    location: "Daireaux, Buenos Aires",
    type: "Renovación Comercial",
    year: "2023–2024",
    area: "",
    excerpt: "Transformación integral de una estación de servicio en un espacio moderno, funcional y reconocible.",
    description: "El desafío de este proyecto fue renovar un espacio industrial de uso cotidiano y convertirlo en un punto de referencia para la comunidad de Daireaux. La intervención abarcó el rediseño completo de fachadas, la ampliación de espacios de atención al cliente y la creación de ambientes más amables y contemporáneos.",
    gallery: ["tall", "duo"],
  },
  {
    id: "hotel-daireaux",
    name: "Hotel Daireaux",
    location: "Daireaux, Buenos Aires",
    type: "Gastronomía · Interiorismo",
    year: "2022",
    area: "",
    excerpt: "Nueva visión para el restaurante del Hotel Daireaux: ambientes creados desde las sensaciones.",
    description: "La reforma del Restaurante Hotel Daireaux buscó evolucionar la imagen del establecimiento sin perder su esencia. La intervención combinó la restauración cuidadosa de elementos existentes con la creación de nuevos ambientes diseñados desde las emociones.",
    gallery: ["tall", "duo"],
  },
  {
    id: "farmacia-traverso",
    name: "Farmacia Traverso",
    location: "Daireaux, Buenos Aires",
    type: "Diseño de Fachada",
    year: "2023",
    area: "",
    excerpt: "Renovación de imagen exterior: una intervención que actualizó la fachada con una propuesta fresca y contemporánea.",
    description: "El objetivo fue evolucionar la imagen pública de la Farmacia Traverso mediante nuevas estrategias de conceptualización del espacio exterior. La propuesta renovó la fachada respetando la funcionalidad del local, incorporando elementos visuales contemporáneos que mejoran la percepción del negocio.",
    gallery: ["tall", "duo"],
  },
  {
    id: "procrear-juana",
    name: "Vivienda PROCREAR Juana",
    location: "Pirovano, Buenos Aires",
    type: "PROCREAR · Steel Frame",
    year: "2021–2022",
    area: "",
    excerpt: "Transformación del modelo estándar en una vivienda personalizada construida en steel frame.",
    description: "Partiendo de los planos base del modelo PROCREAR Juana, el estudio realizó una transformación integral: reorganización de espacios interiores, diseño de fachada personalizada, diseño de interiores y ampliación. La construcción en steel frame permitió una obra más limpia, rápida y eficiente.",
    gallery: ["tall", "duo", "tall"],
  },
  {
    id: "vivienda-quincho",
    name: "Vivienda + Quincho",
    location: "Urdampilleta, Buenos Aires",
    type: "Vivienda · Quincho",
    year: "2021–2022",
    area: "",
    excerpt: "Una vivienda diseñada para los nuevos modos de habitar: flexible, conectada con el exterior y con quincho integrado.",
    description: "Diseñar en una época marcada por cambios rápidos y constantes significa crear espacios que engloben esa mutabilidad. Esta vivienda con quincho propone una arquitectura flexible que se adapta a las necesidades cambiantes de sus habitantes.",
    gallery: ["tall", "duo"],
  },
  {
    id: "casa-ih",
    name: "Casa IH",
    location: "Buenos Aires",
    type: "Clásico · Neoclásico",
    year: "2022–2023",
    area: "",
    excerpt: "Una casa que celebra el estilo clásico-neoclásico: galería amplia, jardín, pileta y gran ambiente integrado.",
    description: "La Casa IH expresa la voluntad de un cliente que eligió la elegancia clásica en un contexto contemporáneo. Una galería amplia y soleada, abierta al jardín y a la pileta, actúa como nexo entre el exterior y el interior social-familiar.",
    gallery: ["tall", "duo", "tall"],
    hidden: true, // sin fotos todavía — no se muestra en el portfolio
  },
  {
    id: "casa-daireaux",
    name: "Casa Daireaux",
    location: "Daireaux, Buenos Aires",
    type: "Vivienda Rural · Patio Central",
    year: "2020",
    area: "",
    excerpt: "Una casa que nació del paisaje pampeano: planta en H con patio central que inunda de luz todos los ambientes.",
    description: "Situada en las proximidades de Daireaux, donde el paisaje es contundente en su horizontalidad, esta casa dialoga directamente con su entorno. La planta en H organiza los usos domésticos alrededor de un patio central que actúa como corazón luminoso del hogar.",
    gallery: ["tall", "duo"],
  },
  {
    id: "vinoteca",
    name: "Vinoteca",
    location: "Buenos Aires",
    type: "Gastronomía · Refacción",
    year: "2020",
    area: "",
    excerpt: "Refacción y ampliación con fachada de chapa calada, madera y aberturas amplias donde lo rústico y lo moderno se encuentran.",
    description: "Este proyecto combinó dos desafíos: renovar la fachada con materiales que transmitan calidez y contemporaneidad, y diseñar interiores donde el estilo rústico y el moderno se encuentren sin tensión. La posibilidad de una barra exterior desmontable agrega flexibilidad de uso.",
    gallery: ["tall", "duo"],
  },
  {
    id: "casa-rural-bioclimatica",
    name: "Casa Rural Bioclimática",
    location: "Buenos Aires",
    type: "Bioclimática · Rural",
    year: "2021",
    area: "",
    excerpt: "El estudio de vistas, transparencias, luces y sombras fue el punto de partida: una vivienda que trabaja con la naturaleza.",
    description: "Las amplias vistas que ofrece el paisaje rural hicieron imprescindible pensar este proyecto desde el análisis profundo del entorno: orientaciones, asoleamiento, vientos predominantes y características visuales. El resultado es una vivienda que maximiza el confort natural y vive en consonancia con su contexto.",
    gallery: ["tall", "duo"],
    hidden: true, // sin fotos todavía — no se muestra en el portfolio
  },
];
