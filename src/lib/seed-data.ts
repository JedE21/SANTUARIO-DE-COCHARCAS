import type {
  SiteSettings,
  NavigationItem,
  FooterSettings,
  Page,
  Announcement,
  Faq,
  NewsCategory,
  NewsItem,
  EventItem,
  Festivity,
  GalleryCategory,
  GalleryAlbum,
  GalleryItem,
  MassSchedule,
  Sacrament,
  SacramentType,
  HomeSection,
  HistoriaContent,
  HistoriaTimeline,
  Slide,
} from '@/types/database';

export const fallbackSiteSettings: SiteSettings = {
  id: 'seed-site',
  site_name: 'Santuario de Nuestra Señora de Cocharcas',
  site_description: 'Santuario mariano, memoria histórica y vida de fe en el corazón de Apurímac.',
  address: 'Plaza de Armas s/n, Cocharcas, Chincheros, Apurímac, Perú',
  phone: '+51 XXX XXX XXX',
  whatsapp: '+51 XXX XXX XXX',
  email: 'info@santuariococharcas.pe',
  logo_url: '/images/cocharcas-hero.svg',
  favicon_url: '/images/cocharcas-hero.svg',
  responsible_name: 'Pbro. Alfredo Prado',
  responsible_title: 'Responsable Parroquial',
  responsible_bio: 'Acompañamiento pastoral y coordinación de la vida litúrgica y comunitaria del santuario.',
  responsible_photo_url: '/images/cocharcas-avatar.svg',
  footer_text: 'Cocharquino de corazón.',
};

export const fallbackNavigation: NavigationItem[] = [
  { id: 'seed-nav-1', label: 'Inicio', href: '/', position: 1, visible: true },
  { id: 'seed-nav-2', label: 'El Santuario', href: '/santuario', position: 2, visible: true },
  { id: 'seed-nav-25', label: 'Historia', href: '/santuario/historia', position: 3, visible: true },
  { id: 'seed-nav-3', label: 'Fe', href: '/fe', position: 4, visible: true },
  { id: 'seed-nav-4', label: 'Festividades', href: '/festividades', position: 5, visible: true },
  { id: 'seed-nav-5', label: 'Noticias', href: '/noticias', position: 6, visible: true },
  { id: 'seed-nav-6', label: 'Eventos', href: '/eventos', position: 7, visible: true },
  { id: 'seed-nav-7', label: 'Galería', href: '/galeria', position: 8, visible: true },
  { id: 'seed-nav-8', label: 'Visita', href: '/visita', position: 9, visible: true },
  { id: 'seed-nav-9', label: 'Contacto', href: '/contacto', position: 10, visible: true },
];

export const fallbackFooterSettings: FooterSettings = {
  id: 'seed-footer',
  about_text: 'Santuario mariano, memoria histórica y vida de fe en el corazón de Apurímac.',
  show_newsletter: true,
  newsletter_text: 'Recibe noticias y avisos de la comunidad.',
  copyright_text: '© 2026 Santuario de Nuestra Señora de Cocharcas · Todos los derechos reservados',
  developer_text: 'Ing. de Sistemas José J. Echegaray Díaz',
  signature_text: 'Cocharquino de corazón.',
  photos_credit_text: 'Fotografías: Wikimedia Commons, licencias Creative Commons BY-SA.',
  show_contact_data: true,
};

export const fallbackPages: Page[] = [
  {
    id: 'seed-page-santuario',
    slug: 'santuario',
    title: 'El Santuario',
    description: 'Historia, arquitectura y patrimonio del templo.',
    content: 'Contenido institucional del Santuario de Nuestra Señora de Cocharcas, centro de peregrinación y memoria viva de la fe en Apurímac.',
    status: 'published',
  },
  {
    id: 'seed-page-historia',
    slug: 'historia',
    title: 'Historia',
    description: 'Historia documentada y devoción popular.',
    content: 'Historia y tradición del santuario. La información se presenta distinguiendo fuente documental, tradición oral y devoción popular.',
    status: 'published',
  },
];

