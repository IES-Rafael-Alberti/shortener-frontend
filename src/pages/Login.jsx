import { useState } from 'react';
import useUserStore from '../stores/useUserStore';
import Swal from 'sweetalert2';
import { Link } from 'react-router';
import React from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { Navigate } from 'react-router';
import axios from 'axios';

const Login = () => {
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

    // Comprobar si el formulario es válido
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
      // Convierte los datos del formulario en formato `x-www-form-urlencoded`
      const urlencodedData = new URLSearchParams();
      Object.keys(datos).forEach((key) => {
        urlencodedData.append(key, datos[key]);
      });
  
      const recaptchaValue = recaptchaRef.current.getValue();
      if (!recaptchaValue) {
        Swal.fire("Error", "Por favor, valida el reCaptcha", "error");
        return;
      }
  
      // Realiza la solicitud con Axios
      const response = await axios.post("http://localhost:3000/auth/login", urlencodedData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      console.log(response.data.token);
      login(response.data);
      Swal.fire("Éxito", "Usuario logueado con éxito", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", error.response?.data?.message || "Ocurrió un error al hacer el login", "error");
    }
  };

  if (user.token) {
    return <Navigate to="/userProfile" replace />;
  }


  return (
    <main className='login'>
      <h2 className='login__title'>Formulario de Inicio de Sesión</h2>
      
      <form className='login__form' onSubmit={handleSubmit} aria-labelledby='login-title'>
        <fieldset className='form__fieldset'>
          <legend className='visually-hidden'>Formulario de Inicio de Sesión</legend>
          
          
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

          {/* Mostrar el reCaptcha solo si el formulario es válido */}
          {isFormValid && (
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LchHbgqAAAAAMaYK9S_kHPDzHsRdEd7atXMMAEz"
            />
          )}

          <span className='fieldset__signup'>
            <p className='signup__signupLink'>¿No tienes una cuenta? <Link to="/register" className='link'>Entra aquí</Link></p> 
            
            <button type="submit" className='signup__submit' disabled={!isFormValid}>
              Acceso
            </button>
          </span>

        </fieldset>
      </form>
    </main>
  );
};

export default Login;
