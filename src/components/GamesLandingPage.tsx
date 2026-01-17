import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, ArrowRight, Star } from 'lucide-react';

export const GamesLandingPage: React.FC = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden px-4 md:px-8 py-20"
      >
        <div className="max-w-6xl mx-auto">
          {/* Contenido Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Texto */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Centro de Juegos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Profesional</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                Juega, aprende y gana tokens en una plataforma integrada con servicios legales de Abg. Wilson Ipiales
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2">
                  <Gamepad2 className="w-5 h-5" />
                  Explorar Juegos
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-4 backdrop-blur-xl bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all">
                  Ver Más Información
                </button>
              </div>
            </motion.div>

            {/* Ilustración */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/20 rounded-3xl p-8 text-center">
                <div className="text-8xl mb-4">🎮</div>
                <p className="text-white font-bold text-lg">10+ Juegos Disponibles</p>
                <p className="text-slate-300 text-sm mt-2">Arcade, Puzzle, Estrategia y Más</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Características */}
      <section className="px-4 md:px-8 py-20 bg-gradient-to-b from-transparent to-blue-950/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            ¿Por Qué Jugar en Nuestro Centro?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icono: '🎮',
                titulo: 'Juegos Variados',
                descripcion: 'Arcade, puzzles, estrategia y juegos legales educativos'
              },
              {
                icono: '💎',
                titulo: 'Sistema de Tokens',
                descripcion: 'Compra, vende y gana tokens jugando y completando desafíos'
              },
              {
                icono: '🏆',
                titulo: 'Logros y Recompensas',
                descripcion: 'Desbloquea logros, sube de nivel y obtén recompensas exclusivas'
              },
              {
                icono: '📱',
                titulo: 'Multi-Dispositivo',
                descripcion: 'Juega en PC, móvil o tablet con controles optimizados'
              },
              {
                icono: '⚖️',
                titulo: 'Contexto Legal',
                descripcion: 'Aprende sobre derecho mientras juegas y te diviertes'
              },
              {
                icono: '🔒',
                titulo: 'Seguro y Profesional',
                descripcion: 'Plataforma segura integrada con servicios legales reales'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:border-blue-400/50 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icono}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.titulo}</h3>
                <p className="text-slate-300">{feature.descripcion}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Juegos Destacados */}
      <section className="px-4 md:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Juegos Destacados
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { nombre: 'Juicio Legal', icono: '⚖️', tokens: 50 },
              { nombre: 'Candy Crush Legal', icono: '🍬', tokens: 30 },
              { nombre: 'Defensores Espaciales', icono: '🛸', tokens: 40 },
              { nombre: 'Póker Legal', icono: '🃏', tokens: 60 },
              { nombre: 'Parchís Legal', icono: '🎲', tokens: 45 },
              { nombre: 'Ajedrez Legal', icono: '♟️', tokens: 65 }
            ].map((juego, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/20 rounded-2xl p-6 hover:border-blue-400/50 transition-all group cursor-pointer"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{juego.icono}</div>
                <h3 className="text-xl font-bold text-white mb-2">{juego.nombre}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 font-bold">{juego.tokens} tokens</span>
                  <Star className="w-5 h-5 text-yellow-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="px-4 md:px-8 py-20 bg-gradient-to-b from-transparent to-blue-950/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Juegos Activos', valor: '10+', icono: '🎮' },
              { label: 'Jugadores', valor: '1000+', icono: '👥' },
              { label: 'Tokens Ganados', valor: '50K+', icono: '💎' },
              { label: 'Logros', valor: '100+', icono: '🏆' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-6 text-center"
              >
                <div className="text-4xl mb-2">{stat.icono}</div>
                <p className="text-3xl font-bold text-white mb-1">{stat.valor}</p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-4 md:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-white/20 rounded-3xl p-12 text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              ¿Listo para Jugar?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Únete a nuestra comunidad de jugadores y comienza a ganar tokens hoy mismo
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all">
                Comenzar Ahora
              </button>
              <button className="px-8 py-4 backdrop-blur-xl bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all">
                Ver Términos
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-4 md:px-8 py-12 bg-gradient-to-b from-transparent to-blue-950/40">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">Centro de Juegos</h3>
              <p className="text-slate-400 text-sm">Plataforma profesional de juegos integrada con servicios legales</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Juegos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tienda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Estadísticas</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Contacto</h3>
              <p className="text-slate-400 text-sm">Abg. Wilson Ipiales</p>
              <p className="text-slate-400 text-sm">+593 988 835 269</p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-slate-400 text-sm">
            <p>© 2025 Centro de Juegos Profesional - Abg. Wilson Ipiales. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GamesLandingPage;
