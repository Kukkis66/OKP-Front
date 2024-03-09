import React, { useState, useEffect } from 'react';
import '../styles/Input.css';
import { markers } from './Maps.jsx';


export const Input = ({ handleSearch, hubData}) => { 
  const [buildingNames, setBuildingNames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBuildingNames(hubData); // 
  }, [hubData]);

  const fetchBuildingNames = (hubData) => { 
    try {
      const extractedMarkers = markers(hubData); 
      const names = extractedMarkers.map(marker => ({
        name: marker.title,
        building: marker // 
      }));
      names.sort((a, b) => a.name.localeCompare(b.name));
      setBuildingNames(names);
    } catch (error) {
      console.error('Error fetching building names:', error);
    }
  };

  const handleInputChange = event => {
    const value = event.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  const handleDropdownChange = async event => {
    const value = event.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };
  
  return (
    <div className="inputContainer">
      <h1 className="searchInfo">HAE RAKENNUKSIA KARTALTA</h1>
      <input
        className="inputField"
        type="text"
        list="exampleList"
        placeholder="Kirjoita rakennuksen nimi"
        value={searchTerm}
        onChange={handleInputChange}
      />
       <datalist
        className="dropdownSearch"
        value={searchTerm}
        onChange={handleDropdownChange}
      >
       
        {buildingNames.map((building, index) => (
          <option key={index} value={building.name}>
            {building.name}
          </option>
        ))}
      </datalist>
    </div>
  );
};

