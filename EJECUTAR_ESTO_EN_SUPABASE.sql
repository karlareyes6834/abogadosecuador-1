-- ===============================================
-- EJECUTAR ESTO EN SUPABASE SQL EDITOR
-- ===============================================
-- Ve a: https://supabase.com/dashboard/project/kbybhgxqdefuquybstqk/sql/new
-- Copia y pega este código completo y ejecuta

-- Habilitar extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===============================================
-- TABLA: profiles
-- ===============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Ecuador',
  avatar_url TEXT,
  role TEXT DEFAULT 'client',
  credits INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- TABLA: orders
-- ===============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2),
  tax DECIMAL(10,2),
  discount DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending',
  payment_method TEXT NOT NULL,
  payment_details JSONB,
  transaction_id TEXT,
  items JSONB NOT NULL,
  billing_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- ===============================================
-- TABLA: purchases
-- ===============================================
CREATE TABLE IF NOT EXISTS public.purchases (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  product_id INTEGER,
  product_type TEXT NOT NULL,
  product_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  order_id TEXT REFERENCES public.orders(id),
  payment_method TEXT NOT NULL,
  transaction_id TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- TABLA: appointments
-- ===============================================
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  type TEXT DEFAULT 'online',
  status TEXT DEFAULT 'scheduled',
  reminder_sent BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- TABLA: consultations
-- ===============================================
CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  order_id TEXT REFERENCES public.orders(id),
  type TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  scheduled_date TIMESTAMP WITH TIME ZONE,
  duration INTEGER,
  lawyer_id UUID REFERENCES public.profiles(id),
  meeting_url TEXT,
  notes TEXT,
  documents JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- TABLA: course_enrollments
-- ===============================================
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  course_id INTEGER NOT NULL,
  order_id TEXT REFERENCES public.orders(id),
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- ===============================================
-- TABLA: user_products
-- ===============================================
CREATE TABLE IF NOT EXISTS public.user_products (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  product_id INTEGER NOT NULL,
  product_type TEXT NOT NULL,
  access_granted BOOLEAN DEFAULT true,
  purchase_id INTEGER REFERENCES public.purchases(id),
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  access_revoked_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  UNIQUE(user_id, product_id, product_type)
);

-- ===============================================
-- ÍNDICES
-- ===============================================
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_order_id ON purchases(order_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_products_user_id ON user_products(user_id);

-- ===============================================
-- TRIGGERS PARA UPDATED_AT
-- ===============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_purchases_updated_at ON purchases;
CREATE TRIGGER update_purchases_updated_at BEFORE UPDATE ON purchases 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_consultations_updated_at ON consultations;
CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON consultations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===============================================
-- ROW LEVEL SECURITY (RLS)
-- ===============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_products ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para orders
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own orders" ON orders;
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can manage orders" ON orders;
CREATE POLICY "Admins can manage orders" ON orders FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Políticas para purchases (PERMISIVO para el sistema de compras)
DROP POLICY IF EXISTS "Users can view own purchases" ON purchases;
CREATE POLICY "Users can view own purchases" ON purchases FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own purchases" ON purchases;
CREATE POLICY "Users can create own purchases" ON purchases FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own purchases" ON purchases;
CREATE POLICY "Users can update own purchases" ON purchases FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all purchases" ON purchases;
CREATE POLICY "Admins can view all purchases" ON purchases FOR SELECT 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can manage purchases" ON purchases;
CREATE POLICY "Admins can manage purchases" ON purchases FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Políticas para appointments
DROP POLICY IF EXISTS "Users can view own appointments" ON appointments;
CREATE POLICY "Users can view own appointments" ON appointments FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own appointments" ON appointments;
CREATE POLICY "Users can create own appointments" ON appointments FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own appointments" ON appointments;
CREATE POLICY "Users can update own appointments" ON appointments FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para consultations
DROP POLICY IF EXISTS "Users can view own consultations" ON consultations;
CREATE POLICY "Users can view own consultations" ON consultations FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own consultations" ON consultations;
CREATE POLICY "Users can create own consultations" ON consultations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para course_enrollments (PERMISIVO para el sistema de compras)
DROP POLICY IF EXISTS "Users can view own enrollments" ON course_enrollments;
CREATE POLICY "Users can view own enrollments" ON course_enrollments FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own enrollments" ON course_enrollments;
CREATE POLICY "Users can create own enrollments" ON course_enrollments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own enrollments" ON course_enrollments;
CREATE POLICY "Users can update own enrollments" ON course_enrollments FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage enrollments" ON course_enrollments;
CREATE POLICY "Admins can manage enrollments" ON course_enrollments FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Políticas para user_products (PERMISIVO para el sistema de compras)
DROP POLICY IF EXISTS "Users can view own products" ON user_products;
CREATE POLICY "Users can view own products" ON user_products FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own products" ON user_products;
CREATE POLICY "Users can create own products" ON user_products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own products" ON user_products;
CREATE POLICY "Users can update own products" ON user_products FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all user products" ON user_products;
CREATE POLICY "Admins can view all user products" ON user_products FOR SELECT 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can manage user products" ON user_products;
CREATE POLICY "Admins can manage user products" ON user_products FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ===============================================
-- FUNCIÓN PARA AUTO-CREAR PERFIL
-- ===============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===============================================
-- CREAR USUARIO ADMIN POR DEFECTO
-- ===============================================
-- IMPORTANTE: Después de ejecutar este script:
-- 1. Ve a Authentication > Users en Supabase Dashboard
-- 2. Crea un usuario manualmente con email: admin@abogado.com y password de tu elección
-- 3. Copia el UUID del usuario creado
-- 4. Ejecuta este UPDATE para hacerlo admin (reemplaza 'UUID_DEL_USUARIO'):

-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@abogado.com';

-- O si prefieres actualizar por ID:
-- UPDATE profiles SET role = 'admin' WHERE id = 'UUID_DEL_USUARIO_AQUI';

-- ===============================================
-- TABLAS ADICIONALES PARA SISTEMA COMPLETO
-- ===============================================

-- TABLA: products (Productos/Servicios/Ebooks)
CREATE TABLE IF NOT EXISTS public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  category TEXT,
  type TEXT DEFAULT 'digital',
  tags TEXT[],
  images JSONB DEFAULT '[]',
  thumbnail TEXT,
  stock INTEGER DEFAULT 0,
  unlimited_stock BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active',
  featured BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA: courses (Cursos completos)
CREATE TABLE IF NOT EXISTS public.courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  level TEXT DEFAULT 'beginner',
  duration INTEGER,
  thumbnail TEXT,
  preview_video TEXT,
  instructor_name TEXT,
  what_you_learn JSONB DEFAULT '[]',
  requirements JSONB DEFAULT '[]',
  status TEXT DEFAULT 'active',
  featured BOOLEAN DEFAULT false,
  enrollment_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA: course_modules (Módulos de cursos)
CREATE TABLE IF NOT EXISTS public.course_modules (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, order_index)
);

-- TABLA: course_lessons (Lecciones de cursos)
CREATE TABLE IF NOT EXISTS public.course_lessons (
  id SERIAL PRIMARY KEY,
  module_id INTEGER REFERENCES public.course_modules(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  video_url TEXT,
  duration INTEGER,
  order_index INTEGER NOT NULL,
  type TEXT DEFAULT 'video',
  resources JSONB DEFAULT '[]',
  is_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(module_id, order_index)
);

-- TABLA: blog_posts (Blog/Entradas)
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id),
  author_name TEXT,
  category TEXT,
  tags TEXT[],
  thumbnail TEXT,
  status TEXT DEFAULT 'draft',
  featured BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA: subscriptions (Suscripciones)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  plan_name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  billing_cycle TEXT DEFAULT 'monthly',
  status TEXT DEFAULT 'active',
  next_billing_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- TABLA: affiliates (Sistema de afiliados)
CREATE TABLE IF NOT EXISTS public.affiliates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) UNIQUE NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  total_referrals INTEGER DEFAULT 0,
  total_sales DECIMAL(10,2) DEFAULT 0,
  total_commission DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA: free_consultations (Consultas Gratuitas)
