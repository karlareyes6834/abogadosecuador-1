const path = require('path');
const dotenv = require('dotenv');

// Intentar cargar variables primero desde backend/.env y luego desde ../.env
dotenv.config();
if (!process.env.VITE_SUPABASE_URL && !process.env.SUPABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
}
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey)
  : new Proxy({}, {
    get() {
      throw new Error('Supabase no configurado: define VITE_SUPABASE_URL (o SUPABASE_URL) y SUPABASE_SERVICE_KEY en el backend');
    }
  });

// Middleware
app.use(cors());
app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhook/stripe') {
    next();
    return;
  }
  express.json()(req, res, next);
});
app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhook/stripe') {
    next();
    return;
  }
  express.urlencoded({ extended: true })(req, res, next);
});

// ============================================
// SISTEMA DE PAGOS REAL - STRIPE
// ============================================

// Crear sesión de pago con Stripe
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', metadata } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convertir a centavos
      currency: currency,
      metadata: metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Verificar pago de PayPal
app.post('/api/verify-paypal-payment', async (req, res) => {
  try {
    const { orderId, payerId, paymentId } = req.body;

    // Aquí se verificaría con la API de PayPal
    // Por ahora validamos que existan los datos
    if (!orderId || !payerId) {
      return res.status(400).json({
        success: false,
        error: 'Datos de pago incompletos'
      });
    }

    res.json({
      success: true,
      verified: true,
      transactionId: orderId
    });
  } catch (error) {
    console.error('Error verifying PayPal payment:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// SISTEMA DE COMPRAS - PROCESAR ORDEN
// ============================================

app.post('/api/purchase', async (req, res) => {
  try {
    const { 
      userId, 
      items, 
      total, 
      paymentMethod, 
      paymentDetails,
      billingInfo 
    } = req.body;

    // Validar datos requeridos
    if (!userId || !items || items.length === 0 || total === undefined || total === null) {
      return res.status(400).json({
        success: false,
        error: 'Datos de compra incompletos'
      });
    }

    // Generar ID de orden único
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Crear orden en la base de datos
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        user_id: userId,
        amount: total,
        status: 'completed',
        payment_method: paymentMethod,
        payment_details: paymentDetails,
        items: items,
        billing_info: billingInfo,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return res.status(500).json({
        success: false,
        error: 'Error al crear la orden'
      });
    }

    // Registrar cada compra individual
    const purchases = [];
    for (const item of items) {
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          user_id: userId,
          product_id: item.id,
          product_type: item.type,
          product_name: item.name,
          amount: item.price,
          quantity: item.quantity || 1,
          order_id: orderId,
          payment_method: paymentMethod,
          transaction_id: paymentDetails?.transactionId || orderId,
          status: 'active',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (!purchaseError) {
        purchases.push(purchase);

        // Si es suscripción, registrar suscripción del usuario
        if (item.type === 'subscription') {
          const nextBillingDate = new Date();
          nextBillingDate.setMonth(nextBillingDate.getMonth() + (item.duration || 1));

          await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId,
              plan_name: item.name,
              price: item.price,
              billing_cycle: item.billingCycle || 'monthly',
              status: 'active',
              next_billing_date: nextBillingDate.toISOString(),
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });
        }

        // Dar acceso al producto comprado
        await supabase
          .from('user_products')
          .insert({
            user_id: userId,
            product_id: item.id,
            product_type: item.type,
            access_granted: true,
            purchased_at: new Date().toISOString()
          });
      }
    }

    // Enviar email de confirmación (opcional)
    // await sendPurchaseConfirmationEmail(userId, order);

    res.json({
      success: true,
      message: '¡Compra realizada con éxito!',
      orderId: orderId,
      transactionId: paymentDetails?.transactionId || orderId,
      purchases: purchases
    });

  } catch (error) {
    console.error('Error processing purchase:', error);
    res.status(500).json({
      success: false,
      error: 'Error al procesar la compra: ' + error.message
    });
  }
});

// ============================================
// SISTEMA DE SUSCRIPCIONES
// ============================================

// Verificar y actualizar suscripciones expiradas
app.post('/api/check-subscriptions', async (req, res) => {
  try {
    const now = new Date().toISOString();

    // Obtener suscripciones expiradas
    const { data: expiredSubs, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active')
      .lt('next_billing_date', now);

    if (error) throw error;

    // Desactivar suscripciones expiradas
    for (const sub of expiredSubs || []) {
      // Actualizar estado de suscripción
      await supabase
        .from('subscriptions')
        .update({ 
          status: 'expired',
          updated_at: new Date().toISOString()
        })
        .eq('id', sub.id);

      // Revocar acceso a productos tipo suscripción
      await supabase
        .from('user_products')
        .update({ 
          access_granted: false,
          access_revoked_at: new Date().toISOString()
        })
        .eq('user_id', sub.user_id)
        .eq('product_type', 'subscription');

      console.log(`Suscripción expirada: ${sub.id} - Usuario: ${sub.user_id}`);
    }

    res.json({
      success: true,
      expiredCount: expiredSubs?.length || 0,
      message: `${expiredSubs?.length || 0} suscripciones procesadas`
    });

  } catch (error) {
    console.error('Error checking subscriptions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Verificar si usuario tiene acceso a un producto
app.get('/api/check-access/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const { data, error } = await supabase
      .from('user_products')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('access_granted', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    res.json({
      success: true,
      hasAccess: !!data,
      accessDetails: data
    });

  } catch (error) {
    console.error('Error checking access:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// REGISTRO DE USUARIOS
// ============================================

app.post('/api/register', async (req, res) => {
  try {
    const { email, password, fullName, phone } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email y contraseña son requeridos'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'La contraseña debe tener al menos 8 caracteres'
      });
    }

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
          phone: phone
        }
      }
    });

    if (authError) {
      return res.status(400).json({
        success: false,
        error: authError.message
      });
    }

    // Crear perfil de usuario
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: fullName,
          email: email,
          phone: phone,
          created_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
    }

    res.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: authData.user
    });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// FORMULARIO DE CONTACTO
// ============================================

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validaciones
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Nombre, email y mensaje son requeridos'
      });
    }

    // Guardar en base de datos
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name: name,
        email: email,
        phone: phone,
        subject: subject,
        message: message,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Opcional: Enviar email de notificación
    // await sendContactNotificationEmail(data);

    res.json({
      success: true,
      message: 'Mensaje enviado exitosamente. Nos pondremos en contacto pronto.',
      contactId: data.id
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({
      success: false,
      error: 'Error al enviar el mensaje: ' + error.message
    });
  }
});

