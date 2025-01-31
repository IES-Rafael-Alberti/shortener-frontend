import axios from "axios";
import { useUserStore } from "../store/user";

/**
 * Obtiene los datos del usuario.
 * 
 * @async
 * @function
 * @param {string} token - Token de autenticación.
 * @returns {Promise<Object>} Datos del usuario.
 * */
const fetchMe = async (token) => {

    const logout = useUserStore((state) => state.logout);


    try {
        const response = await axios.get(`${import.meta.env.VITE_API}/me`, {
        headers: {
        Authorization: `Bearer ${token}`
        }
    })
    return response.data;
    }
    catch (error) {
        if (error.response.status === 401) {
            logout();
        }
    }
    };
    
export default fetchMe;