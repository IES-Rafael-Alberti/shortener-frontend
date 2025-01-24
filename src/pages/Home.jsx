import axios from "axios";
import useUserStore from "../stores/useUserStore";
import { useState } from "react";

const Home = () => {
  const user = useUserStore((state) => state.user);
  const [enlace, setEnlace] = useState(null);
  const [urlInput, setUrlInput] = useState(""); // Estado para manejar el valor del input

  const handlerVolver = () => {
    setEnlace(null);
    setUrlInput(""); // Restablece el valor del input
  };

  const handlerGenerarEnlace = async () => {
    if (user.token) {
      try {
        const urlEncodedData = new URLSearchParams();
        urlEncodedData.append("url", urlInput);

        const response = await axios.post("http://localhost:3000/link", urlEncodedData, {
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

        const response = await axios.post("http://localhost:3000/link", urlEncodedData, {
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
  };

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
