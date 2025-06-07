import { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Box, CircularProgress } from '@mui/material';
import { supabase } from '@/config/supabase';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 15.501504,
  lng: -88.016532,
};

const mapOptions = {
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: 'poi.business',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

export default function PageHome() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [branches, setBranches] = useState([]);

  const fetchBranches = async () => {
    const { data, error } = await supabase
      .from('branches')
      .select('*, pharmacies(commercial_name)');
    if (!error) setBranches(data);
  };

  useEffect(() => {
    if (isLoaded) fetchBranches();
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height='100%'
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        options={mapOptions}
      >
        {branches.map((branch) => (
          <Marker
            key={branch.id}
            position={{ lat: branch.latitude, lng: branch.longitude }}
            onClick={() => {
              const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${branch.latitude},${branch.longitude}`;
              window.open(gmapsUrl, '_blank');
            }}
            label={{
              text: `${branch.name} (${
                branch.pharmacies?.commercial_name || 'N/A'
              })`,
              className: 'map-marker-label',
            }}
          />
        ))}
      </GoogleMap>

      <style>{`
        .map-marker-label {
          background-color: white;
          padding: 2px 4px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          white-space: nowrap;
        }
      `}</style>
    </Box>
  );
}
