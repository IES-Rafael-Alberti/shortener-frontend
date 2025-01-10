import { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, loginFirebase } from "../config/firebase";
import Swal from "sweetalert2";
import useUserStore from "../stores/useUserStore";
import { Link } from 'react-router';

const Register = () => {

  const login = useUserStore((state) => state.login);

  const [datos, setDatos] = useState({
    name: "",
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

    if (name === "")
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
      <h2>Formulario de Registro</h2>
      <form onSubmit={handleSubmit}>
        <div>

          <label>Nombre</label>
          <input
            type='text'
            placeholder='Nombre'
            id="name"
            name='name'
            value={datos.name}
            onChange={handlerChange}
            onBlur={handlerBlur}
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}

          <label>Correo Electrónico</label>
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
        
          <p>¿Ya tienes una cuenta? <Link to="/login">Entra aquí</Link></p>

          <button type="submit" disabled={errors.email || errors.password}>Registro</button>

        </div>
        
      </form>
    </div>
  );
};

export default Register;