export const fallbackHomeSections: HomeSection[] = [
  { id: 'seed-home-hero', key: 'hero', title: 'Santuario de Nuestra Señora de Cocharcas', description: 'Fe, historia y tradición en el corazón de los Andes.', visible: true, position: 1 },
  { id: 'seed-home-intro', key: 'introduccion', title: 'Bienvenida', description: 'Un espacio vivo de peregrinación, memoria y encuentro comunitario.', visible: true, position: 2 },
  { id: 'seed-home-senora', key: 'nuestra-senora', title: 'Nuestra Señora de Cocharcas', description: 'Devoción mariana que convoca a peregrinos de todo el país.', visible: true, position: 3 },
  { id: 'seed-home-historia', key: 'historia', title: 'Historia', description: 'Memoria y tradición del santuario.', visible: true, position: 4 },
  { id: 'seed-home-patrimonio', key: 'patrimonio', title: 'Patrimonio', description: 'Arquitectura, arte religioso y archivo histórico.', visible: true, position: 5 },
  { id: 'seed-home-visita', key: 'visita', title: 'Planifica tu visita', description: 'Cómo llegar, horarios y recomendaciones.', visible: true, position: 6 },
];

export const fallbackAnnouncements: Announcement[] = [
  { id: 'seed-announcement-1', title: 'Bienvenidos al Santuario', content: 'Información pastoral y novedades de la comunidad.', status: 'published', published_at: new Date().toISOString() },
];

export const fallbackFaqs: Faq[] = [
  { id: 'seed-faq-1', question: '¿Dónde queda el Santuario?', answer: 'En el distrito de Cocharcas, provincia de Chincheros, región Apurímac, Perú.', category: 'Visita', active: true, position: 1 },
  { id: 'seed-faq-2', question: '¿Cómo se solicita una misa?', answer: 'Usa el formulario en la sección Vida de Fe o escribe a la parroquia.', category: 'Pastoral', active: true, position: 2 },
  { id: 'seed-faq-3', question: '¿Qué documentos se necesitan para el bautismo?', answer: 'Usa el formulario de sacramento para recibir orientación pastoral.', category: 'Sacramentos', active: true, position: 3 },
];

export const fallbackNewsCategories: NewsCategory[] = [
  { id: 'seed-cat-pastoral', name: 'Pastoral', slug: 'pastoral', description: 'Noticias y actividades pastorales.', position: 1, active: true },
  { id: 'seed-cat-festividades', name: 'Festividades', slug: 'festividades', description: 'Celebraciones y jornadas especiales.', position: 2, active: true },
  { id: 'seed-cat-patrimonio', name: 'Patrimonio', slug: 'patrimonio', description: 'Memoria histórica y conservación.', position: 3, active: true },
];

export const fallbackNews: NewsItem[] = [
  {
    id: 'seed-news-1',
    title: 'Preparativos para la próxima peregrinación',
    slug: 'preparativos-proxima-peregrinacion',
    excerpt: 'La comunidad organiza los detalles para recibir a los peregrinos.',
    content: 'La parroquia y los mayordomos vienen coordinando los servicios pastorales, la limpieza del templo y la atención a los visitantes.',
    cover_image_url: '/images/cocharcas-news.svg',
    category_id: 'seed-cat-pastoral',
    status: 'published',
    published_at: new Date().toISOString(),
    is_featured: true,
  },
  {
    id: 'seed-news-2',
    title: 'Se acerca la festividad principal',
    slug: 'se-acerca-festividad-principal',
    excerpt: 'Los grupos de apoyo afinan el programa litúrgico y cultural.',
    content: 'La celebración reunirá a fieles, danzantes y familias de la provincia con actos litúrgicos y manifestaciones de fe.',
    cover_image_url: '/images/cocharcas-news.svg',
    category_id: 'seed-cat-festividades',
    status: 'published',
    published_at: new Date().toISOString(),
    is_featured: true,
  },
  {
    id: 'seed-news-3',
    title: 'Archivo histórico en proceso de conservación',
    slug: 'archivo-historico-proceso-conservacion',
    excerpt: 'Se avanza en el resguardo y digitalización de documentos antiguos.',
    content: 'El santuario continúa organizando sus libros y documentos para facilitar la investigación y la memoria comunitaria.',
    cover_image_url: '/images/cocharcas-news.svg',
    category_id: 'seed-cat-patrimonio',
    status: 'published',
    published_at: new Date().toISOString(),
    is_featured: false,
  },
];

export const fallbackEvents: EventItem[] = [
  {
    id: 'seed-event-1',
    title: 'Jornada de oración y peregrinación',
    slug: 'jornada-oracion-peregrinacion',
    description: 'Encuentro comunitario con adoración, confesiones y misa solemne.',
    image_url: '/images/cocharcas-event.svg',
    location: 'Santuario de Nuestra Señora de Cocharcas',
    start_date: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    end_date: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    status: 'published',
  },
  {
    id: 'seed-event-2',
    title: 'Fiesta principal del santuario',
    slug: 'fiesta-principal-santuario',
    description: 'Celebración central con procesión, música y participación de la comunidad.',
    image_url: '/images/cocharcas-event.svg',
    location: 'Santuario de Nuestra Señora de Cocharcas',
    start_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    end_date: new Date(Date.now() + 32 * 86400000).toISOString().slice(0, 10),
    status: 'published',
  },
];

