import React, {useState} from 'react';
import useUserStore from '../stores/useUserStore';
import Swal from 'sweetalert2';
import {Link, Navigate} from 'react-router';
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios';

/**
 * Componente para iniciar sesión en la aplicación.
 *
 * Este componente permite a los usuarios autenticarse en la aplicación.
 *
 * @component
 * @returns {JSX.Element} Formulario de inicio de sesión.
 * */
const Login = () => {

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
     * @memberof Login
     * */
    const handlerChange = (e) => {
        const {name, value} = e.target;
        setData({...data, [name]: value});
    };

    /**
     * Maneja el evento de blur en los campos del formulario.
     *
     * @param {Event} e - Evento de blur en un campo del formulario.
     * @memberof Login
     * */
    const handlerBlur = (e) => {
        const {name, value} = e.target;

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
     * @param {Event} e - Evento de envío del formulario.
     * @memberof Login
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
            const response = await axios.post(`${import.meta.env.VITE_API}/auth/login`, urlencodedData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            login(response.data);
            Swal.fire({
                title: "Sesión iniciada con éxito",
                icon: "success",
                customClass: {
                    popup: "swal__popup",       // Clase para el contenedor principal del modal
                    title: "swal__title",       // Clase para el título
                    icon: "swal__icon",         // Clase para el icono
                    confirmButton: "swal__confirm-button" // Clase para el botón de confirmación
                }
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error al iniciar sesión",
                icon: "error",
                customClass: {
                    popup: "swal__popup",
                    title: "swal__title",
                    icon: "swal__icon",
                    confirmButton: "swal__confirm-button"
                }
            });
        }
    };

    if (user.token) {
        return <Navigate to="/userProfile" replace/>;
    }


    return (
        <main className='login'>
            <h2 className='login__title' id='login-title'>Formulario de Inicio de Sesión</h2>

            <form className='login__form' onSubmit={handleSubmit} aria-labelledby='login-title'>
                <fieldset className='form__fieldset'>
                    <legend className='visually-hidden'>Formulario de Inicio de Sesión</legend>


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
                            aria-describedby="email-error"
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
                            aria-describedby="password-error"
                        />
                        {errors.password &&
                            <p id='password-error' className='label__error' role='alert'>{errors.password}</p>}
                    </label>

                    {/* Mostrar el reCaptcha solo si el formulario es válido */}
                    {isFormValid && (
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={import.meta.env.VITE_SITE_KEY_REPACTCHA}
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
