import axios from "axios";
import useUserStore from "../stores/useUserStore";
import {useState} from "react";
import Swal from "sweetalert2";
import verifyLink from "../utils/verifyLink.jsx";
import {useNavigate} from "react-router";

/**
 * Componente principal de la página de inicio.
 *
 * Este componente permite a los usuarios generar link cortos para las URLs que proporcionan.
 * Si el usuario está autenticado, se incluye un token de autenticación en la solicitud para la creación del link.
 * También permite volver a la interfaz de generación de link después de que se haya creado uno.
 *
 * @component
 * @returns {JSX.Element} La interfaz de usuario para generar link cortos.
 *
 */
const Home = () => {
    /**
     * Estado global del usuario, que contiene el token de autenticación.
     * @type {{ token: string }}
     * @memberof Home
     */
    const user = useUserStore((state) => state.user);

    const navigate = useNavigate();
    /**
     * Estado que almacena el código generado para el link.
     * @type {string|null}
     * @memberof Home
     */
    const [link, setlink] = useState(null);

    /**
     * Estado que almacena el valor del campo de entrada para la URL.
     * @type {string}
     * @memberof Home
     */
    const [urlInput, setUrlInput] = useState(""); // Estado para manejar el valor del input

    /**
     * Función que se ejecuta cuando el usuario desea volver al generador de link.
     * Resetea el estado del link y la URL ingresada.
     *
     * @function
     * @memberof Home
     */
    const handlerComeBack = () => {
        setlink(null);
        setUrlInput(""); // Restablece el valor del input
    };

    /**
     * Función que maneja la generación del link corto.
     * Realiza una solicitud a la API para crear un link corto para la URL proporcionada.
     * Si el usuario está autenticado, se incluye el token en la solicitud.
     *
     * @async
     * @function
     * @memberof Home
     */
    const handlerGeneratelink = async () => {
        if (verifyLink(urlInput)) {
            try {
                const urlEncodedData = new URLSearchParams();
                urlEncodedData.append("url", urlInput);

                const response = await axios.post(`${import.meta.env.VITE_API}/link`, urlEncodedData, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded", Authorization: `Bearer ${user.token}`,
                    },
                });
                setUrlInput(import.meta.env.VITE_DOMAIN + "/" + response.data.code);
                setlink(response.data.code);
            } catch (error) {
                await Swal.fire({
                    title: "No se ha podido generar el link", icon: "error", customClass: {
                        popup: "swal__popup",       // Clase para el contenedor principal del modal
                        title: "swal__title",       // Clase para el título
                        icon: "swal__icon",         // Clase para el icono
                        confirmButton: "swal__confirm-button" // Clase para el botón de confirmación
                    }, text: `${error}`
                });
            }
        } else {
            await Swal.fire({
                title: "link no válido", icon: "error", customClass: {
                    popup: "swal__popup",       // Clase para el contenedor principal del modal
                    title: "swal__title",       // Clase para el título
                    icon: "swal__icon",         // Clase para el icono
                    confirmButton: "swal__confirm-button" // Clase para el botón de confirmación
                }, text: "El link ha de empezar por http:// o https://"
            });
        }
    };


    return (<main className="home">
        <h1 className="home__title">Introduzca su link</h1>
        <label htmlFor="url" className="home__label">
            acortador
            <input
                type="url"
                name="url"
                id="url"
                className="home__input"
                value={urlInput} // Conecta el valor del input al estado
                onChange={(e) => setUrlInput(e.target.value)} // Actualiza el estado al escribir
            />
        </label>
        {!link ? (<button
            className="home__button"
            onClick={() => handlerGeneratelink()}
            disabled={!urlInput.trim()} // Desactiva si el input está vacío
        >
            Generar link
        </button>) : (<div className="home__container">
            <button className="home__buttonG" onClick={() => handlerComeBack()}>
                Volver al generador
            </button>
            <button className="home__buttonG"
                    onClick={async () => {
                        if (user.token) {
                            navigate(`/linkConfig/${link}`);
                        } else {
                            await Swal.fire({
                                title: "Necesitas inciar sesión", icon: "error", customClass: {
                                    popup: "swal__popup",       // Clase para el contenedor principal del modal
                                    title: "swal__title",       // Clase para el título
                                    icon: "swal__icon",         // Clase para el icono
                                    confirmButton: "swal__confirm-button" // Clase para el botón de confirmación
                                }, text: ""
                            })
                        }
                    }}>Configurar
                link
            </button>
        </div>)}
    </main>);
};

export default Home;
