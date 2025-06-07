import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { Box, CircularProgress } from '@mui/material';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 14.072275,
  lng: -87.192136,
};

export default function PageHome() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // asegúrate de definirlo en tu .env
  });

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
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        {/* Aquí luego puedes renderizar marcadores con las farmacias */}
      </GoogleMap>
    </Box>
  );
}
