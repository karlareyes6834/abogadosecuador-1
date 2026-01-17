import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaUserShield, FaUser, FaBan, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import adminService from '../../services/adminService';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadUsers();
  }, [filter]);

  const loadUsers = async () => {
    setLoading(true);
    const filters = filter !== 'all' ? { role: filter } : {};
    const result = await adminService.users.getAll(filters);
    if (result.success) {
      setUsers(result.data);
    } else {
      toast.error('Error al cargar usuarios');
    }
    setLoading(false);
  };

  const handleChangeRole = async (userId, newRole) => {
    if (!confirm(`¿Cambiar rol del usuario a ${newRole}?`)) return;
    
    const result = await adminService.users.update(userId, { role: newRole });
    if (result.success) {
      toast.success('Rol actualizado correctamente');
      loadUsers();
    } else {
      toast.error('Error al actualizar rol');
    }
  };

  const handleChangeStatus = async (userId, newStatus) => {
    const result = await adminService.users.update(userId, { status: newStatus });
    if (result.success) {
      toast.success('Estado actualizado correctamente');
      loadUsers();
    } else {
      toast.error('Error al actualizar estado');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todos ({users.length})
          </button>
          <button
            onClick={() => setFilter('admin')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Admins
          </button>
          <button
            onClick={() => setFilter('client')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'client' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Clientes
          </button>
          <button
            onClick={() => setFilter('affiliate')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'affiliate' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Afiliados
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registro
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {user.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.full_name || 'Sin nombre'}</div>
                      <div className="text-sm text-gray-500">{user.phone || 'Sin teléfono'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role || 'client'}
                    onChange={(e) => handleChangeRole(user.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="client">Cliente</option>
                    <option value="admin">Admin</option>
                    <option value="affiliate">Afiliado</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleChangeStatus(
                      user.id, 
                      user.status === 'active' ? 'inactive' : 'active'
                    )}
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {user.status === 'active' ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    {user.role === 'admin' ? (
                      <FaUserShield className="text-purple-600" title="Administrador" />
                    ) : user.role === 'affiliate' ? (
                      <FaUser className="text-green-600" title="Afiliado" />
                    ) : (
                      <FaUser className="text-blue-600" title="Cliente" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium">Total Usuarios</p>
          <p className="text-2xl font-bold text-blue-900">{users.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium">Activos</p>
          <p className="text-2xl font-bold text-green-900">
            {users.filter(u => u.status === 'active').length}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-purple-600 font-medium">Administradores</p>
          <p className="text-2xl font-bold text-purple-900">
            {users.filter(u => u.role === 'admin').length}
          </p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-sm text-orange-600 font-medium">Afiliados</p>
          <p className="text-2xl font-bold text-orange-900">
            {users.filter(u => u.role === 'affiliate').length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserManager;
