import { useState, useEffect } from 'react';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { Maps } from './components/Maps.jsx';
import { List } from './components/List.jsx';
import { Input } from './components/Input.jsx';
import { Login } from './components/Login.jsx';
import {Routes, Route } from "react-router-dom";
import { ConfirmEmailPage } from './components/ConfirmEmailPage.jsx';
import axios from 'axios';
import './styles/App.css';
import { useAuth } from './context/AuthContext.jsx';


function App() {
  const [data, setData] = useState([]);
  const [hubData, setHubData] = useState({ data: { groupedProducts: [] } });
  const [searchField, setSearchField] = useState('');
  const [loginForm, setLoginForm] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const { isLoggedIn, login, logout, currentUser, showFavorites, toggleFavorite, favorites, setFavorites } = useAuth();

  useEffect(() => {
    getAll();
    fetchData();
  }, []);

  const handleSearch = (searchTerm) => {
    // Update the search field state in Input.jsx
    setSearchField(searchTerm);
  };

  const handleLoginForm = () => {
    setLoginForm(!loginForm);
  };

  const getAll = async () => {
    try {
      const response = await axios.get('https://www.hel.fi/palvelukarttaws/rest/v4/unit/?ontologyword=473');
      
      setData(response.data);
    } catch (error) {
      console.error('Something went wrong:', error.message);
    }
  };

  const fetchData = async () => {
    try {
      const backendRes = await fetch('http://localhost:5143/api/DataHub');
      const backendData = await backendRes.json();
      console.log(backendData);
      setHubData(backendData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const updateMapMarker = selectedBuilding => {
    setSelectedMarker(selectedBuilding);
  };

  return (
    <>
      <Header handleLoginForm={handleLoginForm} />
      {showFavorites ? null : (
        <Input handleSearch={handleSearch} searchField={searchField} markers={hubData.data?.groupedProducts || []} hubData={hubData} updateMapMarker={updateMapMarker}/>
      )}
      <Login loginForm={loginForm} handleLoginForm={handleLoginForm} />
      {showFavorites ? null : (
        <Maps searchField={searchField} hubData={hubData}/>
      )}
      <List hubData={hubData} searchField={searchField} handleSearch={handleSearch} />
      <Footer />
    </>
  );
}

export default App;
