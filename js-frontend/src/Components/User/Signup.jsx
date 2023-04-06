import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Container, Row, Col, FormLabel } from 'react-bootstrap';
import { Email, Key, Person, Business, Flag, UploadFile } from '@mui/icons-material';
import {
  TextField,
  Radio,
  Button,
  Select,
  Box,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Input,
  CircularProgress,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import countries from '../utils/countries';
import '../Stylesheet/Login/login.page.scss';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { When } from 'react-if';
import { LocationCity, Phone } from '@material-ui/icons';
import { signup } from '../api/auth';
import VerifyOtp from './VerifyOtp';

const initialValues = {
  fullName: '',
  username: '',
  email: '',
  password: '',
  city: '',
  country: '',
  phone: '',
  company: '',
  image: null,
  type: 'customer',
};

const validationSchema = yup.object({
  fullName: yup
    .string()
    .min(3, 'Full name should be at least 3 characters long')
    .required('Full name is required'),
  username: yup
    .string()
    .min(3, 'User name should be at least 3 characters long')
    .required('User name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password should be at least 8 characters long')
    .required('Password is required'),
  city: yup
    .string()
    .min(3, 'City name should be at least 3 characters long')
    .required('City is required'),
  company: yup.string().min(3, 'Company name should be at least 3 characters long'),
  country: yup
    .string()
    .oneOf(
      countries.map((c) => c.name),
      'Enter a valid country name',
    )
    .required('Country is required'),
  phone: yup
    .string()
    .matches(
      new RegExp(`^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$`),
      'Enter a valid phone number',
    )
    .required('Phone is required'),
  image: yup
    .mixed()
    .test('is-image', 'Select a valid image file', (val) => !val || val.type.startsWith('image')),
  type: yup.string().required('User type is required'),
});

const SignUpPage = () => {
  const [isOpenOtp, openOtp] = useState(null);
  const [userId, setUserId] = useState(null);

  const { isLoading, mutate } = useMutation((vals) => signup(vals), {
    onSuccess: ({ data }) => {
      toast.success(data.message);
      setUserId(data._id);
      openOtp(true);
    },
    onError: (err) => toast.error(err?.response?.data.message || err.message),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => mutate(values),
  });
  return (
    <Container fluid className="form-card d-flex align-items-center justify-content-center my-2">
      <Container className=" border rounded pb-5 loginCard">
        <Row className="justify-content-center text-center">
          <Col className="px-5">
            <div className="form-header py-2 my-3 mt-4">
              <h3 className="font-rebrand fw-bold">Get your free account</h3>
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
                name="fullName"
                label="Full name"
                sx={{ my: 1.5 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment>
                      <Person />
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  style: { paddingLeft: '8px' },
                }}
                value={formik.values.fullName}
                onChange={formik.handleChange}
                error={formik.touched.fullName && formik.errors.fullName}
                helperText={formik.errors.fullName}
              />
              <TextField
                variant="outlined"
                size="small"
                name="username"
                label="Username"
                sx={{ my: 1.5 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment>
                      <Person />
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  style: { paddingLeft: '8px' },
                }}
                value={formik.values.username}
                onChange={formik.handleChange}
                error={formik.touched.username && formik.errors.username}
                helperText={formik.errors.username}
              />
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
              <TextField
                variant="outlined"
                size="small"
                name="phone"
                label="Phone"
                sx={{ my: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment>
                      <Phone />
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  style: { paddingLeft: '8px' },
                }}
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && formik.errors.phone}
                helperText={formik.errors.phone}
              />
              <TextField
                variant="outlined"
                size="small"
                name="company"
                label="Company"
                sx={{ my: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment>
                      <Business />
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  style: { paddingLeft: '8px' },
                }}
                value={formik.values.company}
                onChange={formik.handleChange}
                error={formik.touched.company && formik.errors.company}
                helperText={formik.errors.company}
              />
              <TextField
                variant="outlined"
                size="small"
                name="city"
                label="City"
                sx={{ my: 1.5 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment>
                      <LocationCity />
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  style: { paddingLeft: '8px' },
                }}
                value={formik.values.city}
                onChange={formik.handleChange}
                error={formik.touched.city && formik.errors.city}
                helperText={formik.errors.city}
              />
              <FormControl sx={{ my: 1.5 }} error={formik.touched.country && formik.errors.country}>
                <InputLabel>Country</InputLabel>
                <Select
                  variant="outlined"
                  size="small"
                  name="country"
                  label="Country"
                  sx={{
                    textAlign: 'left',
                  }}
                  startAdornment={
                    <InputAdornment>
                      <Flag />
                    </InputAdornment>
                  }
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  error={formik.touched.country && formik.errors.country}
                  helperText={formik.errors.country}
                >
                  {countries.map((c) => (
                    <MenuItem key={c.name} value={c.name}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{formik.errors.country}</FormHelperText>
              </FormControl>
              <Box
                sx={{
                  cursor: 'pointer',
                  my: 1.5,
                  '&:hover': {
                    '& div, & #upload-icon': {
                      color: 'black',
                    },
                    borderColor:
                      formik.touched.image && formik.errors.image
                        ? 'red !important'
                        : 'black !important',
                  },
                }}
                borderColor={
                  formik.touched.image && formik.errors.image ? 'red !important' : 'gray !important'
                }
                border="1px solid"
                borderRadius="4px"
                display="flex"
                flexDirection="column"
                py={0.7}
                px={1}
                component="label"
                htmlFor="image"
              >
                <Box display="flex" alignItems="center" width="100%">
                  <UploadFile id="upload-icon" htmlColor="gray" />
                  <Box color="gray" width="100%" textAlign="center">
                    Upload Image
                  </Box>
                </Box>
                <Input
                  id="image"
                  type="file"
                  hidden
                  onChange={(e) => formik.setFieldValue('image', e.target.files[0])}
                />
                <When condition={Boolean(formik.values.image)}>
                  <Box
                    width="100px"
                    height="100px"
                    borderRadius="50%"
                    component="img"
                    src={formik.values.image && URL.createObjectURL(formik.values.image)}
                    alt="profile picture"
                    mx="auto"
                  />
                </When>
                <When condition={formik.touched.image && formik.errors.image}>
                  <FormHelperText sx={{ color: 'red' }}>{formik.errors.image}</FormHelperText>
                </When>
              </Box>
              <FormControl sx={{ my: 1.5 }}>
                <FormLabel style={{ textAlign: 'left' }}>Signup as</FormLabel>
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
                {isLoading ? <CircularProgress size="20px" /> : 'Create an account'}
              </Button>
              <p className="mt-3">
                Already have an account? <Link to="/login">Login</Link>
              </p>
              <VerifyOtp
                userId={userId}
                userType={formik.values.type}
                isOpen={isOpenOtp}
                onClose={() => openOtp(false)}
              />
            </Box>
          </Col>
        </Row>
      </Container>
    </Container>
    /* 
      <Container fluid className="bg-color-primary text-white py-4">
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
      </Container>
    </> */
  );
};

export default SignUpPage;
