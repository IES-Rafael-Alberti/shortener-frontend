
const Home = () => {
  return (
    <main className="home">
      <h1 className="home__title">Introduzca su enlace</h1>
      <input type="url" name="url" id="url" className="home__input"/>
      <button className="home__button">Generar enlace</button>
    </main>
  )
}

export default Home
