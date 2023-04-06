import React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import { resendOTP, verifyOTP } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const validationSchema = yup.object().shape({
  otp: yup.string().required('Please enter the OTP'),
});

function VerifyOtp({ userId, userType, isOpen, onClose }) {
  const navigate = useNavigate();
  const { mutate: verify, isLoading: isVerifying } = useMutation(verifyOTP, {
    onSuccess: () => {
      toast.success('OTP verified successfully');
      navigate('/login');
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });
  const { mutate: resend, isLoading: isResending } = useMutation(resendOTP, {
    onSuccess: () => {
      toast.success('OTP resent successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });
  const formik = useFormik({
    initialValues: {
      otp: '',
    },
    validationSchema,
    onSubmit: (values) => {
      verify({ userId, userType, otp: values.otp });
    },
  });
  const { values, errors, touched, handleChange, handleSubmit } = formik;
  const handleResendOtp = () => {
    resend({ userId, userType });
  };
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Verify OTP</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={4} py={2}>
          <Typography variant="body2">Enter the OTP sent to your email</Typography>
          <TextField
            variant="outlined"
            label="OTP"
            name="otp"
            type="text"
            value={values.otp}
            onChange={handleChange}
            error={touched.otp && Boolean(errors.otp)}
            helperText={touched.otp && errors.otp}
            fullWidth
          />
          <Box display="flex" alignItems="center" justifyContent="flex-end" flexWrap="wrap" gap={2}>
            <Button variant="outlined" color="error" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleResendOtp}
              disabled={isResending || isVerifying}
            >
              {isResending ? <CircularProgress size="22px" /> : 'Resend OTP'}
            </Button>
            <Button
              disabled={isVerifying || isResending}
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              {isVerifying ? <CircularProgress size="22px" /> : 'Verify'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

VerifyOtp.propTypes = {
  userId: PropTypes.string.isRequired,
  userType: PropTypes.oneOf(['customer', 'seller']).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default VerifyOtp;
