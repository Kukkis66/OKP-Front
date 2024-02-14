import { useState } from 'react';
import sort from '../assets/sort.png'
import arrowDown from '../assets/arrow-down.png'
import { Popup } from './CardPopUp.jsx'
import { Maps } from './Maps.jsx'
import { Input } from './Input.jsx'
import '../styles/List.css'
import arrowLeft from '../assets/arrowLeft.png'
import arrowRight from '../assets/arrowRight.png'

export const List = ({hubData}) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [isBackwards, setIsBackwards] = useState(true)
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    
    const handleReadMore = (building) => {
        setSelectedBuilding(building);
      };
    
    const handleClosePopup = () => {
        setSelectedBuilding(null);
      };

    const handleCardCount = (count) => {
        setItemsPerPage(count)
    }

    const handleWards = () => {
        setIsBackwards(!isBackwards)
    }

    const totalPages = Math.ceil(hubData.data?.groupedProducts?.length / itemsPerPage);

    const getPageRange = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return [startIndex, endIndex];
    };

    const [startIndex, endIndex] = getPageRange();

    const getBuildingName = (building) => {
        return (
            building.productInformations[0]?.name ||
            (building.productImages[0]?.copyright === "Kuvio" ? "Oodi" :
            building.productImages[0]?.copyright === "Didrichsen archives" ? "Didrichsenin taidemuseo" :
            building.productImages[0]?.copyright.includes("Copyright: Visit Finland")
                ? building.productImages[0]?.copyright.split(":")[1].trim()
                : building.productImages[0]?.copyright)
        );
    };
    
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
        
    {isBackwards ? (
        <div className='wards'>
        <span>A - Ö</span>
        <img onClick={() => handleWards()} src={arrowDown} alt="arrow-down" />
        </div>
    ) : (
        <div className='wards'>
        <span>Ö - A</span>
        <img onClick={() => handleWards()} src="" alt="arrow-up" />
        </div>
    )}
    
        </div>
        <div className='cardContainer'>
        <ul >
        {displayedItems?.map((building) => (
        <li className="card" key={building.id}>
            <h2 className='h2'>{building.productInformations[0]?.name}</h2>
            
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
        {selectedBuilding && <Popup building={selectedBuilding} onClose={() => handleClosePopup()} />}
        </div>
        
        <div className="navigation-arrows">
        <a onClick={() => handlePageChange(currentPage - 1)}><img src={arrowLeft} alt="arrowLeft" /></a>
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


        
            
            <a onClick={() => handlePageChange(currentPage + 1)}><img src={arrowRight} alt="arrowRight" /></a>
        </div>
        

    </div>

);
}


