import {useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
// Se importa la librería QRCode para generar los códigos QR
import {QRCodeSVG} from "qrcode.react";
import {Bar} from "react-chartjs-2";
import useUserStore from "../stores/useUserStore";

import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from "chart.js";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

    const {id} = useParams();
    const user = useUserStore((state) => state.user);
    const [qr, setQr] = useState(false);
    const navigate = useNavigate();

    const [statistics , setStatistics] = useState({
        lastMonth: null, week1: null, week2: null, week3: null, week4: null
    });
    const [enlace, setEnlace] = useState({});
    const [visits, setVisits] = useState([]);

    useEffect(() => {

        axios.get(`${import.meta.env.VITE_API}/link/${id}/visit`, {
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        }).then((response) => {
            setVisits(response.data);
        });

        axios.get(`${import.meta.env.VITE_API}/link/${id}`, {
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        }).then((response) => {
            setEnlace(response.data);
        });

        const today = new Date();
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const monthVisits = visits.filter((visit) => new Date(visit.date) > lastMonth);

        const weekStarts = [new Date(today.setDate(today.getDate() - 21)), new Date(today.setDate(today.getDate() + 7)), new Date(today.setDate(today.getDate() + 7)), new Date(today.setDate(today.getDate() + 7))];


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

        setStatistics({
            lastMonth: monthVisits.length,
            week1: weekVisits[0],
            week2: weekVisits[1],
            week3: weekVisits[2],
            week4: weekVisits[3],
        });
    }, [visits.length]);


    /**
     * Maneja el evento de generar un código QR para el enlace.
     *
     * @function
     * @memberof LinkPage
     * @param {Event} e - Evento de click en el botón de generar QR.
     * */
    const handlerGenerateLink = (e) => {
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

        navigate("/" + code)

    }

    const chartData = {
        labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"], datasets: [{
            label: "Clicks por semana",
            data: [statistics.week1, statistics.week2, statistics.week3, statistics.week4],
            backgroundColor: "#DA0037",
            borderColor: "#620019",
            borderWidth: 1
        },],
    };

    const chartOptions = {
        responsive: true, plugins: {
            legend: {
                display: false, position: "top", labels: {
                    color: "#EDEDED", font: {
                        size: 14,
                    }
                }
            }, title: {
                display: false, text: "Estadísticas semanales de clics",
            },
        }, scales: {
            x: {
                ticks: {
                    color: "#EDEDED", // Cambia el color de las etiquetas del eje X
                },
            }, y: {
                beginAtZero: true, ticks: {
                    color: "#EDEDED", callback: function (value) {
                        return Number.isInteger(value) ? value : Math.round(value);
                    }, stepSize: 100,
                },
            },
        },
    };
    return (

        <main className="linkPage">
            <h1 className="linkPage__title" id="enlace-title">{import.meta.env.VITE_DOMAIN + "/" + enlace.code}</h1>
            <section className="linkPage__statistics" aria-labelledby="statistics-title">
                <h2 id="statistics-title" className="statistics__title">Estadísticas</h2>
                <span className="statistics__gridContainer">
      <p className="statistics__shortenedLink">Enlace acortado: <a onClick={() => handlerVisit(enlace.code)}
                                                                   target="_blank"
                                                                   rel="noopener noreferrer">{import.meta.env.VITE_DOMAIN + "/" + enlace.code}</a></p>
      
      <p className="statistics__item">Último mes: <span>{statistics.lastMonth}</span></p>

      <section className="statistics__chart" aria-labelledby="chart-title">
          
          <h3 id="chart-title" className="chart__title">Gráfica de clics por semana</h3>
          <Bar data={chartData} options={chartOptions}/>
        </section>

      <section className="statistics__qr" aria-labelledby="qr-title">
            <h2 id="qr-title" className="qr__title">Código QR</h2>
          {qr ? (<div className="qr__generated">
              <QRCodeSVG value={import.meta.env.VITE_DOMAIN + "/" + enlace.code} size={256}/>
          </div>) : (<button
              className="qr__generateButton"
              onClick={handlerGenerateLink}
              aria-describedby="qr-description"
          >
              Generar QR
          </button>)}
          {!qr && <p id="qr-description" className="qr__description">Presiona para generar un código QR para este
              enlace</p>}
          </section>

      </span>
            </section>
        </main>);
};

export default LinkPage;
