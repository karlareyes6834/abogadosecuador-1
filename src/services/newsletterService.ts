/**
 * Servicio de Newsletter y Blog
 * Gestiona suscripciones, envíos y posts del blog
 */

import { supabase } from '../config/supabase';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  subscribed_at: string;
  is_active: boolean;
  preferences: any;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  author_id: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
}

const newsletterService = {
  // ==================== NEWSLETTER ====================

  /**
   * Suscribirse al newsletter
   */
  async subscribe(email: string, name?: string) {
    try {
      // Verificar si ya está suscrito
      const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('email', email)
        .single();

      if (existing) {
        if (existing.is_active) {
          return { 
            success: true, 
            message: 'Ya estás suscrito al newsletter',
            alreadySubscribed: true,
            error: null 
          };
        } else {
          // Reactivar suscripción
          const { error } = await supabase
            .from('newsletter_subscribers')
            .update({ is_active: true })
            .eq('email', email);

          if (error) throw error;
          
          return { 
            success: true, 
            message: 'Suscripción reactivada correctamente',
            alreadySubscribed: false,
            error: null 
          };
        }
      }

      // Nueva suscripción
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email,
          name,
          is_active: true,
          subscribed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return { 
        success: true, 
        message: 'Suscripción exitosa',
        data,
        alreadySubscribed: false,
        error: null 
      };
    } catch (error) {
      console.error('Error al suscribirse:', error);
      return { success: false, message: 'Error al procesar suscripción', error };
    }
  },

  /**
   * Cancelar suscripción
   */
  async unsubscribe(email: string) {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ is_active: false })
        .eq('email', email);

      if (error) throw error;

      return { 
        success: true, 
        message: 'Te has dado de baja correctamente',
        error: null 
      };
    } catch (error) {
      console.error('Error al cancelar suscripción:', error);
      return { success: false, message: 'Error al procesar', error };
    }
  },

  /**
   * Actualizar preferencias de suscriptor
   */
  async updatePreferences(email: string, preferences: any) {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ preferences })
        .eq('email', email);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error al actualizar preferencias:', error);
      return { success: false, error };
    }
  },

  /**
   * Obtener total de suscriptores activos
   */
  async getSubscribersCount() {
    try {
      const { count, error } = await supabase
        .from('newsletter_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (error) throw error;

      return { count: count || 0, error: null };
    } catch (error) {
      console.error('Error al contar suscriptores:', error);
      return { count: 0, error };
    }
  },

  /**
   * Obtener lista de suscriptores (solo para admin)
   */
  async getSubscribers(limit: number = 100, offset: number = 0) {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('is_active', true)
        .order('subscribed_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error al obtener suscriptores:', error);
      return { data: [], error };
    }
  },

  // ==================== BLOG ====================

  /**
   * Obtener posts publicados del blog
   */
  async getPublishedPosts(limit: number = 10, offset: number = 0) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles!blog_posts_author_id_fkey (full_name, avatar_url)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error al obtener posts:', error);
      return { data: [], error };
    }
  },

  /**
   * Obtener post por slug
   */
  async getPostBySlug(slug: string) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles!blog_posts_author_id_fkey (full_name, avatar_url)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error al obtener post:', error);
      return { data: null, error };
    }
  },

  /**
   * Obtener posts por categoría
   */
  async getPostsByCategory(category: string, limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles!blog_posts_author_id_fkey (full_name, avatar_url)
        `)
        .eq('status', 'published')
        .eq('category', category)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error al obtener posts por categoría:', error);
      return { data: [], error };
    }
  },

  /**
   * Buscar posts
   */
  async searchPosts(query: string) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles!blog_posts_author_id_fkey (full_name, avatar_url)
        `)
        .eq('status', 'published')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .order('published_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error al buscar posts:', error);
      return { data: [], error };
    }
  },

  /**
   * Crear post (admin/autor)
   */
  async createPost(authorId: string, postData: Partial<BlogPost>) {
    try {
      // Generar slug si no existe
      const slug = postData.slug || this.generateSlug(postData.title || '');

      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          author_id: authorId,
          title: postData.title,
          slug,
          content: postData.content,
          excerpt: postData.excerpt,
          featured_image: postData.featured_image,
          category: postData.category,
          tags: postData.tags || [],
          status: postData.status || 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error al crear post:', error);
      return { data: null, error };
    }
  },

  /**
   * Actualizar post
   */
  async updatePost(postId: string, updates: Partial<BlogPost>) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error al actualizar post:', error);
      return { data: null, error };
    }
  },

  /**
   * Publicar post
   */
  async publishPost(postId: string) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({ 
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error al publicar post:', error);
      return { data: null, error };
    }
  },

  /**
   * Eliminar post
   */
  async deletePost(postId: string) {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error al eliminar post:', error);
      return { success: false, error };
    }
  },

  /**
   * Obtener categorías del blog
   */
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('category')
        .eq('status', 'published');

      if (error) throw error;

      // Obtener categorías únicas
      const categories = [...new Set(data?.map(p => p.category))];

      return { data: categories, error: null };
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      return { data: [], error };
    }
  },

  /**
   * Agregar comentario a post
   */
  async addComment(postId: string, userId: string, content: string) {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .insert({
          post_id: postId,
          user_id: userId,
          content,
          approved: false // Requiere aprobación
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      return { data: null, error };
    }
  },

  /**
   * Obtener comentarios de un post
   */
  async getPostComments(postId: string) {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select(`
          *,
          profiles!blog_comments_user_id_fkey (full_name, avatar_url)
        `)
        .eq('post_id', postId)
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
      return { data: [], error };
    }
  },

  // ==================== UTILIDADES ====================

  /**
   * Generar slug desde título
   */
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres especiales
      .replace(/(^-|-$)/g, ''); // Remover guiones al inicio/fin
  }
};

export default newsletterService;
