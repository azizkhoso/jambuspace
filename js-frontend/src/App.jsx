import React, { Suspense, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress, LinearProgress, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { Else, If, Then } from 'react-if';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './Components/Pages/Homepage';
import useGlobalState from './Components/hooks/useGlobalState';
import './App.scss';
import CustomNavbar from './Components/Common/CustomNavbar';
import CustomFooter from './Components/Common/CustomFooter';
import { getLoggedin } from './Components/api/auth';
import Navbar from './Components/Common/Navbar';
// these routes are not important to be loaded in initial render
// hence these are lazy loaded
const LoginPage = React.lazy(() => import('./Components/User/Login'));
const AdminLogin = React.lazy(() => import('./Components/User/AdminLogin'));
const SignUpPage = React.lazy(() => import('./Components/User/Signup'));
const JobsPage = React.lazy(() => import('./Components/Pages/Jobs'));
const JobDetails = React.lazy(() => import('./Components/Pages/Jobs/components/JobDetails'));
const JobProposal = React.lazy(() => import('./Components/Pages/Jobs/components/JobProposal'));
// const ViewGigs = React.lazy(() => import('./Components/Pages/Gig/ViewGigs'));
// const ViewGig = React.lazy(() => import('./Components/Pages/Gig/ViewGig'));
const UserDetailPage = React.lazy(() => import('./Components/Pages/UserDetails'));
const Pages = React.lazy(() => import('./Components/Pages'));
const Success = React.lazy(() => import('./Components/Pages/PaymentStatus/Success'));
const Cancel = React.lazy(() => import('./Components/Pages/PaymentStatus/Cancel'));
const Admin = React.lazy(() => import('./Components/Pages/Admin'));

const routes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/admin-login', element: <AdminLogin /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/jobs', element: <JobsPage /> },
  { path: '/jobs/:id', element: <JobDetails /> },
  { path: '/jobs/:id/submitproposal', element: <JobProposal /> },
  // { path: '/gigs', element: <ViewGigs /> },
  // { path: '/gig', element: <ViewGig /> },
  { path: '/user-details/:userID', element: <UserDetailPage /> },
  { path: '/pages/*', element: <Pages /> },
  { path: '/payment/success', element: <Success /> },
  { path: '/payment/cancel', element: <Cancel /> },
  { path: '/admin/*', element: <Admin /> },
];

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#2058C3',
    },
    grayBg: {
      light: '#f5f9f5',
      main: '#f3f7f2',
      dark: '#c2c6c2',
      contrastText: 'rgba(0, 0, 0, 0.27)',
    },
  },
});

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
    mutations: {
      retry: 0,
    },
  },
});

export function PageLoader() {
  return (
    <Box width="100%" height="100%" minHeight="50vh" display="flex">
      <CircularProgress sx={{ m: 'auto' }} />
    </Box>
  );
}

function App() {
  const { user, loginUser, logoutUser } = useGlobalState();
  const [isLoading, setLoading] = React.useState(true);
  // checking login status on app startup
  useEffect(() => {
    if (!user) {
      client
        .fetchQuery(['user'], () => getLoggedin())
        .then((res) => loginUser(res.data.user))
        .catch(() => logoutUser())
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <QueryClientProvider client={client}>
      <ThemeProvider theme={muiTheme}>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnHover
        />
        <If condition={isLoading}>
          <Then>
            <Box position="absolute" left="0" right="0" height="100vh" display="flex">
              <Box m="auto" display="flex" flexDirection="column">
                <Typography variant="h3" textAlign="center">
                  JambuSpace
                </Typography>
                <LinearProgress />
              </Box>
            </Box>
          </Then>
          <Else>
            <Router>
              {/* Add in Navbar and footer here so that they are not dubplicated in every route */}
              {/* <CustomNavbar /> */}
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                {routes.map((r) => (
                  <Route
                    key={r.path}
                    path={r.path}
                    element={<Suspense fallback={<PageLoader />}>{r.element}</Suspense>}
                  />
                ))}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
              <CustomFooter />
            </Router>
          </Else>
        </If>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
