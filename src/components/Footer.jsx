import { NavLink } from "react-router";
import fetchMe from "../utils/fetchMe";
import useUserStore from "../stores/useUserStore";
import { useEffect, useState } from "react";

const Footer = () => {
    const [userData, setUserData] = useState({ email: "" });
    const user = useUserStore((state) => state.user);

    useEffect(() => {
        if (user.token) {
            const fetchUserData = async () => {
                const data = await fetchMe(user.token); // Llamamos a la función fetchMe con el token del user
                setUserData(data); // Actualizamos el estado con los datos del user
            }
            fetchUserData();
        }
    },[])

    return (
        <footer className="footer">
            {user.token && <NavLink className="footer__link" to={"/portfolio/"  + userData._id}>Portfolio</NavLink>}
        </footer>
    );
};

export default Footer;