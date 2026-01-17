import { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { FaWhatsapp, FaPhone, FaUser, FaCalendarAlt, FaNewspaper, FaGavel, FaHome, FaEnvelope, FaBook, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { name: 'Inicio', href: '/', current: true, icon: <FaHome className="mr-1" /> },
  { name: 'Servicios', href: '/servicios', current: false, icon: <FaGavel className="mr-1" /> },
  { name: 'Consultas', href: '/consultas', current: false, icon: <FaUser className="mr-1" /> },
  { name: 'Tienda', href: '/tienda', current: false, icon: <FaShoppingCart className="mr-1" /> },
  { name: 'Noticias', href: '/noticias', current: false, icon: <FaBook className="mr-1" /> },
  { name: 'E-Books', href: '/ebooks', current: false, icon: <FaBook className="mr-1" /> },
  { name: 'Contacto', href: '/contacto', current: false, icon: <FaEnvelope className="mr-1" /> },
  { name: 'Calendario', href: '/calendario', current: false, icon: <FaCalendarAlt className="mr-1" /> },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cart = [], cartTotal = 0, removeFromCart } = useCart() || {};
  const [showCart, setShowCart] = useState(false);

  return (
    <Disclosure as="nav" className="bg-white shadow-lg">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Abrir menú principal</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="h-8 w-auto"
                    src="/abogado.png"
                    alt="Abg. Wilson Ipiales"
                  />
                  <span className="ml-2 text-lg font-bold text-blue-800">Abg. Wilson Ipiales</span>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current ? 'bg-blue-700 text-white' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700',
                          'rounded-md px-3 py-2 text-sm font-medium flex items-center'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Carrito de Compras */}
                <div className="relative mr-4">
                  <button
                    onClick={() => setShowCart(!showCart)}
                    className="relative p-2 text-gray-700 hover:text-blue-700 focus:outline-none"
                  >
                    <ShoppingCartIcon className="h-6 w-6" />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </button>

                  {/* Dropdown del Carrito */}
                  {showCart && (
                    <div className="absolute right-0 z-50 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Carrito de Compras</h3>
                        {cart.length === 0 ? (
                          <p className="text-gray-500">Tu carrito está vacío</p>
                        ) : (
                          <>
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                              {cart.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">{item.name}</p>
                                    <p className="text-sm text-gray-600">
                                      Cantidad: {item.quantity || 1} x ${(item.price || 0).toFixed(2)}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => removeFromCart(item.id, item.type)}
                                    className="text-red-600 hover:text-red-800 ml-2"
                                  >
                                    <XMarkIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div className="border-t pt-4 mt-4">
                              <div className="flex justify-between items-center mb-4">
                                <span className="font-semibold">Total:</span>
                                <span className="font-bold text-lg">${cartTotal.toFixed(2)}</span>
                              </div>
                              <button
                                onClick={() => {
                                  setShowCart(false);
                                  navigate('/checkout');
                                }}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                              >
                                Proceder al Pago
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href="https://wa.me/593988835269?text=Hola%20Abg.%20Wilson,%20me%20gustaría%20consultar%20sobre%20sus%20servicios%20legales."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white hover:bg-green-700 rounded-md px-3 py-2 text-sm font-medium flex items-center"
                  >
                    <FaWhatsapp className="mr-1" />
                    WhatsApp
                  </a>
                  <a
                    href="tel:+593988835269"
                    className="bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md px-3 py-2 text-sm font-medium flex items-center"
                  >
                    <FaPhone className="mr-1" />
                    Llamar
                  </a>
                  <Link
                    to="/contacto"
                    className="bg-blue-600 text-white hover:bg-blue-700 rounded-md px-3 py-2 text-sm font-medium"
                  >
                    Consulta Gratis
                  </Link>
                </div>

                {/* Perfil */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Abrir menú de usuario</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="/usuario.svg"
                        alt="Usuario"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {user ? (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/dashboard"
                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                              >
                                Mi Dashboard
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/dashboard/my-purchases"
                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                              >
                                Mis Compras
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={logout}
                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700 w-full text-left')}
                              >
                                Cerrar Sesión
                              </button>
                            )}
                          </Menu.Item>
                        </>
                      ) : (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/login"
                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                              >
                                Iniciar Sesión
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/register"
                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                              >
                                Registrarse
                              </Link>
                            )}
                          </Menu.Item>
                        </>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    item.current ? 'bg-blue-700 text-white' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700',
                    'block rounded-md px-3 py-2 text-base font-medium flex items-center'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}