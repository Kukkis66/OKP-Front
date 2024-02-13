import React from 'react'
import {Maps} from './Maps'
import { List } from './List'
import '../styles/Input.css';

export const Input = ({ searchField, handleSearch }) => {
  return (
    <div className="inputContainer">
      <h1 className="searchInfo">HAE RAKENNUKSIA KARTALTA</h1>
      <input
        className="inputField"
        type="text"
        placeholder="Kirjoita rakennuksen nimi"
        value={searchField}
        onChange={(e) => handleSearch(e.target.value)} // Call handleSearch with input value
      />
    </div>
  );
};

