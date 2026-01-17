import React from 'react';
import Newsletter from '../components/Newsletter/Newsletter';

const NewsletterPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-16">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Boletín Legal Profesional
          </h1>
          <p className="text-xl text-gray-600">
            Manténgase actualizado con las últimas noticias y cambios en la legislación ecuatoriana
          </p>
        </div>
      </div>
      <Newsletter />
    </div>
  );
};

export default NewsletterPage;