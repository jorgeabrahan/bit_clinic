import { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import {
  Box,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Typography,
} from '@mui/material';
import { supabase } from '@/config/supabase';
import TabSearchByBranch from '@/components/tabs/TabSearchByBranch';
import TabSearchByPharmacy from '@/components/tabs/TabSearchByPharmacy';
import TabSearchAlternatives from '@/components/tabs/TabSearchAlternatives';

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
  const [tab, setTab] = useState(0);

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
              text: branch.pharmacies?.commercial_name ?? branch.name,
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

      <Paper sx={{ mt: 3 }}>
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          indicatorColor='primary'
          textColor='primary'
          variant='scrollable'
          scrollButtons='auto'
        >
          <Tab label='Buscar por sucursal' />
          <Tab label='Buscar por farmacia' />
          <Tab label='Buscar alternativas' />
        </Tabs>
        <Box p={2}>
          {tab === 0 && <TabSearchByBranch />}
          {tab === 1 && <TabSearchByPharmacy />}
          {tab === 2 && <TabSearchAlternatives />}
        </Box>
      </Paper>
    </Box>
  );
}
