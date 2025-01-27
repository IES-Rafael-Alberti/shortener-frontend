import { useParams } from "react-router";
import { useState } from "react";

const ConfigurarLink = () => {
  const { id } = useParams(); // Obtenemos el 'id' desde la URL
  const [formData, setFormData] = useState({
    password: "",
    recaptcha: false,
    dateActivation: "",
    dateExpiration: "",
    requireLogin: false,
  });

  // Función para manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    console.log("Datos del formulario:", formData); // Imprime los datos en la consola
    alert("Formulario enviado correctamente. Revisa la consola para ver los datos.");
  };

  return (
    <div>
      <h2>Configurar Enlace</h2>
      <p>ID del enlace: {id}</p>
      <form onSubmit={handleSubmit}>
        <label>
          Contraseña:
          <input
            type="text"
            name="password"
            id="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
          />
        </label>

        <label>
          <input
            type="checkbox"
            name="recaptcha"
            id="recaptcha"
            checked={formData.recaptcha}
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
            value={formData.dateActivation}
            onChange={handleChange}
          />
        </label>

        <label>
          Fecha de Expiración:
          <input
            type="date"
            name="dateExpiration"
            id="dateExpiration"
            value={formData.dateExpiration}
            onChange={handleChange}
          />
        </label>

        <label>
          <input
            type="checkbox"
            name="requireLogin"
            id="requireLogin"
            checked={formData.requireLogin}
            onChange={handleChange}
          />
          <span>Requiere Login</span>
        </label>

        <button type="submit">Generar enlace</button>
      </form>
    </div>
  );
};

export default ConfigurarLink;
