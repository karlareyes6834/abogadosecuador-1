import { useState } from 'react';
import { Scale, Folder, Globe, Calculator, Gamepad2, Settings, User, X, Minus, Square } from 'lucide-react';

const SimpleOS = () => {
  const [activeApp, setActiveApp] = useState<string>('desktop');
  const [language, setLanguage] = useState<'es' | 'en'>('es');

  const apps = [
    { id: 'legal', nameEs: 'Abg. Wilson', nameEn: 'Abg. Wilson', icon: <Scale className="w-8 h-8 text-indigo-600" />, color: 'bg-indigo-100' },
    { id: 'files', nameEs: 'Archivos', nameEn: 'Files', icon: <Folder className="w-8 h-8 text-blue-600" />, color: 'bg-blue-100' },
    { id: 'browser', nameEs: 'Navegador', nameEn: 'Browser', icon: <Globe className="w-8 h-8 text-green-600" />, color: 'bg-green-100' },
    { id: 'calculator', nameEs: 'Calculadora', nameEn: 'Calculator', icon: <Calculator className="w-8 h-8 text-orange-600" />, color: 'bg-orange-100' },
    { id: 'games', nameEs: 'Juegos', nameEn: 'Games', icon: <Gamepad2 className="w-8 h-8 text-purple-600" />, color: 'bg-purple-100' },
    { id: 'settings', nameEs: 'Ajustes', nameEn: 'Settings', icon: <Settings className="w-8 h-8 text-gray-600" />, color: 'bg-gray-100' }
  ];

  const renderAppContent = () => {
    switch(activeApp) {
      case 'legal':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">Abg. Wilson Ipiales</h2>
            <div className="bg-white rounded-lg p-4 shadow">
              <h3 className="font-semibold mb-2">Servicios Legales</h3>
              <ul className="space-y-2 text-sm">
                <li>• Derecho Penal</li>
                <li>• Derecho Civil</li>
                <li>• Derecho de Tránsito</li>
                <li>• Consultoría Legal</li>
              </ul>
            </div>
          </div>
        );
      case 'files':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Archivos</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded p-3 shadow">Documentos</div>
              <div className="bg-white rounded p-3 shadow">Casos</div>
              <div className="bg-white rounded p-3 shadow">Contratos</div>
              <div className="bg-white rounded p-3 shadow">Facturas</div>
            </div>
          </div>
        );
      case 'browser':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Navegador Web</h2>
            <div className="bg-white rounded-lg p-4 shadow">
              <input type="text" placeholder="Buscar en la web..." className="w-full p-2 border rounded" />
              <div className="mt-4 text-sm text-gray-600">
                <p>• www.google.com</p>
                <p>• abogadowilson.com</p>
                <p>• www.supabase.co</p>
              </div>
            </div>
          </div>
        );
      case 'calculator':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">Calculadora</h2>
            <div className="bg-white rounded-lg p-4 shadow">
              <input type="text" className="w-full p-2 border rounded mb-2 text-right" readOnly />
              <div className="grid grid-cols-4 gap-2">
                {['7','8','9','/','4','5','6','*','1','2','3','-','0','.','+','='].map(btn => (
                  <button key={btn} className="p-2 bg-gray-100 rounded hover:bg-gray-200">{btn}</button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'games':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">Juegos</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded p-4 shadow text-center">
                <Gamepad2 className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                <p className="text-sm">Legal Trial</p>
              </div>
              <div className="bg-white rounded p-4 shadow text-center">
                <Gamepad2 className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                <p className="text-sm">Space Shooter</p>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">Ajustes</h2>
            <div className="bg-white rounded-lg p-4 shadow space-y-3">
              <div className="flex justify-between">
                <span>Modo Oscuro</span>
                <button className="w-12 h-6 bg-gray-300 rounded-full"></button>
              </div>
              <div className="flex justify-between">
                <span>Notificaciones</span>
                <button className="w-12 h-6 bg-blue-500 rounded-full"></button>
              </div>
              <div className="flex justify-between">
                <span>Idioma</span>
                <select className="border rounded px-2 py-1">
                  <option>Español</option>
                  <option>English</option>
                </select>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Escritorio</h2>
            <div className="grid grid-cols-3 gap-4">
              {apps.map(app => (
                <button
                  key={app.id}
                  onClick={() => setActiveApp(app.id)}
                  className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col items-center">
                    {app.icon}
                    <span className="text-xs mt-2">{app.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Scale className="w-6 h-6 text-indigo-500" />
          <span className="text-white font-semibold">Abogados OS</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-white text-sm">Usuario: Invitado</span>
          <User className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-slate-800 border-r border-slate-700 p-4">
          <div className="space-y-2">
            {apps.map(app => (
              <button
                key={app.id}
                onClick={() => setActiveApp(app.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeApp === app.id ? 'bg-slate-700 text-white' : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                {app.icon}
                <span>{app.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-slate-900">
          {renderAppContent()}
        </div>
      </div>

      {/* Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 px-4 py-2">
        <div className="flex items-center space-x-2">
          {apps.filter(app => app.id !== 'desktop').map(app => (
            <button
              key={app.id}
              onClick={() => setActiveApp(app.id)}
              className={`px-3 py-1 rounded text-sm ${
                activeApp === app.id ? 'bg-slate-700 text-white' : 'text-gray-300 hover:bg-slate-700'
              }`}
            >
              {app.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimpleOS;
