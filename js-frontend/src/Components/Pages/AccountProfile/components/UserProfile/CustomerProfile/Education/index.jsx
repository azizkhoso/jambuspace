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
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { Add, Delete, Edit, School } from '@mui/icons-material';
import { useFormik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { updateCustomer } from '../../../../../../api/client';
import useGlobalState from '../../../../../../hooks/useGlobalState';
import EditEducation from './EditEducation';
import { When } from 'react-if';

const validationSchema = yup.object({
  school: yup.string().min(5, 'School name is too short').required('School is required'),
  degree: yup.string().min(5, 'Degree name is too short').required('Degree is required'),
  fieldOfStudy: yup.string().min(5, 'Field name is too short').required('Field is required'),
  startDate: yup
    .object({
      month: yup
        .number()
        .integer()
        .min(1, 'Month can not be less than 1')
        .max(12, 'Month can not be greater than 12')
        .required('Month is required'),
      year: yup.number().integer().min(1950, 'Year is too old').required('Year is required'),
    })
    .required(),
  endDate: yup
    .object({
      month: yup
        .number()
        .integer()
        .min(1, 'Month can not be less than 1')
        .max(12, 'Month can not be greater than 12')
        .required('Month is required'),
      year: yup.number().integer().min(1950, 'Year is too old').required('Year is required'),
    })
    .required(),
  grade: yup.string().min(1, 'Grade is too short'),
  description: yup.string().min(10, 'Description is too short').max(255, 'Description is too long'),
});

const initialVals = {
  school: '',
  degree: '',
  fieldOfStudy: '',
  startDate: { month: 0, year: 0 },
  endDate: { month: 0, year: 0 },
  grade: '',
  description: '',
};

function Education() {
  const [isOpen, setOpen] = React.useState(false);
  const [deleteIndex, setDeleteIndex] = React.useState(-1);
  const [editIndex, setEditIndex] = React.useState(-1);
  const { user, setUser } = useGlobalState();
  const { isLoading, mutate } = useMutation((vals) => updateCustomer(vals), {
    onSuccess: ({ data }) => {
      setUser(data); // data = { education: [{...}] }
      setOpen(false);
      setDeleteIndex(-1);
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });
  const formik = useFormik({
    initialValues: initialVals,
    validationSchema,
    onSubmit: (values) => mutate({ education: [...user.education, values] }),
  });
  const deleteEducation = (index) => {
    setDeleteIndex(() => index);
    const newEdus = user?.education?.filter((edu, i) => i !== index);
    mutate({ education: newEdus });
  };
  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid
            item
            xs={12}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography variant="h6">Education</Typography>
            <IconButton disabled={isLoading} onClick={() => setOpen(true)}>
              <Add />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            {user?.education?.map((edu, index) => (
              <Box key={Math.random()} display="flex" flexWrap="wrap" gap={1}>
                <School sx={{ width: '32px', height: '32px' }} />
                <Box
                  display="flex"
                  flexDirection="column"
                  order={{ xs: 3, sm: 2 }}
                  width={{ xs: '100%', sm: 'fit-content' }}
                >
                  <Typography variant="body1" fontWeight="bold">
                    {edu.school}
                  </Typography>
                  <Typography variant="body1">{edu.degree}</Typography>
                  <Typography variant="subtitle1">{`${edu.startDate.year} - ${edu.endDate.year}`}</Typography>
                  <Typography variant="subtitle1">{`Grade: ${edu.grade}`}</Typography>
                  <Typography variant="subtitle2" fontWeight="normal">
                    {edu.description}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  jusityfContent="space-between"
                  gap={1}
                  ml="auto"
                  order={{ xs: 2, sm: 3 }}
                >
                  <IconButton disabled={isLoading} onClick={() => setEditIndex(() => index)}>
                    <Edit />
                  </IconButton>
                  <IconButton disabled={isLoading} onClick={() => deleteEducation(index)}>
                    {isLoading && deleteIndex === index ? (
                      <CircularProgress size="18px" />
                    ) : (
                      <Delete />
                    )}
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Grid>
        </Grid>
      </CardContent>
      {/* Add education dialog*/}
      <Dialog open={isOpen} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Education</DialogTitle>
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
              name="school"
              variant="outlined"
              label="School"
              size="small"
              value={formik.values.school}
              onChange={formik.handleChange}
              helperText={formik.touched.school && formik.errors.school}
              error={formik.touched.school && formik.errors.school}
            />
            <TextField
              name="degree"
              variant="outlined"
              label="Degree"
              size="small"
              value={formik.values.degree}
              onChange={formik.handleChange}
              helperText={formik.touched.degree && formik.errors.degree}
              error={formik.touched.degree && formik.errors.degree}
            />
            <TextField
              name="fieldOfStudy"
              variant="outlined"
              label="Field of Study"
              size="small"
              value={formik.values.fieldOfStudy}
              onChange={formik.handleChange}
              helperText={formik.touched.fieldOfStudy && formik.errors.fieldOfStudy}
              error={formik.touched.fieldOfStudy && formik.errors.fieldOfStudy}
            />
            <Box
              display="flex"
              justifyContent="space-between"
              flexDirection={{ xs: 'column', md: 'row' }}
              gap={4}
            >
              <TextField
                name="startDate.month"
                type="number"
                variant="outlined"
                label="Start Date Month"
                size="small"
                value={formik.values.startDate?.month}
                onChange={formik.handleChange}
                helperText={formik.touched.startDate?.month && formik.errors.startDate?.month}
                error={formik.touched.startDate?.month && formik.errors.startDate?.month}
              />
              <TextField
                name="startDate.year"
                type="number"
                variant="outlined"
                label="Start Date Year"
                size="small"
                value={formik.values.startDate?.year}
                onChange={formik.handleChange}
                helperText={formik.touched.startDate?.year && formik.errors.startDate?.year}
                error={formik.touched.startDate?.year && formik.errors.startDate?.year}
              />
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              flexDirection={{ xs: 'column', md: 'row' }}
              gap={4}
            >
              <TextField
                name="endDate.month"
                type="number"
                variant="outlined"
                label="End Date Month"
                size="small"
                value={formik.values.endDate?.month}
                onChange={formik.handleChange}
                helperText={formik.touched.endDate?.month && formik.errors.endDate?.month}
                error={formik.touched.endDate?.month && formik.errors.endDate?.month}
              />
              <TextField
                name="endDate.year"
                type="number"
                variant="outlined"
                label="End Date Year"
                size="small"
                value={formik.values.endDate?.year}
                onChange={formik.handleChange}
                helperText={formik.touched.endDate?.year && formik.errors.endDate?.year}
                error={formik.touched.endDate?.year && formik.errors.endDate?.year}
              />
            </Box>
            <TextField
              name="grade"
              variant="outlined"
              label="Grade"
              size="small"
              value={formik.values.grade}
              onChange={formik.handleChange}
              helperText={formik.touched.grade && formik.errors.grade}
              error={formik.touched.grade && formik.errors.grade}
            />
            <TextField
              name="description"
              variant="outlined"
              label="Description"
              size="small"
              multiline
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
              helperText={formik.touched.description && formik.errors.description}
              error={formik.touched.description && formik.errors.description}
            />
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
                {isLoading ? <CircularProgress size="22px" /> : 'Add'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      {/* Add Education dialog end */}
      <When condition={editIndex >= 0}>
        <EditEducation index={editIndex} isOpen={editIndex >= 0} onClose={() => setEditIndex(-1)} />
      </When>
    </Card>
  );
}

export default React.memo(Education);
