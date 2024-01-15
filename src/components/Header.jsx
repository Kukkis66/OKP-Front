import silhouet from '../assets/logo-project.png';
import arrow from '../assets/arrow-right.svg';
import '../styles/Header.css';

export const Header = () => {

    return (
        <header className='header'>
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
        </header>
            

    );
}