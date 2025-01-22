import axios from "axios";
import useUserStore from "../stores/useUserStore";

const Home = () => {

  const user = useUserStore((state) => state.user);


  const handlerGenerarEnlace = async () => {
    if(user.token){

      try {

        const urlEncodedData = new URLSearchParams();
        urlEncodedData.append("url", document.getElementById("url").value);
        
        const response = await axios.post("http://localhost:3000/link", urlEncodedData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${user.token}`
          }
        });
        document.getElementById("url").value = import.meta.env.VITE_DOMAIN+"/"+response.data.code;
        console.log(user.token);
      }

      catch (error) {
        console.error(error);
      }
    }
    else {
      console.log("Debe iniciar sesión");
    }
  }


  return (
    <main className="home">
      <h1 className="home__title">Introduzca su enlace</h1>
      <input type="url" name="url" id="url" className="home__input"/>
      <button className="home__button" onClick={() => handlerGenerarEnlace()}>Generar enlace</button>
    </main>
  )
}

export default Home
