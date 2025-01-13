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
    <div>      
      <h3>{user.email}</h3>

      <div>
        <h2>Mis enlaces</h2>
        <ul>
        {enlaces.map((enlace) =>(
          <li key={enlace.id}>
            <h3>{enlace.nombre}</h3>
            <button onClick={() => handleRedirect(enlace.id)}>Consultar</button>
          </li>
        ))}
        </ul>
      </div>
    </div>
  )
}

export default UserProfile
