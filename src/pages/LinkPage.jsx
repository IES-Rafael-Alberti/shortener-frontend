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
    <main className="linkPage">
      <h1 className="linkPage__title" id="enlace-title">{enlace.nombre}</h1>

      <section className="linkPage__statistics" aria-labelledby="statistics-title">
        <h2 id="statistics-title" className="statistics__title">Estadísticas</h2>
        <span className="statistics__gridContainer">
          <p className="statistics__shortenedLink">Enlace acortado: <a href={enlace.enlaceAcortado} target="_blank" rel="noopener noreferrer">{enlace.enlaceAcortado}</a></p>
          <p className="statistics__item">Último mes: <span>{enlace.estadisticas.ultimoMes}</span></p>
          <ul className="statistics__list">
            <li className="list__item">Semana 1: <span>{enlace.estadisticas.semana1}</span></li>
            <li className="list__item">Semana 2: <span>{enlace.estadisticas.semana2}</span></li>
            <li className="list__item">Semana 3: <span>{enlace.estadisticas.semana3}</span></li>
            <li className="list__item">Semana 4: <span>{enlace.estadisticas.semana4}</span></li>
          </ul>
          <section className="statistics__qr" aria-labelledby="qr-title">
            <h2 id="qr-title" className="qr__title">Código QR</h2>
            {enlace.qr ? (
              <div className="qr__generated">
                <QRCodeSVG value={enlace.qr} size={256} aria-label={`Código QR para ${enlace.enlaceAcortado}`} />
              </div>
            ) : (
              <button 
                className="qr__generateButton" 
                onClick={handlerGenerarEnlace} 
                aria-describedby="qr-button"
              >
                Generar QR
              </button>
            )}
            {!enlace.qr && <p id="qr-description" className="qr__description">Presiona para generar un código QR para este enlace</p>}
          </section>
        </span>
      </section>
    </main>
  );
};

export default LinkPage;
