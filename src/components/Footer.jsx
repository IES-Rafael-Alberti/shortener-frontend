import {NavLink} from "react-router";
import fetchMe from "../utils/fetchMe";
import useUserStore from "../stores/useUserStore";
import {useEffect, useState} from "react";

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
    const [userData, setUserData] = useState({email: "", _id: ""});

    /**
     * Datos del usuario del estado global.
     * @type {{ token: string }}
     * @memberof Footer
     */
    const user = useUserStore((state) => state.user);
    const logout = useUserStore((state) => state.logout);

    useEffect(() => {
        if (user.token) {
            fetchMe(user.token).then((data) => {
                if (data === null) return logout();
                setUserData(data);
            });
        }
    }, [user.token]); // Dependencia para actualizar datos cuando el token cambie.

    return (<footer className="footer">
        {userData && (<NavLink className="footer__link" to={`/portfolio/${userData._id}`}>
            Portfolio
        </NavLink>)}
    </footer>);
};

export default Footer;
