// Login.js
import { useState } from 'react';
import useUserStore from '../stores/useUserStore';
import { loginFirebase } from '../config/firebase';
import Swal from 'sweetalert2';

const Login = () => {
  const login = useUserStore((state) => state.login); // Acción para iniciar sesión
  
  const [datos, setDatos] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });

  // Expresiones regulares
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  const passwordRegex = /^[A-Za-z0-9]{6,}$/;

  const handlerChange = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
  };

  const handlerBlur = (e) => {
    const { name, value } = e.target;

    if (name === "email" && !emailRegex.test(value)) {
      setErrors({
        ...errors,
        email: "Formato de correo inválido"
      });
    } else if (name === "password" && !passwordRegex.test(value)) {
      setErrors({
        ...errors,
        password: "Mínimo 6 caracteres alfanuméricos"
      });
    } else {
      setErrors({
        ...errors, 
        [name]: ""
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userFirebase = await loginFirebase({ email: datos.email, password: datos.password });
      login({ email: datos.email, id: userFirebase.user.uid }); // Guardar el usuario en el estado global
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Correo electrónico"
            name="email"
            value={datos.email}
            onChange={handlerChange}
            onBlur={handlerBlur} 
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            name="password"
            value={datos.password}
            onChange={handlerChange}
            onBlur={handlerBlur} 
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        </div>
        <button type="submit" disabled={errors.email || errors.password}>
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
