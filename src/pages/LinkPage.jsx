import { useParams } from "react-router";
import { useEffect, useState } from "react";
// Se importa la librería QRCode para generar los códigos QR
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

  const handlerGenerarEnlace = (e) => {
    e.preventDefault();
    setEnlace({
      ...enlace, // Mantenemos los otros datos del enlace
      qr: enlace.enlaceAcortado // Establecemos el enlace acortado como valor del QR
    });
  };

  const chartData = {
    labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
    datasets: [
      {
        label: "Clicks por semana",
        data: [
          enlace.estadisticas.semana1,
          enlace.estadisticas.semana2,
          enlace.estadisticas.semana3,
          enlace.estadisticas.semana4,
        ],
        backgroundColor: "#DA0037",
        borderColor: "#620019",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top",
        labels: {
          color: "#EDEDED",
          font: {
            size:14,
          }
        }
      },
      title: {
        display: false,
        text: "Estadísticas semanales de clics",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#EDEDED", // Cambia el color de las etiquetas del eje X
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#EDEDED",
          callback: function (value) {
            return Number.isInteger(value) ? value : Math.round(value);
          },
          stepSize: 100,
        },
      },
    },
  };

  return (
    /*
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
      {/* Verificamos si el enlace tiene un QR generado */ /*}
      {enlace.qr ? (
        // Si ya tiene un QR generado, lo mostramos
        <QRCodeSVG value={enlace.qr} size={256} /> // Se pasa el enlace acortado al componente QRCode
      ) : (
        // Si no tiene QR generado, mostramos un botón para generarlo
        <button onClick={handlerGenerarEnlace}>Generar enlace</button>
      )}
    </div>
    */
    <main className="linkPage">
      <h1 className="linkPage__title" id="enlace-title">{enlace.nombre}</h1>

      <section className="linkPage__statistics" aria-labelledby="statistics-title">
        <h2 id="statistics-title" className="statistics__title">Estadísticas</h2>
        <span className="statistics__gridContainer">
          <p className="statistics__shortenedLink">Enlace acortado: <a href={enlace.enlaceAcortado} target="_blank" rel="noopener noreferrer">{enlace.enlaceAcortado}</a></p>
          <p className="statistics__item">Último mes: <span>{enlace.estadisticas.ultimoMes}</span></p>
          <section className="statistics__chart" aria-labelledby="chart-title">
            <h3 id="chart-title" className="chart__title">Gráfica de clics por semana</h3>
            <Bar data={chartData} options={chartOptions} />
          </section>
          <section className="statistics__qr" aria-labelledby="qr-title">
            <h2 id="qr-title" className="qr__title">Código QR</h2>
            {enlace.qr ? (
              <div className="qr__generated">
                <QRCodeSVG value={enlace.qr} size={256}/>
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
