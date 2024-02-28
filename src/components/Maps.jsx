import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker} from '@react-google-maps/api';
import '../styles/Maps.css';
import houseIcon from '../assets/house.png';
import emptyHeart from '../assets/emptyHeart.png';
import { Popup } from './CardPopUp.jsx'; // Import Popup component
import closeIcon from '../assets/close.png'; // Adjust the path as necessary

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 60.23222,
  lng: 24.86209,
};

const libraries = ['places'];

export const getBuildingName = (building) => {
  const name =
    building.productInformations[0]?.name ||
    (building.productImages[0]?.copyright === "Kuvio"
      ? "Oodi"
      : building.productImages[0]?.copyright === "Didrichsen archives"
      ? "Didrichsenin taidemuseo"
      : building.productImages[0]?.copyright.includes(
          "Copyright: Visit Finland"
        )
      ? building.productImages[0]?.copyright.split(":")[1].trim()
      : building.productImages[0]?.copyright);

  return name;
};

export const markers = hubData => {
  const extractedMarkers = hubData.data?.groupedProducts?.map((building, index) => {
    const location = building.postalAddresses[0]?.location;
    const name =getBuildingName(building);
       
    // Check if location is defined and has valid latitude and longitude
    if (location && location.includes(',')) {
      const [lat, lng] = location.substring(1, location.length - 1).split(',');
      const latitude = parseFloat(lat.trim());
      const longitude = parseFloat(lng.trim());   
      
      // Check if latitude and longitude are valid numbers
      if (!isNaN(latitude) && !isNaN(longitude)) {
        const marker = {
          position: {
            lat: latitude,
            lng: longitude
          },
          title: name
        };  
        return marker;
      }
    }
    
    console.warn(`Invalid location data for marker ${index + 1}. Skipping...`);
    return null;
  }).filter(marker => marker !== null);

  return extractedMarkers;
};

export const Maps = ({ buildings = [], searchField, hubData}) => {

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_APIKEY,
    libraries,
  });

  const [map, setMap] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [mapCenter, setMapCenter] = useState(center); 
  const markersData = markers(hubData);
  const [refreshPage, setRefreshPage] = useState(false);
  const [imageIndex, setImageIndex] = useState(0); // Track current index of images
  const [numImages, setNumImages] = useState(3);

    // Filter markers to show only the selected building marker
    const filteredMarkers = markersData.filter(marker => {
      return searchField === '' || marker.title.toLowerCase().includes(searchField.toLowerCase());
    });
  
  const displayBuildings = () => {
    const startIndex = imageIndex * numImages;
    const endIndex = startIndex + numImages;
    return buildings.slice(startIndex, endIndex);
  }; 

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1320) {
        setNumImages(6);
      } else {
        setNumImages(3);
      }
    };
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    // Initial call to set numImages based on window width
    handleResize();
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setImageIndex((imageIndex + 1) % Math.ceil(buildings.length / numImages));
    }, 15000);  
    return () => clearInterval(timer); // Cleanup on unmount
  }, [imageIndex, buildings.length, numImages]);

  useEffect(() => {
    // Check if the selectedBuilding state changes
    if (selectedBuilding === null && refreshPage) {
      // Trigger page refresh when the information window is closed and refreshPage flag is set
      window.location.reload();
    }
  }, [selectedBuilding, refreshPage]); // Include selectedBuilding and refreshPage in the dependency array

  useEffect(() => {
    if (selectedMarker) {
      setMapCenter(selectedMarker.position);
    }
  }, [selectedMarker]);
  
  const onMapLoad = map => {
    setMap(map);
    window.google.maps.event.addListener(map, 'bounds_changed', () => {
      setMapBounds(map.getBounds());
    });
    
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  const mapOptions =  {
    styles: [
      {
        featureType: "all",
        elementType: "all",
        stylers: [
          { saturation: -100 }, // Set saturation to -100 for black and white
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
  
  const selectBuilding = (building) => {
    setSelectedBuilding(building);
    setRefreshPage(true); 
    // Find the marker corresponding to the selected building
    const marker = markersData.find(marker => getBuildingName(building) === marker.title);
    // If marker is found, update the map center and set the selected marker
    if (marker) {
      console.log('Marker position:', marker.position); 
      console.log('Map center updated to:', marker.position);
      setMapCenter(marker.position);
      setSelectedMarker(marker); // Update the selected marker
    } else {
      setSelectedMarker(null); // No marker found, clear the selected marker
    }
};
 
  return (
    <div className="mapContainer">
      <div className="map">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={10.8}
          center={mapCenter}
          options={mapOptions}
          onLoad={onMapLoad}
        >
          {filteredMarkers.map((marker, index) => {
             // If a selectedMarker exists, only render the selectedMarker.
            // Otherwise, render all markers as per the existing logic.
          if (!selectedMarker || marker.title === selectedMarker.title) {
          return (
            <Marker
              key={index}
              position={marker.position}
              title={marker.title}
              icon={{
                url: houseIcon,
                scaledSize: new window.google.maps.Size(20, 32),
              }}
              onClick={() => {
                const clickedBuilding = buildings.find(building => getBuildingName(building) === marker.title);
                setSelectedBuilding(clickedBuilding);
              }}
              />
            );
            }
            return null; // Don't render other markers if a specific one is selected
          })}
        </GoogleMap>
      </div>
      <div className="emptyWindow">
        {selectedBuilding ? (
          <div className='mapCardContainer'>  
            <ul>
              <li className="mapCard" key={selectedBuilding.id}>
                <h2 className='h2_map'>{getBuildingName(selectedBuilding)}</h2>
                <div className="mapIconsContainer">
                  <img src={closeIcon} alt="Close" className="closeIcon" onClick={() => setSelectedBuilding(null)} />
                  <img className="emptyHeart_map" src={emptyHeart} alt="empty-heart" />
                </div>
                <figure className='map_picture_url'>
                  <img src={selectedBuilding.productImages[0]?.thumbnailUrl} alt={selectedBuilding.productImages[0]?.altText} />
                </figure>
                <div className='info'>
                  <p className='p'>Osoite: {selectedBuilding.postalAddresses[0]?.streetName}</p>
                  <p className='p'>Kaupunki: {selectedBuilding.postalAddresses[0]?.city}</p>
                  <p className='p'>Postinumero: {selectedBuilding.postalAddresses[0]?.postalCode}</p>
                </div>
                <a className='zoom' onClick={() => setShowPopup(true)}> {/* Show popup on click */}
                  LUE LISÄÄ
                </a>
              </li>
            </ul>
            {showPopup && <Popup building={selectedBuilding} onClose={() => setShowPopup(false)} />} {/* Conditionally render popup */}
          </div>
        ) : (
          displayBuildings().map(building => (
            <div key={building.id} className="building-image-container">
              <figure className='picture_map' onClick={() => selectBuilding(building)}>  
              <img
              src={building.productImages[0]?.originalUrl}
              alt={building.productImages[0]?.altText}
              title={getBuildingName(building)}
              />
              </figure>
            </div>
          ))
        )}
      </div>
    </div>
  );  
};
