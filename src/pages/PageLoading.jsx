import { Box, CircularProgress, Typography } from '@mui/material';

export default function PageLoading({ message = '' }) {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant='body1' color='textSecondary'>
        {message}
      </Typography>
    </Box>
  );
}
