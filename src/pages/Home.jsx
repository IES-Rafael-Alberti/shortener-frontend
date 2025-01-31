import axios from "axios";
import useUserStore from "../stores/useUserStore";
import { useState } from "react";
import Swal from "sweetalert2";

/**
 * Componente principal de la página de inicio.
 * 
 * Este componente permite a los usuarios generar enlaces cortos para las URLs que proporcionan.
 * Si el usuario está autenticado, se incluye un token de autenticación en la solicitud para la creación del enlace.
 * También permite volver a la interfaz de generación de enlaces después de que se haya creado uno.
 * 
 * @component
 * @returns {JSX.Element} La interfaz de usuario para generar enlaces cortos.
 * 
 */
const Home = () => {
  /**
   * Estado global del usuario, que contiene el token de autenticación.
   * @type {{ token: string }}
   * @memberof Home
   */
  const user = useUserStore((state) => state.user);

  /**
   * Estado que almacena el código generado para el enlace.
   * @type {string|null}
   * @memberof Home
   */
  const [enlace, setEnlace] = useState(null);

  /**
   * Estado que almacena el valor del campo de entrada para la URL.
   * @type {string}
   * @memberof Home
   */
  const [urlInput, setUrlInput] = useState(""); // Estado para manejar el valor del input

  /**
   * Función que se ejecuta cuando el usuario desea volver al generador de enlaces.
   * Resetea el estado del enlace y la URL ingresada.
   * 
   * @function
   * @memberof Home
   */
  const handlerVolver = () => {
    setEnlace(null);
    setUrlInput(""); // Restablece el valor del input
  };

  /**
   * Función que maneja la generación del enlace corto.
   * Realiza una solicitud a la API para crear un enlace corto para la URL proporcionada.
   * Si el usuario está autenticado, se incluye el token en la solicitud.
   * 
   * @async
   * @function
   * @memberof Home
   */
  const handlerGenerarEnlace = async () => {
    if (startsWithHTTPS(urlInput)) {
      if (user.token) {
        try {
          const urlEncodedData = new URLSearchParams();
          urlEncodedData.append("url", urlInput);

          const response = await axios.post(`${import.meta.env.VITE_API}/link`, urlEncodedData, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${user.token}`,
            },
          });
          setUrlInput(import.meta.env.VITE_DOMAIN + "/" + response.data.code);
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          const urlEncodedData = new URLSearchParams();
          urlEncodedData.append("url", urlInput);

          const response = await axios.post(`${import.meta.env.VITE_API}/link`, urlEncodedData, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          });
          setUrlInput(import.meta.env.VITE_DOMAIN + "/" + response.data.code);
          setEnlace(response.data.code);
        } catch (error) {
          console.error(error);
        }
      }
    }
    else {
      Swal.fire({
              title: "Enlace no válido",
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

  const startsWithHTTPS = (url) => /^https:\/\/[^/]+/i.test(url);

  return (
    <main className="home">
      <h1 className="home__title">Introduzca su enlace</h1>
      <input
        type="url"
        name="url"
        id="url"
        className="home__input"
        value={urlInput} // Conecta el valor del input al estado
        onChange={(e) => setUrlInput(e.target.value)} // Actualiza el estado al escribir
      />
      {!enlace ? (
        <button
          className="home__button"
          onClick={() => handlerGenerarEnlace()}
          disabled={!urlInput.trim()} // Desactiva si el input está vacío
        >
          Generar enlace
        </button>
      ) : (
        <button className="home__button" onClick={() => handlerVolver()}>
          Volver al generador
        </button>
      )}
    </main>
  );
};

export default Home;
