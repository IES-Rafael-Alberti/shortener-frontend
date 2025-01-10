import { NavLink, useNavigate } from 'react-router';
import logo from '../assets/ShortenerLogo.png';
import useUserStore from '../stores/useUserStore';
const Header = () => {
    const user = useUserStore((state) => state.user);
    const logout = useUserStore((state) => state.logout);
    const navigate = useNavigate();

    return (
        <header className="header">
            <figure className="header__branding">
                <img src={logo} alt='Logo Shortener' className='branding__logo'></img>
                <figcaption>
                    <NavLink to="/" className="branding__name"></NavLink>
                </figcaption>
            </figure>

            <section className='header__auth'>
                {!user.email ? (
                    <>
                        <button className='auth__login' onClick={() => navigate('/login')}>Login</button>
                        <button className='auth__register' onClick={() => navigate('/register')}>Registro</button>
                    </>
                ):
                (
                    <>
                        <NavLink to="/userProfile" className="auth__userName">{user?.email}</NavLink>
                        <button className="auth__logOut" onClick={logout}>Logout</button>
                    </>
                )}
            </section>
        </header>
    );
};

export default Header;