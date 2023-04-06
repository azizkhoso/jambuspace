import React from 'react';
import { If, Then, Else } from 'react-if';
import useGlobalState from '../../hooks/useGlobalState';
import '../../Stylesheet/Dashboard/dashboard.scss';
import CustomerDashboard from './CustomerDashboard';
import SellerDashboard from './SellerDashboard';

const DashboardPage = () => {
  const { user } = useGlobalState();

  return (
    <If condition={user?.userType === 'customer'}>
      <Then>
        <CustomerDashboard />
      </Then>
      <Else>
        <SellerDashboard />
      </Else>
    </If>
  );
};

export default DashboardPage;