export const fallbackFestivities: Festivity[] = [
  {
    id: 'seed-fest-1',
    name: 'Fiesta principal de Nuestra Señora de Cocharcas',
    slug: 'fiesta-principal',
    description: 'Celebración central mariana que reúne a fieles, danzantes y peregrinos.',
    program: 'Programa litúrgico y cultural por confirmar según el calendario parroquial.',
    start_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    end_date: new Date(Date.now() + 34 * 86400000).toISOString().slice(0, 10),
    cover_image_url: '/images/cocharcas-hero.svg',
    status: 'published',
  },
];

export const fallbackGalleryCategories: GalleryCategory[] = [
  { id: 'seed-gal-cat-1', name: 'Templo', slug: 'templo', description: 'Vistas y detalles del santuario.', position: 1, active: true },
  { id: 'seed-gal-cat-2', name: 'Festividades', slug: 'festividades', description: 'Celebraciones y procesiones.', position: 2, active: true },
  { id: 'seed-gal-cat-3', name: 'Comunidad', slug: 'comunidad', description: 'Vida comunitaria y pastoral.', position: 3, active: true },
];

export const fallbackGalleryAlbums: GalleryAlbum[] = [
  { id: 'seed-gal-1', category_id: 'seed-gal-cat-1', title: 'El Santuario', slug: 'el-santuario', description: 'Vistas del templo.', cover_image_url: '/images/cocharcas-gallery.svg', position: 1, active: true },
  { id: 'seed-gal-2', category_id: 'seed-gal-cat-2', title: 'Fiestas', slug: 'fiestas', description: 'Fiestas y celebraciones.', cover_image_url: '/images/cocharcas-gallery.svg', position: 2, active: true },
  { id: 'seed-gal-3', category_id: 'seed-gal-cat-3', title: 'Comunidad', slug: 'comunidad', description: 'Vida de la comunidad.', cover_image_url: '/images/cocharcas-gallery.svg', position: 3, active: true },
];

export const fallbackGalleryItems: GalleryItem[] = [
  { id: 'seed-img-1', album_id: 'seed-gal-1', title: 'Vista del santuario', description: 'La fachada principal al atardecer.', alt_text: 'Vista del santuario de Cocharcas', image_url: '/images/cocharcas-gallery.svg', position: 1, visible: true },
  { id: 'seed-img-2', album_id: 'seed-gal-1', title: 'Retablo principal', description: 'Vista del retablo y el altar mayor.', alt_text: 'Retablo principal del santuario', image_url: '/images/cocharcas-gallery.svg', position: 2, visible: true },
  { id: 'seed-img-3', album_id: 'seed-gal-2', title: 'Celebración comunitaria', description: 'Fieles reunidos en una jornada de oración.', alt_text: 'Celebración comunitaria en Cocharcas', image_url: '/images/cocharcas-gallery.svg', position: 3, visible: true },
  { id: 'seed-img-4', album_id: 'seed-gal-2', title: 'Peregrinación', description: 'Caminata de peregrinos hacia el santuario.', alt_text: 'Peregrinación hacia Cocharcas', image_url: '/images/cocharcas-gallery.svg', position: 4, visible: true },
  { id: 'seed-img-5', album_id: 'seed-gal-3', title: 'Imagen venerada', description: 'La imagen de Nuestra Señora de Cocharcas.', alt_text: 'Imagen venerada de Nuestra Señora de Cocharcas', image_url: '/images/cocharcas-gallery.svg', position: 5, visible: true },
];

export const fallbackMassSchedules: MassSchedule[] = [
  { id: 'seed-sched-1', day_of_week: 'Domingo', time: '07:00', place: 'Capilla Principal', description: 'Misa dominical de madrugada', active: true },
  { id: 'seed-sched-2', day_of_week: 'Domingo', time: '09:00', place: 'Capilla Principal', description: 'Misa dominical con participación coral', active: true },
  { id: 'seed-sched-3', day_of_week: 'Domingo', time: '11:00', place: 'Capilla Principal', description: 'Misa dominical principal', active: true },
  { id: 'seed-sched-4', day_of_week: 'Lunes a viernes', time: '18:00', place: 'Capilla Principal', description: 'Misa vespertina diaria', active: true },
  { id: 'seed-sched-5', day_of_week: 'Sábado', time: '18:00', place: 'Capilla Principal', description: 'Misa de anticipación dominical', active: true },
];

export const fallbackSacraments: Sacrament[] = [
  { id: 'seed-sac-1', name: 'Bautismo', slug: 'bautismo', description: 'Preparación para recibir el sacramento del Bautismo.', requirements: 'Partida de nacimiento, DNI de padrinos y apoderados.', image_url: '/images/cocharcas-sacrament.svg', active: true, position: 1 },
  { id: 'seed-sac-2', name: 'Confirmación', slug: 'confirmacion', description: 'Acompañamiento catequético para la Confirmación.', requirements: 'Catequesis previa y coordinación pastoral.', image_url: '/images/cocharcas-sacrament.svg', active: true, position: 2 },
  { id: 'seed-sac-3', name: 'Matrimonio', slug: 'matrimonio', description: 'Orientación para la celebración del Matrimonio.', requirements: 'Partidas de bautismo y entrevista pastoral.', image_url: '/images/cocharcas-sacrament.svg', active: true, position: 3 },
  { id: 'seed-sac-4', name: 'Primera Comunión', slug: 'primera-comunion', description: 'Preparación para la Primera Comunión.', requirements: 'Catequesis previa y partida de bautismo.', image_url: '/images/cocharcas-sacrament.svg', active: true, position: 4 },
];

/** Contenido editable de la página Historia (historia de la Virgen de Cocharcas). */
export const fallbackHistoriaContent: HistoriaContent = {
  id: 'seed-historia-content',
  hero_title: 'Cuatro siglos de devoción',
  hero_description:
    'Un legado que perdura a través de los siglos, desde la llegada de la imagen hasta el santuario de piedra de hoy.',
  origins_title: 'Una imagen que llegó a pie',
  origins_text:
    'La historia de Nuestra Señora de Cocharcas se remonta a finales del siglo XVI, cuando el indígena Francisco Tito Yupanqui, inspirado por la devoción a la Virgen de Copacabana, decidió crear una réplica de la imagen sagrada. Tras un arduo viaje de más de 800 kilómetros a pie desde Potosí, logró traer la imagen a estas tierras, donde fue recibida con gran alegría y devoción por la población local.',
  origins_quote:
    'Este acto de fe marcó el comienzo de lo que hoy es uno de los centros religiosos más importantes de los Andes peruanos.',
  origins_image_url: '/images/santuario/virgen-cocharcas.jpg',
  origins_image_alt: 'Imagen de Nuestra Señora de Cocharcas traída por Francisco Tito Yupanqui',
  periods_title: 'Etapas del santuario',
  periods_description:
    'De la primera capilla de adobe al templo de piedra que hoy recibe a los peregrinos.',
  archive_title: 'La memoria escrita',
  archive_text:
    'El santuario posee un valioso archivo histórico que incluye documentos del siglo XVII, como libros de bautismos, matrimonios y defunciones, así como correspondencia eclesiástica y registros administrativos que permiten reconstruir la vida de la comunidad a lo largo de los siglos.\n\nActualmente, el archivo se encuentra en proceso de organización y digitalización para su conservación y puesta a disposición de investigadores y del público interesado.',
  archive_image_url: '/images/santuario/pintura-detalle.jpg',
  archive_image_alt: 'Documentos y arte colonial del archivo histórico del santuario',
  status: 'published',
};

/** Hitos históricos de la línea de tiempo (editables desde el panel). */
export const fallbackHistoriaTimeline: HistoriaTimeline[] = [
  {
    id: 'seed-hist-tl-1',
    year: '1598',
    title: 'Llegada de la imagen de la Virgen de Cocharcas',
    description:
      'Según la tradición, el indígena Francisco Tito Yupanqui trajo una réplica de la Virgen de Copacabana a estas tierras después de un arduo viaje a pie desde Potosí.',
    image_url: '/images/santuario/virgen-cocharcas.jpg',
    image_alt: 'Imagen de la Virgen de Cocharcas',
    position: 1,
    is_active: true,
  },
  {
    id: 'seed-hist-tl-2',
    year: '1600',
    title: 'Construcción de la primera capilla',
    description:
      'Los fieles construyeron una primera capilla de adobe y paja para venerar la imagen traída.',
    image_url: null,
    image_alt: null,
    position: 2,
    is_active: true,
  },
  {
    id: 'seed-hist-tl-3',
    year: '1650',
    title: 'Edificación de la iglesia actual',
    description:
      'Se comenzó la construcción de la iglesia de piedra que actualmente se conserva.',
    image_url: '/images/santuario/santuario-exterior.jpg',
    image_alt: 'Fachada del santuario de piedra',
    position: 3,
    is_active: true,
  },
  {
    id: 'seed-hist-tl-4',
    year: '1700',
    title: 'Primeros documentos parroquiales',
    description: 'Se iniciaron los registros de bautismos, matrimonios y defunciones.',
    image_url: null,
    image_alt: null,
    position: 4,
    is_active: true,
  },
];

