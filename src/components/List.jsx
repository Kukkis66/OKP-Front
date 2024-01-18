import { useState } from 'react';

import '../styles/List.css'


export const List = ({filteredList}) => {


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const totalPages = Math.ceil(filteredList.length / itemsPerPage);

    const getPageRange = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return [startIndex, endIndex];
    };

    const [startIndex, endIndex] = getPageRange();
    const displayedItems = filteredList.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
      };
      
      
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);


      
    
    return (
    <div>
        <div className='cardContainer'>
        <ul >
        {displayedItems.map((building) => (
        <li className="card" key={building.id}>
            <h2 className='h2'>{building.productInformations[0].name}</h2>
            
            <div className='info'>
            
            <p className='p'>Osoite: {building.postalAddresses[0].streetName}</p>
            <p className='p'>Kaupunki: {building.postalAddresses[0].city}</p>
            <p className='p'>Postinumero: {building.postalAddresses[0].postalCode}</p>
            </div>
            <figure className='picture_url'>
                <img src={building.productImages[0].thumbnailUrl} alt={building.productImages[0].altText} />
            </figure>
            

            <a href='' className='zoom'>LUE LISÄÄ</a>
        </li>
        
        ))}
        </ul>
     
        </div>
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


        <div className="navigation-arrows">
            <a onClick={() => handlePageChange(currentPage - 1)}>&lt; Prev</a>
            <a onClick={() => handlePageChange(currentPage + 1)}>Next &gt;</a>
        </div>

    </div>
      
            

    );
}