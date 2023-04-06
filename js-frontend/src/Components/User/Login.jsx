import React from 'react';
// import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  RadioGroup,
  Radio,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import CustomButton from '../Common/Button/CustomButton';
import '../Stylesheet/Login/login.page.scss';
import { useFormik } from 'formik';
import { Email, Key } from '@mui/icons-material';
import useGlobalState from '../hooks/useGlobalState';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../api/auth';
import VerifyOtp from './VerifyOtp';

const initialValues = {
  email: '',
  password: '',
  type: 'customer',
};

const validationSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password should be at least 8 characters long')
    .required('Password is required'),
  type: yup.string().required('User type is required'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { loginUser } = useGlobalState();
  const [userId, setUserId] = React.useState('');
  const [userType, setUserType] = React.useState('');
  const [isOpenOtp, openOtp] = React.useState(false);
  const { mutate, isLoading } = useMutation((vals) => login(vals), {
    onSuccess: ({ data }) => {
      // save current user in global state
      loginUser(data);
      navigate('/pages/dashboard');
      queryClient.invalidateQueries('user');
    },
    onError: (err) => {
      const data = err?.response?.data;
      if (!data?.emailVerified && data?._id) {
        toast.error('Email not verified, please check your inbox');
        setUserId(data._id);
        setUserType(data.userType);
        openOtp(true);
      } else toast.error(err?.response?.data.message || err.message);
    },
  });
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => mutate(values),
  });

  return (
    <>
      <Container fluid className="form-card d-flex align-items-center justify-content-center my-5">
        <Container className=" border rounded pb-5 loginCard">
          <Row className="justify-content-center text-center pb-5">
            <Col className="px-5">
              <div className="form-header py-2 my-3 mt-4">
                <h4>Login to JambuSpace</h4>
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
                <FormControl sx={{ my: 1.5 }}>
                  <FormLabel sx={{ textAlign: 'left' }}>Login as</FormLabel>
                  <RadioGroup
                    row
                    name="type"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel value="customer" control={<Radio />} label="Client" />
                    <FormControlLabel value="seller" control={<Radio />} label="Tech" />
                  </RadioGroup>
                </FormControl>
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
            </Col>
          </Row>
          <VerifyOtp
            userId={userId}
            userType={userType}
            isOpen={isOpenOtp}
            onClose={() => openOtp(false)}
          />
          <Row className="form-footer border-top">
            <Col className="my-4 text-center d-flex flex-column justify-content-center align-items-center">
              <p className="mb-0 account-text d-inline-block">
                Don&apos;t have an JambuSpace account?
              </p>
              <Link to="/signup" className="text-decoration-none ">
                <CustomButton classes="mt-4 px-5 w-100" values="Sign Up" type="secondary" />
              </Link>
            </Col>
          </Row>
        </Container>
      </Container>

      {/* <Container fluid className="bg-color-primary text-white py-4">
        <Row>
          <Col className="d-flex align-items-center justify-content-center flex-column">
            <p className="mb-2">© 2015 - 2022 JambuSpace® Global Inc.</p>
            <div className="footer-content text-center">
              <p className="mb-0">
                <a className="text-white" href="/">
                  Terms of Service
                </a>
              </p>
              <p className="mb-0">
                <a className="text-white" href="/">
                  Privacy Policy
                </a>
              </p>
              <p className="mb-0">
                <a className="text-white" href="/">
                  Accessibility
                </a>
              </p>
            </div>
          </Col>
        </Row>
      </Container> */}
    </>
  );
};

export default LoginPage;
