import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  InputAdornment,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import '../Stylesheet/Login/login.page.scss';
import { useFormik } from 'formik';
import { Email, Key } from '@mui/icons-material';
import useGlobalState from '../hooks/useGlobalState';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../api/auth';

const initialValues = {
  email: '',
  password: '',
  type: 'admin',
};

const validationSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password should be at least 8 characters long')
    .required('Password is required'),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user } = useGlobalState();
  const queryClient = useQueryClient();
  const { loginUser } = useGlobalState();
  const { mutate, isLoading } = useMutation((vals) => login(vals), {
    onSuccess: ({ data }) => {
      // save current user in global state
      loginUser(data);
      navigate('/admin');
      queryClient.invalidateQueries('user');
    },
    onError: (err) => toast.error(err?.response?.data.message || err.message),
  });
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => mutate(values),
  });
  if (user?.userType === 'admin') return <Navigate to="/admin" />;
  return (
    <>
      <Container fluid className="form-card d-flex align-items-center justify-content-center my-5">
        <Container className=" border rounded pb-5 loginCard">
          <Grid container className="justify-content-center text-center">
            <Grid item className="px-5">
              <div className="form-header py-2 my-3 mt-4">
                <h4>Admin Login to JambuSpace</h4>
              </div>
              <Box
                component="form"
                onSubmit={formik.handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column' }}
                className="px-4 form-wrapper"
              >
                <TextField
                  variant="outlined"
                  size="small"
                  name="email"
                  label="Email"
                  sx={{ my: 1.5 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment>
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    style: { paddingLeft: '8px' },
                  }}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && formik.errors.email}
                  helperText={formik.errors.email}
                />
                <TextField
                  type="password"
                  variant="outlined"
                  size="small"
                  name="password"
                  label="Password"
                  sx={{ my: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment>
                        <Key />
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    style: { paddingLeft: '8px' },
                  }}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && formik.errors.password}
                  helperText={formik.errors.password}
                />
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  type="submit"
                  sx={{ borderRadius: '9999px' }}
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size="20px" /> : 'Login'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Container>
    </>
  );
};

export default AdminLogin;
