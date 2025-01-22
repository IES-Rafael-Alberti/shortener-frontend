const fetchMe = async (token) => {
        const response = await fetch("http://localhost:3000/me", {
        headers: {
        Authorization: `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data;
    }

export default fetchMe;