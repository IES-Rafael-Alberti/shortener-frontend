import { useParams } from "react-router";
import { useEffect, useState } from "react";
// Se importa la librería QRCode para generar los códigos QR
// Librería añadida para generar códigos QR
import { QRCodeSVG } from "qrcode.react";
import linkVisits from "../data/link_visits_100.json";

const LinkPage = () => {
  const { id } = useParams();

  // Si el ID no es igual a "1", mostramos un mensaje indicando que la API no está funcional.
  if (id !== "1") {
    return <div>La API no está todavía funcional</div>;
  }

  const [estadisticas, setEstadisticas] = useState({
    ultimoMes: null,
    semana1: null,
    semana2: null,
    semana3: null,
    semana4: null
  });

  // Estado para manejar los datos del enlace
  const [enlace, setEnlace] = useState({
    id: 1,
    shorter: "Google",
    url: "https://es.wikipedia.org/wiki/Roma", // Enlace acortado
    author: 1,
    date: Date.parse("2024-10-17"),
    linktree: false,
    qr: null // Inicialmente el QR está en null (no generado)
  });

  useEffect(() => {
    const visitsPage = linkVisits.filter((link) => link.link === enlace.url);

    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const monthVisits = visitsPage.filter((visit) => new Date(visit.date) > lastMonth);

    const weekStarts = [
      new Date(today.setDate(today.getDate() - 21)),
      new Date(today.setDate(today.getDate() + 7)), 
      new Date(today.setDate(today.getDate() + 7)), 
      new Date(today.setDate(today.getDate() + 7))
    ];

    const weekVisits = [0, 0, 0, 0]; 

    monthVisits.forEach((visit) => {
      const visitDate = new Date(visit.date);
      for (let i = 0; i < weekStarts.length; i++) {
        if (visitDate < weekStarts[i]) {
          weekVisits[i] += 1;
          break;
        }
      }
    });

    setEstadisticas({
      ultimoMes: monthVisits.length,
      semana1: weekVisits[0],
      semana2: weekVisits[1],
      semana3: weekVisits[2],
      semana4: weekVisits[3],
    });
  }, [id]); 


  // Función para generar el código QR cuando el usuario hace clic en el botón
  const handlerGenerarEnlace = (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    setEnlace({
      ...enlace, // Mantenemos los otros datos del enlace
      qr: enlace.url // Establecemos el enlace acortado como valor del QR
    });
  };

  return (
    <div>
      <h2>{enlace.nombre}</h2>
      <p>Enlace acortado: {enlace.url}</p>
      <p>Estadísticas</p>
      <ul>
        <li>Último mes: {estadisticas.ultimoMes}</li>
        <li>Semana 1: {estadisticas.semana1}</li>
        <li>Semana 2: {estadisticas.semana2}</li>
        <li>Semana 3: {estadisticas.semana3}</li>
        <li>Semana 4: {estadisticas.semana4}</li>
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
