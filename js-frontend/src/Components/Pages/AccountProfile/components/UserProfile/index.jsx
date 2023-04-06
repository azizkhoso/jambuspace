import React from 'react';
import { Box } from '@mui/material';
import useGlobalState from '../../../../hooks/useGlobalState';
import SellerProfile from './SellerProfile';
import CustomerProfile from './CustomerProfile';
import { Else, If, Then } from 'react-if';
import { Navigate } from 'react-router-dom';

const UserProfile = () => {
  const { user } = useGlobalState();
  if (!user) return <Navigate replace to="/" />;
  return (
    <Box display="flex" flexDirection="column" rowGap={2}>
      <If condition={user?.userType === 'seller'}>
        <Then>
          <SellerProfile />
        </Then>
        <Else>
          <CustomerProfile />
        </Else>
      </If>
    </Box>
  );
};

export default UserProfile;
