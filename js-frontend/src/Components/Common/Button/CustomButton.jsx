import React from 'react';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';

const CustomButton = ({ values, variant, type, block, classes, onClick, maxWidth }) => {
  const fullwidth = block === true;
  const isPrimary = type === 'primary';
  const isSecondary = type === 'secondary';

  return (
    <Button
      variant={variant || 'contained'}
      className={`${classes}`}
      onClick={onClick}
      sx={{
        width: (fullwidth && '100%') || (isSecondary && '40%') || (isPrimary && 'auto'),
        maxWidth: maxWidth,
        background: (isPrimary && '#3592d5') || (isSecondary && 'transparent'),
        color: (isPrimary && 'white') || (isSecondary && '#3592d5'),
        border: isSecondary && '1px solid #3592d5',
        boxShadow: isSecondary && 'none',
        borderRadius: '20px',
        textTransform: 'none',
        fontWeight: 'bold',
        '&:hover': {
          background: (isPrimary && '#3592d5') || (isSecondary && 'rgba(0, 149, 255, 0.1)'),
          color: (isPrimary && '#3c408a') || (isSecondary && '#3592d5'),
          boxShadow: isSecondary && 'none',
          fontWeight: 'bold',
        },
      }}
    >
      {values}
    </Button>
  );
};

CustomButton.propTypes = {
  values: PropTypes.string.isRequired,
  variant: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  block: PropTypes.string.isRequired,
  classes: PropTypes.string.isRequired,
  onClick: PropTypes.string.isRequired,
  maxWidth: PropTypes.string.isRequired,
};

export default CustomButton;
