import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';
import { TEXTS } from '../../constants';

const ErrorMessage = ({ 
  error, 
  title = TEXTS.COMMON.ERROR, 
  severity = 'error',
  onClose = null 
}) => {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message || TEXTS.COMMON.ERROR;

  return (
    <Box sx={{ my: 2 }}>
      <Alert severity={severity} onClose={onClose}>
        {title && <AlertTitle>{title}</AlertTitle>}
        {errorMessage}
      </Alert>
    </Box>
  );
};

export default ErrorMessage;
