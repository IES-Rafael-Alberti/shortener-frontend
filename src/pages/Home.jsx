import axios from "axios";
import useUserStore from "../stores/useUserStore";
import { useState } from "react";

const Home = () => {

  const user = useUserStore((state) => state.user);

  const [ enlace, setEnlace ] = useState(null);


  const handlerVolver = () => {
    setEnlace(null);
    document.getElementById("url").value = "";
  }


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
      try {
          
          const urlEncodedData = new URLSearchParams();
          urlEncodedData.append("url", document.getElementById("url").value);
          
          const response = await axios.post("http://localhost:3000/link", urlEncodedData, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            }
          });
          document.getElementById("url").value = import.meta.env.VITE_DOMAIN+"/"+response.data.code;
          console.log(user.token);
          setEnlace(response.data.code);
      }
        
        catch (error) {
          console.error(error);
        }
    }
  }


  return (
    <main className="home">
      <h1 className="home__title">Introduzca su enlace</h1>
      <input type="url" name="url" id="url" className="home__input"/>
      {!enlace ? (<button className="home__button" onClick={() => handlerGenerarEnlace()}>Generar enlace</button>)
      : (<button className="home__button" onClick={() => handlerVolver()}>Volver al generador</button>)}
    </main>
  )
}

export default Home
