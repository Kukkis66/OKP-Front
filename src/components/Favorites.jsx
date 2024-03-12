import { useState, useEffect } from 'react';
import sort from '../assets/sort.png';
import arrowDown from '../assets/arrow-down.png';
import { Popup } from './CardPopUp.jsx';
import { getBuildingName} from './Maps.jsx';
import '../styles/List.css';
import arrowLeft from '../assets/arrowLeft.png';
import arrowRight from '../assets/arrowRight.png';
import wholeHeart from '../assets/whole-heart.png';
import emptyHeart from '../assets/emptyHeart.png';
import close from '../assets/close.png';
import React from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';



export const Favorites = ({}) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [isBackwards, setIsBackwards] = useState(true);
    const [selectedBuilding, setSelectedBuilding] = useState(null);

    const { isLoggedIn, login, logout, currentUser, showFavorites, toggleFavorite, favorites, setFavorites } = useAuth();

    const navigate = useNavigate();
   
  // Example of redirecting programmatically
    if (!isLoggedIn) {
        navigate('/');
    }

    useEffect(() => {
        if (isLoggedIn && currentUser.Id) {
            const fetchFavorites = async () => {
                try {
                    const backendRes = await fetch(`http://localhost:5143/api/DataHub/GetUserFavorites/${currentUser.Id}`);
                    const backendData = await backendRes.json();
                    console.log(backendData);
                    setFavorites(backendData);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchFavorites();
        }
    }, [isLoggedIn, currentUser.Id, setFavorites]);

    // If user is not logged in or currentUser.Id is not available, return null
    if (!isLoggedIn || !currentUser.Id) {
        return null;
    }

    const deleteFavorite = async (key) => {
        try {
            // Make POST request to backend API to save favorite status
            const response = await axios.delete(`http://localhost:5143/api/Favorites/${key}`);
            console.log("Succeeded deletion", response);
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
                    {displayedItems?.map((building) => (
                        <li className="card" key={building.id}>
                            <div className="headingContainer">
                                <h2 className='h2'>{getBuildingName(building)}</h2> 
                                <div className="iconsContainer" onClick={() => deleteFavorite(building.id)}>
                                    <img className="emptyHeart" src={wholeHeart} alt="empty-heart" />
                                </div>
                            </div>
                            <div className="info">
                                <p className='p'>Osoite: {building.postalAddresses[0]?.streetName}</p>
                                <p className='p'>Kaupunki: {building.postalAddresses[0]?.city}</p>
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
    };

    const totalPages = Math.ceil(
        favorites.data?.product?.length / itemsPerPage
    );

    const getPageRange = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return [startIndex, endIndex];
    };

    const [startIndex, endIndex] = getPageRange();

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
            <h1 className="listHeader">TÄSSÄ ON SUOSIKKISI</h1>
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
                {renderCardContainer(displayedItems2)}
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
}