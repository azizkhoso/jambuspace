import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardHeader } from '@mui/material';
import PropTypes from 'prop-types';

function GigCard({ image, title, dec }) {
  return (
    <Card className="m-3 p-2 rounded shadow">
      <CardMedia variant="top" src={image} />
      <CardContent>
        <CardHeader>{title}</CardHeader>
        <Typography>{dec}</Typography>
      </CardContent>
    </Card>
  );
}

GigCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  dec: PropTypes.string.isRequired,
};

export default GigCard;
