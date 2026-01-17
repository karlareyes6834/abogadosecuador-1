import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaWhatsapp, FaEnvelope, FaGlobe } from 'react-icons/fa';

const FooterMarcia = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Instagram',
      icon: FaInstagram,
      url: 'https://www.instagram.com/soy_marcia_guerron',
      color: '#E4405F'
    },
    {
      name: 'Facebook',
      icon: FaFacebook,
      url: 'https://www.facebook.com/marciaiarlda.guerroncaicedo',
      color: '#1877F2'
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      url: 'https://wa.me/34654281633',
      color: '#25D366'
    },
    {
      name: 'Email',
      icon: FaEnvelope,
      url: 'mailto:marciguerron75@gmail.com',
      color: '#D4AF37'
    },
    {
      name: 'Website',
      icon: FaGlobe,
      url: 'https://www.marciaguerron.com',
      color: '#D4AF37'
    }
  ];

  const quickLinks = [
    { name: 'Bienvenidos', path: '/' },
    { name: 'Cursos', path: '/cursos' },
    { name: 'Mi Historia', path: '/mi-historia' },
    { name: 'Contacto', path: '/contacto' },
  ];

  const legalLinks = [
    { name: 'Aviso Legal', path: '/aviso-legal' },
    { name: 'Términos y Condiciones', path: '/terminos' },
    { name: 'Política de Privacidad', path: '/privacidad' },
    { name: 'Política de Cookies', path: '/cookies' },
  ];

  return (
    <footer className="glass-footer">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Sobre Marcia */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 glass-container flex items-center justify-center">
                <span className="text-xl font-bold text-gradient">MG</span>
              </div>
              <div>
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                  Marcia Guerrón
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Coach & Mentora
                </p>
              </div>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Transforma tu vida a través del desarrollo personal, la espiritualidad 
              y la sabiduría financiera. Despierta tu potencial y alcanza la abundancia.
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h4 className="font-bold mb-4" style={{ color: 'var(--accent-gold)' }}>
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-sm hover:text-gold-accent transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4" style={{ color: 'var(--accent-gold)' }}>
              Legal
            </h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-sm hover:text-gold-accent transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto y Redes */}
          <div>
            <h4 className="font-bold mb-4" style={{ color: 'var(--accent-gold)' }}>
              Conéctate Conmigo
            </h4>
            <div className="space-y-3 mb-4">
              <p className="text-sm flex items-center space-x-2" style={{ color: 'var(--text-secondary)' }}>
                <FaWhatsapp />
                <span>+34 654 28 16 33</span>
              </p>
              <p className="text-sm flex items-center space-x-2" style={{ color: 'var(--text-secondary)' }}>
                <FaEnvelope />
                <span>marciguerron75@gmail.com</span>
              </p>
            </div>
            
            {/* Social Icons */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-button p-2 w-10 h-10 flex items-center justify-center group"
                  aria-label={social.name}
                >
                  <social.icon 
                    size={20}
                    className="transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t pt-6" style={{ borderColor: 'var(--glass-border)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              © {currentYear} Marcia Guerrón. Todos los derechos reservados.
            </p>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Desarrollado con ❤️ para transformar vidas
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterMarcia;
