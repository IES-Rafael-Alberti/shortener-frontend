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
  )
}

export default Portfolio
