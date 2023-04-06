import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { updateCompanyMargin } from '../../api/admin';

const CompanyMargin = () => {
  const defaultValues = {
    margin: '',
  };
  const [formValues, setFormValues] = useState(defaultValues);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateCompanyMargin(formValues)
      .then(() => {
        toast('Company Margin Updated Successfully');
        setFormValues({ margin: '' });
      })
      .catch((error) => {
        toast(error.response?.data.message || error.message);
      });
  };

  const validate = () => {
    if (formValues.margin !== '') return false;
    else return true;
  };

  return (
    <div>
      <h3 className="mt-5" style={{ textAlign: 'center' }}>
        Change Jambu Space Percentage
      </h3>
      <form onSubmit={handleSubmit}>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          direction="column"
          style={{ backgroundColor: 'white', marginTop: '7rem' }}
        >
          <Grid item style={{ padding: '15px' }}>
            <TextField
              id="age-input"
              name="margin"
              label="Margin Percentage"
              type="text"
              value={formValues.margin}
              onChange={handleInputChange}
            />
          </Grid>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{ marginTop: '25px' }}
            disabled={validate()}
          >
            Submit
          </Button>
        </Grid>
      </form>
    </div>
  );
};

export default CompanyMargin;
