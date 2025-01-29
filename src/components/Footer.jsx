/**
 * Componente que muestra un enlace al portfolio si el usuario está autenticado.
 * 
 * Este componente obtiene los datos del usuario utilizando la función `fetchMe` cuando el token del usuario
 * está presente y muestra un enlace "Portfolio" si el usuario está autenticado.
 * 
 * @component
 * @example
 * // Uso del componente Footer
 * <Footer />
 */

import { NavLink } from "react-router";
import fetchMe from "../utils/fetchMe";
import useUserStore from "../stores/useUserStore";
import { useEffect, useState } from "react";

/**
 * Componente de pie de página que muestra un enlace al portfolio si el usuario está autenticado.
 *
 * @function
 * @returns {JSX.Element} El componente de footer con un enlace condicional para usuarios autenticados.
 */
const Footer = () => {
    /**
     * Estado para almacenar los datos del usuario obtenidos del servidor.
     * @type {Object}
     * @property {string} email - El correo electrónico del usuario.
     */
    const [userData, setUserData] = useState({ email: "" });

    /**
     * Datos del usuario del estado global (user store).
     * @type {Object}
     * @property {string} token - El token de autenticación del usuario.
     */
    const user = useUserStore((state) => state.user);

    /**
     * Hook de efecto que se ejecuta cuando el componente se monta.
     * Obtiene los datos del usuario utilizando el token de autenticación del usuario.
     */
    useEffect(() => {
        if (user.token) {
            /**
             * Obtiene los datos del usuario utilizando el token de autenticación.
             * @async
             * @function
             * @returns {Promise<void>} Actualiza el estado con los datos del usuario obtenidos.
             */
            const fetchUserData = async () => {
                const data = await fetchMe(user.token); // Llama a fetchMe con el token del usuario
                setUserData(data); // Actualiza el estado con los datos del usuario
            }
            fetchUserData();
        }
    },[])

    return (
        <footer className="footer">
            {user.token && <NavLink className="footer__link" to={"/portfolio/"  + userData._id}>Portfolio</NavLink>}
        </footer>
    );
};

export default Footer;
