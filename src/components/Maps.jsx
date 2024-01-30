import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import '../styles/Maps.css';
import houseIcon from '../assets/house.png'; // Importing the house.png file

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 60.1699, // default latitude
  lng: 24.9384, // default longitude
};

const markers = [
    { position: { lat: 60.1706504, lng: 24.9364049 }, title: 'Amos Rex' },
    { position: { lat: 60.17001745, lng: 24.9440677623992 }, title: 'Ateneumin taidemuseo' },
    { position: { lat: 60.1600628740227, lng: 24.922695503294 }, title: 'Clarion Hotel Helsinki' },
    { position: { lat: 60.1635706218208, lng: 24.9392131154624 }, title: 'Design District Helsinki' },
    { position: { lat: 60.20859, lng: 24.97539 }, title: 'Designmuseo Arabia' },
    { position: { lat: 60.18527285, lng: 24.8562462609865 }, title: 'Didrichsen museo' },
    { position: { lat: 60.1441753535626, lng: 24.9855922651141 }, title: 'Ehrensvärd-museo' },
    { position: { lat: 60.17878, lng: 24.79478 }, title: 'EMMA – Espoon modernin taiteen museo' },
    { position: { lat: 60.2755499, lng: 24.6688687 }, title: 'Espoon Automuseo' },
    { position: { lat: 60.1778999, lng: 24.804333 }, title: 'Espoon kulttuurikeskus' },
    { position: { lat: 60.2569414, lng: 25.1054363 }, title: 'Fazer Experience Vierailukeskus' },
    { position: { lat: 60.1758229, lng: 24.9335608297167 }, title: 'Finlandia-talo' },
    { position: { lat: 60.1788939, lng: 24.7943157 }, title: 'Futuro-talo' },
    { position: { lat: 60.2064796769452, lng: 24.8388756997883 }, title: 'Gallen-Kallelan Museo' },
    { position: { lat: 60.1635297, lng: 24.8359911081639 }, title: 'Hanasaaren galleria' },
    { position: { lat: 60.1635297, lng: 24.8359911081639 }, title: 'Hanasaari – ruotsalais-suomalainen kulttuurikeskus' },
    { position: { lat: 60.1689855, lng: 24.9521743 }, title: 'Helsingin matkailuneuvonta' },
    { position: { lat: 60.1667098555807, lng: 24.953596228711 }, title: 'Helsingin matkailuneuvonta paviljongilla' },
    { position: { lat: 60.17041695, lng: 24.9521727903568 }, title: 'Helsingin tuomiokirkko' },
    { position: { lat: 60.20859, lng: 24.97539 }, title: 'Iittala & Arabia Muotoilukeskus' },
    { position: { lat: 60.1788939, lng: 24.7943157 }, title: 'KAMU Espoon kaupunginmuseo' },
    { position: { lat: 60.2060662, lng: 24.6532097 }, title: 'Kannusali' },
    { position: { lat: 60.1750711951119, lng: 24.9836880806834 }, title: 'Korkeasaaren eläintarha' },
    { position: { lat: 60.15434, lng: 24.98985 }, title: 'Lonnan saari' },
    { position: { lat: 60.17880605, lng: 24.7968872202258 }, title: 'Museo Leikki' },
    { position: { lat: 60.2929237527319, lng: 24.5564810985727 }, title: 'Nuuksion kansallispuisto' },
    { position: { lat: 60.17204005, lng: 24.9367421223869 }, title: 'Nykytaiteen museo Kiasma/Finnish National Gallery' },
    { position: { lat: 60.2818785550166, lng: 25.1959215273734 }, title: 'Sipoonkorven kansallispuisto' },
    { position: { lat: 60.1458471339988, lng: 24.9893476255238 }, title: 'Sotamuseon Maneesi ja Tykistömaneesi' },
    { position: { lat: 60.1425490390967, lng: 24.9895944169533 }, title: 'Sukellusvene Vesikko' },
    { position: { lat: 60.3031384293747, lng: 24.9572482194253 }, title: 'Suomen Ilmailumuseo' },
    { position: { lat: 60.17880605, lng: 24.7968872202258 }, title: 'Suomen kello- ja korumuseo Kruunu' },
    { position: { lat: 60.2937108, lng: 24.557039547569 }, title: 'Suomen luontokeskus Haltia' },
    { position: { lat: 60.145504, lng: 24.987774 }, title: 'Suomenlinnamuseo' },
    { position: { lat: 60.145812, lng: 24.991372 }, title: 'Suomenlinnan Lelumuseo' },
    { position: { lat: 60.1439456482997, lng: 24.9845243303156 }, title: 'Suomenlinnan merilinnoitus' },
    { position: { lat: 60.1489438716674, lng: 24.9848036500059 }, title: 'Suomenlinnan vierailijakeskus' },
    { position: { lat: 60.2183097240005, lng: 24.8129976633936 }, title: 'Taidegalleria Aarni' },
    { position: { lat: 60.2209541, lng: 24.6799432377572 }, title: 'Talomuseo Glims' },
    { position: { lat: 60.1406410474853, lng: 25.0072102832257 }, title: 'Vallisaari' },
    { position: { lat: 60.290901, lng: 25.0431272789568 }, title: 'Vantaan kaupunginmuseo' }
];

export const Maps = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_APIKEY,
    libraries,
  });

  const [map, setMap] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);

  useEffect(() => {
    if (isLoaded && !loadError) {
      if (map) {
        markers.forEach(({ position, title }) => {
          const marker = new window.google.maps.Marker({
            position,
            map,
            title,
            icon: {
              url: houseIcon, // Using house.png as the icon
              scaledSize: new window.google.maps.Size(20, 20), // Set a smaller size for the icon
            },
          });

          // Remove marker if it's outside the bounds of the map
          if (mapBounds && !mapBounds.contains(marker.getPosition())) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [isLoaded, loadError, map, mapBounds]);

  const onMapLoad = (map) => {
    setMap(map);
    // Set up bounds listener once the map is loaded
    window.google.maps.event.addListener(map, 'bounds_changed', () => {
      setMapBounds(map.getBounds());
    });
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  const mapOptions = {
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


  return (
    <div className="mapContainer">
      <div className="map">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13.6}
          center={center}
          options={mapOptions}
          onLoad={onMapLoad} // Store the map instance in state
        >
          {/* The markers will be added dynamically in the useEffect hook */}
        </GoogleMap>
      </div>
    </div>
  );
};
