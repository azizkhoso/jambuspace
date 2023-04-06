import React from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import { addTechnology } from '../../api/admin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Add } from '@material-ui/icons';

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  skills: yup.array().of(yup.string()),
});

const AddTechnology = ({ isOpen, onClose }) => {
  const client = useQueryClient();
  const [text, setText] = React.useState('');
  const { isLoading, mutate } = useMutation((vals) => addTechnology(vals), {
    onSuccess: () => {
      client.invalidateQueries('technologies');
      onClose();
    },
    onError: ({ response: res }) => toast(res?.data?.message || res.message, { type: 'error' }),
  });
  const { handleSubmit, handleChange, handleBlur, setFieldValue, values, errors, touched } =
    useFormik({
      initialValues: {
        title: '',
        skills: [],
      },
      validationSchema,
      onSubmit: (values) => mutate(values),
    });

  return (
    <Dialog
      open={isOpen}
      onClose={() => onClose()}
      aria-labelledby="form-dialog-title"
      components={{
        Root: 'form',
      }}
      onSubmit={handleSubmit}
    >
      <DialogTitle id="form-dialog-title">Add New Technology</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          id="title"
          label="Title"
          type="text"
          fullWidth
          required
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          error={Boolean(touched.title && errors.title)}
          helperText={touched.title && errors.title}
        />
        <Box mt={2} display="flex" alignItems="center" flexWrap="wrap">
          {values.skills.map((s) => (
            <Chip
              key={s}
              label={s}
              onDelete={() =>
                setFieldValue(
                  'skills',
                  values.skills.filter((sk) => sk !== s),
                )
              }
            />
          ))}
        </Box>
        <TextField
          margin="dense"
          id="skills"
          label="Skill"
          type="text"
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => {
                  if (text || text !== '' || !values.skills.find((i) => i === text)) {
                    setFieldValue('skills', [...values.skills, text]);
                    setText('');
                  }
                }}
              >
                <Add />
              </IconButton>
            ),
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="secondary">
          Close
        </Button>
        <Button disabled={isLoading} type="submit" onClick={handleSubmit} color="primary">
          {isLoading ? <CircularProgress size="18px" /> : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddTechnology.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddTechnology;
