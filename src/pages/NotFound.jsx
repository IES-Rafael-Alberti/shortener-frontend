import { NavLink } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";

const NotFound = () => {
  return (
    <main className = 'notFound'>
      <section className="notFound__section">
        <h1 className="section__title">Shortener</h1>
        <p className="section__error">ERROR 404</p>
        <p className="section__description">Lo sentimos. Esta página no existe o no está disponible en este momento.</p>
        <p className="section__backHome">
          <NavLink className="backHome__Link" to="/">
            <FontAwesomeIcon className="right" icon={faArrowRightLong} />
            <span>VOLVER</span> 
            <FontAwesomeIcon icon={faArrowLeftLong} />
          </NavLink>
        </p>
      </section>
    </main>
  )
}

export default NotFound
