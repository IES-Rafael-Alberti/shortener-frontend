import { useParams } from "react-router";
import axios from "axios";
import useUserStore from "../stores/useUserStore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

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
  const [recaptcha, setRecaptcha] = useState("");
  //console.log(recaptchaRef.current.getValue());

  const obtenerEnlace = async (code) => {
    const response = await axios.get(`http://localhost:3000/passthrough/${code}`, {
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

  const handleSubmit = async () => {
    try {
      if (!reasons.recaptcha){
      const response = await axios.get(
        `http://localhost:3000/passthrough/${id}?password=${encodeURIComponent(password)}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          validateStatus: (status) => status === 403 || status === 200,
        }
      );
      if (response.status === 200) {
        window.location.href = response.data.url;
      } else if (response.status === 403) {
          Swal.fire({
            title: "Contraseña incorrecta",
            icon: "error",
          });
        
    }
  }

    else if (!reasons.password){
      console.log(recaptchaRef.current);
      console.log(recaptcha)
      const response = await axios.get(`http://localhost:3000/passthrough/${id}?recaptcha=${encodeURIComponent(recaptcha)}`, {
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
      

    }
    else if (reasons.password && reasons.recaptcha){
      "Todo: recaptcha y password"
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
          <ReCAPTCHA ref={recaptchaRef} sitekey={import.meta.env.VITE_SITE_KEY_REPACTCHA} onChange={setRecaptcha} />
        )}

        {(reasons.recaptcha || reasons.password) && (
          <button type="button" onClick={handleSubmit}>
          Enviar
        </button>
        )}

      </form>
    </div>
  );
};

export default Passthrough;