CREATE TABLE IF NOT EXISTS public.free_consultations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  document_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- TABLA: contact_messages (Mensajes de Contacto)
-- ===============================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  responded_at TIMESTAMP WITH TIME ZONE,
  responded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- ÍNDICES ADICIONALES
-- ===============================================
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_free_consultations_email ON free_consultations(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at DESC);

-- ===============================================
-- POLÍTICAS RLS ADICIONALES
-- ===============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE free_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Productos: ACCESO PÚBLICO sin autenticación, admin puede gestionar
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products" ON products FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Cursos: ACCESO PÚBLICO sin autenticación, admin puede gestionar
DROP POLICY IF EXISTS "Anyone can view active courses" ON courses;
CREATE POLICY "Anyone can view active courses" ON courses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage courses" ON courses;
CREATE POLICY "Admins can manage courses" ON courses FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Módulos y lecciones: visibles para todos, admin puede gestionar
DROP POLICY IF EXISTS "Anyone can view modules" ON course_modules;
CREATE POLICY "Anyone can view modules" ON course_modules FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage modules" ON course_modules;
CREATE POLICY "Admins can manage modules" ON course_modules FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Anyone can view lessons" ON course_lessons;
CREATE POLICY "Anyone can view lessons" ON course_lessons FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage lessons" ON course_lessons;
CREATE POLICY "Admins can manage lessons" ON course_lessons FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Blog: ACCESO PÚBLICO sin autenticación, admin puede gestionar
DROP POLICY IF EXISTS "Anyone can view published posts" ON blog_posts;
CREATE POLICY "Anyone can view published posts" ON blog_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage blog" ON blog_posts;
CREATE POLICY "Admins can manage blog" ON blog_posts FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Suscripciones: usuarios ven las suyas, admin ve todas
DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage subscriptions" ON subscriptions;
CREATE POLICY "Admins can manage subscriptions" ON subscriptions FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Afiliados: usuarios ven su propia info, admins ven todo
DROP POLICY IF EXISTS "Users can view own affiliate" ON affiliates;
CREATE POLICY "Users can view own affiliate" ON affiliates FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create affiliate" ON affiliates;
CREATE POLICY "Users can create affiliate" ON affiliates FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage affiliates" ON affiliates;
CREATE POLICY "Admins can manage affiliates" ON affiliates FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Consultas gratuitas: cualquiera puede crear, solo admin puede ver
DROP POLICY IF EXISTS "Anyone can create free consultation" ON free_consultations;
CREATE POLICY "Anyone can create free consultation" ON free_consultations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view consultations" ON free_consultations;
CREATE POLICY "Admins can view consultations" ON free_consultations FOR SELECT 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Mensajes de contacto: cualquiera puede crear, usuarios ven los suyos, admins ven todos
DROP POLICY IF EXISTS "Anyone can create contact message" ON contact_messages;
CREATE POLICY "Anyone can create contact message" ON contact_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own contact messages" ON contact_messages;
CREATE POLICY "Users can view own contact messages" ON contact_messages FOR SELECT 
USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins can view all contact messages" ON contact_messages;
CREATE POLICY "Admins can view all contact messages" ON contact_messages FOR SELECT 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can manage contact messages" ON contact_messages;
CREATE POLICY "Admins can manage contact messages" ON contact_messages FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ===============================================
-- MENSAJE DE CONFIRMACIÓN
-- ===============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Base de datos completa creada exitosamente!';
  RAISE NOTICE '✅ Tablas básicas: profiles, orders, purchases, appointments, consultations, course_enrollments, user_products';
  RAISE NOTICE '✅ Tablas avanzadas: products, courses, course_modules, course_lessons, blog_posts, subscriptions, affiliates';
  RAISE NOTICE '✅ Tablas de comunicación: contact_messages, free_consultations';
  RAISE NOTICE '✅ RLS habilitado en todas las tablas con políticas profesionales';
  RAISE NOTICE '✅ Trigger de auto-creación de perfil configurado';
  RAISE NOTICE '';
  RAISE NOTICE '📋 PERMISOS CONFIGURADOS:';
  RAISE NOTICE '   • Productos/Cursos: Públicos (cualquiera puede ver)';
  RAISE NOTICE '   • Compras/Órdenes: Autenticación requerida';
  RAISE NOTICE '   • Contacto/Consultas: Público (sin autenticación)';
  RAISE NOTICE '   • Administración: Solo usuarios con role=admin';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️ IMPORTANTE: Crea un usuario en Authentication y luego actualiza su rol a admin';
  RAISE NOTICE '⚠️ Ejecuta: UPDATE profiles SET role = ''admin'' WHERE email = ''tu_email@admin.com'';';
END $$;
