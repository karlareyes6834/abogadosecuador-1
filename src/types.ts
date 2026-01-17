export interface Site {
  id: string;
  name: string;
  slug: string;
  status: 'published' | 'draft';
  lastModified: string;
  pageIds?: string[];
}

export interface WebAppComponent {
  id: string;
  type: string;
  props: {
      style?: React.CSSProperties;
      [key: string]: any;
  };
}

export interface WebAppPage {
  path: string;
  isProtected: boolean;
  components: WebAppComponent[];
}

export interface DataModelField {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'date' | 'id';
}

export interface DataModel {
    fields: DataModelField[];
    initialData?: any[];
}

export interface WebApp {
    name: string;
    theme: {
        primaryColor: string;
        font: string;
    };
    dataModels: Record<string, DataModel>;
    pages: Record<string, WebAppPage>;
    domains?: { name: string, isPrimary: boolean, status: 'pending' | 'verified' }[];
    seo?: {
        titleTemplate?: string;
        metaDescription?: string;
        socialImage?: string;
    };
}


export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string; // Will be a data URL or external URL
  category: string;
  status: 'active' | 'archived';
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  project: string;
  assignee: {
    name: string;
    avatar: string;
  };
}

export interface Resource {
  name: string;
  url: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'pdf' | 'evaluation';
  content: string; // URL, markdown, or JSON for evaluation
  resources?: Resource[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  modules: Module[];
  materials?: { name: string, url: string }[];
}

// --- NEW UNIFIED CATALOG ITEM ---
export type CatalogItemType = 'product' | 'service' | 'course' | 'ebook' | 'masterclass' | 'consulta' | 'plan';

export interface CatalogItem {
  id: string;
  type: CatalogItemType;
  name: string;
  description: string;
  price: number;
  status: 'active' | 'archived' | 'draft';
  category: string;
  imageUrl: string;
  slug?: string;
  shortDescription?: string;
  longDescription?: string;
  keyPoints?: string[];
  priceInfo?: string;
  isFeatured?: boolean;

  // Product specific
  stock?: number;

  // Service specific
  duration?: number; // in minutes
  color?: string;
  
  // Consultation specific
  durationText?: string;
  attention?: {
    modalities: string[];
    canSchedule: boolean;
  };

  // Course / Masterclass specific
  modules?: Module[];
}
// --- END NEW UNIFIED CATALOG ITEM ---

export type PipelineStatus = 'new' | 'qualifying' | 'nurturing' | 'agent_review' | 'proposal' | 'won';

// This is a view model for the CRM page, combining User and CrmData
export interface Contact {
  id: string; // user id
  name: string;
  company: string;
  value: number;
  status: PipelineStatus;
  avatar: string;
  email: string;
  phone?: string;
  tags: string[];
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  billingType: 'one-time' | 'recurring';
  status: 'active' | 'archived';
  color: string;
  imageUrl: string;
}

export interface LegalService {
    id: string;
    slug: string;
    title: string;
    category: string;
    shortDescription: string;
    longDescription: string; // Can be Markdown/HTML
    keyPoints: string[];
    price: number;
    priceInfo: string;
    modalities?: ('virtual' | 'presencial')[];
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    downloadables?: { name: string, url: string }[];
}


export interface Appointment {
  id: string;
  contactName: string;
  serviceId: string;
  dateTime: string; // ISO string
  status: AppointmentStatus;
  modality?: 'presencial' | 'virtual';
}

export interface Purchase {
  id: string;
  itemId: string;
  itemType: 'service' | 'product' | 'course' | 'plan' | 'ebook' | 'consulta' | 'masterclass';
  itemName: string;
  amount: number;
  purchaseDate: string; // ISO String
  paymentMethod: 'Card' | 'PayPal' | 'Transfer';
}

// --- Order & Shipping Types for Sales Management ---
export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  id: string; 
  name: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  orderDate: string; // ISO String
  shippingAddress?: ShippingAddress;
}


// --- Form Types ---

export type FormFieldType = 'text' | 'email' | 'textarea' | 'tel';

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  placeholder?: string;
}

export interface Form {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  createdAt: string; // ISO string
}

export interface FormSubmission {
  id: string;
  formId: string;
  submittedAt: string; // ISO string
  data: Record<string, any>; // { fieldId: value }
}

// --- User Database Type ---

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: 'Registro' | 'Formulario de Contacto' | 'Importado' | 'Conversación';
  registeredAt: string; // ISO string
  avatar: string;
  company?: string;
}

// --- CRM Data ---
export interface CrmData {
  userId: string; // Links to User.id
  value: number;
  status: PipelineStatus;
  tags: string[];
}

// --- Affiliates Types ---
export interface AffiliateStats {
  userId: string;
  referralCode: string;
  clicks: number;
  signups: number;
  earnings: number;
}

export interface Referral {
    id: string;
    name: string;
    date: string; // ISO String
    status: 'pending' | 'converted';
    commission: number;
}

// --- Documents Types ---
export interface DocumentTemplate {
    id: string;
    name: string;
    description: string;
    content: string; // HTML content or a structured format
}

export interface UserDocument {
    id: string;
    title: string;
    content: string; // Plain text or markdown content
    createdAt: string; // ISO String
    status: 'Borrador' | 'Analizado' | 'Finalizado';
}

// --- Blog Types ---
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown
  imageUrl: string;
  publishDate: string; // ISO String
  category: string;
}

// --- Dashboard Types ---
export interface Activity {
  id: number;
  type: 'document' | 'course' | 'appointment' | 'case_update';
  description: string;
  timestamp: string; // ISO String
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

// --- Testimonial Types ---
export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  authorTitle: string;
  caseType: string;
  caseResult: string;
  avatar: string;
}

// --- Plan Types ---
export interface Plan {
    id: string;
    name: string;
    price: number;
    priceDetails: string;
    description: string;
    features: string[];
    isFeatured?: boolean;
    cta: string;
}

export type UserRole = 'admin' | 'client';

export type Page = 'dashboard' | 'crm' | 'automations' | 'chatbots' | 'publisher' | 'analytics' | 'vrar' | 'sites' | 'media' | 'financials' | 'database' | 'assistants' | 'settings' | 'site-editor' | 'course-editor' | 'manage-courses' | 'projects' | 'credits' | 'content-studio' | 'sales' | 'documents' | 'campaigns' | 'conversations' | 'calendar' | 'forms' | 'form-editor' | 'form-submissions' | 'catalogo' | 'website-editor' | 'users' | 'affiliates' | 'games' | 'services' | 'service-detail' | 'blog' | 'blog-post' | 'forum' | 'checkout' | 'plans' | 'contact' | 'rewards' | 'ebooks' | 'courses' | 'course-detail' | 'my-purchases' | 'my-courses' | 'consultas' | 'products';
export type PublicRoute = 'home' | 'plans' | 'login' | 'register' | 'contact' | 'services' | 'blog' | 'service-detail' | 'blog-post' | 'checkout' | 'catalogo' | 'ebooks' | 'courses' | 'course-detail' | 'forum' | 'games' | 'calendar' | 'consultas';

export interface Branch {
  id: string;
  name: string;
}