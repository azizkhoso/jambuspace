import React from 'react';
import { Box } from '@mui/material';
import Banner from './components/Banner';
import HowItWorks from './components/HowItWorks';
import AboutUs from './components/AboutUs';
import TechnologyArea from './components/TechnologyArea';
import MissionAndVision from './components/MissionAndVision';
import Benefits from './components/Benefits';
import '../../Stylesheet/Homepage/homePage.scss';
import BrowesByCatogories from './components/BrowesByCatogories';
import TopSkills from './components/TopSkills';

const Homepage = () => {
  return (
    <Box>
      <Banner />
      {/* <HowItWorks /> */}
      {/* <AboutUs /> */}
      <BrowesByCatogories />

      <TechnologyArea />
      <TopSkills />
      <MissionAndVision />
      <Benefits />
    </Box>
  );
};

export default Homepage;
