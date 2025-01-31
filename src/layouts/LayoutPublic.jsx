import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

/**
 * Layout para las páginas públicas de la aplicación.
 * 
 * Este componente define una estructura común para las páginas públicas,
 * incluyendo un encabezado (`Header`), un pie de página (`Footer`) y un espacio
 * dinámico (`Outlet`) donde se renderizará el contenido de las rutas públicas.
 * 
 * @component
 * @returns {JSX.Element} La estructura del layout público con header, footer y outlet.
 * 
 */
const LayoutPublic = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default LayoutPublic;
