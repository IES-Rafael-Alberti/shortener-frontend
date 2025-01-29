import { useNavigate, useParams } from "react-router"
import { useState, useEffect } from "react"
import axios from "axios"
//import useUserStore from "../stores/useUserStore"

const Portfolio = () => {

  const { id } = useParams()

  const navigate = useNavigate()

  const [enlacesPortfolio, setEnlacesPortfolio] = useState([])

  //const user = useUserStore((state) => state.user);
/*
  const obtenerEnlace = async (code) => {
    if (user.token){
      console.log(user.token)
      const response = await axios.get("http://localhost:3000/passthrough/"+code, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
      
      console.log(response.status)
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
    const fetchPortfolio = async () => {
      console.log(id)
      const response = await axios.get("http://localhost:3000/portfolio/"+id)
      console.log(response.data)
      setEnlacesPortfolio(response.data)
    }

    
    fetchPortfolio()
    
    console.log(enlacesPortfolio)

  }, [id]);

  const handlerVisit = (code) => {

    navigate("/"+code)
  
  }

 

  return (
    
    <main className = 'portfolio'>
      <section className = 'portfolio__section' aria-labelledby="portfolio-title">
        <h1 className = 'section__title' id="portfolio-title">Portfolio</h1>
        <ul className = 'section__list'>
          {enlacesPortfolio && enlacesPortfolio.map((enlace) => (
            <li className = 'list__element' key={enlace.code}>
              <a 
                className = 'element__link' 
                target="_blank" 
                rel="noreferrer" 
                aria-label={`Abrir el proyecto ${import.meta.env.VITE_DOMAIN+"/"+ enlace.code} en una nueva ventana`}
                onClick={() => {handlerVisit(enlace.code)} }
              >
                {import.meta.env.VITE_DOMAIN+"/"+ enlace.code}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default Portfolio
