import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { TEXTS } from '../../constants';

const LoadingSpinner = ({ message = TEXTS.COMMON.LOADING, size = 40 }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={3}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;
