import silhouet from '../assets/silhouet2.png';
import arrow from '../assets/arrow-right.svg';
import '../styles/Header.css';

export const Header = () => {

    return (
        <header className='header'>
            <a className='language' href="">ENGLISH
            <figure className='silhouet'>
                <img src={silhouet} alt="silhuetti" />
            </figure>
            </a>
            <a className='login' href="">KIRJAUDU SISÄÄN
            <figure>
                <img src={arrow} alt="login" />
            </figure>
            </a>
        </header>
            

    );
}