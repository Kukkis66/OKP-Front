import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Input.css';

export const Input = ({ handleSearch, updateMapMarker }) => {
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
        const name = building.productInformations[0]?.name || 
          (building.productImages[0]?.copyright === "Kuvio" ? "Oodi" 
          : building.productImages[0]?.copyright === "Didrichsen archives" ? "Didrichsenin taidemuseo"         
          : building.productImages[0]?.copyright.includes("Copyright: Visit Finland")
          ? building.productImages[0]?.copyright.split(":")[1].trim()
          : building.productImages[0]?.copyright);
        return { name, building }; // Return both name and building object
      });
      // Sort buildingNames alphabetically by name
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

const handleDropdownChange = event => {
  const value = event.target.value;
  setSearchTerm(value);
  const selected = buildingNames.find(building => building.name === value);
  console.log("Selected building:", selected);
  setSelectedBuilding(selected);
  handleSearch(value);
  // Update map marker based on selected building
  updateMapMarker(selected ? selected.building : null);
};


  useEffect(() => {
    if (selectedBuilding) {
      updateMapMarker(selectedBuilding.building); // Pass building information to update map marker
    } else {
      // If no building is selected, update map marker to null to remove all markers
      updateMapMarker(null);
    }
  }, [selectedBuilding, updateMapMarker]);

  return (
    <div className="inputContainer">
      <h1 className="searchInfo">HAE RAKENNUKSIA KARTALTA</h1>
      <input
        className="inputField"
        type="text"
        name="example" 
        list="exampleList"
        placeholder="Kirjoita rakennuksen nimi"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <datalist
        className="dropdownSearch"
        value={searchTerm}
        onChange={handleDropdownChange}
        id= "exampleList"
      >
        <option key="" value=""></option>
        {buildingNames.map((building, index) => (
          <option key={index} value={building.name}>
            {building.name}
          </option>
        ))}
      </datalist>
    </div>
  );
};
