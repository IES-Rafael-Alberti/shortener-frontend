import { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase"; // Asegúrate de importar correctamente tu configuración de Firebase
import Swal from "sweetalert2";

const Register = () => {
  const [datos, setDatos] = useState({
    email: "",
    password: ""
  });

  

  const showError = (mensaje) => {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: mensaje,
      confirmButtonText: "Aceptar"
    });
  };

  const showSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Registro exitoso",
      text: "¡Tu cuenta ha sido creada con éxito!",
      confirmButtonText: "Aceptar"
    });
  };

  const handlerChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, datos.email, datos.password);
      showSuccess();
      setDatos({ email: "", password: "" }); // Limpiar el formulario
    } catch (error) {
      showError(error.message); // Muestra el error si ocurre algún problema
    }
  };

  return (
    <div>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Correo electrónico"
          id="email"
          name="email"
          value={datos.email}
          onChange={handlerChange}
        />
        <input
          type="password"
          placeholder="Contraseña"
          id="password"
          name="password"
          value={datos.password}
          onChange={handlerChange}
        />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
