import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService } from '../services/apiService';
import { FaPaperPlane, FaTimes, FaComments, FaUser, FaRobot, FaSpinner } from 'react-icons/fa';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showUserForm, setShowUserForm] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Crear un nuevo ID de sesión si no existe
    let sessionId = localStorage.getItem('chatSessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}`;
      localStorage.setItem('chatSessionId', sessionId);
    }

    // Cargar mensajes previos del localStorage
    const savedMessages = localStorage.getItem(`chat_messages_${sessionId}`);
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Error al cargar mensajes:', error);
        setMessages([{
          text: '¡Bienvenido de nuevo! ¿En qué puedo ayudarle hoy?',
          sender: 'bot',
          timestamp: new Date().toISOString()
        }]);
      }
    } else {
      // Mensaje de bienvenida
      const welcomeMessage = {
        text: '¡Bienvenido al chat de asistencia legal! ¿En qué puedo ayudarle hoy?',
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    }

    // Verificar si ya tenemos información del usuario
    const storedName = localStorage.getItem('chatUserName');
    const storedEmail = localStorage.getItem('chatUserEmail');
    
    if (storedName && storedEmail) {
      setUserName(storedName);
      setUserEmail(storedEmail);
    }
  }, []);

  // Guardar mensajes en localStorage
  const saveMessagesToStorage = (messages) => {
    const sessionId = localStorage.getItem('chatSessionId');
    if (sessionId) {
      try {
        localStorage.setItem(`chat_messages_${sessionId}`, JSON.stringify(messages));
      } catch (error) {
        console.error('Error al guardar mensajes:', error);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Si es el primer mensaje y no tenemos información del usuario, solicitarla
    if (messages.length <= 1 && !userName && !userEmail) {
      setShowUserForm(true);
      return;
    }

    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
      user_name: userName || 'Anónimo'
    };
    
    // Actualizar mensajes localmente primero para mejor UX
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    saveMessagesToStorage(newMessages);
    
    setInput('');
    setIsLoading(true);
    inputRef.current?.focus();
    
    // Simular respuesta del bot después de un breve retraso
    setTimeout(() => {
      // Obtener respuesta del bot
      const botResponse = {
        text: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date().toISOString()
      };

      // Actualizar mensajes con la respuesta del bot
      const updatedMessages = [...newMessages, botResponse];
      setMessages(updatedMessages);
      saveMessagesToStorage(updatedMessages);
      
      setIsLoading(false);
    }, 1000);
  };

  const handleUserFormSubmit = (e) => {
    e.preventDefault();
    
    if (!userName.trim() || !userEmail.trim()) {
      alert('Por favor, complete todos los campos');
      return;
    }
    
    // Guardar información del usuario en localStorage
    localStorage.setItem('chatUserName', userName);
    localStorage.setItem('chatUserEmail', userEmail);
    
    // Ocultar formulario y enviar mensaje
    setShowUserForm(false);
    handleSendMessage(e);
  };

  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('consulta') || input.includes('asesoría') || input.includes('cita')) {
      return `Gracias por su interés en nuestros servicios legales. Para agendar una consulta con el Abg. Wilson Ipiales, puede contactarnos al +593 988835269 o visitarnos en nuestra oficina en Juan José Flores 4-73 y Vicente Rocafuerte, Ibarra. También puede dejarnos su número y le llamaremos a la brevedad.`;
    }
    
    if (input.includes('precio') || input.includes('costo') || input.includes('tarifa') || input.includes('honorarios')) {
      return 'Nuestros honorarios varían según la complejidad del caso. Ofrecemos una primera consulta gratuita para evaluar su situación y proporcionarle un presupuesto personalizado. ¿Le gustaría agendar esta consulta inicial sin costo?';
    }
    
    if (input.includes('penal') || input.includes('delito') || input.includes('crimen') || input.includes('denuncia')) {
      return 'El Abg. Wilson Ipiales es especialista en derecho penal con amplia experiencia en la defensa de diversos casos. Cada situación penal requiere un análisis detallado. ¿Podría proporcionarnos más detalles sobre su caso para brindarle una mejor orientación?';
    }
    
    if (input.includes('tránsito') || input.includes('accidente') || input.includes('multa') || input.includes('licencia')) {
      return 'En casos de tránsito, es importante actuar con rapidez. El Abg. Wilson Ipiales puede ayudarle con impugnaciones de multas, defensa en accidentes de tránsito, y recuperación de licencias. ¿Cuál es su situación específica?';
    }
    
    if (input.includes('civil') || input.includes('contrato') || input.includes('demanda') || input.includes('juicio')) {
      return 'En materia civil, ofrecemos asesoría en contratos, obligaciones, responsabilidad civil, y procesos de demanda o defensa. El Abg. Wilson Ipiales puede representarle eficazmente para proteger sus intereses. ¿Necesita ayuda con algún asunto civil específico?';
    }
    
    if (input.includes('comercial') || input.includes('empresa') || input.includes('negocio') || input.includes('mercantil')) {
      return 'Nuestro despacho brinda asesoría legal a empresas y emprendedores en asuntos comerciales, constitución de compañías, contratos mercantiles y resolución de conflictos comerciales. ¿Qué tipo de negocio o transacción comercial necesita asesorar?';
    }
    
    if (input.includes('gracias') || input.includes('agradezco') || input.includes('agradecido')) {
      return 'Ha sido un placer ayudarle. Estamos a su disposición para cualquier consulta legal adicional que pueda tener. ¡Que tenga un excelente día!';
    }
    
    if (input.includes('ubicación') || input.includes('dirección') || input.includes('oficina') || input.includes('donde')) {
      return 'Nuestra oficina está ubicada en Juan José Flores 4-73 y Vicente Rocafuerte, en el centro de Ibarra, Ecuador. Atendemos de lunes a viernes de 8:00 a 17:00. ¿Desea agendar una cita presencial?';
    }

    if (input.includes('hola') || input.includes('buenos días') || input.includes('buenas tardes') || input.includes('buenas noches')) {
      return `Hola ${userName || ''}. Bienvenido al chat de asistencia legal del Abg. Wilson Ipiales. ¿En qué podemos ayudarle hoy?`;
    }

    return 'Gracias por su mensaje. Para brindarle una asesoría más precisa, le recomendamos contactarnos directamente al +593 988835269 o agendar una consulta gratuita. ¿Hay algún área legal específica sobre la que necesite información?';
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Si se abre el chat, enfocar el input
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  };

  return (
    <>
      {/* Botón flotante para abrir/cerrar el chat */}
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-6 left-6 z-50 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Chat de Asistencia Legal IA"
        aria-label="Abrir chat de asistencia"
      >
        {isOpen ? <FaTimes size={20} /> : <FaRobot size={20} />}
      </motion.button>

      {/* Ventana de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 500 }}
            className="fixed bottom-20 left-6 w-96 bg-white rounded-xl shadow-2xl z-40 overflow-hidden border border-gray-200"
          >
            {/* Encabezado del chat */}
            <div className="p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FaRobot />
                  Asistente Legal IA
                </h3>
                <span className="text-xs bg-green-500 px-2 py-1 rounded-full">En línea</span>
              </div>
              <p className="text-sm text-purple-100 mt-1">
                Respuestas instantáneas 24/7
              </p>
            </div>

            {/* Contenedor de mensajes */}
            <div className="h-96 overflow-y-auto p-4 bg-gray-50">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`mb-4 flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className="flex items-start max-w-[80%]">
                    {message.sender === 'bot' && (
                      <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white mr-2 mt-1">
                        <FaRobot size={16} />
                      </div>
                    )}
                    <div>
                      <div
                        className={`p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-purple-50 text-gray-800 border border-purple-200 rounded-tl-none'
                        }`}
                      >
                        {message.text}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 ml-1">
                        {new Date(message.timestamp).toLocaleTimeString('es-ES', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                    {message.sender === 'user' && (
                      <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-white ml-2 mt-1">
                        <FaUser size={14} />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white mr-2">
                      <FaRobot size={16} />
                    </div>
                    <div className="p-3 bg-purple-50 text-gray-800 rounded-lg border border-purple-200 rounded-tl-none">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Formulario de usuario */}
            <AnimatePresence>
              {showUserForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 border-t border-gray-200 bg-gray-50"
                >
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Por favor, complete sus datos para continuar:
                  </h4>
                  <form onSubmit={handleUserFormSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Nombre</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Su nombre"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Email</label>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Su correo electrónico"
                        required
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Continuar
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Formulario de entrada de mensaje */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escriba su consulta..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  disabled={isLoading || showUserForm}
                />
                <motion.button
                  type="submit"
                  disabled={isLoading || !input.trim() || showUserForm}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaPaperPlane />
                  )}
                </motion.button>
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-500">
                  Consultas legales iniciales sin costo
                </p>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chat;
