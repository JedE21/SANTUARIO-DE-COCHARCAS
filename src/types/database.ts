export type Json = string | number | boolean | null | undefined | { [key: string]: Json } | Json[];
export type Status = 'draft' | 'published' | 'archived';

export type Role = {
  id: string;
  name: string;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Profile = {
  id: string;
  user_id: string;
  role_id?: string | null;
  full_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type SiteSettings = {
  id: string;
  site_name?: string | null;
  site_description?: string | null;
  address?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  logo_url?: string | null;
  favicon_url?: string | null;
  responsible_name?: string | null;
  responsible_title?: string | null;
  responsible_bio?: string | null;
  responsible_photo_url?: string | null;
  facebook_url?: string | null;
  twitter_url?: string | null;
  instagram_url?: string | null;
  youtube_url?: string | null;
  footer_text?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type NavigationItem = {
  id: string;
  label: string;
  href: string;
  position?: number | null;
  visible?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type FooterSettings = {
  id: string;
  about_text?: string | null;
  show_newsletter?: boolean | null;
  newsletter_text?: string | null;
  copyright_text?: string | null;
  developer_text?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Page = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  content?: string | null;
  image_url?: string | null;
  status?: Status | null;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type HomeSection = {
  id: string;
  key: string;
  title: string;
  description?: string | null;
  content?: string | null;
  image_url?: string | null;
  visible?: boolean | null;
  position?: number | null;
  settings?: Json;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Announcement = {
  id: string;
  title: string;
  content?: string | null;
  link_url?: string | null;
  status?: Status | null;
  published_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  active?: boolean | null;
  position?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  status?: 'new' | 'read' | 'replied' | 'archived' | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type NewsCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  position?: number | null;
  active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  cover_image_url?: string | null;
  category_id?: string | null;
  author_id?: string | null;
  status?: Status | null;
  published_at?: string | null;
  is_featured?: boolean | null;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type EventItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url?: string | null;
  location?: string | null;
  start_date: string;
  end_date?: string | null;
  status?: Status | null;
  author_id?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Festivity = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  program?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  cover_image_url?: string | null;
  status?: Status | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type GalleryCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  position?: number | null;
  active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type GalleryAlbum = {
  id: string;
  category_id?: string | null;
  title: string;
  slug: string;
  description?: string | null;
  cover_image_url?: string | null;
  position?: number | null;
  active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type GalleryItem = {
  id: string;
  album_id?: string | null;
  title?: string | null;
  description?: string | null;
  alt_text?: string | null;
  image_url: string;
  position?: number | null;
  visible?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type MassSchedule = {
  id: string;
  day_of_week: string;
  time: string;
  place?: string | null;
  description?: string | null;
  active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Sacrament = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  requirements?: string | null;
  image_url?: string | null;
  active?: boolean | null;
  position?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type SacramentType = {
  id: string;
  name: string;
  description?: string | null;
  active?: boolean | null;
  position?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type MassRequest = {
  id: string;
  request_number?: string | null;
  requester_name: string;
  requester_email?: string | null;
  phone?: string | null;
  intention_type?: string | null;
  intention?: string | null;
  requested_date: string;
  preferred_time?: string | null;
  notes?: string | null;
  status?: 'pending' | 'reviewing' | 'confirmed' | 'rejected' | 'completed' | 'cancelled' | null;
  admin_notes?: string | null;
  tracking_hash?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type SacramentRequest = {
  id: string;
  request_number?: string | null;
  sacrament_id?: string | null;
  requester_name: string;
  requester_email?: string | null;
  phone?: string | null;
  requested_date: string;
  notes?: string | null;
  status?: 'pending' | 'reviewing' | 'confirmed' | 'rejected' | 'completed' | 'cancelled' | null;
  admin_notes?: string | null;
  tracking_hash?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Slide = {
  id: string;
  section: string;
  title: string;
  description?: string | null;
  image_url: string;
  button_text?: string | null;
  button_url?: string | null;
  order_index?: number | null;
  is_active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Media = {
  id: string;
  name: string;
  url: string;
  bucket?: string | null;
  mime_type?: string | null;
  size_bytes?: number | null;
  alt_text?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AuditLog = {
  id: string;
  user_id?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  metadata?: Json;
  created_at?: string | null;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Tables = {
  roles: Role;
  profiles: Profile;
  site_settings: SiteSettings;
  navigation_items: NavigationItem;
  footer_settings: FooterSettings;
  pages: Page;
  home_sections: HomeSection;
  announcements: Announcement;
  faqs: Faq;
  contact_messages: ContactMessage;
  news_categories: NewsCategory;
  news: NewsItem;
  events: EventItem;
  festivities: Festivity;
  gallery_categories: GalleryCategory;
  gallery_albums: GalleryAlbum;
  gallery_items: GalleryItem;
  mass_schedules: MassSchedule;
  sacraments: Sacrament;
  sacrament_types: SacramentType;
  mass_requests: MassRequest;
  sacrament_requests: SacramentRequest;
  media: Media;
  slides: Slide;
  audit_logs: AuditLog;
  newsletter_subscribers: NewsletterSubscriber;
};

export type Database = {
  public: {
    Tables: { [K in keyof Tables]: { Row: Tables[K]; Insert: Partial<Tables[K]>; Update: Partial<Tables[K]> } };
  };
};
