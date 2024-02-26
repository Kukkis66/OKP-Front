import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Input.css';
import { getBuildingName, markers } from './Maps.jsx'; // Import the markers function

export const Input = ({ handleSearch, updateMapMarker, updateMapCenter, hubData }) => {
  const [buildingNames, setBuildingNames] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBuildingNames();
  }, []);

  const fetchBuildingNames = async () => {
    try {
      const response = await axios.get('http://localhost:5143/api/DataHub');
      const names = response.data.data.groupedProducts.map(building => {
        const name = getBuildingName(building);
        return { name, building };
      });
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
    const selected = buildingNames.find(building => building.name === value);
    setSelectedBuilding(selected);
    handleSearch(value);

    // Call updateMapCenter with the coordinates of the selected building
    if (selected) {
      const marker = markers(hubData).find(marker => getBuildingName(selected.building) === marker.title);
      if (marker) {
        console.log('Marker position:', marker.position); 
        updateMapCenter(marker.position);
      }
    }
    updateMapMarker(selected ? selected.building : null);
  };

  return (
    <div className="inputContainer">
      <h1 className="searchInfo">HAE RAKENNUKSIA KARTALTA</h1>
      <input
        className="inputField"
        type="text"
        placeholder="Kirjoita rakennuksen nimi"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <select
        className="dropdownSearch"
        value={searchTerm}
        onChange={handleDropdownChange}
      >
        <option key="" value=""></option>
        {buildingNames.map((building, index) => (
          <option key={index} value={building.name}>
            {building.name}
          </option>
        ))}
      </select>
    </div>
  );
};
