import silhouet from '../assets/logo-project.png';
import arrow from '../assets/login.svg';
import arrowOut from '../assets/logout.png'
import '../styles/Header.css';
import { useAuth } from '../context/AuthContext.jsx';

export const Header = ({handleLoginForm}) => {
    const { isLoggedIn, login, logout } = useAuth();
    return (
        
        <header className='header'>
            <div className='top-section'>
            <div className='language'>
            <a  href="">ENGLISH</a>
            <figure className='silhouet'>
                <img src={silhouet} alt="silhuetti" />
            </figure>
            </div>{isLoggedIn ? (
                <div className='login'>
                <a >NIMI</a>
        <a href='#' onClick={logout}>KIRJAUDU ULOS</a>
        <figure>
            <img className='arrow' src={arrowOut} alt="logout" />
        </figure>
        
        </div>
      ) : (
        <a className='login' href='#' onClick={handleLoginForm}>KIRJAUDU SISÄÄN
            <figure>
                <img src={arrow} alt="login" />
            </figure>
        </a>
      )}
            
            </div>
            <div className='bottom-section'><h1>Löydä tietoa rakennuksista, tallenna suosikkejasi, rakenna reittejä</h1></div>
        </header>
            

    );
}