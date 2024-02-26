import silhouet from '../assets/logo-project.png';

import '../styles/Footer.css';

export const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="footer">
            <div className='top'>
                </div>
        
        <div className='bottom'>
            <figure className='silhoutte'>
                <img src={silhouet} alt="" />
            </figure>
            <p className='copyright'>Copyright © {currentYear}</p>
        </div>
      </footer>
            

    );
}