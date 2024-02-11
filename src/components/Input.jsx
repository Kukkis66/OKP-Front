import React from 'react'
import {Maps} from './Maps'
import { List } from './List'
import '../styles/Input.css'

export const Input = ({ searchField, handleSearch, markers }) => {
  // Обработчик события изменения выбранной опции в ниспадающем списке
  const handleSelectChange = event => {
    // Обновляем значение searchField в родительском компоненте
    handleSearch(event);
  };

  return (
    <div className="inputContainer">
        <h1 className="searchInfo">HAE RAKENNUKSIA KARTALTA</h1>
        <input
            className="inputField"
            type="text"
            placeholder="valitse rakennuksen nimi"
            value={searchField}
            onChange={handleSearch}
            />
        {/* Ниспадающий список */}
        <select className='choiceField' value={searchField} onChange={handleSelectChange}>
            {/* Отображаем каждый заголовок из переданного массива markers в виде опции в ниспадающем списке */}
            {markers.map((marker, index) => (
            <option key={index} value={marker.title}>
                {marker.title}
            </option>
            ))}
        </select>
    </div>
  );
};

