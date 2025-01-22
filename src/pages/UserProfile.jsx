import { useEffect, useState } from "react";
import useUserStore from "../stores/useUserStore";
import { useNavigate } from "react-router";
import links from "../data/links.json";

const UserProfile = () => {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate(); // Hook para navegación
  const [enlaces, setEnlaces] = useState([]); // Inicializamos el estado como un array vacío

  // Verificamos si el user está disponible antes de proceder
  useEffect(() => {
    if (user && user.id) {
      const enlaces = links.filter((link) => link.author === user.id);
      setEnlaces(enlaces);
    }
  }, [user]); // Recorremos los enlaces cuando el user cambia

  const handleRedirect = (id) => {
    navigate(`/userProfile/linkPage/${id}`); // Redirigir a la página del enlace con el ID
  };

  const handlePortfolio = (id) => {
    const enlace = enlaces.filter((link) => link.id === id)[0];
    if (enlace.linktree) {
      enlace.linktree = false;
    } else {
      enlace.linktree = true;
    }
    setEnlaces([...enlaces]);
  };

  if (!user) {
    return <div>Cargando perfil...</div>; // Agregamos un mensaje de carga si el user no está disponible
  }

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
        {enlaces.length > 0 ? (
          <ul className="links__list">
            {enlaces.map((enlace) => (
              <li className="list__element" key={enlace.id}>
                <h3 className="element__name">{enlace.shorter}</h3>

                <span className="buttons">
                  <button 
                    className="element__button"
                    onClick={() => handleRedirect(enlace.id)} 
                    aria-label={`Consultar el enlace ${enlace.shorter}`}
                  >
                    Consultar
                  </button>

                  {enlace.linktree ? (
                  <button 
                    className="element__buttonPort" 
                    onClick={() => handlePortfolio(enlace.id)} 
                    aria-label={`Añadir el enlace ${enlace.shorter} al portfolio`}
                  >
                    Eliminar del portfolio
                  </button>
                ) : (
                  <button 
                    className="element__buttonPort" 
                    onClick={() => handlePortfolio(enlace.id)} 
                    aria-label={`Añadir el enlace ${enlace.shorter} al portfolio`}
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
