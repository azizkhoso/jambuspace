import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import ReactAliceCarousel from 'react-alice-carousel';

import banner1 from '../../../assets/banner-1.jpg';
import banner2 from '../../../assets/banner-2.jpg';

const Banner = () => {
  return (
    <Box className="banner-carousel" mx="auto">
      <ReactAliceCarousel
        disableButtonsControls
        disableDotsControls
        disableSlideInfo
        mouseTracking
        responsive={{
          0: {
            items: 1,
          },
        }}
        items={[banner1, banner2].map((item, index) => (
          <Box
            key={index}
            height="70vh"
            position="relative"
            sx={{
              backgroundImage: `url(${item})`,
              backgroundPosition: '50% 20%',
            }}
          >
            <Box
              sx={{
                backdropFilter: 'brightness(50%)',
              }}
              position="absolute"
              left="0"
              right="0"
              top="0"
              bottom="0"
            >
              <Container
                maxWidth="xl"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  height: '100%',
                  width: '100%',
                }}
              >
                <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
                  Hire on-demand <br /> Engineers & Freelancers
                </Typography>
              </Container>
            </Box>
          </Box>
        ))}
      />
      {/* <Box as="img" src={banner1} maxWidth="100%" />, */}
    </Box>
  );
};

export default Banner;
