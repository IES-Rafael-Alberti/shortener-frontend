import { useState } from 'react';
import Swal from "sweetalert2";
import useUserStore from "../stores/useUserStore";
import { Link } from 'react-router';
import React from 'react';
import { Navigate } from 'react-router';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';

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
      // Convierte los datos del formulario en formato `x-www-form-urlencoded`
      const urlencodedData = new URLSearchParams();
      Object.keys(datos).forEach((key) => {
        urlencodedData.append(key, datos[key]);
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
      const response = await axios.post("http://localhost:3000/auth/register", urlencodedData, {
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
