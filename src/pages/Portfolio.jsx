import {useNavigate, useParams} from "react-router"
import {useEffect, useState} from "react"
import axios from "axios"
//import useUserStore from "../stores/useUserStore"

/**
 * Página para visualizar los enlaces de un portfolio.
 *
 * Este componente muestra los enlaces de un portfolio, permitiendo al usuario visitarlos.
 *
 * @component
 * @returns {JSX.Element} La página de visualización de enlaces de un portfolio.
 * */
const Portfolio = () => {

    const {id} = useParams()

    const navigate = useNavigate()

    const [enlacesPortfolio, setEnlacesPortfolio] = useState([])

    //const user = useUserStore((state) => state.user);
    /*
      const obtenerEnlace = async (code) => {
        if (user.token){
    ƒ      const response = await axios.get("http://localhost:3000/passthrough/"+code, {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          })

          return response.data.url
        }
          else{
            const response = await axios.get("http://localhost:3000/passthrough/"+code)
            return response.data.url
          }

      }
    */
    /*const getIPAddress = async () => {
      try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
      } catch (error) {
        console.error('Error obteniendo la IP:', error);
        return null
      }
    };
  */
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API}/portfolio/` + id).then((response) => {
            setEnlacesPortfolio(response.data)
        });
    }, [id]);

    /**
     * Función que maneja la visita a un enlace.
     *
     * @param {string} code - Código del enlace.
     * */
    const handlerVisit = (code) => {

        navigate("/" + code)

    }


    return (

        <main className='portfolio'>
            <section className='portfolio__section' aria-labelledby="portfolio-title">
                <h1 className='section__title' id="portfolio-title">Portfolio</h1>
                <ul className='section__list'>
                    {enlacesPortfolio && enlacesPortfolio.map((enlace) => (
                        <li className='list__element' key={enlace.code}>
                            <a
                                className='element__link'
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`Abrir el proyecto ${import.meta.env.VITE_DOMAIN + "/" + enlace.code} en una nueva ventana`}
                                onClick={() => {
                                    handlerVisit(enlace.code)
                                }}
                            >
                                {import.meta.env.VITE_DOMAIN + "/" + enlace.code}
                            </a>
                        </li>))}
                </ul>
            </section>
        </main>)
}

export default Portfolio
