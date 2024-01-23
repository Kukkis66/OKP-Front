import '../styles/CardPopUp.css'
import close from '../assets/close.png'

export const Popup = ({ building, onClose }) => {
    
    console.log(building)
    
    
    return (
        <div className='overlay'>
      <div className="cardPopup">
      <span className="popupClose" onClick={() => {onClose();}}><img src={close} alt="close"/></span>
      <div className='popupCard'>
      <h2 className='h2'>{building.productInformations[0]?.name}</h2>
            
           
            
            
        {/* <p className='p'>Osoite: {building.postalAddresses[0]?.streetName}</p>
            <p className='p'>Kaupunki: {building.postalAddresses[0]?.city}</p>
            <p className='p'>Postinumero: {building.postalAddresses[0]?.postalCode}</p> */}
            
            <figure >
            
                <img className='picture_popup' src={building.productImages[0]?.originalUrl} alt={building.productImages[0]?.altText} />
            </figure>
            
            <p className='p'>{building.productInformations[0]?.description}</p>
            </div>
      </div>
      </div>
    );
  };