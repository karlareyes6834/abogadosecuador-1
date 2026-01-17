import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaClock, FaUserTie, FaFileAlt, FaGraduationCap } from 'react-icons/fa';
import Laboral from '../components/Services/Laboral';

const ServicioLaboralPage = () => {
  return (
    <>
      <Helmet>
        <title>Derecho Laboral | Abogado Wilson Ipiales</title>
        <meta name="description" content="Especialistas en derecho laboral para trabajadores y empleadores. Asesoría en despidos, seguridad social, contratos colectivos y más." />
        <link rel="canonical" href="https://abogados.ecuador.workers.dev/servicios/laboral" />
      </Helmet>

      <div className="bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-100 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link to="/" className="text-gray-500 hover:text-gray-700">Inicio</Link>
                </li>
                <li>
                  <FaArrowLeft className="text-gray-400 mx-2 rotate-180" />
                </li>
                <li>
                  <Link to="/servicios" className="text-gray-500 hover:text-gray-700">Servicios</Link>
                </li>
                <li>
                  <FaArrowLeft className="text-gray-400 mx-2 rotate-180" />
                </li>
                <li className="text-gray-900">Derecho Laboral</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Main Content - El componente Laboral incluye su propio header */}
        <Laboral />

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Necesita asesoría en derecho laboral?</h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto text-yellow-100">
                Contáctenos hoy para una evaluación personalizada de su caso laboral
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://wa.me/593988835269?text=Hola%20Abg.%20Wilson,%20necesito%20asesor%C3%ADa%20en%20derecho%20laboral."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg flex items-center justify-center transition-colors"
                >
                  <FaUserTie className="mr-2" />
                  Consulta Inmediata por WhatsApp
                </a>
                <Link 
                  to="/contacto"
                  className="px-8 py-4 bg-white hover:bg-blue-50 text-blue-700 font-bold rounded-lg shadow-lg flex items-center justify-center transition-colors"
                >
                  <FaArrowLeft className="mr-2 rotate-180" />
                  Agendar Consulta Formal
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ServicioLaboralPage;