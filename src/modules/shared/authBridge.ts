// Bridge para sincronizar autenticación entre módulos
export const syncAuthToModules = (user: any) => {
  if (user) {
    const userData = {
      id: user.id || 'user-' + Date.now(),
      email: user.email || '',
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario',
      tier: 'STANDARD',
      isVerified: true,
      joinedAt: new Date().toISOString(),
      language: 'ES',
      theme: 'NEXUS',
      xp: 1200,
      level: 3,
      streak: 5
    };
    
    // Sincronizar con localStorage para módulos
    localStorage.setItem('wi_user', JSON.stringify(userData));
    localStorage.setItem('nexuspro_user', JSON.stringify(userData));
    localStorage.setItem('abogados_user', JSON.stringify(userData));
  } else {
    localStorage.removeItem('wi_user');
    localStorage.removeItem('nexuspro_user');
    localStorage.removeItem('abogados_user');
  }
};

export const getModuleUser = () => {
  const stored = localStorage.getItem('wi_user');
  return stored ? JSON.parse(stored) : null;
};
