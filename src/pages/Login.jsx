// Login.js
import { useState } from 'react';
import useUserStore from '../stores/useUserStore';

const Login = () => {
  const [username, setUsername] = useState('');
  const user = useUserStore((state) => state.user); // Acceder al estado del usuario
  const login = useUserStore((state) => state.login); // Acción de iniciar sesión
  const logout = useUserStore((state) => state.logout); // Acción de cerrar sesión

  const handleLogin = () => {
    if (username.trim()) {
      login({ username }); // Iniciar sesión pasando el nombre de usuario
      setUsername(''); // Limpiar el campo de entrada
    }
  };

  if (user) {
    // Si el usuario está logueado, mostrar mensaje de bienvenida y botón de logout
    return (
      <div>
        <h2>Bienvenido, {user.username}</h2>
        <button onClick={logout}>Cerrar Sesión</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <input
        type="text"
        placeholder="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
};

export default Login;
