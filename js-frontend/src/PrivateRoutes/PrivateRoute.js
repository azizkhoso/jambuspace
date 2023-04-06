import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';

function PrivateRoute({ children, roles, userRole }) {
  return roles.includes(userRole) ? children : <Navigate to="/" />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  userRole: PropTypes.string.isRequired,
};

PrivateRoute.defaultProps = {
  roles: [],
  userRole: '',
};

export function PrivateOutlet({ roles, userRole }) {
  return roles.includes(userRole) ? <Outlet /> : <Navigate to="/" />;
}

PrivateOutlet.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  userRole: PropTypes.string.isRequired,
};

PrivateOutlet.defaultProps = {
  roles: [],
  userRole: '',
};

export default PrivateRoute;
