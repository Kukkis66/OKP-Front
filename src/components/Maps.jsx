import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker} from '@react-google-maps/api';
import '../styles/Maps.css';
import '../styles/List.css';
import houseIcon from '../assets/house.png';
import { Popup } from './CardPopUp.jsx';
import close from '../assets/close.png';
import emptyHeart from '../assets/emptyHeart.png';
import pin from '../assets/pin.png';
import wholeHeart from '../assets/wholeHeart.png';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 60.18527285,
  lng: 24.8562462609865, 
};

const libraries = ['places'];

const API_BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';
const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;

export const getBuildingName = (building) => {
  if (!building || !building.productInformations || !building.productImages) {
    return "Unknown Building"; // Or any default value
  }

  const name =
    building.productInformations[0]?.name === "Hanasaari – ruotsalais-suomalainen kulttuurikeskus"
      ? "Hanasaari"
      : building.productInformations[0]?.name === "Helsingin matkailuneuvonta paviljongilla"
      ? "Biennaali -paviljonki"     
      : building.productInformations[0]?.name === "EMMA – Espoon modernin taiteen museo"
      ? "EMMA"  
      : building.productInformations[0]?.name === "Futuro-talo (nro 001)"
      ? "Futuro-talo"  
      : building.productInformations[0]?.name === "Suomenlinnamuseo"
      ? "Suomenlinna - museo" 
      : building.productInformations[0]?.name === "Fazer Experience Vierailukeskus"
      ? "Fazer vierailukeskus"
      : building.productInformations[0]?.name === "Suomen kello- ja korumuseo Kruunu"
      ? "Kruunu"
      : building.productInformations[0]?.name === "Sotamuseon Maneesi ja Tykistömaneesi"
      ? "Sotamuseon Maneesit"
      : building.productInformations[0]?.name === "Musta tuntuu, tois­tai­sek­si 27.3.–8.9.2024."
      ? "Näyttelyt Amox Rex"
      : building.productInformations[0]?.name ||
        (building.productImages[0]?.copyright === "Kuvio"
          ? "Oodi"
          : building.productImages[0]?.copyright === "Didrichsen archives"
          ? "Didrichsenin taidemuseo"
          : building.productImages[0]?.copyright.includes(
              "Copyright: Visit Finland"
            )
            ? building.productImages[0]?.copyright.split(":")[1]?.trim() // added null check here
            : building.productImages[0]?.copyright);
        
  return name || "Unknown Building"; // Or any default value
};

