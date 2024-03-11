import { useState } from 'react';
import React from 'react';
import sort from '../assets/sort.png';
import arrowDown from '../assets/arrow-down.png';
import arrowLeft from '../assets/arrowLeft.png';
import arrowRight from '../assets/arrowRight.png';
import emptyHeart from '../assets/emptyHeart.png';
import fillHeart from '../assets/fillHeart.png';
import { Popup } from './CardPopUp.jsx';
import { getBuildingName } from './Maps.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Favorites } from './Favorites.jsx';
import '../styles/List.css';


export const List = ({ hubData }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [isBackwards, setIsBackwards] = useState(true);
    const [selectedBuilding, setSelectedBuilding] = useState(null);

    const [paginationArrowLeft, setPaginationArrowLeft] = useState(false);
    const [paginationArrowRight, setPaginationArrowRight] = useState(true);
    const [heartStates, setHeartStates] = useState({});

    const { isLoggedIn, login, logout, currentUser, showFavorites, toggleFavorite, favorites, setFavorites } = useAuth();

    const handleReadMore = (building) => {
        setSelectedBuilding(building);
    };
    
    const handleClosePopup = () => {
        setSelectedBuilding(null);
    };

    const handleCardCount = (count) => {
        setItemsPerPage(count)

        const newTotalPages = Math.ceil(hubData.data?.groupedProducts?.length / count);
        const newCurrentPage = Math.min(currentPage, newTotalPages);
        setCurrentPage(newCurrentPage);

        console.log("current page: " + newCurrentPage)
        console.log("page numbers length" + newTotalPages)
           
        if (newCurrentPage === 1 && newTotalPages === 2) {
            setPaginationArrowRight(true)
            setPaginationArrowLeft(false)
        }
        else if (newCurrentPage === 2 && newTotalPages === 2) {
            console.log("tulee tänne!!")
            setPaginationArrowRight(false)
            setPaginationArrowLeft(true)
        }

        else if (newCurrentPage === 1) {
            setPaginationArrowLeft(false);
        }
       
        else if (newCurrentPage === newTotalPages) {
            
            setPaginationArrowRight(false);
        }

        else {
            setPaginationArrowRight(true);
            setPaginationArrowLeft(true);
        }
    }

    const handleWards = () => {
        setIsBackwards(!isBackwards);
    };

    const handleHeartClick = (buildingId) => {
        setHeartStates(prevState => ({
            ...prevState,
            [buildingId]: !prevState[buildingId]
        }));
    };

    const totalPages = Math.ceil(hubData.data?.groupedProducts?.length / itemsPerPage);

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

    const handlePageChange = (newPage) => {
    
        setCurrentPage(newPage);
        console.log("sivujen lukumäärä " + pageNumbers.length)

        if (newPage === 1 && pageNumbers.length === 2) {
            setPaginationArrowRight(true)
            setPaginationArrowLeft(false)
        }
        else if (newPage === 2 && pageNumbers.length === 2) {
            setPaginationArrowRight(false)
            setPaginationArrowLeft(true)
        }

        else if (newPage === 1) {
            setPaginationArrowLeft(false);
            setPaginationArrowRight(true);
        }
       
        else if (newPage === pageNumbers.length) {
            setPaginationArrowRight(false);
            setPaginationArrowLeft(true);
        }

        else {
            setPaginationArrowRight(true);
            setPaginationArrowLeft(true);
        }  
    };

    const handlePageChangeLeft = (newPage) => {
        const pageToShow = currentPage - 1;
    
        if (pageToShow === 1 && totalPages === 2) {
            setPaginationArrowRight(true);
            setPaginationArrowLeft(false);
            setCurrentPage(newPage);
        } else if (pageToShow === 1) {
            setPaginationArrowLeft(false);
            setCurrentPage(newPage);
        } else {
            setPaginationArrowLeft(true);
            setPaginationArrowRight(true);
            setCurrentPage(newPage);
        }
    };
    
    const handlePageChangeRight = (newPage) => {
        const pageToShow = currentPage + 1;
    
        if (pageToShow === totalPages && totalPages === 2) {
            setPaginationArrowRight(false);
            setPaginationArrowLeft(true);
            setCurrentPage(newPage);
        } else if (pageToShow === totalPages) {
            setPaginationArrowRight(false);
            setCurrentPage(newPage);
        } else {
            setPaginationArrowRight(true);
            setPaginationArrowLeft(true);
            setCurrentPage(newPage);
        }
    };
    

    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <div>
            <h1 className="listHeader">SELAA RAKENNUKSIA</h1>

            <div className='sortContainer'>
                <div className='dropdown'>
                    <img src={sort} alt="sortLogo" />
                    <a>NÄYTÄ {itemsPerPage}</a>
                    <div className="dropdown-content">
                        <button className='button' onClick={() => handleCardCount(6)}>6</button>
                        <button className='button' onClick={() => handleCardCount(12)}>12</button>
                        <button className='button' onClick={() => handleCardCount(24)}>24</button>
                    </div>
                </div>

                <div className='wards'>
                    <span>{isBackwards ? 'A - Ö' : 'Ö - A'}</span>
                    <img onClick={handleWards} src={arrowDown} alt={isBackwards ? 'arrow-down' : 'arrow-up'} style={{ transform: isBackwards ? '' : 'rotate(180deg)' }} />
                </div>
            </div>

            <div className="cardContainer">
                {showFavorites && currentUser ? (
                    <Favorites
                        displayedItems={displayedItems}
                        handleReadMore={handleReadMore}
                        handleClosePopup={handleClosePopup}
                        selectedBuilding={selectedBuilding}
                        setFavorites={setFavorites}
                        favorites={favorites}
                    />
                ) : (
                    <ul>
                        {displayedItems?.map((building) => (
                            <li className="card" key={building.id}>
                                <div className='headingContainer'>
                                    <h2 className='h2'>{getBuildingName(building)}</h2>
                                    <div className='iconsContainer'>
                                        <img className="emptyHeart" src={heartStates[building.id] ? fillHeart : emptyHeart} alt="heart" onClick={() => handleHeartClick(building.id)} />
                                    </div>
                                </div>

                                <div className='info'>
                                    <p className='p'>Osoite: {building.postalAddresses[0]?.streetName}</p>
                                    <p className='p'>Kaupunki: {building.postalAddresses[0]?.city}</p>
                                    <p className='p'>Postinumero: {building.postalAddresses[0]?.postalCode}</p>
                                </div>

                                <figure className='picture_url'>
                                    <img src={building.productImages[0]?.thumbnailUrl} alt={building.productImages[0]?.altText} />
                                </figure>
                                <a className='zoom' onClick={() => handleReadMore(building)}>
                                    LUE LISÄÄ
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
                {selectedBuilding && <Popup building={selectedBuilding} onClose={handleClosePopup} />}
            </div>

            <div className="navigation-arrows">
                {paginationArrowLeft ? (
                    <a
                        onClick={() => handlePageChangeLeft(currentPage - 1)}>
                        <img src={arrowLeft} alt="arrowLeft"
                            style={{ textDecoration: currentPage === pageNumbers.indexOf(currentPage) ? 'none !important' : 'underline' }} />
                    </a>
                ) : (
                    <p>{null}</p>
                )}

                <div className="pagination">
                    {pageNumbers.map((pageNumber) => (
                        <span
                            key={pageNumber}
                            className={pageNumber === currentPage ? 'active' : ''}
                            style={{ textDecoration: pageNumber === currentPage ? 'none !important' : 'underline' }}
                            onClick={() => handlePageChange(pageNumber)}>
                            {pageNumber}
                        </span>
                    ))}
                </div>

                {paginationArrowRight ? (
                    <a
                        onClick={() => handlePageChangeRight(currentPage + 1)}>
                        <img src={arrowRight} alt="arrowRight"
                            style={{ textDecoration: currentPage === pageNumbers.indexOf(currentPage) ? 'none !important' : 'underline' }} />
                    </a>
                ) : (
                    <p>{null}</p>
                )}
            </div>
        </div>
    );
};
