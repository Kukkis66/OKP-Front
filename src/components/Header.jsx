import silhouet from '../assets/logo-project.png';
import arrow from '../assets/login.svg';
import arrowOut from '../assets/logout.png'
import '../styles/Header.css';
import { useAuth } from '../context/AuthContext.jsx';

export const Header = ({handleLoginForm}) => {
    const { isLoggedIn, login, logout, currentUser, showFavorites, setShowFavorites, fetchFavorites } = useAuth();
    return (
        
        <header className='header'>
            <div className='top-section'>
                {/* <div className='language'>
                    <a className='language-grid-item' href="">ENGLISH</a>
                   
                </div> */}
                <figure className='silhouet'>
                        <img src={silhouet} alt="silhuetti" />
                </figure>
            {isLoggedIn ? (
                <div className='login header-grid-item'>
                    <a >{currentUser["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]}</a>
                    <a href='#' onClick={logout}>KIRJAUDU ULOS</a>
                    <figure>
                        <img className='arrow' src={arrowOut} alt="logout" />
                    </figure>
                </div>
             ) : (
                    <a className='login header-grid-item' href='#' onClick={handleLoginForm}>KIRJAUDU SISÄÄN
                        <figure>
                            <img className='arrow' src={arrow} alt="login" />
                        </figure>
                    </a>
            )}
            </div>
            <div className='bottom-section'><h1>Löydä tietoa rakennuksista, tallenna suosikkejasi, rakenna reittejä</h1></div>
            {currentUser && (
                <div>
                    <button onClick={() => {setShowFavorites(!showFavorites); fetchFavorites()}}>Click me</button>
                </div>
            )}
        </header>
            

    );
}