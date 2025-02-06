import { useState } from 'react';
import Swal from "sweetalert2";
import useUserStore from "../stores/useUserStore";
import { Link } from 'react-router';
import React from 'react';
import { Navigate } from 'react-router';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';

/**
 * Componente para el registro de usuarios.
 * 
 * Este componente permite a los usuarios registrarse en la aplicación.
 * 
 * @component
 * @returns {JSX.Element} Formulario de registro.
 * */
const Register = () => {

  const login = useUserStore((state) => state.login);

  const user = useUserStore((state) => state.user);

  const [data, setData] = useState({
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

  /**
   * Maneja el cambio en los campos del formulario.
   * 
   * @param {Event} e - Evento de cambio en un campo del formulario.
   * @memberof Register
   * */
  const handlerChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  /**
   *  Maneja el evento de blur en los campos del formulario.
   * 
   * @param {Event} e - Evento de blur en un campo del formulario.
   * @memberof Register
   * */
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

    if (emailRegex.test(data.email) && passwordRegex.test(data.password)) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const recaptchaRef = React.createRef();

  /**
   * Maneja el evento de envío del formulario.
   * 
   * @async
   * @function
   * @memberof Register
   * @param {Event} e - Evento de envío del formulario.
   * */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convierte los datos del formulario en formato `x-www-form-urlencoded`
      const urlencodedData = new URLSearchParams();
      Object.keys(data).forEach((key) => {
        urlencodedData.append(key, data[key]);
      });
  
      const recaptchaValue = recaptchaRef.current.getValue();
      if (!recaptchaValue) {
        Swal.fire({
          title: "ReCaptcha no validado",
          icon: "error",
          customClass: {
            popup: "swal__popup",       // Clase para el contenedor principal del modal
            title: "swal__title",       // Clase para el título
            icon: "swal__icon",         // Clase para el icono
            confirmButton: "swal__confirm-button" // Clase para el botón de confirmación
          }
        });
        return;
      }
  
      // Realiza la solicitud con Axios
      const response = await axios.post(`${import.meta.env.VITE_API}/auth/register`, urlencodedData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
  
      login(response.data);
      Swal.fire({
        title: "Registro completado con éxito",
        icon: "success",
        customClass: {
          popup: "swal__popup",       // Clase para el contenedor principal del modal
          title: "swal__title",       // Clase para el título
          icon: "swal__icon",         // Clase para el icono
          confirmButton: "swal__confirm-button" // Clase para el botón de confirmación
        }
      });
    } catch (error) {
      if (error.response.data.error === "User already exists")
      {
        Swal.fire({
          title: "El usuario ya existe",
          icon: "error",
          customClass: {
            popup: "swal__popup",       // Clase para el contenedor principal del modal
            title: "swal__title",       // Clase para el título
            icon: "swal__icon",         // Clase para el icono
            confirmButton: "swal__confirm-button" // Clase para el botón de confirmación
          }
        });
        return;
      }
      console.error(error);
      Swal.fire({
        title: "Error al realizar el registro",
        icon: "error",
        customClass: {
          popup: "swal__popup",       // Clase para el contenedor principal del modal
          title: "swal__title",       // Clase para el título
          icon: "swal__icon",         // Clase para el icono
          confirmButton: "swal__confirm-button" // Clase para el botón de confirmación
        }
      });
    }
  };

  if (user.token) {
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
            value={data.email}
            onChange={handlerChange}
            onBlur={handlerBlur}
            className='label__input'
            aria-invalid={errors.email ? "true" : "false"}
            //aria-describedby="email-error" 
          />
          {errors.email && <p id='email-error' className='label__error' role='alert'>{errors.email}</p>}
        </label>

        <label className='fieldset__label'>Contraseña
      
          <input
            type="password"
            placeholder="Contraseña"
            name="password"
            value={data.password}
            onChange={handlerChange}
            onBlur={handlerBlur}
            className='label__input'
            aria-invalid={errors.password ? "true" : "false"}
            //aria-describedby="password-error" 
          />
          {errors.password && <p id='password-error' className='label__error' role='alert'>{errors.password}</p>}
        </label>

        {isFormValid && (
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey = {import.meta.env.VITE_SITE_KEY_REPACTCHA}
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
