import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Switch, Case, When } from 'react-if';
import { deleteCustomerJob, getCustomer } from '../../../api/admin';
import { toast } from 'react-toastify';
import CircularLoader from '../../../Common/CircularLoader';
import { Delete } from '@mui/icons-material';

export default function Customer() {
  const { id } = useParams();
  const client = useQueryClient();
  const [customer, setCustomer] = React.useState({});

  const { isLoading } = useQuery([`admin-customer-${id}`], () => getCustomer(id), {
    onSuccess: ({ data }) => setCustomer(data),
    onError: (err) => toast.error(err?.response?.data?.message || err?.message),
  });

  const { mutate: deleteJob } = useMutation((data) => deleteCustomerJob(data), {
    onSuccess: () => client.invalidateQueries(`admin-customer-${id}`),
    onError: (err) => toast.error(err?.response?.data?.message || err?.message),
  });

  return (
    <Container maxWidth="lg">
      <Paper sx={{ my: 6, p: 3, display: 'flex', flexDirection: 'column' }}>
        <Switch>
          <Case condition={isLoading}>
            <CircularLoader />
          </Case>
          <Case condition={!customer._id}>
            <Typography textAlign="center">No data available</Typography>
          </Case>
          <Case condition={customer}>
            <Box display="flex" flexWrap="wrap" gap={2}>
              <img
                style={{
                  flex: '1 1 130px',
                  maxWidth: '130px',
                  height: 'auto',
                  borderRadius: '50%',
                }}
                src={process.env.REACT_APP_BACKEND_URL + customer?.image?.url}
              />
              <Box dispaly="flex" flexDirection="column">
                <Typography variant="h4">{customer.fullName}</Typography>
                <Typography variant="h6">{customer.username}</Typography>
                <Typography variant="h6">{customer.email}</Typography>
              </Box>
            </Box>
            <When condition={customer?.jobs?.length > 0}>
              <Box display="flex" flexDirection="column" width="100%">
                <Typography variant="h6" textAlign="center" my={2}>
                  Jobs
                </Typography>
                <TableContainer>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Budget</TableCell>
                        <TableCell>Technologies</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Bids</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customer?.jobs?.map((j, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{j.title}</TableCell>
                          <TableCell>{j.budget}</TableCell>
                          <TableCell>{j?.technologies?.join(', ')}</TableCell>
                          <TableCell>{j.duration}</TableCell>
                          <TableCell>{j?.bids?.length}</TableCell>
                          <TableCell>
                            <IconButton
                              color="error"
                              onClick={() => deleteJob({ customerId: id, jobId: j._id })}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </When>
          </Case>
        </Switch>
      </Paper>
    </Container>
  );
}
