import { useParams } from "react-router";
import { useState } from "react";
// Se importa la librería QRCode para generar los códigos QR
// Librería añadida para generar códigos QR
import { QRCodeSVG } from "qrcode.react";

const LinkPage = () => {
  const { id } = useParams();

  // Si el ID no es igual a "1", mostramos un mensaje indicando que la API no está funcional.
  if (id !== "1") {
    return <div>La API no está todavía funcional</div>;
  }

  // Estado para manejar los datos del enlace
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
    enlaceAcortado: "https://es.wikipedia.org/wiki/Roma", // Enlace acortado
    qr: null // Inicialmente el QR está en null (no generado)
  });

  // Función para generar el código QR cuando el usuario hace clic en el botón
  const handlerGenerarEnlace = (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    setEnlace({
      ...enlace, // Mantenemos los otros datos del enlace
      qr: enlace.enlaceAcortado // Establecemos el enlace acortado como valor del QR
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
      {/* Verificamos si el enlace tiene un QR generado */}
      {enlace.qr ? (
        // Si ya tiene un QR generado, lo mostramos
        <QRCodeSVG value={enlace.qr} size={256} /> // Se pasa el enlace acortado al componente QRCode
      ) : (
        // Si no tiene QR generado, mostramos un botón para generarlo
        <button onClick={handlerGenerarEnlace}>Generar enlace</button>
      )}
    </div>
  );
};

export default LinkPage;
