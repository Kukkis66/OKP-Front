import React, { useState, useEffect } from 'react';
import '../styles/Input.css';
import axios from 'axios';
import { getBuildingName } from './Maps.jsx';

export const Input = ({ handleSearch }) => {
  const [buildingNames, setBuildingNames] = useState([]);
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
        id="exampleList"
        onChange={handleDropdownChange}
      >
        <option value=""></option>
        {buildingNames.map((building, index) => (
          <option key={index} value={building.name} />
        ))}
      </datalist>
    </div>
  );
};
