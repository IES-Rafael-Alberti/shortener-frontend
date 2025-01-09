// Login.js
import { useState } from 'react';
import useUserStore from '../stores/useUserStore';
import { loginFirebase } from '../config/firebase';
import Swal from 'sweetalert2';

const Login = () => {
//  const [username, setUsername] = useState('');
  const user = useUserStore((state) => state.user); // Acceder al estado del usuario
  const login = useUserStore((state) => state.login); // Acción de iniciar sesión

  const showError = (mensaje) => {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: mensaje,
      confirmButtonText: "Aceptar"
    });
  }

  const [datos, setDatos] = useState({
    email: "",
    password: ""
  })

  const handlerChange = (e) => {
    console.log(user);
    setDatos({
      ...datos,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userFirebase = await loginFirebase({ email: datos.email, password: datos.password });
      login({ email: datos.email, id: userFirebase.user.uid }); // Guardar el usuario en el estado global
    } catch (error) {
      showError(error.message); // Muestra el error en un alert
    }
  };
  

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <input
        type="text"
        placeholder="Nombre de usuario"
        id="email" 
        name="email"
        onBlur={(e) => handlerChange(e)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        id="password" 
        name="password"
        onBlur={(e) => handlerChange(e)}
      />
      <button onClick={handleSubmit}>Entrar</button>
    </div>
  );
};

export default Login;
