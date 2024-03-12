import { getBuildingName } from './Maps.jsx'; 
import '../styles/CardPopUp.css';
import close from '../assets/close.png';

export const FavoritePopUp = ({ building, onClose }) => {

    // let originalString = building.openingHours[4]?.openTo;
    // console.log(originalString);
    // let modifiedString = originalString ? `${originalString.slice(0, 5)}` : "";
    // console.log(modifiedString);

    // let ma_from = building.openingHours[6]?.openFrom ? building.openingHours[6]?.openFrom.slice(0,5) : "";
    // let ma_to = building.openingHours[6]?.openTo ? building.openingHours[6]?.openTo.slice(0,5) : "";

    // let ti_from = building.openingHours[5]?.openFrom ? building.openingHours[5]?.openFrom.slice(0,5) : "";
    // let ti_to = building.openingHours[5]?.openTo ? building.openingHours[5]?.openTo.slice(0,5) : "";

    // let ke_from = building.openingHours[4]?.openFrom ? building.openingHours[4]?.openFrom.slice(0,5) : "";
    // let ke_to = building.openingHours[4]?.openTo ? building.openingHours[4]?.openTo.slice(0,5) : "";

    // let to_from = building.openingHours[3]?.openFrom ? building.openingHours[3]?.openFrom.slice(0,5) : "";
    // let to_to = building.openingHours[3]?.openTo ? building.openingHours[3]?.openTo.slice(0,5) : "";

    // let pe_from = building.openingHours[2]?.openFrom ? building.openingHours[2]?.openFrom.slice(0,5) : "";
    // let pe_to = building.openingHours[2]?.openTo ? building.openingHours[2]?.openTo.slice(0,5) : "";

    // let la_from = building.openingHours[1]?.openFrom ? building.openingHours[1]?.openFrom.slice(0,5) : "";
    // let la_to = building.openingHours[1]?.openTo ? building.openingHours[1]?.openTo.slice(0,5) : "";

    // let su_from = building.openingHours[0]?.openFrom ? building.openingHours[0]?.openFrom.slice(0,5) : "";
    // let su_to = building.openingHours[0]?.openTo ? building.openingHours[0]?.openTo.slice(0,5) : "";

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
                            <p className='p-zoom'>Nettisivu: <a href={building.productInformations[0]?.url}>{building.productInformations[0]?.url}</a></p>
                            <p className='p-zoom'>Aukioloajat: </p>
                            {/* <div className='aukiolo-container'>
                                <div className='aukiolo-container2'>
                                    <div className='aukiolo-aika'>
                                        <span className='weekday'>MA</span>
                                        <span className='open-from-to'>{ma_from} - {ma_to}</span>
                                    </div>
                                    <div className='aukiolo-aika'>
                                        <span className='weekday'>TI</span>
                                        <span className='open-from-to'>{ti_from} - {ti_to}</span>
                                    </div>
                                    <div className='aukiolo-aika'>
                                        <span className='weekday'>KE</span>
                                        <span className='open-from-to'>{ke_from} - {ke_to}</span>
                                    </div>
                                    <div className='aukiolo-aika'>
                                        <span className='weekday'>TO</span>
                                        <span className='open-from-to'>{to_from} - {to_to}</span>
                                    </div>  
                                    <div className='aukiolo-aika'>
                                        <span className='weekday'>PE</span>
                                        <span className='open-from-to'>{pe_from} - {pe_to}</span>
                                    </div>  
                                    <div className='aukiolo-aika'>
                                        <span className='weekday'>LA</span>
                                        <span className='open-from-to'>{la_from} - {la_to}</span>
                                    </div>  
                                    <div className='aukiolo-aika'>
                                        <span className='weekday'>SU</span>
                                        <span className='open-from-to'>{su_from} - {su_to}</span>
                                    </div>          
                                </div>
                            </div> */}
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
