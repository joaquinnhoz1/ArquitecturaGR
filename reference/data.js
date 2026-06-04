/* ===========================================================================
   arq.estudio.gr — CONTENIDO EDITABLE
   Arq. Giannina Ricci · Daireaux, Buenos Aires
   Cambiá textos, proyectos y servicios desde acá. Las imágenes se reemplazan
   arrastrando una foto sobre cada placeholder (se guardan solas).
   =========================================================================== */

/* ---- SERVICIOS (sección Qué hacemos) ------------------------------------- */
window.SERVICIOS = [
  { name: "Proyecto y diseño integral",   desc: "Diseño arquitectónico y de interiores, desde la primera idea hasta la entrega de obra." },
  { name: "Reformas y ampliaciones",      desc: "Renovamos y sumamos metros a viviendas y locales, respetando su identidad." },
  { name: "Proyectos PRO.CRE.AR",         desc: "Personalizamos los modelos Juana, Milagros y Bicentenaria para que la casa sea realmente tuya." },
  { name: "Obra nueva en steel frame",    desc: "Construcción en seco y tradicional: obras más limpias, rápidas y eficientes." },
  { name: "Renders y recorridos virtuales", desc: "Recorré tu casa antes del primer ladrillo con renders fotorrealistas en Lumion y SketchUp." },
  { name: "Relevamientos y empadronamientos", desc: "Planos municipales, empadronamiento de obras existentes y todo en regla." },
  { name: "Dirección de obra",            desc: "Coordinamos y supervisamos la construcción cuidando plazos, calidad y detalles." },
  { name: "Seguridad e higiene laboral",  desc: "Servicio complementario para obras y establecimientos comerciales." },
];

/* ---- MÉTODO DE TRABAJO ---------------------------------------------------- */
window.METODO = [
  { t: "Soñar despierta, juntos",   d: "Nos sentamos a escuchar cómo querés vivir o trabajar. Planificar cada detalle es soñar despierta junto a mis clientes." },
  { t: "Anteproyecto y partido",    d: "Traducimos tus ideas en una propuesta espacial: plantas, volúmenes y el carácter del proyecto." },
  { t: "Render y recorrido virtual",d: "Visualizás tu casa como la soñaste, en Lumion y SketchUp, para decidir con total seguridad." },
  { t: "Documentación y permisos",  d: "Planos técnicos, documentación municipal y trámites para construir tranquilo." },
  { t: "Dirección de obra",         d: "Dirigimos la construcción —steel frame o tradicional— cuidando cada material, plazo y terminación." },
  { t: "Entrega y ese toque final", d: "Te entregamos la obra terminada. Horas de diseño y dedicación, con un toque final que nos encanta cuidar." },
];

/* ---- SERVICIOS REQUERIDOS (chips del formulario) ------------------------- */
window.CHIPS = [
  "Vivienda nueva", "Reforma", "Ampliación", "PRO.CRE.AR",
  "Interiorismo", "Steel frame", "Renders", "Local comercial", "Relevamiento",
];

/* ---- PORTFOLIO -----------------------------------------------------------
   Cada proyecto: id, name, location, type, year, area, excerpt, description.
   gallery = cantidad/forma de fotos en la vista ampliada.
   Las imágenes se cargan arrastrando una foto sobre cada placeholder.
   --------------------------------------------------------------------------- */
