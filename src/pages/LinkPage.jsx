import { useParams } from "react-router";
import { useState } from "react";

const LinkPage = () => {
  const { id } = useParams();

  if (id !== "1") {
    return <div>La API no está todavía funcional</div>;
  }

  // Datos iniciales del enlace
  // Falta la peticion a la api por el id
  const [enlace, setEnlace] = useState({
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
  });

  const handlerGenerarEnlace = (e) => {
    e.preventDefault();
    setEnlace({
      ...enlace,
      qr: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Commons_QR_code.png"
    });
  };

  return (
    <div>
      <h2>{enlace.nombre}</h2>
      <p>Enlace acortado: {enlace.enlaceAcortado}</p>
      <p>Estadísticas</p>
      <ul>
        <li>Último mes: {enlace.estadisticas.ultimoMes}</li>
        <li>Semana 1: {enlace.estadisticas.semana1}</li>
        <li>Semana 2: {enlace.estadisticas.semana2}</li>
        <li>Semana 3: {enlace.estadisticas.semana3}</li>
        <li>Semana 4: {enlace.estadisticas.semana4}</li>
      </ul>
      {enlace.qr ? (
        <img src={enlace.qr} alt="QR" />
      ) : (
        <button onClick={handlerGenerarEnlace}>Generar enlace</button>
      )}
    </div>
  );
};

export default LinkPage;
