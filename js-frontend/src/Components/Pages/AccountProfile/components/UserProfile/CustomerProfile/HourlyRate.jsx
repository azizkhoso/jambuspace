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
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import useGlobalState from '../../../../../hooks/useGlobalState';
import { useMutation } from '@tanstack/react-query';
import { updateCustomer } from '../../../../../api/client';
import { toast } from 'react-toastify';

export default function HourlyRate() {
  const { user, setUser } = useGlobalState();
  const [isOpen, setOpen] = React.useState(false);
  const [earnings, setEarnings] = React.useState(user?.earnings || '');
  const { isLoading, mutate } = useMutation((vals) => updateCustomer(vals), {
    onSuccess: ({ data }) => {
      setUser(data);
      setOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
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
            <Typography variant="h6">Hourly Rate</Typography>
            <IconButton onClick={() => setOpen(true)}>
              <Edit />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">${user?.earnings}</Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Dialog open={isOpen} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Hourly Rate</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={4} py={2}>
            <TextField
              type="number"
              variant="outlined"
              label="Hourly Rate"
              fullWidth
              InputProps={{
                label: 'Hourly Rate',
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              sx={{ mt: 1 }}
              onChange={(e) => setEarnings(e.target.value)}
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
              <Button
                disabled={isLoading}
                variant="contained"
                color="primary"
                onClick={() => {
                  mutate({ earnings });
                }}
              >
                {isLoading ? <CircularProgress size="22px" /> : 'Update'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
