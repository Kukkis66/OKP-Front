import { useState } from 'react';
import sort from '../assets/sort.png';
import arrowDown from '../assets/arrow-down.png';
import { Popup } from './CardPopUp.jsx';
import { getBuildingName} from './Maps.jsx';
import '../styles/List.css';
import arrowLeft from '../assets/arrowLeft.png';
import arrowRight from '../assets/arrowRight.png';
import emptyHeart from '../assets/emptyHeart.png';
import close from '../assets/close.png';
import React from 'react';
import axios from 'axios';



export const Favorites = ({displayedItems, handleReadMore, selectedBuilding, handleClosePopup, setFavorites, favorites}) => {



    const deleteFavorite = async (key) => {
        try {
            // Make POST request to backend API to save favorite status
            await axios.delete(`http://localhost:5143/api/Favorites/${key}`);
            console.log("Succeeded deletion");
            const updatedData = {
                data: {
                    product: favorites.data.product.filter(product => product.id !== key)
                }
            };
    
            // Update the state with the updated data
            setFavorites(updatedData);
          } catch (error) {
            console.error('Error deleting favorite:', error);
          }
      };
    
    return (
        <div className="cardContainer">
            <ul>
                {displayedItems?.map((building) => (
                    <li className="card" key={building.id}>
                        <div className="headingContainer">
                            <h2 className='h2'>{getBuildingName(building)}</h2> 
                            <div className="iconsContainer" onClick={() => deleteFavorite(building.id)}>
                                <img className="emptyHeart" src={emptyHeart} alt="empty-heart" />
                            </div>
                        </div>
                        <div className="info">
                            <p className="p">Osoite: {building.postalAddresses[0]?.streetName}</p>
                            <p className="p">Kaupunki: {building.postalAddresses[0]?.city}</p>
                            <p className="p">Postinumero: {building.postalAddresses[0]?.postalCode}</p>
                        </div>
                        <figure className="picture_url">
                            <img
                                src={building.productImages[0]?.thumbnailUrl}
                                alt={building.productImages[0]?.altText}
                            />
                        </figure>
                        <a className="zoom" onClick={() => handleReadMore(building)}>
                            LUE LISÄÄ
                        </a>
                    </li>
                ))}
            </ul>
            {selectedBuilding && <Popup building={selectedBuilding} onClose={() => handleClosePopup()} />}
        </div>
    );
}