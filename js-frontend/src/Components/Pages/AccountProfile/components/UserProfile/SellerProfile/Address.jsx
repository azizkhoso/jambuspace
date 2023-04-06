import React from 'react';

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import * as yup from 'yup';
import { useFormik } from 'formik';

import useGlobalState from '../../../../../hooks/useGlobalState';
import countries from '../../../../../utils/countries';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { updateSeller } from '../../../../../api/seller';

const initialValues = {
  city: '',
  country: '',
};

const validationSchema = yup.object({
  city: yup
    .string()
    .min(3, 'City name should be at least 3 characters long')
    .required('City is required'),
  country: yup
    .string()
    .oneOf(
      countries.map((c) => c.name),
      'Enter a valid country name',
    )
    .required('Country is required'),
});

export default function Address() {
  const { user, setUser } = useGlobalState();
  const [isOpen, setOpen] = React.useState(false);
  const { isLoading, mutate } = useMutation((vals) => updateSeller(vals), {
    onSuccess: ({ data }) => {
      setUser(data);
      setOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });
  const formik = useFormik({
    initialValues: {
      city: user?.city || initialValues.city,
      country: user?.country || initialValues.country,
    },
    validationSchema,
    onSubmit: (vals) => mutate(vals),
  });
  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid
            item
            xs={12}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography variant="h6">Address</Typography>
            <IconButton onClick={() => setOpen(true)}>
              <Edit />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">{`${user?.city}, ${user?.country}`}</Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Dialog open={isOpen || isLoading} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Address</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            display="flex"
            flexDirection="column"
            gap={4}
            py={2}
            onSubmit={formik.handleSubmit}
          >
            <TextField
              name="city"
              variant="outlined"
              label="City"
              value={formik.values.city}
              onChange={formik.handleChange}
              helperText={formik.touched.city && formik.errors.city}
              error={formik.touched.city && formik.errors.city}
            />
            <FormControl error={formik.touched.country && formik.errors.country}>
              <InputLabel>Country</InputLabel>
              <Select
                variant="outlined"
                name="country"
                label="Country"
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
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              flexWrap="wrap"
              gap={2}
            >
              <Button variant="outlined" color="error" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button disabled={isLoading} variant="contained" color="primary" type="submit">
                {isLoading ? <CircularProgress size="22px" /> : 'Update'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
