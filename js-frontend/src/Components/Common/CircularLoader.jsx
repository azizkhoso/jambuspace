import React from 'react';
import PropTypes from 'prop-types';

import { Box, CircularProgress } from '@mui/material';

export default function CircularLoader({ size }) {
  return (
    <Box display="flex" w="100%" justifyContent="center" alignItems="center">
      <CircularProgress size={size} />
    </Box>
  );
}

CircularLoader.propTypes = {
  size: PropTypes.string,
};
