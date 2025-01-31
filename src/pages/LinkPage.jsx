import { useParams } from "react-router";
import { useEffect, useState } from "react";
// Se importa la librería QRCode para generar los códigos QR
import { QRCodeSVG } from "qrcode.react";
import { Bar } from "react-chartjs-2";
import useUserStore from "../stores/useUserStore";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { useNavigate } from "react-router";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Página para visualizar las estadísticas de un enlace acortado.
 * 
 * Este componente muestra las estadísticas de un enlace acortado, incluyendo el número de clics
 * en el último mes y por semana, así como un gráfico de barras con los clics por semana.
 * 
 * @component
 * @returns {JSX.Element} La página de estadísticas de un enlace acortado. 
 * */

const LinkPage = () => {

  const { id } = useParams();
  const user = useUserStore((state) => state.user);
  const [ qr, setQr ] = useState(false);
  const navigate = useNavigate();

  const [estadisticas, setEstadisticas] = useState({
    ultimoMes: null,
    semana1: null,
    semana2: null,
    semana3: null,
    semana4: null
  });
  const [ enlace, setEnlace ] = useState({}); 
  const [ visits, setVisits ] = useState([]);

  useEffect(() => {

    /*
    * Obtiene los datos de las visitas del enlace desde la API y actualiza el estado.
    *
    * @async
    * @memberof LinkPage
    * @function fetchVisits
    * @returns {Promise<void>} Actualiza el estado con la información de las visitas.
    * */
    const fetchVisits = async () => {
      const response = await axios.get(`${import.meta.env.VITE_API}/link/${id}/visit`,
      { headers: { 
        "Authorization": `Bearer ${user.token}`
    } }
  );
  setVisits(response.data);
  }

    /*
    * Obtiene los datos del enlace desde la API y actualiza el estado.
    *
    * @async
    * @memberof LinkPage
    * @function fetchEnlace
    * @returns {Promise<void>} Actualiza el estado con la información del enlace.
    * */
    const fetchEnlace = async () => {
      const response = await axios.get(`${import.meta.env.VITE_API}/link/${id}`,
      { headers: { 
        "Authorization": `Bearer ${user.token}`
    } }
  );
      setEnlace(response.data);
      
    }

    
  

    fetchEnlace();
    fetchVisits();
    
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const monthVisits = visits.filter((visit) => new Date(visit.date) > lastMonth);

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
  }, [visits.length]); 


  /** 
   * Maneja el evento de generar un código QR para el enlace.
   *  
   * @function
   * @memberof LinkPage
   * @param {Event} e - Evento de click en el botón de generar QR.
   * */
  const handlerGenerarEnlace = (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    setQr(true); // Actualizar el estado para mostrar el código QR
  };
  
  /**
   * Maneja el evento de visitar el enlace acortado.
   *  
   * @function
   * @memberof LinkPage
   * @param {string} code - Código del enlace acortado.
   * */
  const handlerVisit = (code) => {

    navigate("/"+code)
  
  }

  const chartData = {
    labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
    datasets: [
      {
        label: "Clicks por semana",
        data: [
          estadisticas.semana1,
          estadisticas.semana2,
          estadisticas.semana3,
          estadisticas.semana4
        ],
        backgroundColor: "#DA0037",
        borderColor: "#620019",
        borderWidth: 1
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
      <h1 className="linkPage__title" id="enlace-title">{import.meta.env.VITE_DOMAIN+"/"+enlace.code}</h1>
      <section className="linkPage__statistics" aria-labelledby="statistics-title">
      <h2 id="statistics-title" className="statistics__title">Estadísticas</h2>
      <span className="statistics__gridContainer">
      <p className="statistics__shortenedLink">Enlace acortado: <a onClick={() => handlerVisit(enlace.code)} target="_blank" rel="noopener noreferrer">{import.meta.env.VITE_DOMAIN+"/"+enlace.code}</a></p>
      
      <p className="statistics__item">Último mes: <span>{estadisticas.ultimoMes}</span></p>

      <section className="statistics__chart" aria-labelledby="chart-title">
          
          <h3 id="chart-title" className="chart__title">Gráfica de clics por semana</h3>
          <Bar data={chartData} options={chartOptions} />
        </section>

      <section className="statistics__qr" aria-labelledby="qr-title">
            <h2 id="qr-title" className="qr__title">Código QR</h2>
            {qr ? (
              <div className="qr__generated">
                <QRCodeSVG value={import.meta.env.VITE_DOMAIN+"/"+enlace.code} size={256}/>
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
            {!qr && <p id="qr-description" className="qr__description">Presiona para generar un código QR para este enlace</p>}
          </section>

      </span>
      </section>
    </main>
  );
};

export default LinkPage;
