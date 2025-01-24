import { useEffect, useState } from "react";
import useUserStore from "../stores/useUserStore";
import { useNavigate } from "react-router";
import fetchMe from "../utils/fetchMe";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const UserProfile = () => {
  const [userData, setUserData] = useState({email: ""}); // Inicializamos el estado con un objeto vacío 
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate(); // Hook para navegación
  const [enlaces, setEnlaces] = useState([]); // Inicializamos el estado como un array vacío

  // Verificamos si el user está disponible antes de proceder
  useEffect(() => {
    if (!user) {
      return;
    }
    const fetchUserData = async () => {
      const data = await fetchMe(user.token); // Llamamos a la función fetchMe con el token del user
      setUserData(data); // Actualizamos el estado con los datos del user
    }
    const fetchLinks = async () => {
      const response = await axios.get("http://localhost:3000/link", {
        headers: {
          "Authorization": `Bearer ${user.token}`
        }
      });
      setEnlaces(response.data); // Actualizamos el estado con los enlaces del user
    }

    fetchLinks();
    console.log(enlaces)

    fetchUserData();
}, [user]); // Recorremos los enlaces cuando el user cambia

  const handleRedirect = (id) => {
    navigate(`/userProfile/linkPage/${id}`); // Redirigir a la página del enlace con el ID
  };

  const handlePortfolio = (id) => {
    const enlace = enlaces.filter((link) => link.code === id)[0];
    if (enlace.portfolio) {
      enlace.portfolio = false;
    } else {
      enlace.portfolio = true;
    }
    setEnlaces([...enlaces]);

    axios.put(`http://localhost:3000/link/${id}`, {portfolio: enlace.portfolio}, {
      headers: { "Authorization": `Bearer ${user.token}` }
    });
    console.log(enlaces);
  };

  const handlerEliminar = (id) => {
    axios.delete(`http://localhost:3000/link/${id}`, {
      headers: { "Authorization": `Bearer ${user.token}` }
    });
    setEnlaces(enlaces.filter((enlace) => enlace.code !== id));
  };

  console.log(userData);

  if (!user) {
    return <div>Cargando perfil...</div>; // Agregamos un mensaje de carga si el user no está disponible
  }

  return (
    <main className="userProfile">
      <span className="container">
        <h1 className="userProfile__title">Perfil del usuario</h1>
        <section aria-labelledby="user-email" className="userProfile__user">
          <h2 className="user__user" id="user-email">{userData.email}</h2>
        </section>
      </span>

      <section aria-labelledby="user-links" className="userProfile__links">
        <h2 id="user-links" className="links__title">Mis enlaces</h2>
        {enlaces.length > 0 ? (
          <ul className="links__list">
            {enlaces.map((enlace) => (
              <li className="list__element" key={enlace.code}>
                <h3 className="element__name">{import.meta.env.VITE_DOMAIN+"/"+enlace.code}</h3>
                
                <button onClick={() => handlerEliminar(enlace.code)} className="element__delete" aria-label="close"><FontAwesomeIcon className="hover__icon" icon={faXmark} /></button>

                <span className="buttons">
                  <button 
                    className="element__button"
                    onClick={() => handleRedirect(enlace.code)} 
                    aria-label={`Consultar el enlace ${import.meta.env.VITE_DOMAIN+"/"+enlace.code}`}
                  >
                    Consultar
                  </button>

                  {enlace.portfolio ? (
                  <button 
                    className="element__buttonPort" 
                    onClick={() => handlePortfolio(enlace.code)} 
                    aria-label={`Añadir el enlace ${enlace.code} al portfolio`}
                  >
                    Eliminar del portfolio
                  </button>
                ) : (
                  <button 
                    className="element__buttonPort" 
                    onClick={() => handlePortfolio(enlace.code)} 
                    aria-label={`Añadir el enlace ${enlace.code} al portfolio`}
                  >
                    Añadir al portfolio
                  </button>
                )}

                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tienes enlaces.</p> // Mensaje si no hay enlaces disponibles
        )}
      </section>
    </main>    
  );
};


export default UserProfile;