/** Slides de demostración (imágenes locales reales del santuario). */
export const fallbackSlides: Slide[] = [
  // HOME
  { id: 'seed-slide-home-1', section: 'home', title: 'Santuario de Nuestra Señora de Cocharcas', description: 'Fe, historia y tradición en el corazón de los Andes.', image_url: '/images/santuario/santuario-exterior.jpg', order_index: 0, is_active: true },
  { id: 'seed-slide-home-2', section: 'home', title: 'Fachada del templo', description: 'Piedra tallada entre los cerros de Apurímac.', image_url: '/images/santuario/santuario-plaza.jpg', order_index: 1, is_active: true },
  { id: 'seed-slide-home-3', section: 'home', title: 'Nuestra Señora de Cocharcas', description: 'Detalle del óleo colonial que guarda la memoria del pueblo.', image_url: '/images/santuario/pintura-detalle.jpg', order_index: 2, is_active: true },
  { id: 'seed-slide-home-4', section: 'home', title: 'La imagen de la Virgen', description: 'Devoción mariana que atraviesa generaciones.', image_url: '/images/santuario/pintura-colonial.jpg', order_index: 3, is_active: true },
  // SANTUARIO
  { id: 'seed-slide-santuario-1', section: 'santuario', title: 'Fachada del Santuario', description: 'Portada principal de piedra tallada.', image_url: '/images/santuario/santuario-plaza.jpg', button_text: 'Conocer la arquitectura', button_url: '/santuario/arquitectura', order_index: 0, is_active: true },
  { id: 'seed-slide-santuario-2', section: 'santuario', title: 'Torres y cúpulas', description: 'Silueta del templo entre los cerros de Chincheros.', image_url: '/images/santuario/santuario-exterior.jpg', button_text: 'Historia del templo', button_url: '/santuario/historia', order_index: 1, is_active: true },
  { id: 'seed-slide-santuario-3', section: 'santuario', title: 'Patrimonio del santuario', description: 'Arte religioso y memoria que se conserva.', image_url: '/images/santuario/pintura-detalle.jpg', button_text: 'Ver el patrimonio', button_url: '/santuario/patrimonio', order_index: 2, is_active: true },
  // FE Y PEREGRINACIÓN
  { id: 'seed-slide-fe-1', section: 'fe-peregrinacion', title: 'Caminos de fe', description: 'Peregrinos que llegan cada año al santuario.', image_url: '/images/santuario/santuario-exterior.jpg', button_text: 'Planifica tu visita', button_url: '/visita', order_index: 0, is_active: true },
  { id: 'seed-slide-fe-2', section: 'fe-peregrinacion', title: 'Oración y devoción', description: 'La casa de la Virgen, abierta a todos los pueblos.', image_url: '/images/santuario/santuario-plaza.jpg', button_text: 'Vida de fe', button_url: '/fe', order_index: 1, is_active: true },
  // FESTIVIDADES
  { id: 'seed-slide-fest-1', section: 'festividades', title: 'Fiesta de la Virgen de Cocharcas', description: 'Cada 8 de septiembre, el pueblo celebra a su patrona.', image_url: '/images/santuario/pintura-colonial.jpg', button_text: 'Ver festividades', button_url: '/festividades', order_index: 0, is_active: true },
  { id: 'seed-slide-fest-2', section: 'festividades', title: 'Procesión y devoción popular', description: 'Danzas, música y fe que reúne a generaciones.', image_url: '/images/santuario/pintura-detalle.jpg', button_text: 'Conocer el programa', button_url: '/festividades', order_index: 1, is_active: true },
  // HISTORIA
  { id: 'seed-slide-hist-1', section: 'historia', title: 'Cuatro siglos de devoción', description: 'Desde la llegada de la imagen hasta el santuario de piedra.', image_url: '/images/santuario/santuario-exterior.jpg', button_text: 'Conocer la historia', button_url: '/santuario/historia', order_index: 0, is_active: true },
  { id: 'seed-slide-hist-2', section: 'historia', title: 'El óleo de 1751', description: 'Testimonio del arte colonial andino.', image_url: '/images/santuario/pintura-colonial.jpg', button_text: 'Ver el patrimonio', button_url: '/santuario/patrimonio', order_index: 1, is_active: true },
  // GALERÍA
  { id: 'seed-slide-gal-1', section: 'galeria', title: 'El santuario en imágenes', description: 'Vistas del templo, las celebraciones y la comunidad.', image_url: '/images/santuario/santuario-plaza.jpg', button_text: 'Explorar la galería', button_url: '/galeria', order_index: 0, is_active: true },
  { id: 'seed-slide-gal-2', section: 'galeria', title: 'La Virgen de Cocharcas', description: 'Imagen venerada en Apurímac desde 1598.', image_url: '/images/santuario/virgen-cocharcas.jpg', button_text: 'Conocer a la Virgen', button_url: '/santuario/nuestra-senora', order_index: 1, is_active: true },
  // EVENTOS
  { id: 'seed-slide-eventos-1', section: 'eventos', title: 'Agenda del santuario', description: 'Encuentros litúrgicos, peregrinaciones y actividades comunitarias.', image_url: '/images/santuario/santuario-exterior.jpg', button_text: 'Ver la agenda', button_url: '/eventos', order_index: 0, is_active: true },
  { id: 'seed-slide-eventos-2', section: 'eventos', title: 'Fiesta y tradición', description: 'La comunidad celebrando su fe a lo largo del año.', image_url: '/images/santuario/pintura-detalle.jpg', button_text: 'Festividades', button_url: '/festividades', order_index: 1, is_active: true },
  // NOTICIAS
  { id: 'seed-slide-noticias-1', section: 'noticias', title: 'Novedades del santuario', description: 'Noticias pastorales, culturales y patrimoniales de la comunidad.', image_url: '/images/santuario/santuario-plaza.jpg', button_text: 'Leer las noticias', button_url: '/noticias', order_index: 0, is_active: true },
  { id: 'seed-slide-noticias-2', section: 'noticias', title: 'Memoria que se comparte', description: 'La vida del pueblo contada desde su santuario.', image_url: '/images/santuario/pintura-colonial.jpg', button_text: 'Ver el archivo', button_url: '/santuario/archivo-historico', order_index: 1, is_active: true },
  // VISITA
  { id: 'seed-slide-visita-1', section: 'visita', title: 'Ven a Cocharcas', description: 'Información esencial para peregrinos y visitantes del santuario.', image_url: '/images/santuario/santuario-exterior.jpg', button_text: 'Planifica tu visita', button_url: '/visita', order_index: 0, is_active: true },
  { id: 'seed-slide-visita-2', section: 'visita', title: 'Un pueblo que recibe al peregrino', description: 'Hospedaje, rutas y horarios para tu llegada.', image_url: '/images/santuario/santuario-plaza.jpg', button_text: 'Cómo llegar', button_url: '/visita', order_index: 1, is_active: true },
  // CONTACTO
  { id: 'seed-slide-contacto-1', section: 'contacto', title: 'Escríbenos', description: 'Estamos para orientarte en tu visita y en tus solicitudes pastorales.', image_url: '/images/santuario/santuario-plaza.jpg', button_text: 'Solicitudes pastorales', button_url: '/solicitudes', order_index: 0, is_active: true },
  { id: 'seed-slide-contacto-2', section: 'contacto', title: 'La casa de la Virgen, abierta a todos', description: 'Consulta, sugiere o acompaña la misión del santuario.', image_url: '/images/santuario/virgen-cocharcas.jpg', button_text: 'Planifica tu visita', button_url: '/visita', order_index: 1, is_active: true },
];

export const fallbackSacramentTypes: SacramentType[] = [
  { id: 'seed-sactype-bautismo', name: 'Bautismo', description: 'Preparación para recibir el Bautismo.', active: true, position: 1 },
  { id: 'seed-sactype-confirmacion', name: 'Confirmación', description: 'Acompañamiento catequético.', active: true, position: 2 },
  { id: 'seed-sactype-matrimonio', name: 'Matrimonio', description: 'Orientación para el sacramento.', active: true, position: 3 },
  { id: 'seed-sactype-primera', name: 'Primera Comunión', description: 'Preparación eucarística.', active: true, position: 4 },
];
