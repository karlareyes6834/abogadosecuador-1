import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendar, FaUser, FaTag, FaEye, FaHeart, FaShare } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { supabase } from '../../services/supabaseService';

const BlogReader = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPosts();
  }, [selectedCategory]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error al cargar blog:', error);
      toast.error('Error al cargar entradas');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'Derecho Penal', 'Derecho Civil', 'Derecho Laboral', 'Derecho de Familia', 'Derecho Comercial', 'Noticias', 'Consejos'];

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const incrementViews = async (postId) => {
    try {
      const resp = await fetch('/api/blog/increment-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId })
      });

      if (!resp.ok) {
        throw new Error('No se pudo incrementar vistas');
      }
    } catch (error) {
      try {
        await supabase.rpc('increment_views', { post_id: postId });
      } catch (rpcError) {
        console.error('Error al incrementar vistas:', rpcError);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog Legal</h1>
          <p className="text-xl opacity-90">Artículos, noticias y consejos sobre derecho ecuatoriano</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Buscador y filtros */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Buscar artículos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
          />

          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category === 'all' ? 'Todos' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              {post.thumbnail && (
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              
              <div className="p-6">
                {/* Categoría */}
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mb-3">
                  {post.category}
                </span>

                {/* Título */}
                <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600">
                  <Link
                    to={`/blog/${post.slug}`}
                    onClick={() => incrementViews(post.id)}
                  >
                    {post.title}
                  </Link>
                </h2>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}

                {/* Metadatos */}
                <div className="flex items-center text-xs text-gray-500 mb-4 space-x-4">
                  <span className="flex items-center">
                    <FaUser className="mr-1" />
                    {post.author_name || 'Admin'}
                  </span>
                  <span className="flex items-center">
                    <FaCalendar className="mr-1" />
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        <FaTag className="mr-1" size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                  <span className="flex items-center">
                    <FaEye className="mr-1" />
                    {post.views_count || 0} vistas
                  </span>
                  <Link
                    to={`/blog/${post.slug}`}
                    onClick={() => incrementViews(post.id)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Leer más →
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron artículos</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogReader;
