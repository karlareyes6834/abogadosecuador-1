/**
 * Servicio de Órdenes y Pagos - Integración completa
 * Maneja carrito, órdenes, pagos y procesamiento
 */

import { supabase } from '../config/supabase';

export interface CartItem {
  id: string;
  item_id: string;
  item_type: 'product' | 'service' | 'course' | 'ebook';
  quantity: number;
  price: number;
  name?: string;
  image_url?: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  payment_id?: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  item_id: string;
  item_type: string;
  item_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

const ordersService = {
  // ==================== CARRITO ====================
  
  /**
   * Obtener carrito del usuario
   */
  async getCart(userId: string) {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      // Enriquecer con detalles de los items
      const enrichedItems = await Promise.all(
        (data || []).map(async (item) => {
          let itemDetails = null;
          
          switch (item.item_type) {
            case 'course':
              const { data: course } = await supabase
                .from('courses')
                .select('title, thumbnail')
                .eq('id', item.item_id)
                .single();
              itemDetails = course;
              break;
            case 'product':
              const { data: product } = await supabase
                .from('products')
                .select('name, image_url')
                .eq('id', item.item_id)
                .single();
              itemDetails = product;
              break;
            case 'service':
              const { data: service } = await supabase
                .from('services')
                .select('name, image_url')
                .eq('id', item.item_id)
                .single();
              itemDetails = service;
              break;
            case 'ebook':
              const { data: ebook } = await supabase
                .from('ebooks')
                .select('title, cover_image')
                .eq('id', item.item_id)
                .single();
              itemDetails = ebook;
              break;
          }

          return {
            ...item,
            name: itemDetails?.title || itemDetails?.name || 'Item',
            image_url: itemDetails?.thumbnail || itemDetails?.image_url || itemDetails?.cover_image
          };
        })
      );

      return { data: enrichedItems, error: null };
    } catch (error) {
      console.error('Error al obtener carrito:', error);
      return { data: [], error };
    }
  },

  /**
   * Agregar item al carrito
   */
  async addToCart(userId: string, itemId: string, itemType: CartItem['item_type'], price: number, quantity: number = 1) {
    try {
      // Verificar si ya existe
      const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('item_id', itemId)
        .single();

      if (existing) {
        // Actualizar cantidad
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      }

      // Crear nuevo item
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          item_id: itemId,
          item_type: itemType,
          quantity,
          price
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      return { data: null, error };
    }
  },

  /**
   * Actualizar cantidad de item en carrito
   */
  async updateCartItemQuantity(cartItemId: string, quantity: number) {
    try {
      if (quantity <= 0) {
        return await this.removeFromCart(cartItemId);
      }

      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      return { data: null, error };
    }
  },

