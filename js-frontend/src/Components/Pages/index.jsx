import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PageLoader } from '../../App';
import useGlobalState from '../hooks/useGlobalState';
import io from 'socket.io-client';
import { toast } from 'react-toastify';

const Chat = React.lazy(() => import('./Chat'));
// const Gigs = React.lazy(() => import('./Gig/Gigs'));
const Notifications = React.lazy(() => import('./Notifications'));
// const CreateGigs = React.lazy(() => import('./Gig/CreateGigs'));
// New Work
const AccountProfile = React.lazy(() => import('./AccountProfile'));
// New Work

const PostJob = React.lazy(() => import('./PostJob'));
// const Orders = React.lazy(() => import('./Orders/Orders'));
// const PlaceOrder = React.lazy(() => import('./Orders/PlaceOrder'));
const DashboardPage = React.lazy(() => import('./Dashboard'));
// const VideoCall = React.lazy(() => import('./VideoCall/VideoCall'));

const routes = [
  { path: '/chat', element: <Chat /> },
  // { path: '/gigs', element: <Gigs /> },
  { path: '/notifications', element: <Notifications /> },
  // { path: '/creategigs', element: <CreateGigs /> },
  { path: '/profile', element: <AccountProfile /> },
  { path: '/post-job', element: <PostJob /> },
  // { path: '/orders', element: <Orders /> },
  // { path: '/place-order', element: <PlaceOrder /> },
  { path: '/dashboard', element: <DashboardPage /> },
  // { path: '/video-call', element: <VideoCall /> },
];

export default function Pages() {
  const { user } = useGlobalState();
  const { current: notificationsSocket } = React.useRef(
    io(`${process.env.REACT_APP_BACKEND_URL}/notifications`, {
      query: {
        userId: user?._id,
        userType: user?.userType,
      },
    }),
  );

  React.useEffect(() => {
    notificationsSocket.emit('all-notifications');
    notificationsSocket.on('all-notifications', (notifs) => {
      notifs.forEach((notif) => toast.info(notif.description));
    });
    notificationsSocket.on('new-notification', (notif) => toast.info(notif.description));
  }, []);
  if (!user) return <Navigate replace to="/" />;
  return (
    <Routes>
      <Route index element={<h1>Hello</h1>} />
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
