import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { List } from './List';
import { Input } from './Input'; // Import Input component
import '../styles/Maps.css';
import houseIcon from '../assets/house.png';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 60.1699,
  lng: 24.9384,
};

const libraries = ['places'];

export const markers = hubData => {
  const extractedMarkers = hubData.data?.groupedProducts?.map((building, index) => {
    const location = building.postalAddresses[0]?.location;
    const name =
      building.productInformations[0]?.name ||
      (building.productImages[0]?.copyright === "Kuvio" ? "Oodi"
      : building.productImages[0]?.copyright.includes("Copyright: Visit Finland")
      ? building.productImages[0]?.copyright.split(":")[1].trim()
      : building.productImages[0]?.copyright);
   
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

export const Maps = ({ buildings = [], searchField = '', hubData }) => {
  
  const markersData = markers(hubData);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_APIKEY,
    libraries,
  });

  const [map, setMap] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [googleMarkers, setGoogleMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [imageIndex, setImageIndex] = useState(0); // Track current index of images
  const [numImages, setNumImages] = useState(3);
  
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

  const onMapLoad = map => {
    setMap(map);
    window.google.maps.event.addListener(map, 'bounds_changed', () => {
      setMapBounds(map.getBounds());
    });
  };

  const handleMarkerClick = (marker) => {
    console.log("Marker clicked:", marker);
    setSelectedMarker(marker);
  };

  const handleCloseInfoWindow = () => {
    setSelectedMarker(null);
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  const mapOptions = {
    disableDefaultUI: true, // Removes default UI (like zoom controls and street view)
    styles: [
        {
            "featureType": "all",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#444444"
                },
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.neighborhood",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#e0dfe0"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#a8a9a8"
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "lightness": 45
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#5b5b5a"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#ffffff"
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        }
    ],
  };
  
  // Function to slice the buildings array and display images based on numImages
  const displayBuildings = () => {
    const startIndex = imageIndex * numImages;
    const endIndex = startIndex + numImages;
    return buildings.slice(startIndex, endIndex);
  };

  return (
    <div className="mapContainer">
    <div className="map">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13.6}
          center={center}
          options={mapOptions}
          onLoad={onMapLoad}
        >
          {markersData && Array.isArray(markersData) && markersData.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              title={marker.title}
              onClick={() => handleMarkerClick(marker)}
              icon={{
                url: houseIcon,
                scaledSize: new window.google.maps.Size(15, 25),
              }}
            />
          ))}
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position} // Accessing the position directly from the marker object
              onCloseClick={handleCloseInfoWindow}
            >
              <div className="infoWindow">{selectedMarker.title}</div>
            </InfoWindow>
          )}
        </GoogleMap>
    </div>
            
    <div className="emptyWindow">
  {/* Display building information if buildings exist */}
  {displayBuildings().map(building => (
    <div key={building.id}>
      <figure className='picture_map'>
        <img 
          src={building.productImages[0]?.originalUrl} 
          alt={building.productImages[0]?.altText}
          title={
            building.productInformations[0]?.name||
            (building.productImages[0]?.copyright === "Kuvio" ? "Oodi"
            : building.productImages[0]?.copyright.includes("Copyright: Visit Finland")
            ? building.productImages[0]?.copyright.split(":")[1].trim()
            : building.productImages[0]?.copyright)
          }
        />
      </figure>
    </div>
  ))}
</div>

      
    </div>
  );
};
