import { useParams } from "react-router";
import { useState } from "react";
// Se importa la librería QRCode para generar los códigos QR
import { QRCodeSVG } from "qrcode.react";
// Importamos componentes y configuración de react-chartjs-2
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Definimos el plugin personalizado
const pluginBackground = {
  id: "customCanvasBackgroundColor",
  beforeDraw: (chart) => {
    const ctx = chart.canvas.getContext("2d");
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "#171717"; // Fondo personalizado
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
};

// Registramos los elementos necesarios y el plugin personalizado
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, pluginBackground);

const LinkPage = () => {
  const { id } = useParams();

  if (id !== "1") {
    return <div>La API no está todavía funcional</div>;
  }

  const [enlace, setEnlace] = useState({
    id: 1,
    nombre: "Google",
    estadisticas: {
      ultimoMes: 6,
      semana1: 1,
      semana2: 1,
      semana3: 3,
      semana4: 1,
    },
    enlaceAcortado: "https://es.wikipedia.org/wiki/Roma",
    qr: null,
  });

  const handlerGenerarEnlace = (e) => {
    e.preventDefault();
    setEnlace({
      ...enlace,
      qr: enlace.enlaceAcortado,
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
                <QRCodeSVG value={enlace.qr} size={256} aria-label={`Código QR para ${enlace.enlaceAcortado}`} />
              </div>
            ) : (
              <span>
                <button 
                  className="qr__generateButton" 
                  onClick={handlerGenerarEnlace} 
                  aria-describedby="qr-button"
                >
                  Generar QR
                </button>
                <p id="qr-description" className="qr__description">Presiona para generar un código QR para este enlace</p>
              </span>
            )}
          </section>
        </span>
      </section>
    </main>
  );
};

export default LinkPage;
