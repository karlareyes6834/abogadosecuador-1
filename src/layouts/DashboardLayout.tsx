import React from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Clientes', href: '/dashboard/clients' },
    { name: 'Casos', href: '/dashboard/cases' },
    { name: 'Documentos', href: '/dashboard/documents' },
    { name: 'Calendario', href: '/dashboard/calendar' },
    { name: 'Analíticas', href: '/dashboard/analytics' },
    { name: 'Configuración', href: '/dashboard/settings' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6">
            <h1 className="text-xl font-bold text-primary-600">LegalPro</h1>
          </div>
          <nav className="mt-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  block px-6 py-3 text-sm font-medium
                  ${location.pathname === item.href
                    ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
