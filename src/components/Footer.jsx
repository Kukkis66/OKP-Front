import silhouet from '../assets/logo-project.png';

import '../styles/Footer.css';

export const Footer = () => {

    return (
        <footer className="footer">
            <div className='top'>
                </div>
        
        <div className='bottom'>
            <figure className='silhoutte'>
                <img src={silhouet} alt="" />
            </figure>
            <p className='copyright'>Copyright © 2024</p>
        </div>
      </footer>
            

    );
}