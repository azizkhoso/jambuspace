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
import { Edit } from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { updateSeller } from '../../../../../api/seller';
import useGlobalState from '../../../../../hooks/useGlobalState';

export default function About() {
  const { user, setUser } = useGlobalState();
  const [isOpen, setOpen] = React.useState(false);
  const [about, setAbout] = React.useState(user?.about || '');
  const { isLoading, mutate } = useMutation((vals) => updateSeller(vals), {
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
            <Typography variant="h6">About</Typography>
            <IconButton onClick={() => setOpen(true)}>
              <Edit />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">{user?.about || 'Not provided yet'}</Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Dialog open={isOpen || isLoading} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update About</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={4} py={2}>
            <TextField
              multiline
              rows={3}
              variant="outlined"
              title="About"
              style={{ width: '100%' }}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
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
                  mutate({ about });
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
