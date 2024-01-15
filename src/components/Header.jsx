import silhouet from '../assets/logo-project.png';
import arrow from '../assets/arrow-right.svg';
import '../styles/Header.css';

export const Header = () => {

    return (
        
        <header className='header'>
            <div className='top-section'>
            <div className='language'>
            <a  href="">ENGLISH</a>
            <figure className='silhouet'>
                <img src={silhouet} alt="silhuetti" />
            </figure>
            </div>
            <a className='login' href="">KIRJAUDU SISÄÄN
            <figure>
                <img src={arrow} alt="login" />
            </figure>
            </a>
            </div>
            <div className='bottom-section'><h1>Löydä tietoa rakennuksista, tallenna suosikkejasi, rakenna reittejä</h1></div>
        </header>
            

    );
}