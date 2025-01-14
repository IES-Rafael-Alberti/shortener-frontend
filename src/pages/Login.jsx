// Login.js
import { useState } from 'react';
import useUserStore from '../stores/useUserStore';
import { loginFirebase } from '../config/firebase';
import Swal from 'sweetalert2';
import { Link } from 'react-router';

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

          <span className='fieldset__signup'>
            <p className='signup__signupLink'>¿No tienes una cuenta? <Link to="/register" className='link'>Entra aquí</Link></p> 
            
            <button type="submit" className='signup__submit' disabled={errors.email || errors.password}>
              Acceso
            </button>
          </span>

        </fieldset>
      </form>
    </main>
  );
};

export default Login;