export const Maps = ({searchField, hubData}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_APIKEY,
    libraries,
  });
  const [map, setMap] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [mapContainerHeight, setMapContainerHeight] = useState(window.innerWidth <= 425 ? 630 : 'auto');
  
  const { isLoggedIn, login, logout, currentUser, showFavorites, toggleFavorite, favorites, setFavorites, heartFilled, setHeartFilled, userFavorites, setUserFavorites } = useAuth();

  const toggleFavorite1 = async (buildingId, userId) => {
    // Check if currentUser is logged in
    if (!currentUser) {
        console.log("User is not logged in!");
        return;
    }

    try {
            // If not favorited, add the favorite
            const response = await axios.post('http://localhost:5143/api/Favorites', { "key": buildingId, "userId": userId });
            console.log("Favorite added:", response);
            return response.data;

    } catch (error) {
        console.error('Error toggling favorite:', error);
        console.log(userId);
    }
  };

  const deleteFavorite2 = async (buildingId, userId) => {
      // Check if currentUser is logged in
      if (!currentUser) {
          console.log("User is not logged in!");
          return;
      }

      try {
              // If already favorited, delete the favorite
              const response = await axios.delete(`http://localhost:5143/api/Favorites/${buildingId}`);
              console.log("Favorite deleted:", response);
        
          } catch (error) {
              console.error('Error toggling favorite:', error);
              console.log(userId);
          }
    
  };
  
  const markers = hubData => {
    if (!hubData || !hubData.data || !hubData.data.groupedProducts) {
      console.error("Invalid hubData:", hubData);
      return [];
    }

    return hubData.data.groupedProducts
      .map((building, index) => {
        const location = building.postalAddresses[0]?.location;
        const name = getBuildingName(building);

        if (location && location.includes(',')) {
          const [lat, lng] = location.substring(1, location.length - 1).split(',');
          const latitude = parseFloat(lat.trim());
          const longitude = parseFloat(lng.trim());

          if (!isNaN(latitude) && !isNaN(longitude)) {
            return {
              position: { lat: latitude, lng: longitude },
              title: name
            };
          }
        }

        console.warn(`Invalid location data for marker ${index + 1}. Skipping...`);
        return null;
      })
      .filter(marker => marker !== null && (searchField === '' || marker.title.toLowerCase().includes(searchField.toLowerCase())));
  };
  
  useEffect(() => {
    if (map && selectedMarker && selectedMarker.position) {
      const newPosition = selectedMarker.position;
      map.panTo(newPosition);
      map.setZoom(13.6); 
    }
  }, [map, selectedMarker]);

  const setMapCenterAndZoom = (mapInstance, selectedMarker) => {
    if (window.innerWidth <= 425 && mapInstance && selectedMarker) {
      mapInstance.panTo(selectedMarker.getPosition());
      mapInstance.setZoom(11.8);
    } else if (window.innerWidth <= 425 && mapInstance) {
      mapInstance.panTo({ lat: 60.1699, lng: 24.9384 });
      mapInstance.setZoom(12.9);
    }
  };

  const onMapLoad = (mapInstance) => {
    setMap(mapInstance);
    window.google.maps.event.addListener(mapInstance, 'bounds_changed', () => {
      setMapBounds(mapInstance.getBounds());
    });
    setMapCenterAndZoom(mapInstance); // Call the function to set center and zoom
  };

  useEffect(() => {
    const handleResize = () => {
      setMapContainerHeight(window.innerWidth <= 425 ? 980 : 'auto');
    };

    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMarkerClick = (marker) => {
  // Close the info window of the previously selected marker, if any
    if (selectedMarker && selectedMarker.title !== marker.title) {
      closeInfoWindow();
    }
    setSelectedMarker(marker);
    setShowInfoWindow(true); 
    const clickedBuilding = hubData.data.groupedProducts.find(
      building => getBuildingName(building) === marker.title);
    setSelectedBuilding(clickedBuilding);
    fetchWeatherData(marker.position.lat, marker.position.lng);

     // Move the map center to the clicked marker's position and set zoom 
     if (map) {
      map.panTo(marker.position);
      map.setZoom(13.6);
    }
     // set the map container height for mobile when the building is clicked
    if (window.innerWidth <= 425) {
      setMapContainerHeight(980);
    }  
  };

  const closeInfoWindow = () => {
    // Close the info window of the currently selected marker
    setSelectedMarker(null);
    setSelectedBuilding(null);
    setWeatherData(null);

    // Revert the zoom level back to 13 and center to the default center
    if (map) {
      if (window.innerWidth <= 425) {
        map.panTo({ lat: 60.1699, lng: 24.9384 });
        map.setZoom(13.6);
      } else {
        map.setZoom(11.8);
        map.panTo(center);
      }
    }

    if (window.innerWidth <= 425) {
      setMapContainerHeight(window.innerWidth <= 425 ? 630 : 'auto');
    }

    if (window.innerWidth <= 425) {
      setMapContainerHeight(window.innerWidth <= 425 ? 630 : 'auto');
    }

    setShowInfoWindow(false);
  };

  const fetchWeatherData = async (lat, lng) => {
    try {
      const response = await fetch(`${API_BASE_URL}?lat=${lat}&lon=${lng}&appid=${API_KEY}`);
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };
 
  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  const mapOptions =  {
    styles: [
      {
        featureType: "all",
        elementType: "all",
        stylers: [
          { saturation: -120 }, // Set saturation to -100 for black and white
          { lightness: 0 }, // Set lightness to 0 for black and white
        ],
      },
      {
        featureType: "administrative",
        elementType: "labels.text",
        stylers: [{ visibility: "on" }], // Show city part names
      },
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }], // Hide points of interest labels
      },
      {
        featureType: "transit",
        elementType: "labels",
        stylers: [{ visibility: "off" }], // Hide transit labels
      },
      {
        featureType: "road",
        elementType: "labels",
        stylers: [{ visibility: "off" }], // Hide road labels
      },
    ],
  };

  const handleHeartClick2 = async (buildingId) => {
    // Toggle the heart state

    const fetchFavorites = async () => {
          const backendRes = await fetch(`http://localhost:5143/api/Favorites/user-favorites/${currentUser.Id}`);
          const backendData = await backendRes.json();
          console.log(backendData);
          return backendData;
      
    }
    console.log("Here userfavorites:", userFavorites);
    console.log(buildingId);

    try {
        const response = await fetchFavorites();
        const isFavorite = response.some((favorite) => favorite.key === buildingId);

        if (isFavorite) {
            await deleteFavorite2(buildingId, currentUser.Id);
            const updatedFavorites = userFavorites.filter(favorite => favorite.key !== buildingId);
            setUserFavorites(updatedFavorites);
        } else {
            const response = await toggleFavorite1(buildingId, currentUser.Id);
            setUserFavorites([...userFavorites, response]);
        }

        // Toggle the heart icon
    
    } catch (error) {
        console.error('Error handling heart click:', error);
    }
    
};

  return (
    <div className="mapContainer" style={{ height: mapContainerHeight }}>
      <div className={selectedBuilding ? "map" : "map full-width"}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={11.8}
          center={center}
          options={mapOptions}
          onLoad={onMapLoad}
        >
          {markers(hubData).map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              title={marker.title}
              icon={{
                url: selectedMarker && selectedMarker.title === marker.title ? pin : houseIcon,
                scaledSize: selectedMarker && selectedMarker.title === marker.title ? new window.google.maps.Size(25, 40) : new window.google.maps.Size(20, 32),
              }}
              onClick={() => handleMarkerClick(marker)}
            />
          ))}  
        </GoogleMap>
      </div>
      {showInfoWindow && selectedMarker && (
        <div className="InfoWindows">
        {selectedBuilding && (
          <li className="card" key={selectedBuilding.id}>
            <div className="headingContainer">
              <h2 className="h2">{getBuildingName(selectedBuilding)}</h2>
              <div className="iconsContainer">
                <img className="emptyHeart" src={(userFavorites.some(favorite => favorite.key === selectedBuilding.id)) ? wholeHeart : emptyHeart} alt="heart" onClick={() => {handleHeartClick2(selectedBuilding.id);  }} />  
              </div>
            </div>
            <div className="info">
              <p className="p">Osoite: {selectedBuilding.postalAddresses[0]?.streetName}</p>
              <p className="p">Kaupunki: {selectedBuilding.postalAddresses[0]?.city}</p>
            </div>
            <figure className="picture_url">
              <img
                src={selectedBuilding.productImages[0]?.thumbnailUrl}
                alt={selectedBuilding.productImages[0]?.altText}
              />
            </figure>
            <div className="bottomContainer">
              <a className="zoom" onClick={() => setShowPopup(true)}>LUE LISÄÄ</a>
              {showPopup && <Popup building={selectedBuilding} onClose={() => setShowPopup(false)} />}
              {weatherData && (
                <div className="weather-info">
                  <p>{Math.round(weatherData.main.temp - 273.15)} °C</p>
                  <img src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} alt="Weather Icon" />
                </div>
              )} 
            </div>
          </li>
        )}
            <img className="closeX" src={close} alt="close" onClick={closeInfoWindow} />
        </div>
      )}
    </div>
  );

};
