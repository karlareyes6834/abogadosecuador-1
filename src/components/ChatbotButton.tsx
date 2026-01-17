import React, { useState } from 'react';
import { FaRobot, FaTimes } from 'react-icons/fa';

const ChatbotButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-24 left-4 z-[70] bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Abrir chatbot"
        title="Asistente Legal Virtual"
      >
        {isOpen ? <FaTimes className="w-6 h-6" /> : <FaRobot className="w-6 h-6" />}
      </button>
      
      {isOpen && (
        <div className="fixed bottom-44 left-4 z-[65] bg-white rounded-lg shadow-xl border border-gray-200 w-80 h-96">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Asistente Legal Virtual</h3>
            <p className="text-sm text-gray-600">¿En qué puedo ayudarte hoy?</p>
          </div>
          <div className="p-4 h-64 overflow-y-auto">
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-blue-900">
                ¡Hola! Soy tu asistente legal virtual. Puedo ayudarte con:
              </p>
              <ul className="text-sm text-blue-800 mt-2 list-disc list-inside">
                <li>Información sobre servicios</li>
                <li>Agendar consultas</li>
                <li>Preguntas frecuentes</li>
                <li>Recursos legales</li>
              </ul>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200">
            <input
              type="text"
              placeholder="Escribe tu pregunta..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotButton;