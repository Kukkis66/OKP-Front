import { getBuildingName } from './Maps.jsx'; 
import '../styles/CardPopUp.css';
import close from '../assets/close.png';

export const Popup = ({ building, onClose }) => {

    return (
        <div className='overlay-popup'>
            <div className="cardPopup">
                <span className="popupClose" onClick={() => { onClose(); }}><img src={close} alt="close" /></span>
                <div className='popupCard'>
                    <h2 className='h2-zoom'>{getBuildingName(building)}</h2> {/* Use getBuildingName function */}
                    <div className='info-and-photo-container'>
                        <div className='popup-info'>
                            <p className='p-zoom'>Osoite: {building.postalAddresses[0]?.streetName}</p>
                            <p className='p-zoom'>Kaupunki: {building.postalAddresses[0]?.city}</p>
                            <p className='p-zoom'>Postinumero: {building.postalAddresses[0]?.postalCode}</p>
                        </div>
                        <figure >
                            <img className='picture_popup' src={building.productImages[0]?.originalUrl} alt={building.productImages[0]?.altText} />
                        </figure>
                    </div>

                    <p className='p-zoom'>{building.productInformations[0]?.description}</p>
                </div>
            </div>
        </div>
    );
};