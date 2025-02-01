import {useEffect, useState} from "react";
import useUserStore from "../stores/useUserStore";
import {useNavigate} from "react-router";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import fetchMe from "../utils/fetchMe.jsx";

/**
 * Página de perfil de usuario.
 *
 * Este componente muestra el perfil del usuario autenticado, incluyendo su correo electrónico y los enlaces acortados.
 *
 * @component
 * @returns {JSX.Element} La página de perfil de usuario.
 * */
const UserProfile = () => {
    const [userData, setUserData] = useState({email: ""}); // Inicializamos el estado con un objeto vacío
    const user = useUserStore((state) => state.user);
    const navigate = useNavigate(); // Hook para navegación
    const [links, setLinks] = useState([]); // Inicializamos el estado como un array vacío

    // Verificamos si el user está disponible antes de proceder
    useEffect(() => {
        fetchMe(user.token).then((data) => {
            if (data === null) return user.logout(); // Si no hay datos, cerramos la sesión
            setUserData(data); // Actualizamos el estado con los datos del user
        })

        axios.get(`${import.meta.env.VITE_API}/link`, {
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        }).then((response) => {
            setLinks(response.data); // Actualizamos el estado con los enlaces del user
        })

    }, [user]); // Recorremos los enlaces cuando el user cambia

    /**
     * Redirige a la página del enlace.
     *
     * @function
     * @param {string} id - ID del enlace.
     * */
    const handleRedirect = (id) => {
        navigate(`/userProfile/linkPage/${id}`); // Redirigir a la página del enlace con el ID
    };

    /**
     * Redirige a la página de configuración del enlace.
     *
     * @function
     * @param {string} id - ID del enlace.
     * */
    const handleConfig = (id) => {
        navigate(`/userProfile/linkConfig/${id}`); // Redirigir a la página de configuración del enlace con el ID
    };

    /**
     * Añade o elimina un enlace del portfolio.
     *
     * @function
     * @param {string} id - ID del enlace.
     * */
    const handlePortfolio = (id) => {
        const link = links.filter((link) => link.code === id)[0];
        if (link.portfolio) {
            link.portfolio = false;
        } else {
            link.portfolio = true;
        }
        setLinks([...links]);

        axios.put(`${import.meta.env.VITE_API}/link/${id}`, {portfolio: link.portfolio}, {
            headers: {"Authorization": `Bearer ${user.token}`}
        });
    };

    /**
     * Elimina un enlace.
     *
     * @function
     * @param {string} id - ID del enlace.
     * */
    const handlerDelete = (id) => {
        axios.delete(`${import.meta.env.VITE_API}/link/${id}`, {
            headers: {"Authorization": `Bearer ${user.token}`}
        });
        setLinks(links.filter((link) => link.code !== id));
    };

    if (!user) {
        return <div>Cargando perfil...</div>; // Agregamos un mensaje de carga si el user no está disponible
    }

    return (<main className="userProfile">
      <span className="container">
        <h1 className="userProfile__title">Perfil del usuario</h1>
        <section aria-labelledby="user-email" className="userProfile__user">
          <h2 className="user__user" id="user-email">{userData.email}</h2>
        </section>
      </span>

        <section aria-labelledby="user-links" className="userProfile__links">
            <h2 id="user-links" className="links__title">Mis enlaces</h2>
            {links.length > 0 ? (<ul className="links__list">
                {links.map((link) => (<li className="list__element" key={link.code}>
                    <h3 className="element__name">{import.meta.env.VITE_DOMAIN + "/" + link.code}</h3>

                    <button onClick={() => handlerDelete(link.code)} className="element__delete"
                            aria-label="close"><FontAwesomeIcon className="hover__icon" icon={faXmark}/>
                    </button>


                    <span className="buttons">
                  <button
                      className="element__button"
                      onClick={() => handleRedirect(link.code)}
                      aria-label={`Consultar el enlace ${import.meta.env.VITE_DOMAIN + "/" + link.code}`}
                  >
                    Consultar
                  </button>

                  <button
                      className="element__button"
                      onClick={() => handleConfig(link.code)}
                      aria-label={`Configurar el enlace ${import.meta.env.VITE_DOMAIN + "/" + link.code}`}
                  >
                    Configurar
                  </button>

                        {link.portfolio ? (<button
                            className="element__buttonPort"
                            onClick={() => handlePortfolio(link.code)}
                            aria-label={`Añadir el enlace ${link.code} al portfolio`}
                        >
                            Eliminar del portfolio
                        </button>) : (<button
                            className="element__buttonPort"
                            onClick={() => handlePortfolio(link.code)}
                            aria-label={`Añadir el enlace ${link.code} al portfolio`}
                        >
                            Añadir al portfolio
                        </button>)}

                </span>
                </li>))}
            </ul>) : (<p>No tienes enlaces.</p> // Mensaje si no hay enlaces disponibles
            )}
        </section>
    </main>);
};


export default UserProfile;
