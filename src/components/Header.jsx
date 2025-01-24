import { NavLink, useNavigate } from 'react-router';
import logo from '../assets/ShortenerLogo.png';
import useUserStore from '../stores/useUserStore';
import { useEffect, useState } from 'react';
import fetchMe from '../utils/fetchMe';

const Header = () => {
    const user = useUserStore((state) => state.user);
    const logout = useUserStore((state) => state.logout);
    const navigate = useNavigate();
    const [theme, setTheme] = useState("light");
    const [userData, setUserData] = useState({ email: "" });

    const toggleMode = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    useEffect(() => {
        if (user.token) {
            const fetchUserData = async () => {
                const data = await fetchMe(user.token); // Llamamos a la función fetchMe con el token del user
                setUserData(data); // Actualizamos el estado con los datos del user
              }
              fetchUserData();
        }

        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.body.setAttribute("data-theme", savedTheme);

    }, [])


    useEffect(() => {
        document.body.setAttribute("data-theme", theme);
    }, [theme]);

    return (
        <header className="header">
            <figure className="header__branding">
                <img src={logo} alt='Logo Shortener' className='branding__logo'></img>
                <figcaption>
                    <NavLink to="/" className="branding__name">Shortener</NavLink>
                </figcaption>
            </figure>

            <section className='header__rightSide'>
                <article className='rightSide__themeToggle'>
                    <label className="themeToggle__switch">
                        <input
                            type="checkbox"
                            checked={theme === "dark"}
                            onChange={toggleMode}
                        />
                        <span className="themeToggle__slider"></span>
                    </label>
                </article>

                <article className='rightSide__auth'>
                    {!user.token ? (
                        <>
                            <button className='auth__login' onClick={() => navigate('/login')}>Login</button>
                            <button className='auth__register' onClick={() => navigate('/register')}>Registro</button>
                        </>
                    ):
                    (
                        <>
                            <NavLink to="/userProfile" className="auth__userName">{userData?.email}</NavLink>
                            <button className="auth__logOut" onClick={logout}>Logout</button>
                        </>
                    )}
                </article>
            </section>
        </header>
    );
};

export default Header;