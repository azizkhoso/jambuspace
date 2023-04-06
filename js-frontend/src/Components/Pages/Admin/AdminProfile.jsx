import React from 'react';
import { Button, Container, Grid, Paper, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { updateAdminProfile } from '../../api/admin';
import useGlobalState from '../../hooks/useGlobalState';
import { toast } from 'react-toastify';

const AdminProfile = () => {
  const { user, setUser } = useGlobalState();

  const formik = useFormik({
    initialValues: {
      email: user?.email || '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      updateAdminProfile(values)
        .then(({ data }) => {
          setUser(data);
          toast.success('Profile updated successfully');
        })
        .catch((error) => {
          toast.error(error.response?.data.message || error.message);
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  return (
    <Container maxWidth="lg">
      <Paper sx={{ my: 6, p: 3, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" textAlign="center" mt={3}>
          Edit Profile
        </Typography>
        <Grid
          container
          component="form"
          alignItems="center"
          justify="center"
          direction="column"
          onSubmit={formik.handleSubmit}
          style={{ backgroundColor: 'white' }}
        >
          <Grid item style={{ padding: '15px' }}>
            <TextField
              id="email"
              name="email"
              label="Email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.email && formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item style={{ padding: '15px' }}>
            <TextField
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.password && formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
          <Button variant="contained" color="primary" type="submit" style={{ marginTop: '25px' }}>
            Submit
          </Button>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AdminProfile;
