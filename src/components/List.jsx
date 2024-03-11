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
import { useAuth } from '../context/AuthContext.jsx';
import { Favorites } from './Favorites.jsx';
import wholeHeart from '../assets/whole-heart.png';
import axios from 'axios';


export const List = ({ hubData, userFavorites }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [isBackwards, setIsBackwards] = useState(true);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteStatus, setFavoriteStatus] = useState({});

    const { isLoggedIn, login, logout, currentUser, showFavorites, toggleFavorite, favorites, setFavorites } = useAuth();

    const toggleFavorite2 = async (buildingId, userId) => {
        // Check if currentUser is logged in
        if (!currentUser) {
            console.log("User is not logged in!");
            return;
        }
    
        try {
            // Check if the building is already favorited
            const isFavorite = userFavorites.some(favorite => favorite.key === buildingId);
    
            if (isFavorite) {
                // If already favorited, delete the favorite
                const response = await axios.delete(`http://localhost:5143/api/Favorites/${buildingId}`);
                console.log("Favorite deleted:", response);
            } else {
                // If not favorited, add the favorite
                const response = await axios.post('http://localhost:5143/api/Favorites', { "key": buildingId, "userId": userId });
                console.log("Favorite added:", response);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };
    
   

    const handleReadMore = (building) => {
        setSelectedBuilding(building);
    };

    const handleClosePopup = () => {
        setSelectedBuilding(null);
    };

    const handleCardCount = (count) => {
        setItemsPerPage(count);
    };

    const handleWards = () => {
        setIsBackwards(!isBackwards);
    };

    const renderCardContainer = (displayedItems) => {
        return (
            <div className="cardContainer">
                <ul>
                {displayedItems?.map((building) => {
            // Check if the current card's ID exists in the userFavorites list
            const isFavorite = userFavorites.some(favorite => favorite.key === building.id);
            

                        return (
                            <li className="card" key={building.id}>
                                <div className="headingContainer">
                                    <h2 className='h2'>{getBuildingName(building)}</h2> 
                                    <div className="iconsContainer" onClick={() => {
                                        // Check if currentUser is logged in
                                        if (currentUser && isLoggedIn) {
                                            // If logged in, toggle favorite
                                            toggleFavorite2(building.id, currentUser.Id);
                                        } else {
                                            // If not logged in, display a message or handle the situation accordingly
                                            console.log("You need to be logged in to use this feature.");
                                            // You could also redirect the user to the login page, show a modal, etc.
                                        }
                                    }}>
                                        {isFavorite ? (
                                            <img className="fullHeart" src={wholeHeart} alt="full-heart" />
                                        ) : (
                                            <img className="emptyHeart" src={emptyHeart} alt="empty-heart" />
                                        )}
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
                        );
                    })}
                </ul>
                {selectedBuilding && <Popup building={selectedBuilding} onClose={() => handleClosePopup()} />}
            </div>
        );
    };

    const totalPages = Math.ceil(
        hubData.data?.groupedProducts?.length / itemsPerPage
    );

    const getPageRange = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return [startIndex, endIndex];
    };

    const [startIndex, endIndex] = getPageRange();

    const sortedItems = isBackwards
        ? hubData.data?.groupedProducts?.sort((a, b) => {
              const nameA = getBuildingName(a);
              const nameB = getBuildingName(b);
              return nameA.localeCompare(nameB);
          })
        : hubData.data?.groupedProducts?.sort((a, b) => {
              const nameA = getBuildingName(a);
              const nameB = getBuildingName(b);
              return nameB.localeCompare(nameA);
          });

    const displayedItems = sortedItems?.slice(startIndex, endIndex);

    const sortedItems2 = isBackwards
        ? favorites.data?.product?.sort((a, b) => {
              const nameA = getBuildingName(a);
              const nameB = getBuildingName(b);
              return nameA.localeCompare(nameB);
          })
        : favorites.data?.product?.sort((a, b) => {
              const nameA = getBuildingName(a);
              const nameB = getBuildingName(b);
              return nameB.localeCompare(nameA);
          });
    
    const displayedItems2 = sortedItems2?.slice(startIndex, endIndex);
    
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
   
    return (
        <div>
            <h1 className="listHeader">SELAA RAKENNUKSIA</h1>
            <div className="sortContainer">
                <div className="dropdown">
                    <img src={sort} alt="sortLogo" />
                    <a>NÄYTÄ {itemsPerPage}</a>
                    <div className="dropdown-content">
                        <button className="button" onClick={() => handleCardCount(6)}>
                            6
                        </button>
                        <button className="button" onClick={() => handleCardCount(12)}>
                            12
                        </button>
                        <button className="button" onClick={() => handleCardCount(24)}>
                            24
                        </button>
                    </div>
                </div>

                {isBackwards ? (
                    <div className="wards">
                        <span>A - Ö</span>
                        <img
                            onClick={() => handleWards()}
                            src={arrowDown}
                            alt="arrow-down"
                        />
                    </div>
                ) : (
                    <div className="wards">
                        <span>Ö - A</span>
                        <img
                            onClick={() => handleWards()}
                            src={arrowDown}
                            alt="arrow-up"
                            style={{ transform: 'rotate(180deg)' }}
                        />
                    </div>
                )}
            </div>
            <div className="cardContainer">
                {renderCardContainer(displayedItems)}
            </div>
            <div className="navigation-arrows">
                <a onClick={() => handlePageChange(currentPage - 1)}>
                    <img src={arrowLeft} alt="arrowLeft" />
                </a>
                <div className="pagination">
                    {pageNumbers.map((pageNumber) => (
                        <span
                            key={pageNumber}
                            className={pageNumber === currentPage ? 'active' : ''}
                            onClick={() => handlePageChange(pageNumber)}
                        >
                            {pageNumber}
                        </span>
                    ))}
                </div>
                <a onClick={() => handlePageChange(currentPage + 1)}>
                    <img src={arrowRight} alt="arrowRight" />
                </a>
            </div>
        </div>
    );
};
