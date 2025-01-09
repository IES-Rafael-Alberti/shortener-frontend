import { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, loginFirebase } from "../config/firebase";
import Swal from "sweetalert2";
import useUserStore from "../stores/useUserStore";

const Register = () => {

  const login = useUserStore((state) => state.login);

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

  const showError = (mensaje) => {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: mensaje,
      confirmButtonText: "Aceptar"
    });
  };

  const handlerChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value
    });
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
      await createUserWithEmailAndPassword(auth, datos.email, datos.password);
      const userFirebase = await loginFirebase({ email: datos.email, password: datos.password });
      login({ email: datos.email, id: userFirebase.user.uid }); 
    } catch (error) {
      showError(error.message); 
    }
  };

  return (
    <div>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Correo electrónico"
            id="email"
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
            id="password"
            name="password"
            value={datos.password}
            onChange={handlerChange}
            onBlur={handlerBlur} 
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        </div>
        <button type="submit" disabled={errors.email || errors.password}>Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
