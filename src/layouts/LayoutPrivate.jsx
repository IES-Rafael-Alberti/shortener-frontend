import { Navigate, Outlet } from "react-router";
import useUserStore from "../stores/useUserStore";
import Header from "../components/Header";
import Footer from "../components/Footer";

/**
 * Componente de diseño para rutas privadas.
 * 
 * Este componente se asegura de que solo los usuarios autenticados puedan acceder a las rutas privadas.
 * Si el usuario no está autenticado (sin token), lo redirige a la página de inicio de sesión.
 * Si el usuario está autenticado, renderiza el `Header`, el contenido de la ruta (`Outlet`), y el `Footer`.
 * 
 * @component
 * @returns {JSX.Element} El diseño de las rutas privadas con un `Header`, el contenido de la ruta (`Outlet`) y un `Footer`.
 * 
 */
const LayoutPrivate = () => {
    /**
     * Estado global del usuario. Contiene el token de autenticación.
     * @type {{ token: string }}
     * @memberof LayoutPrivate
     */
    const user = useUserStore((state) => state.user);

    /**
     * Si el usuario no está autenticado, redirige a la página de login.
     * 
     * @returns {JSX.Element} Un componente `Navigate` que redirige a la página de login.
     * @memberof LayoutPrivate
     */
    if (!user.token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
};

export default LayoutPrivate;
