import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Información del Abogado */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">
                WI
              </div>
              <div>
                <h3 className="text-xl font-bold">Abg. Wilson Ipiales</h3>
                <p className="text-gray-400 text-sm">Abogado Especialista</p>
              </div>
            </div>
            <p className="text-gray-300">
              Más de 15 años de experiencia en derecho penal, civil, laboral y tránsito.
              Soluciones legales integrales para empresas y particulares.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/wilsonipiales" target="_blank" rel="noopener noreferrer"
                 className="text-gray-400 hover:text-blue-400 transition-colors">
                <FaFacebook className="h-6 w-6" />
              </a>
              <a href="https://instagram.com/wilsonipiales" target="_blank" rel="noopener noreferrer"
                 className="text-gray-400 hover:text-pink-400 transition-colors">
                <FaInstagram className="h-6 w-6" />
              </a>
              <a href="https://linkedin.com/in/wilsonipiales" target="_blank" rel="noopener noreferrer"
                 className="text-gray-400 hover:text-blue-500 transition-colors">
                <FaLinkedin className="h-6 w-6" />
              </a>
              <a href="https://wa.me/593988835269" target="_blank" rel="noopener noreferrer"
                 className="text-gray-400 hover:text-green-400 transition-colors">
                <FaWhatsapp className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/servicios" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Servicios Legales
                </Link>
              </li>
              <li>
                <Link to="/consultas" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Consultas
                </Link>
              </li>
              <li>
                <Link to="/tienda" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Tienda Legal
                </Link>
              </li>
              <li>
                <Link to="/cursos" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Cursos
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Blog Legal
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Servicios Legales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Servicios Legales</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/servicios/penal" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                  Derecho Penal
                </Link>
              </li>
              <li>
                <Link to="/servicios/civil" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Derecho Civil
                </Link>
              </li>
              <li>
                <Link to="/servicios/laboral" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Derecho Laboral
                </Link>
              </li>
              <li>
                <Link to="/servicios/transito" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                  Derecho de Tránsito
                </Link>
              </li>
              <li>
                <Link to="/servicios/comercial" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  Derecho Comercial
                </Link>
              </li>
              <li>
                <Link to="/servicios/aduanero" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                  Derecho Aduanero
                </Link>
              </li>
            </ul>
          </div>

          {/* Información de Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <p className="text-gray-300">
                  Juan José Flores 4-73 y Vicente Rocafuerte<br />
                  Ibarra, Imbabura, Ecuador
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a href="tel:+593988835269" className="text-gray-300 hover:text-white transition-colors">
                  +593 988 835 269
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a href="mailto:alexip2@hotmail.com" className="text-gray-300 hover:text-white transition-colors">
                  alexip2@hotmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FaWhatsapp className="h-5 w-5 text-green-400 flex-shrink-0" />
                <a href="https://wa.me/593988835269" target="_blank" rel="noopener noreferrer"
                   className="text-gray-300 hover:text-white transition-colors">
                  WhatsApp: +593 988 835 269
                </a>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="pt-4 border-t border-gray-700">
              <h4 className="font-semibold mb-3">Newsletter</h4>
              <p className="text-gray-400 text-sm mb-3">Recibe noticias legales y actualizaciones.</p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-l-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-md transition-colors"
                >
                  Suscribir
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Abg. Wilson Alexander Ipiales Guerron. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/politicas-privacidad" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de Privacidad
              </Link>
              <Link to="/terminos-condiciones" className="text-gray-400 hover:text-white text-sm transition-colors">
                Términos y Condiciones
              </Link>
              <Link to="/seguridad" className="text-gray-400 hover:text-white text-sm transition-colors">
                Seguridad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}