// Authentication types
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'admin' | 'client';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginData) => Promise<{ success: boolean; error?: any }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

// Catalog and Product types
export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: CatalogItemType;
  category: string;
  imageUrl?: string;
  status: 'active' | 'inactive';
  duration?: string;
  shortDescription?: string;
  slug?: string;
  modules?: Module[];
  attention?: {
    modalities: string[];
    canSchedule: boolean;
  };
}

export type CatalogItemType = 'product' | 'service' | 'course' | 'masterclass' | 'ebook' | 'consulta';

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  type: 'text' | 'video' | 'pdf' | 'evaluation';
  content: string;
  resources?: Resource[];
}

export interface Resource {
  name: string;
  url: string;
}

// Purchase and Payment types
export interface Purchase {
  id: string;
  itemId: string;
  itemType: string;
  itemName: string;
  amount: number;
  purchaseDate: string;
  paymentMethod: string;
}

// Legacy types for compatibility
export interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Course {
  id: string;
  name: string;
  price: number;
  description: string;
}

// Navigation types
export type Page = 'home' | 'dashboard' | 'login' | 'register' | 'checkout' | 'catalogo' | 'calendar';
export type PublicRoute = 'services' | 'courses' | 'ebooks' | 'blog' | 'contact' | 'about' | 'plans';

// Blog types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  publishDate: string;
  author?: string;
}

// Testimonial types
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  imageUrl?: string;
}
