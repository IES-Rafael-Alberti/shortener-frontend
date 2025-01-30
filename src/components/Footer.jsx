import { NavLink } from "react-router";
import fetchMe from "../utils/fetchMe";
import useUserStore from "../stores/useUserStore";
import { useEffect, useState } from "react";

/**
 * Componente de pie de página que muestra un enlace al portfolio si el usuario está autenticado.
 *
 * @component
 * @returns {JSX.Element} El componente de footer con un enlace condicional para usuarios autenticados.
 * 
 */
const Footer = () => {
    /**
     * Estado para almacenar los datos del usuario obtenidos del servidor.
     * @type {Object}
     * @property {string} email - El correo electrónico del usuario.
     * @property {string} _id - El identificador único del usuario.
     * @memberof Footer
     */
    const [userData, setUserData] = useState({ email: "", _id: "" });

    /**
     * Datos del usuario del estado global.
     * @type {{ token: string }}
     * @memberof Footer
     */
    const user = useUserStore((state) => state.user);

    /**
     * Obtiene los datos del usuario utilizando el token de autenticación.
     * 
     * @async
     * @function fetchUserData
     * @memberof Footer
     * @param {string} token - Token de autenticación del usuario.
     * @returns {Promise<void>} Actualiza el estado con los datos del usuario obtenidos.
     * @example
     * fetchUserData('some-token')
     */
    const fetchUserData = async (token) => {
        const data = await fetchMe(token);
        setUserData(data);
    };

    useEffect(() => {
        if (user.token) {
            fetchUserData(user.token);
        }
    }, [user.token]); // Dependencia para actualizar datos cuando el token cambie.

    return (
        <footer className="footer">
            {user.token && (
                <NavLink className="footer__link" to={`/portfolio/${userData._id}`}>
                    Portfolio
                </NavLink>
            )}
        </footer>
    );
};

export default Footer;
