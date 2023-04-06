import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PageLoader } from '../../../App';
import useGlobalState from '../../hooks/useGlobalState';

const AdminProfile = React.lazy(() => import('./AdminProfile'));
const CompanyMargin = React.lazy(() => import('./CompanyMargin'));
const AllJobs = React.lazy(() => import('./AllJobs'));
const Customers = React.lazy(() => import('./Customers'));
const Sellers = React.lazy(() => import('./Sellers'));
const Technologies = React.lazy(() => import('./Technologies'));

const routes = [
  { path: '/company-margin', element: <CompanyMargin /> },
  { path: '/all-jobs', element: <AllJobs /> },
  { path: '/customers/*', element: <Customers /> },
  { path: '/sellers/*', element: <Sellers /> },
  { path: '/technologies', element: <Technologies /> },
];

export default function Admin() {
  const { user } = useGlobalState();
  if (!user || !user.userType === 'admin') return <Navigate replace to="/" />;
  return (
    <Routes>
      <Route index element={<AdminProfile />} />
      {routes.map((r) => (
        <Route
          key={r.path}
          path={r.path}
          element={<Suspense fallback={<PageLoader />}>{r.element}</Suspense>}
        />
      ))}
    </Routes>
  );
}
