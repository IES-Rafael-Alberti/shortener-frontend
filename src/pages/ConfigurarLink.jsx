import { useParams } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import useUserStore from "../stores/useUserStore";
import Swal from 'sweetalert2';

/**
 * Componente para configurar un enlace existente.
 * 
 * Este componente permite al usuario modificar la configuración de un enlace,
 * incluyendo la protección con contraseña, la activación de reCAPTCHA, las fechas de activación y expiración, 
 * y la necesidad de iniciar sesión para acceder.
 * 
 * @component
 * @returns {JSX.Element} Formulario para configurar los parámetros de un enlace.
 * 
 */
const ConfigurarLink = () => {
  /**
   * ID del enlace obtenido desde la URL.
   * @type {string}
   */
  const { id } = useParams();

  /**
   * Información del usuario autenticado.
   * @type {Object}
   * @property {string} token - Token de autenticación del usuario.
   */
  const user = useUserStore((state) => state.user);

  /**
   * Estado que almacena los datos del enlace.
   * @type {Object}
   * @property {string} password - Contraseña para acceder al enlace.
   * @property {boolean} recaptcha - Indica si se requiere reCAPTCHA.
   * @property {string} dateActivation - Fecha de activación del enlace en formato "YYYY-MM-DD".
   * @property {string} dateExpiration - Fecha de expiración del enlace en formato "YYYY-MM-DD".
   * @property {boolean} requireLogin - Indica si el acceso requiere autenticación.
   */
  const [enlace, setEnlace] = useState({
    password: "",
    recaptcha: false,
    dateActivation: "",
    dateExpiration: "",
    requireLogin: false,
  });

  /**
   * Obtiene los datos del enlace desde la API y actualiza el estado.
   * 
   * @async
   * @memberof ConfigurarLink
   * @function fetchEnlace
   * @returns {Promise<void>} Actualiza el estado con la información del enlace.
   */
  useEffect(() => {
    const fetchEnlace = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API}/link/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = response.data;

        setEnlace({
          ...data,
          dateActivation: data.dateActivation ? data.dateActivation.split("T")[0] : "",
          dateExpiration: data.dateExpiration ? data.dateExpiration.split("T")[0] : "",
        });
      } catch (error) {
        console.error("Error al cargar el enlace:", error);
      }
    };

    fetchEnlace();
  }, [id, user.token]);

  /**
   * Maneja los cambios en los campos del formulario y actualiza el estado.
   * 
   * @function handleChange
   * @memberof ConfigurarLink
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio en un input.
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEnlace({
      ...enlace,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /**
   * Envía los datos del formulario para actualizar la configuración del enlace.
   * 
   * @async
   * @memberof ConfigurarLink
   * @function handleSubmit
   * @param {React.FormEvent<HTMLFormElement>} e - Evento de envío del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API}/link/${id}`, enlace, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      Swal.fire({
              title: "Configuración guardada con éxito",
              icon: "success",
              customClass: {
                popup: "swal__popup",       // Clase para el contenedor principal del modal
                title: "swal__title",       // Clase para el título
                icon: "swal__icon",         // Clase para el icono
                confirmButton: "swal__confirm-button" // Clase para el botón de confirmación
              }
            });
    } catch (error) {
      console.error("Error al actualizar el enlace:", error);
    }
  };

  return (
    /*
    <div>
      <h2>Configurar Enlace</h2>
      <p>Enlace: {import.meta.env.VITE_DOMAIN + "/" + enlace.code}</p>
      <form onSubmit={handleSubmit}>
        <label>
          Contraseña:
          <input
            type="text"
            name="password"
            id="password"
            placeholder="Contraseña"
            value={enlace.password || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          <input
            type="checkbox"
            name="recaptcha"
            id="recaptcha"
            checked={enlace.recaptcha || false}
            onChange={handleChange}
          />
          <span>Recaptcha</span>
        </label>

        <label>
          Fecha de Activación:
          <input
            type="date"
            name="dateActivation"
            id="dateActivation"
            value={enlace.dateActivation || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Fecha de Expiración:
          <input
            type="date"
            name="dateExpiration"
            id="dateExpiration"
            value={enlace.dateExpiration || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          <input
            type="checkbox"
            name="requireLogin"
            id="requireLogin"
            checked={enlace.requireLogin || false}
            onChange={handleChange}
          />
          <span>Requiere Login</span>
        </label>

        <button type="submit">Guardar configuración</button>
      </form>
    </div>
    */
    <main className='config-link'>
      <h2 className='config-link__title'>Configurar Enlace</h2>
      <p className='config-link__info'>Enlace: {import.meta.env.VITE_DOMAIN + "/" + enlace.code}</p>
      
      <form className='config-link__form' onSubmit={handleSubmit}>
        <fieldset className='form__fieldset'>
          <legend className='visually-hidden'>Configuración de Enlace</legend>
          
          <label className='fieldset__label'>Contraseña
            <input
              type='text'
              name='password'
              id='password'
              placeholder='Contraseña'
              value={enlace.password || ""}
              onChange={handleChange}
              className='label__input'
            />
          </label>
          
          <label className='fieldset__label'>Fecha de Activación
            <input
              type='date'
              name='dateActivation'
              id='dateActivation'
              value={enlace.dateActivation || ""}
              onChange={handleChange}
              className='label__input'
            />
          </label>
          
          <label className='fieldset__label'>Fecha de Expiración
            <input
              type='date'
              name='dateExpiration'
              id='dateExpiration'
              value={enlace.dateExpiration || ""}
              onChange={handleChange}
              className='label__input'
            />
          </label>
          
          <label className='fieldset__labelR'>
            <input
              type='checkbox'
              name='recaptcha'
              id='recaptcha'
              checked={enlace.recaptcha || false}
              onChange={handleChange}
              className='label__checkbox'
            />
            <span>Recaptcha</span>
          </label>
          
          <label className='fieldset__labelR'>
            <input
              type='checkbox'
              name='requireLogin'
              id='requireLogin'
              checked={enlace.requireLogin || false}
              onChange={handleChange}
              className='label__checkbox'
            />
            <span>Requiere Login</span>
          </label>
          
          <button type='submit' className='config-link__submit'>Guardar configuración</button>
        </fieldset>
      </form>
    </main>
  
  );
};

export default ConfigurarLink;
