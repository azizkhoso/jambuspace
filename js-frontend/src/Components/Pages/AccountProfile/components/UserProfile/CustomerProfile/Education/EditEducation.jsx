import React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import useGlobalState from '../../../../../../hooks/useGlobalState';
import { useMutation } from '@tanstack/react-query';
import { updateSeller } from '../../../../../../api/seller';

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

function EditEducation({ index, isOpen, onClose }) {
  const { user, setUser } = useGlobalState();
  const { isLoading, mutate } = useMutation((vals) => updateSeller(vals), {
    onSuccess: ({ data }) => {
      setUser(data); // data = { education: [{...}] }
      onClose();
    },
  });
  const formik = useFormik({
    initialValues: user?.education[index] || initialVals,
    validationSchema,
    onSubmit: (updatedEdu) => {
      const beforeCurrentEdus = user.education.slice(0, index);
      const afterCurrentEdus = user.education.slice(index + 1);
      const newEdus = [...beforeCurrentEdus, updatedEdu, ...afterCurrentEdus];
      mutate({ education: newEdus });
    },
  });
  return (
    <Dialog open={isOpen || isLoading} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Education</DialogTitle>
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
          <Box display="flex" alignItems="center" justifyContent="flex-end" flexWrap="wrap" gap={2}>
            <Button variant="outlined" color="error" onClick={onClose}>
              Close
            </Button>
            <Button disabled={isLoading} variant="contained" color="primary" type="submit">
              {isLoading ? <CircularProgress size="22px" /> : 'Update'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

EditEducation.propTypes = {
  index: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default React.memo(EditEducation);
