import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import logo from '../assets/logo.png';
import useGlobalState from '../hooks/useGlobalState';
import { Else, If, Then } from 'react-if';
import { toast } from 'react-toastify';
import { logout } from '../api/auth';

const settings = [{ key: 'profile', path: '/pages/profile', label: 'Profile' }];

const menu = [
  {
    key: 'home',
    label: 'Home',
    path: '/',
    isPrivateRoute: false,
    allow: ['customer', 'seller'],
  },
  {
    key: '',
    label: '',
    path: '/pages/',
    isPrivateRoute: true,
    allow: ['customer', 'seller'],
  },
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/pages/dashboard',
    isPrivateRoute: true,
    allow: ['customer', 'seller'],
  },

  /* {
    key: 'orders',
    label: 'Orders',
    path: '/pages/orders',
    isPrivateRoute: true,
    allow: ['customer', 'seller'],
  }, */
  {
    key: 'jobs',
    label: 'Jobs',
    path: '/jobs',
    isForBoth: true,
    allow: ['seller'],
  },
  {
    key: 'post-job',
    label: 'Post Job',
    path: '/pages/post-job',
    isPrivateRoute: true,
    allow: ['customer'],
  },
  {
    key: 'chat',
    label: 'Chat',
    path: '/pages/chat',
    isPrivateRoute: true,
    allow: ['customer', 'seller'],
  },
  /* {
    key: 'gigs',
    label: 'Gigs',
    path: '/pages/gigs',
    isPrivateRoute: true,
    allow: ['seller'],
  }, */
  {
    key: 'notifications',
    label: 'Notifications',
    path: '/pages/notifications',
    isPrivateRoute: true,
    allow: ['seller', 'customer'],
  },
  /* {
    key: 'view_gigs',
    label: 'View Gigs',
    path: '/gigs',
    isPrivateRoute: true,
    allow: ['customer'],
  }, */
  {
    key: 'edit-profile',
    label: 'Edit Profile',
    path: '/admin',
    isPrivateRoute: true,
    allow: ['admin'],
  },
  {
    key: 'add-company-margin',
    label: 'Add Margin',
    path: '/admin/company-margin',
    isPrivateRoute: true,
    allow: ['admin'],
  },
  {
    key: 'technologies',
    label: 'Technologies',
    path: '/admin/technologies',
    isPrivateRoute: true,
    allow: ['admin'],
  },
  /* {
    key: 'all-jobs',
    label: 'All Jobs',
    path: '/admin/all-jobs',
    isPrivateRoute: true,
    allow: ['admin'],
  }, */
  {
    key: 'customers-accounts',
    label: 'Customers',
    path: '/admin/customers',
    isPrivateRoute: true,
    allow: ['admin'],
  },
  {
    key: 'sellers-accounts',
    label: 'Sellers',
    path: '/admin/sellers',
    isPrivateRoute: true,
    allow: ['admin'],
  },
];

function Navbar() {
  const navigate = useNavigate();
  const { user, logoutUser } = useGlobalState();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const filteredMenu = menu
    .filter((item) => (user ? item.isPrivateRoute : !item.isPrivateRoute) || item.isForBoth)
    .filter((item) => item.allow.includes(user?.userType));

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout()
      .then(() => {
        navigate('/login');
        logoutUser();
      })
      .catch((res) => {
        toast(res?.data?.message || res.message, { type: 'error' });
      });
  };

  return (
    <AppBar position="sticky" color="transparent" sx={{ backdropFilter: 'blur(12px)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' }, py: '4px' }}>
          {/*Large screen logo*/}
          <Box as={Link} to="/" sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
            <Box as="img" src={logo} alt="jambuspace logo" />
          </Box>
          {/*xs screen menu icon, hidden for time being */}
          {/*<Box sx={{ display: { xs: 'none', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {filteredMenu.map((page) => (
                <MenuItem key={page.key} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
              </Box>*/}
          {/*small screen logo*/}
          <Box
            as={Link}
            to="/"
            sx={{
              display: { xs: 'flex', md: 'none' },
              mr: 'auto',
            }}
          >
            <Box as="img" src={logo} alt="jambuspace logo" />
          </Box>
          {/*md screen links */}
          <Box sx={{ mx: 'auto', display: { xs: 'none', md: 'flex' }, gap: '4px' }}>
            {filteredMenu.map((item) => (
              <Link to={item.path} key={item.key}>
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, display: 'block', color: 'black', textTransform: 'none' }}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </Box>

          <Box ml="auto">
            <If condition={user}>
              <Then>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={user?.fullName} src={user?.image?.url} />
                </IconButton>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting.key} onClick={handleCloseUserMenu}>
                      <Link to={setting.path}>
                        <Typography textAlign="center" color="black">
                          {setting.label}
                        </Typography>
                      </Link>
                    </MenuItem>
                  ))}
                  <MenuItem onClick={() => handleLogout()}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </Then>
              <Else>
                <Box display="flex" gap="8px">
                  <Link to="/signup">
                    <Button variant="outlined" sx={{ borderRadius: 9999 }}>
                      Sign up
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="contained" sx={{ borderRadius: 9999 }}>
                      Login
                    </Button>
                  </Link>
                </Box>
              </Else>
            </If>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
