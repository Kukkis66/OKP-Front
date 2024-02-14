import '../styles/CardPopUp.css'
import close from '../assets/close.png'

export const Popup = ({ building, onClose }) => {
    
    console.log(building)
    
    
    return (
        <div className='overlay-popup'>
            <div className="cardPopup">
                <span className="popupClose" onClick={() => {onClose();}}><img src={close} alt="close"/></span>
                <div className='popupCard'>
                    <h2 className='h2-zoom'>{
                        building.productInformations[0]?.name ||
                        (building.productImages[0]?.copyright === "Kuvio" ? "Oodi"
                        : building.productImages[0]?.copyright === "Didrichsen archives" ? "Didrichsenin taidemuseo" 
                        : building.productImages[0]?.copyright.includes("Copyright: Visit Finland")
                        ? building.productImages[0]?.copyright.split(":")[1].trim()
                        : building.productImages[0]?.copyright)}</h2>
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