window.PROJECTS = [
  {
    id: "vivienda-transicion",
    name: "Vivienda en Transición",
    location: "Buenos Aires",
    type: "Reforma y ampliación",
    year: "2026",
    area: "Obra entregada",
    excerpt: "Una reforma pensada desde la transición: espacios que se conectan, se integran y se viven.",
    description: "Este proyecto nació de la necesidad de transformar una vivienda existente en un hogar contemporáneo, orgánico y fluido. La intervención reorganizó por completo los ambientes: un patio de luz central actúa como articulador visual y ventilador natural, mientras la cocina integrada, el quincho flexible y la habitación principal —que dialoga directamente con el exterior— configuran una secuencia espacial memorable. La historia de una casa que encontró su verdadera identidad.",
    gallery: ["tall", "duo", "tall"],
  },
  {
    id: "puma-energy",
    name: "PUMA Energy Vagnoni",
    location: "Daireaux, Buenos Aires",
    type: "Renovación comercial",
    year: "2023–2024",
    area: "Obra entregada",
    excerpt: "De punto de paso a punto de encuentro: la transformación integral de una estación de servicio.",
    description: "El desafío fue renovar un espacio industrial de uso cotidiano y convertirlo en un punto de referencia para la comunidad de Daireaux. La intervención abarcó el rediseño completo de fachadas, la ampliación de los espacios de atención al cliente y la creación de ambientes más amables y contemporáneos. El resultado: una estación de servicio moderna, funcional y con identidad propia, que el cliente y la comunidad celebraron desde el primer día.",
    gallery: ["tall", "duo", "tall"],
  },
  {
    id: "hotel-daireaux",
    name: "Restaurante Hotel Daireaux",
    location: "Daireaux, Buenos Aires",
    type: "Gastronomía · Interiorismo",
    year: "2022",
    area: "Obra entregada",
    excerpt: "El espacio gastronómico como experiencia sensorial: ambientes creados desde las emociones.",
    description: "La reforma del Restaurante Hotel Daireaux buscó evolucionar la imagen del establecimiento sin perder su esencia. La intervención combinó la restauración cuidadosa de elementos existentes con la creación de nuevos ambientes diseñados desde las sensaciones. Un lugar que fusiona lo rústico y lo moderno en perfecta armonía, para que los comensales no solo vengan a comer, sino a vivir el ambiente.",
    gallery: ["tall", "duo"],
  },
  {
    id: "farmacia-traverso",
    name: "Farmacia Traverso",
    location: "Daireaux, Buenos Aires",
    type: "Diseño de fachada",
    year: "2023",
    area: "Obra entregada",
    excerpt: "La primera impresión lo es todo: una nueva imagen exterior, más fresca y moderna.",
    description: "El objetivo fue evolucionar la imagen pública de la Farmacia Traverso mediante nuevas estrategias de conceptualización del espacio exterior. La propuesta renovó la fachada respetando la funcionalidad del local, incorporando elementos visuales contemporáneos que mejoran la percepción del negocio y su relación con el espacio urbano.",
    gallery: ["tall", "duo"],
  },
  {
    id: "procrear-juana",
    name: "Vivienda PRO.CRE.AR Juana",
    location: "Pirovano, Buenos Aires",
    type: "Steel frame · PRO.CRE.AR",
    year: "2021–2022",
    area: "Obra terminada",
    excerpt: "Cómo transformamos el modelo estándar PRO.CRE.AR en un hogar a medida. De la idea al render, y del render a la realidad.",
    description: "Partiendo de los planos base del modelo PRO.CRE.AR Juana, el estudio realizó una transformación integral: reorganización de los espacios interiores, fachada personalizada, diseño de interiores y ampliación. La construcción en steel frame permitió una obra más limpia, rápida y eficiente. Es el proyecto mejor documentado del portfolio, con renders previos y múltiples registros de avance de obra.",
    gallery: ["tall", "duo", "tall"],
  },
  {
    id: "vivienda-quincho",
    name: "Vivienda + Quincho",
    location: "Urdampilleta, Buenos Aires",
    type: "Vivienda residencial",
    year: "2021–2022",
    area: "Obra avanzada",
    excerpt: "Una vivienda para los nuevos modos de habitar: flexible, conectada con el exterior y con quincho integrado.",
    description: "Diseñar en una época marcada por cambios rápidos y constantes significa crear espacios que engloben esa mutabilidad. Esta vivienda con quincho en Urdampilleta propone una arquitectura flexible que se adapta a las necesidades cambiantes de sus habitantes. El programa incluye la vivienda principal y un quincho concebido como punto de encuentro familiar, corazón social del hogar.",
    gallery: ["tall", "duo"],
  },
  {
    id: "casa-ih",
    name: "Casa IH",
    location: "Buenos Aires",
    type: "Vivienda · Estilo clásico",
    year: "2022–2023",
    area: "Proyecto / Render",
    excerpt: "Arquitectura que nunca pasa de moda: proporción clásica con confort moderno.",
    description: "La Casa IH expresa la voluntad de un cliente que eligió la elegancia clásica en un contexto contemporáneo. Una galería amplia y soleada, abierta al jardín y a la pileta, actúa como nexo entre el exterior y el interior social-familiar. El gran ambiente integrado —donde cocina, breakfast, comedor, estar y hall confluyen— genera fluidez y luminosidad en cada rincón.",
    gallery: ["tall", "duo", "tall"],
  },
  {
    id: "casa-daireaux",
    name: "Casa Daireaux",
    location: "Daireaux, Buenos Aires",
    type: "Vivienda rural · Planta H",
    year: "2020",
    area: "Proyecto / Render",
    excerpt: "Una casa que respira con el lugar: planta en H y patio central que inunda de luz todos los ambientes.",
    description: "Situada en las proximidades de Daireaux, donde el paisaje es contundente en su horizontalidad, esta casa dialoga directamente con su entorno. La planta en H organiza los usos domésticos alrededor de un patio central que actúa como corazón luminoso del hogar, integrando el arbolado existente y permitiendo el ingreso de luz solar en todas las direcciones. La tranquilidad del lugar fue el punto de partida del diseño.",
    gallery: ["tall", "duo", "tall"],
  },
  {
    id: "vinoteca",
    name: "Vinoteca",
    location: "Buenos Aires",
    type: "Gastronomía · Refacción",
    year: "2020",
    area: "Obra terminada",
    excerpt: "Chapa calada, madera y aberturas amplias: lo rústico y lo moderno en perfecta armonía.",
    description: "Este proyecto de refacción y ampliación de vinoteca combinó dos desafíos: renovar la fachada con materiales que transmitan calidez y contemporaneidad, y diseñar interiores donde el estilo rústico y el moderno se encuentren sin tensión. La fachada resultante —con chapa calada, madera y aberturas generosas— crea un espacio invitante desde la vereda, con una barra exterior desmontable que agrega flexibilidad de uso.",
    gallery: ["tall", "duo"],
  },
  {
    id: "casa-bioclimatica",
    name: "Casa Rural Bioclimática",
    location: "Buenos Aires",
    type: "Vivienda rural · Bioclimática",
    year: "2021",
    area: "Proyecto / Render",
    excerpt: "Una casa que trabaja con la naturaleza, no contra ella. Luz, viento y paisaje como herramientas de arquitectura.",
    description: "Las amplias vistas que ofrece el paisaje rural hicieron imprescindible pensar este proyecto desde el análisis profundo del entorno: orientaciones, asoleamiento, vientos predominantes y características visuales internas y externas. El resultado es una vivienda que maximiza el confort natural, reduce la dependencia energética y vive en perfecta consonancia con su contexto.",
    gallery: ["tall", "duo", "tall"],
  },
];
