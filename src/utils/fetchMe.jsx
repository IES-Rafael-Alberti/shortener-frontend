import axios from "axios";

const fetchMe = async (token) => {
        const response = await axios.get("http://localhost:3000/me", {
        headers: {
        Authorization: `Bearer ${token}`
        }
    });
    
    return response.data;

    }

export default fetchMe;