// ============================================
// PRODUCTOS Y SERVICIOS
// ============================================

// Obtener todos los productos
app.get('/api/products', async (req, res) => {
  try {
    const { type, category } = req.query;

    let query = supabase
      .from('products')
      .select('*')
      .eq('status', 'active');

    if (type) query = query.eq('type', type);
    if (category) query = query.eq('category', category);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      products: data || []
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/blog/increment-view', async (req, res) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({
        success: false,
        error: 'postId requerido'
      });
    }

    const { data: post, error: readError } = await supabase
      .from('blog_posts')
      .select('id, views_count')
      .eq('id', postId)
      .single();

    if (readError) throw readError;

    const nextViews = (post?.views_count || 0) + 1;

    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ views_count: nextViews })
      .eq('id', postId);

    if (updateError) throw updateError;

    return res.json({
      success: true,
      views_count: nextViews
    });
  } catch (error) {
    console.error('Error incrementing blog views:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Obtener historial de compras del usuario
app.get('/api/user-purchases/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('purchases')
      .select('*, orders(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      purchases: data || []
    });

  } catch (error) {
    console.error('Error fetching user purchases:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ============================================
// WEBHOOK DE STRIPE (para pagos automáticos)
// ============================================

app.post('/api/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar eventos de Stripe
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent.id);
      // Aquí actualizar orden en la base de datos
      break;
    
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// ============================================
// CRON JOB - Verificar suscripciones cada hora
// ============================================

// Ejecutar cada hora
setInterval(async () => {
  try {
    console.log('Verificando suscripciones expiradas...');
    const response = await fetch('http://localhost:3001/api/check-subscriptions', {
      method: 'POST'
    });
    const result = await response.json();
    console.log('Resultado verificación:', result);
  } catch (error) {
    console.error('Error en verificación automática:', error);
  }
}, 60 * 60 * 1000); // Cada hora

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, 'localhost', () => {
  console.log('═══════════════════════════════════════════════════════');
  console.log(`🚀 Backend interno en puerto ${PORT} (Solo localhost)`);
  console.log(`📡 Acceso público: http://localhost:5173/api`);
  console.log(`✅ Frontend con proxy: http://localhost:5173`);
  console.log('═══════════════════════════════════════════════════════');
});

module.exports = app;
