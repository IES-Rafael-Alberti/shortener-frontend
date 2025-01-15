import useUserStore from "../stores/useUserStore";
import { useNavigate } from "react-router";

const UserProfile = () => {

  const user = useUserStore((state) => state.user);

  const navigate = useNavigate(); // Hook para navegación

  const handleRedirect = (id) => {
    navigate(`/userProfile/linkPage/${id}`); // Redirigir a la página del enlace con el ID
  };

  //Aqui va la peticion a la API
  const enlaces = [
    {
      id: 1,
      nombre: "Google",
      estadisticas: {
        ultimoMes: 1500,
        semana1: 400,
        semana2: 350,
        semana3: 380,
        semana4: 370
      },
      enlaceAcortado: "https://bit.ly/google-link",
      qr: null
    },
    {
      id: 2,
      nombre: "GitHub",
      estadisticas: {
        ultimoMes: 800,
        semana1: 200,
        semana2: 180,
        semana3: 210,
        semana4: 210
      },
      enlaceAcortado: "https://bit.ly/github-link",
      qr: null
    },
    {
      id: 3,
      nombre: "YouTube",
      estadisticas: {
        ultimoMes: 2000,
        semana1: 500,
        semana2: 520,
        semana3: 480,
        semana4: 500
      },
      enlaceAcortado: "https://bit.ly/youtube-link",
      qr: null
    }
  ];

  return (
      <main className="userProfile">
        <span className="container">
          <h1 className="userProfile__title">Perfil del usuario</h1>
          <section aria-labelledby="user-email" className="userProfile__user">
            <h2 className="user__user" id="user-email">{user.email}</h2>
          </section>
        </span>
      
        <section aria-labelledby="user-links" className="userProfile__links">
          <h2 id="user-links" className="links__title">Mis enlaces</h2>
          <ul className="links__list">
            {enlaces.map((enlace) => (
              <li className="list__element" key={enlace.id}>
                <h3 className="element__name">{enlace.nombre}</h3>

                <span className="buttons">
                  <button 
                    className="element__button"
                    onClick={() => handleRedirect(enlace.id)} 
                    aria-label={`Consultar el enlace ${enlace.nombre}`}
                  >
                    Consultar
                  </button>

                  <button 
                    className="element__buttonPort"
                    onClick={() => navigate("/portfolio")} 
                    aria-label={`Consultar el enlace ${enlace.nombre}`}
                  >
                    Añadir al portfolio
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>    
  )
}

export default UserProfile