  /**
   * Remover item del carrito
   */
  async removeFromCart(cartItemId: string) {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Error al remover del carrito:', error);
      return { success: false, error };
    }
  },

  /**
   * Limpiar carrito
   */
  async clearCart(userId: string) {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Error al limpiar carrito:', error);
      return { success: false, error };
    }
  },

  // ==================== ÓRDENES ====================

  /**
   * Crear orden desde el carrito
   */
  async createOrderFromCart(userId: string, paymentMethod: string, paymentId?: string) {
    try {
      // Obtener items del carrito
      const { data: cartItems, error: cartError } = await this.getCart(userId);
      if (cartError) throw cartError;
      if (!cartItems || cartItems.length === 0) {
        throw new Error('El carrito está vacío');
      }

      // Calcular total
      const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Crear orden
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          total_amount: totalAmount,
          status: 'pending',
          payment_method: paymentMethod,
          payment_id: paymentId
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Crear items de orden
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        item_id: item.item_id,
        item_type: item.item_type,
        item_name: item.name || 'Item',
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Limpiar carrito
      await this.clearCart(userId);

      return { data: order, error: null };
    } catch (error) {
      console.error('Error al crear orden:', error);
      return { data: null, error };
    }
  },

  /**
   * Actualizar estado de orden
   */
  async updateOrderStatus(orderId: string, status: Order['status']) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      // Si la orden se completó, asignar cursos/productos al usuario
      if (status === 'completed') {
        await this.fulfillOrder(orderId);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error al actualizar estado de orden:', error);
      return { data: null, error };
    }
  },

  /**
   * Cumplir orden (asignar productos/cursos al usuario)
   */
  async fulfillOrder(orderId: string) {
    try {
      // Obtener items de la orden
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select('*, orders!inner(user_id)')
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;

      const userId = orderItems[0]?.orders?.user_id;
      if (!userId) throw new Error('Usuario no encontrado');

      // Procesar cada item
      for (const item of orderItems) {
        switch (item.item_type) {
          case 'course':
            // Asignar curso al usuario
            await supabase
              .from('user_courses')
              .upsert({
                user_id: userId,
                course_id: item.item_id,
                purchased_at: new Date().toISOString(),
                active: true
              }, { onConflict: 'user_id,course_id' });
            break;

          case 'ebook':
            // Asignar ebook al usuario
            await supabase
              .from('ebook_purchases')
              .upsert({
                user_id: userId,
                ebook_id: item.item_id,
                purchased_at: new Date().toISOString()
              }, { onConflict: 'user_id,ebook_id' });
            break;

          case 'service':
            // Crear notificación para agendar servicio
            await supabase
              .from('notifications')
              .insert({
                user_id: userId,
                type: 'service_purchased',
                title: 'Servicio Adquirido',
                message: `Has adquirido: ${item.item_name}. Por favor agenda tu cita.`,
                action_url: '/calendar'
              });
            break;
        }
      }

      // Crear notificación de compra exitosa
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'order_completed',
          title: 'Compra Exitosa',
          message: 'Tu orden ha sido procesada correctamente.',
          action_url: `/dashboard/my-purchases`
        });

      return { success: true, error: null };
    } catch (error) {
      console.error('Error al cumplir orden:', error);
      return { success: false, error };
    }
  },

  /**
   * Obtener órdenes del usuario
   */
  async getUserOrders(userId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
      return { data: [], error };
    }
  },

  /**
   * Obtener detalles de orden
   */
  async getOrderDetails(orderId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*),
          profiles!orders_user_id_fkey (full_name, email)
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error al obtener detalles de orden:', error);
      return { data: null, error };
    }
  },

  // ==================== PAGOS ====================

  /**
   * Procesar pago con Stripe (placeholder para integración real)
   */
  async processStripePayment(orderId: string, paymentMethodId: string) {
    try {
      // Aquí iría la integración real con Stripe
      // Por ahora simulamos el proceso
      
      const { data: order } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('id', orderId)
        .single();

      // Simular llamada a Stripe API
      // const paymentIntent = await stripe.paymentIntents.create({...})
      
      // Actualizar orden con payment_id
      await supabase
        .from('orders')
        .update({ 
          payment_id: `stripe_${Date.now()}`,
          status: 'completed' 
        })
        .eq('id', orderId);

      await this.fulfillOrder(orderId);

      return { 
        success: true, 
        paymentId: `stripe_${Date.now()}`,
        error: null 
      };
    } catch (error) {
      console.error('Error al procesar pago Stripe:', error);
      return { success: false, paymentId: null, error };
    }
  },

  /**
   * Procesar pago con PayPal (placeholder para integración real)
   */
  async processPayPalPayment(orderId: string, paypalOrderId: string) {
    try {
      // Aquí iría la integración real con PayPal
      
      await supabase
        .from('orders')
        .update({ 
          payment_id: paypalOrderId,
          status: 'completed' 
        })
        .eq('id', orderId);

      await this.fulfillOrder(orderId);

      return { 
        success: true, 
        paymentId: paypalOrderId,
        error: null 
      };
    } catch (error) {
      console.error('Error al procesar pago PayPal:', error);
      return { success: false, paymentId: null, error };
    }
  }
};

export default ordersService;
