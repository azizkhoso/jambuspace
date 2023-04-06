import React from 'react';
import { Box } from '@mui/system';

import About from './About';
import Address from './Address';
import FullName from './FullName';
import Email from './Email';
import UserName from './UserName';
import ProfilePicture from './ProfilePicture';

export default function CustomerProfile() {
  return (
    <Box display="flex" flexDirection="column" rowGap={2}>
      <ProfilePicture />
      <FullName />
      <Email />
      <UserName />
      <About />
      <Address />
    </Box>
  );
}
