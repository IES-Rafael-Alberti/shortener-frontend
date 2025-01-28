import { useParams } from "react-router";
import axios from "axios";
import useUserStore from "../stores/useUserStore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import React from "react";

const Passthrough = () => {
  const { id } = useParams();
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const [reasons, setReasons] = useState({
    password: null,
    recaptcha: null,
  });
    const recaptchaRef = React.createRef();
  



  const obtenerEnlace = async (code) => {
    const response = await axios.get(`http://localhost:3000/passthrough/${code}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      validateStatus: (status) => status === 403 || status === 200 || status === 404,
    });

    

    if (response.status === 403) {
      const { reasons: serverReasons } = response.data;
      console.log(serverReasons)
      if (
        serverReasons.includes("dateActivation") ||
        serverReasons.includes("dateExpiration") ||
        serverReasons.includes("invalid_password")
      ) {
        Swal.fire({
          title: "Hay alguna protección en el enlace",
          icon: "error",
          text: serverReasons.join(", "),
          customClass: {
            popup: "swal__popup",
            title: "swal__title",
            icon: "swal__icon",
            confirmButton: "swal__confirm-button",
          },
        }).then(() => {
          navigate("/");
        });
      } else if (serverReasons.includes("requireLogin")) {
        console.log("login")
        Swal.fire({
          title: "Hay alguna protección en el enlace",
          icon: "error",
          text: serverReasons.join(", "),
          customClass: {
            popup: "swal__popup",
            title: "swal__title",
            icon: "swal__icon",
            confirmButton: "swal__confirm-button",
          },
        }).then(() => {
          navigate("/login");
        });
      } else {
        if (serverReasons.includes("password")) {
          setReasons((prevReasons) => ({
            ...prevReasons,
            password: true,
          }));
          console.log(reasons);
        }
        if (serverReasons.includes("recaptcha")){
            setReasons((prevReasons) => ({
                ...prevReasons,
                recaptcha: true,
              }));
        }
        console.log(reasons);

        Swal.fire({
          title: "Hay alguna protección en el enlace",
          icon: "warning",
          text: serverReasons.join(", "),
          customClass: {
            popup: "swal__popup",
            title: "swal__title",
            icon: "swal__icon",
            confirmButton: "swal__confirm-button",
          },
        });
      }
    } else if (response.status === 404) {
      Swal.fire({
        title: "Enlace no encontrado",
        icon: "error",
        customClass: {
          popup: "swal__popup",
          title: "swal__title",
          icon: "swal__icon",
          confirmButton: "swal__confirm-button",
        },
      }).then(() => {
        navigate("/");
      });
    }
    else if (response.status === 200){
        window.location.href = response.data.url;
    }
  };

  useEffect(() => {
    obtenerEnlace(id); // Llamar a la función solo cuando el componente se monte
  }, [id]); // Solo se ejecutará cuando cambie el parámetro `id`


const handleSubmit = async (e) => {
  e.preventDefault();

  
  // Codificar los datos como x-www-form-urlencoded
  const data = new URLSearchParams();
  data.append("password", "123456");

  console.log(data)

  try {
    const response = await axios.get(`http://localhost:3000/passthrough/${id}`, data,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        validateStatus: (status) => status === 403 || status === 200,
      }
    );

    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
};

  

  return <div>


<form action="submit">
    {reasons.password && 
    <form>
        <label htmlFor="">Contraseña</label>
        <input type="text" value="123456"></input>
        <button onClick={handleSubmit}>hola</button>
    </form>}
    {reasons.recaptcha &&
    <ReCAPTCHA
    ref={recaptchaRef}
    sitekey="6LchHbgqAAAAAMaYK9S_kHPDzHsRdEd7atXMMAEz"
  />
    }



</form>
  </div>;
};

export default Passthrough;

