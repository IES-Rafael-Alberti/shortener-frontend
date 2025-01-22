import { useParams } from "react-router"
import links from "../data/links.json"
import { useState, useEffect } from "react"

const Portfolio = () => {

  const { id } = useParams()

  const [enlacesPortfolio, setEnlacesPortfolio] = useState([])

  useEffect(() => {
      const enlacesPortfolio = links.filter((link) => link.author == id).filter((link) => link.linktree);
      setEnlacesPortfolio(enlacesPortfolio);
    
  }, [id]);
 

  return (
    /*
    <div>
      
      <h1>Portfolio</h1>
      <ul>
        {enlacesPortfolio.map((enlace) => (
          <li key={enlace.id}>
            <a href={enlace.url} target="_blank" rel="noreferrer">{enlace.shorter}</a>
          </li>
        ))}
      </ul>
    </div>
    */
    <main className = 'portfolio'>
      <section className = 'portfolio__section' aria-labelledby="portfolio-title">
        <h1 className = 'section__title' id="portfolio-title">Portfolio</h1>
        <ul className = 'section__list'>
          {enlacesPortfolio.map((enlace) => (
            <li className = 'list__element' key={enlace.id}>
              <a 
                className = 'element__link'
                href={enlace.url} 
                target="_blank" 
                rel="noreferrer" 
                aria-label={`Abrir el proyecto ${enlace.shorter} en una nueva ventana`}
              >
                {enlace.shorter}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default Portfolio
