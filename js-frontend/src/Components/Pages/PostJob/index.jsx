import React from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  FormHelperText,
  Grid,
  Input,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { UploadFile } from '@mui/icons-material';
import { When } from 'react-if';
import moment from 'moment';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createJob } from '../../api/client';
import { getTechnologies } from '../../api/website';

const jobSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  budget: yup
    .number()
    .integer()
    .moreThan(0, 'Budget must be greater than 0')
    .required('Budget is required'),
  dueDate: yup
    .string()
    .test('valid-date', 'Enter a valid date', (val) => moment(val, 'YYYY-MM-DD').isValid()),
  duration: yup.string().required('Duration is required'),
  experienceLevel: yup.string().required('Experience level is required'),
  technologies: yup.array(yup.string()).min(2, 'At least 2 technologies are required'),
  image: yup
    .mixed()
    .test('is-image', 'Select a valid image file', (val) => !val || val.type.startsWith('image')),
});

const initialVals = {
  title: '',
  description: '',
  budget: 0,
  dueDate: moment().format('YYYY-MM-DD'),
  duration: '',
  experienceLevel: '',
  technologies: [],
  image: null,
};

const PostJob = () => {
  const navigate = useNavigate();
  const [technologies, setTechnologies] = React.useState([]);

  useQuery(['technologies'], () => getTechnologies(), {
    onSuccess: ({ data }) => setTechnologies(data),
    onError: (err) => toast.error(err?.response?.data.message || err.message),
  });

  const { isLoading, mutate } = useMutation((vals) => createJob(vals), {
    onSuccess: ({ data }) => {
      toast.success(data.message);
      navigate('/pages/dashboard');
    },
    onError: (err) => toast.error(err?.response?.data.message || err.message),
  });

  const formik = useFormik({
    initialValues: initialVals,
    validationSchema: jobSchema,
    onSubmit: (vals) => mutate(vals),
  });

  return (
    <Container maxWidth="lg" sx={{ my: 3 }}>
      <Box borderBottom="1px solid gray">
        <Typography variant="h4">Post a Job</Typography>
        <Typography variant="h6">Job Details</Typography>
      </Box>
      <Grid container spacing={3} my={1} component="form" onSubmit={formik.handleSubmit}>
        <Grid item xs={12} md={6}>
          <TextField
            size="small"
            label="Job Title"
            placeholder="Your job title here"
            name="title"
            type="text"
            fullWidth
            value={formik.values.title}
            onChange={formik.handleChange}
            error={Boolean(formik.touched.title && formik.errors.title)}
            helperText={formik.errors.title}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            size="small"
            id="duration"
            label="Duration of the project"
            select
            name="duration"
            fullWidth
            value={formik.values.duration}
            onChange={formik.handleChange}
            error={Boolean(formik.touched.duration && formik.errors.duration)}
            helperText={formik.errors.duration}
          >
            <MenuItem disabled value="Please select a duration">
              Please select a duration
            </MenuItem>
            <MenuItem value="less than a week">Less than a week</MenuItem>
            <MenuItem value="less than a month">Less than a month</MenuItem>
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="less than 6 months">Less than 6 Months</MenuItem>
            <MenuItem value="less than year">Less than Year</MenuItem>
            <MenuItem value="year">Year</MenuItem>
            <MenuItem value="more than 1 year">Year than 1 year</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            size="small"
            fullWidth
            select
            label="Experience Level"
            name="experienceLevel"
            value={formik.values.experienceLevel}
            onChange={formik.handleChange}
            error={Boolean(formik.touched.experienceLevel && formik.errors.experienceLevel)}
            helperText={formik.errors.experienceLevel}
          >
            <MenuItem value="Entry-level">Entry-level</MenuItem>
            <MenuItem value="Intermediate">Intermediate</MenuItem>
            <MenuItem value="Mid-level">Mid-level</MenuItem>
            <MenuItem value="Senior">Senior</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            size="small"
            label="Budget"
            fullWidth
            placeholder="Budget"
            name="budget"
            type="number"
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            value={formik.values.budget}
            onChange={formik.handleChange}
            error={Boolean(formik.touched.budget && formik.errors.budget)}
            helperText={formik.errors.budget}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            size="small"
            label="Due Date"
            type="date"
            name="dueDate"
            fullWidth
            value={formik.values.dueDate}
            onChange={formik.handleChange}
            error={Boolean(formik.touched.dueDate && formik.errors.dueDate)}
            helperText={formik.errors.dueDate}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            multiple
            onChange={
              (e, values) => formik.setFieldValue('technologies', values) // accessing last option
            }
            id="tags-filled"
            options={technologies.map((option) => option.title)}
            name="technologies"
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  key={index}
                  variant="outlined"
                  size="small"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            size="small"
            renderInput={(params) => (
              <TextField
                size="small"
                {...params}
                label="Required Technologies"
                error={Boolean(formik.touched.technologies && formik.errors.technologies)}
                helperText={formik.errors.technologies}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            size="small"
            label="Job Description"
            placeholder="Describe your job"
            name="description"
            multiline
            rows={5}
            fullWidth
            value={formik.values.description}
            onChange={formik.handleChange}
            error={Boolean(formik.touched.description && formik.errors.description)}
            helperText={formik.errors.description}
          />
        </Grid>
        <Grid item xs={12}>
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
        </Grid>
        <Grid item>
          <Button variant="contained" type="submit" disabled={isLoading}>
            {isLoading ? <CircularProgress size="20px" /> : 'Post'}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PostJob;
