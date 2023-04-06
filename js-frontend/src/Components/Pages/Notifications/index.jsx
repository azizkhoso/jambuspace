import React from 'react';
import { If, Then, Else } from 'react-if';
import SellerNotifications from './SellerNotifications';
import CustomerNotifications from './CustomerNotifications';
import useGlobalstate from '../../hooks/useGlobalState';

export default function NotificationsPage() {
  const { user } = useGlobalstate();
  return (
    <If condition={user?.userType === 'seller'}>
      <Then>
        <SellerNotifications />
      </Then>
      <Else>
        <CustomerNotifications />
      </Else>
    </If>
  );
}
