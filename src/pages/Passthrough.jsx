import { useParams } from "react-router";
import axios from "axios";
import useUserStore from "../stores/useUserStore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

/**
 * Componente para redirigir a un enlace.
 * 
 * Este componente permite redirigir a un enlace, si esta protegido solicita la contraseña o reCAPTCHA.
 * 
 * @component
 * @returns {JSX.Element} Formulario para ingresar la contraseña o reCAPTCHA.
 * */
const Passthrough = () => {
  const { id } = useParams();
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const [reasons, setReasons] = useState({
    password: null,
    recaptcha: null,
  });
  const [password, setPassword] = useState("");
  const recaptchaRef = useRef();
  //console.log(recaptchaRef.current.getValue());

  /**
   * Obtiene el enlace desde la API y redirige a la URL.
   * 
   * @async
   * @function
   * @memberof Passthrough
   * @param {string} code - Código del enlace.
   * */
  const obtenerEnlace = async (code) => {
    const response = await axios.get(`${import.meta.env.VITE_API}/passthrough/${code}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      validateStatus: (status) => status === 403 || status === 200 || status === 404,
    });
    

    if (response.status === 403) {
      const { reasons: serverReasons } = response.data;

      if (
        serverReasons.includes("dateActivation") ||
        serverReasons.includes("dateExpiration") ||
        serverReasons.includes("invalid_password")
      ) {
        Swal.fire({
          title: "Hay alguna protección en el enlace",
          icon: "error",
          text: serverReasons.join(", "),
        }).then(() => {
          navigate("/");
        });
      } else if (serverReasons.includes("requireLogin")) {
        Swal.fire({
          title: "Debes iniciar sesión",
          icon: "error",
          text: serverReasons.join(", "),
        }).then(() => {
          navigate("/login");
        });
      } else {
        if (serverReasons.includes("password")) {
          setReasons((prevReasons) => ({
            ...prevReasons,
            password: true,
          }));
        }
        if (serverReasons.includes("recaptcha")) {
          setReasons((prevReasons) => ({
            ...prevReasons,
            recaptcha: true,
          }));
        }

        Swal.fire({
          title: "Hay protecciones en el enlace",
          icon: "warning",
          text: serverReasons.join(", "),
        });
      }
    } else if (response.status === 404) {
      Swal.fire({
        title: "Enlace no encontrado",
        icon: "error",
      }).then(() => {
        navigate("/");
      });
    } else if (response.status === 200) {
      window.location.href = response.data.url;
    }
  };


  useEffect(() => {
    obtenerEnlace(id);
  }, [id]);


  /**
   * Realiza una solicitud a la API para redirigir al enlace.
   * 
   * 
   * @async
   * @function
   * @memberof Passthrough
   * @param {Event} e - Evento de envío del formulario.
   * */
const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    if (reasons.password && !reasons.recaptcha) {
      const response = await axios.get(`${import.meta.env.VITE_API}/passthrough/${id}?password=${password}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        validateStatus: (status) => status === 403 || status === 200,
      });

      if (response.status === 200) {
        window.location.href = response.data.url;
      } 
      else if (response.status === 403) {
          Swal.fire({
            title: "Contraseña incorrecta",
            icon: "error",
          });
        
    }
    } else if (!reasons.password && reasons.recaptcha) {
      const response = await axios.get(`${import.meta.env.VITE_API}/passthrough/${id}?recaptcha=${recaptchaRef.current.getValue()}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        validateStatus: (status) => status === 403 || status === 200,
      });

      if (response.status === 200) {
        window.location.href = response.data.url;
      }
      else if (response.status === 403) {
        Swal.fire({
          title: "Recaptcha incorrecto",
          icon: "error",
        });
      }
      

    } else if (reasons.password && reasons.recaptcha){
      const response = await axios.get(`${import.meta.env.VITE_API}/passthrough/${id}?password=${password}&recaptcha=${recaptchaRef.current.getValue()}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        validateStatus: (status) => status === 403 || status === 200,
      });
      if (response.status === 200) {
        window.location.href = response.data.url;
    }
    else if (response.status === 403) {
      Swal.fire({
        title: "Recaptcha o contraseña incorrectos",
        icon: "error",
      });
      recaptchaRef.current.reset();
    }
  }

    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  };

 
  return (
    <div>
      <form>
        {reasons.password && (
          <div>
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}
        {reasons.recaptcha && (
          <ReCAPTCHA ref={recaptchaRef} sitekey={import.meta.env.VITE_SITE_KEY_REPACTCHA} />
        )}


        {(reasons.recaptcha || reasons.password) && (
          <button type="button" onClick={handleSubmit}>
          Enviar
        </button>
        )}

      </form>
    </div>
    /*<main className='passth'>
      <h2 className='passth__title'>Formulario</h2>
      
      <form className='passth__form' onSubmit={handleSubmit} aria-labelledby='passth-title'>
        <fieldset className='form__fieldset'>
          <legend className='visually-hidden'>Formulario</legend>
          
          {reasons.password && (
            <label className='fieldset__label'>Contraseña
              <input
                type='password'
                placeholder='Contraseña'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='label__input'
              />
            </label>
          )}
          
          {reasons.recaptcha && (
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_SITE_KEY_REPACTCHA}
            />
          )}
          
          {(reasons.recaptcha || reasons.password) && (
            <button type='submit' className='signup__submit'>
              Enviar
            </button>
          )}
        </fieldset>
      </form>
    </main>
   */
  );
};

export default Passthrough;