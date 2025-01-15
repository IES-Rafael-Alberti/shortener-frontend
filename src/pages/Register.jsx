import { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, loginFirebase } from "../config/firebase";
import Swal from "sweetalert2";
import useUserStore from "../stores/useUserStore";
import { Link } from 'react-router';
import React from 'react';
import { Navigate } from 'react-router';
import ReCAPTCHA from 'react-google-recaptcha';

const Register = () => {

  const login = useUserStore((state) => state.login);

  const user = useUserStore((state) => state.user);

  const [datos, setDatos] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });

  const [isFormValid, setIsFormValid] = useState(false); 

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

    if (emailRegex.test(datos.email) && passwordRegex.test(datos.password)) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const recaptchaRef = React.createRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, datos.email, datos.password);
      const userFirebase = await loginFirebase({ email: datos.email, password: datos.password });
      const recaptchaValue = recaptchaRef.current.getValue();
      // Asegúrate de que el recaptcha no esté vacío antes de proceder
      if (!recaptchaValue) {
        Swal.fire("Error", "Por favor, valida el reCaptcha", "error");
        return;
      }
      login({ email: datos.email, id: userFirebase.user.uid }); // Guardar el usuario en el estado global
    } catch (error) {
      Swal.fire("Error", error.message, "error");
      setIsFormValid(false);
    }
  };

  if (user.email) {
    return <Navigate to="/userProfile" replace />;
  }

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

        {isFormValid && (
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LchHbgqAAAAAMaYK9S_kHPDzHsRdEd7atXMMAEz"
            />
          )}

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
