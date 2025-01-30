import { NavLink, useNavigate } from 'react-router';
import logo from '../assets/ShortenerLogo.png';
import useUserStore from '../stores/useUserStore';
import { useEffect, useState } from 'react';
import fetchMe from '../utils/fetchMe';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb as faSolidLightbulb } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb as faRegularLightbulb } from "@fortawesome/free-regular-svg-icons";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

/**
 * Componente Header que muestra el logo, botones de autenticación y cambio de tema.
 * 
 * @component
 * @returns {JSX.Element} El componente del encabezado de la aplicación con opciones de autenticación y cambio de tema.
 */
const Header = () => {
    /**
     * Estado global del usuario, que contiene el token de autenticación.
     * @type {{ token: string }}
     * @memberof Header
     */
    const user = useUserStore((state) => state.user);

    /**
     * Función para cerrar sesión que modifica el estado global.
     * @memberof Header
     */
    const logout = useUserStore((state) => state.logout);

    /**
     * Hook para manejar la navegación a otras páginas dentro de la aplicación.
     * @type {Function}
     * @memberof Header
     */
    const navigate = useNavigate();

    /**
     * Estado para manejar el tema de la aplicación (modo claro u oscuro).
     * @type {"light" | "dark"}
     * @memberof Header
     */
    const [theme, setTheme] = useState("light");

    /**
     * Estado para almacenar los datos del usuario autenticado.
     * @type {Object}
     * @property {string} email - Correo electrónico del usuario.
     * @memberof Header
     */
    const [userData, setUserData] = useState({ email: "" });

    /**
     * Cambia el tema entre "light" y "dark".
     * Guarda la preferencia del tema en el `localStorage`.
     * 
     * @function toggleMode
     * @memberof Header
     */
    const toggleMode = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    /**
     * Efecto que se ejecuta al montar el componente, recuperando los datos del usuario 
     * y el tema preferido del usuario desde `localStorage`.
     * 
     * @function
     * @async
     * @memberof Header
     */
    useEffect(() => {
        if (user.token) {
            /**
             * Obtiene los datos del usuario autenticado.
             * 
             * @async
             * @function fetchUserData
             * @memberof Header
             * @returns {Promise<void>} Datos del usuario actualizados.
             */
            const fetchUserData = async () => {
                const data = await fetchMe(user.token);
                setUserData(data);
            };
            fetchUserData();
        }

        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.body.setAttribute("data-theme", savedTheme);
    }, [user.token]);

    /**
     * Efecto que aplica el tema al `body` cuando cambia el estado `theme`.
     * 
     * @memberof Header
     */
    useEffect(() => {
        document.body.setAttribute("data-theme", theme);
    }, [theme]);

    return (
        <header className="header">
            <figure className="header__branding">
                <img src={logo} alt="Logo Shortener" className="branding__logo" />
                <figcaption>
                    <NavLink to="/" className="branding__name">Shortener</NavLink>
                </figcaption>
            </figure>

            <section className="header__rightSide">
                <button className="rightSide__button" onClick={toggleMode}>
                    <FontAwesomeIcon
                        icon={theme === "dark" ? faRegularLightbulb : faSolidLightbulb}
                        className="button__icon"
                    />
                </button>

                <article className="rightSide__auth">
                    {!user.token ? (
                        <>
                            <button className="auth__login" onClick={() => navigate('/login')}>Login</button>
                            <button className="auth__register" onClick={() => navigate('/register')}>Registro</button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/userProfile" className="auth__userName">
                                <FontAwesomeIcon className="userName__logo" icon={faCircleUser} />
                            </NavLink>
                            <button className="auth__logOut" onClick={logout}>Logout</button>
                        </>
                    )}
                </article>
            </section>
        </header>
    );
};

export default Header;
