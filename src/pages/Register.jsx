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
    <main className='register'>
    <h2 className='register__title'>Formulario de Registro</h2>
    
    <form className='register__form' onSubmit={handleSubmit} aria-labelledby='register-title'>
      <fieldset className='form__fieldset'>
        <legend className='visually-hidden'>Formulario de Registro</legend>
        
        
        <label className='fieldset__label'>Correo Electronico
          
          <input
            type="email"
            placeholder="Correo electrónico"
            name="email"
            value={datos.email}
            onChange={handlerChange}
            onBlur={handlerBlur}
            className='label__input'
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby="email-error" 
          />
          {errors.email && <p id='email-error' className='label__error' role='alert'>{errors.email}</p>}
        </label>

        <label className='fieldset__label'>Contraseña
      
          <input
            type="password"
            placeholder="Contraseña"
            name="password"
            value={datos.password}
            onChange={handlerChange}
            onBlur={handlerBlur}
            className='label__input'
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby="password-error" 
          />
          {errors.password && <p id='password-error' className='label__error' role='alert'>{errors.password}</p>}
        </label>

        <span className='fieldset__register'>
          <p className='register__registerLink'>¿Ya tienes una cuenta? <Link to="/login" className='link'>Entra aquí</Link></p> 
        
          <button type="submit" className='register__submit' disabled={errors.email || errors.password}>
            Acceso
          </button>
        </span>

      </fieldset>
    </form>
  </main>
  );
};

export default Register;
