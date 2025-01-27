import { useParams } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import useUserStore from "../stores/useUserStore";

const ConfigurarLink = () => {
  const { id } = useParams(); // Obtenemos el 'id' desde la URL
  const user = useUserStore((state) => state.user);

  const [enlace, setEnlace] = useState({
    password: "",
    recaptcha: false,
    dateActivation: "",
    dateExpiration: "",
    requireLogin: false,
  });

  // Efecto para cargar los datos del enlace
  useEffect(() => {
    const fetchEnlace = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/link/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        // Ajustar las fechas para los inputs de tipo date
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

  // Función para manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEnlace({
      ...enlace,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/link/${id}`, enlace, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      alert("Enlace actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar el enlace:", error);
    }
  };

  return (
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
  );
};

export default ConfigurarLink;
