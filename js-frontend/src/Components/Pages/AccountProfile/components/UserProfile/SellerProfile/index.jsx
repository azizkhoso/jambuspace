import React from 'react';
import { Box } from '@mui/system';

import FullName from './FullName';
import Email from './Email';
import UserName from './UserName';
import ProfilePicture from './ProfilePicture';
import About from './About';
import Address from './Address';
import Education from './Education';
import HourlyRate from './HourlyRate';
import Skills from './Skills';
import Resume from './Resume';
import Payment from './Payment';

export default function SellerProfile() {
  return (
    <Box display="flex" flexDirection="column" rowGap={2}>
      <ProfilePicture />
      <Payment />
      <FullName />
      <Email />
      <UserName />
      <About />
      <Skills />
      <Address />
      <HourlyRate />
      <Education />
      <Resume />
    </Box>
  );
}
