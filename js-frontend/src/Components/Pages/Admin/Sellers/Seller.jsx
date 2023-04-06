import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Paper, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Switch, Case } from 'react-if';
import { getSeller } from '../../../api/admin';
import { toast } from 'react-toastify';
import CircularLoader from '../../../Common/CircularLoader';

export default function Seller() {
  const { id } = useParams();
  const [seller, setSeller] = React.useState({});

  const { isLoading } = useQuery([`admin-seller-${id}`], () => getSeller(id), {
    onSuccess: ({ data }) => setSeller(data),
    onError: (err) => toast.error(err?.response?.data?.message || err?.message),
  });

  return (
    <Container maxWidth="lg">
      <Paper sx={{ my: 6, p: 3, display: 'flex', flexDirection: 'column' }}>
        <Switch>
          <Case condition={isLoading}>
            <CircularLoader />
          </Case>
          <Case condition={!seller._id}>
            <Typography textAlign="center">No data available</Typography>
          </Case>
          <Case condition={seller}>
            <Box display="flex" flexWrap="wrap" gap={2}>
              <img
                style={{
                  flex: '1 1 130px',
                  maxWidth: '130px',
                  height: 'auto',
                  borderRadius: '50%',
                }}
                src={process.env.REACT_APP_BACKEND_URL + seller?.image?.url}
              />
              <Box dispaly="flex" flexDirection="column">
                <Typography variant="h4">{seller.fullName}</Typography>
                <Typography variant="h6">{seller.username}</Typography>
                <Typography variant="h6">{seller.email}</Typography>
              </Box>
            </Box>
          </Case>
        </Switch>
      </Paper>
    </Container>
  );
}
