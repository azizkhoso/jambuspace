import { Check, Delete, Visibility } from '@mui/icons-material';
import { Box, Container, IconButton, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Case, Switch, When } from 'react-if';
import { Link, Route, Routes } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  deleteSeller as dltSeller,
  getSellers,
  getTotalSellersCount,
  toggleEnableSeller,
} from '../../../api/admin';
import Seller from './Seller';
import CircularLoader from '../../../Common/CircularLoader';

const ROWS_PER_PAGE = 1;

const SellersAccounts = () => {
  const client = useQueryClient();
  const [page, setPage] = React.useState(0);
  const [sellers, setsellers] = useState([]);
  const [totalCount, setTotalCount] = useState(-1); // -1 represents we don't know total numbers

  useQuery(['admin-sellers-count'], () => getTotalSellersCount(), {
    onSuccess: ({ data }) => setTotalCount(data.total),
    onError: (err) => toast.error(err.response?.data.message || err?.message),
  });

  const { isLoading } = useQuery(['admin-sellers', page], () => getSellers(page * ROWS_PER_PAGE), {
    onSuccess: ({ data }) => setsellers(data),
    onError: (err) => toast.error(err.response?.data.message || err?.message),
  });

  const { mutate: enableSeller } = useMutation((id) => toggleEnableSeller(id), {
    onSuccess: () => client.invalidateQueries(['admin-sellers']),
    onError: (err) => toast.error(err.response?.data.message || err?.message),
  });

  const { mutate: deleteSeller } = useMutation((id) => dltSeller(id), {
    onSuccess: () => client.invalidateQueries(['admin-sellers', 'admin-sellers-count']),
    onError: (err) => toast.error(err.response?.data.message || err?.message),
  });

  return (
    <Routes>
      <Route
        index
        element={
          <>
            <Typography variant="h4" textAlign="center" mt={3}>
              Sellers
            </Typography>
            <Container maxWidth="lg">
              <Paper sx={{ my: 6 }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bolder' }}>
                          Name
                        </TableCell>
                        <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bolder' }}>
                          Email
                        </TableCell>
                        <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bolder' }}>
                          Country
                        </TableCell>
                        <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bolder' }}>
                          Image
                        </TableCell>
                        <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bolder' }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <Switch>
                      <Case condition={isLoading}>
                        <Box position="absolute" left={0} right={0}>
                          <CircularLoader />
                        </Box>
                      </Case>
                      <Case condition={sellers.length === 0}>
                        <Box position="absolute" left={0} right={0} py={1}>
                          <Typography fontSize="sm" textAlign="center">
                            No records available
                          </Typography>
                        </Box>
                      </Case>
                      <Case condition={sellers.length > 0}>
                        <TableBody>
                          {sellers.map((row) => {
                            return (
                              <TableRow hover key={row._id}>
                                <TableCell>
                                  <Typography>{row.fullName}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>{row.email}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>{row.country}</Typography>
                                </TableCell>
                                <TableCell>
                                  <img
                                    style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                                    src={process.env.REACT_APP_BACKEND_URL + row?.image?.url}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Link to={`${row._id}`}>
                                    <IconButton>
                                      <Visibility />
                                    </IconButton>
                                  </Link>
                                  <IconButton
                                    color={!row.isEnabled ? 'error' : 'primary'}
                                    onClick={() => enableSeller(row._id)}
                                  >
                                    <Check />
                                  </IconButton>
                                  <IconButton color="error" onClick={() => deleteSeller(row._id)}>
                                    <Delete />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Case>
                    </Switch>
                  </Table>
                </TableContainer>
                <When condition={(sellers.length > 0 || page > 0) && !isLoading}>
                  <TablePagination
                    rowsPerPageOptions={[{ label: 'Rows', value: -1 }]}
                    rowsPerPage={ROWS_PER_PAGE}
                    count={totalCount}
                    page={page}
                    onPageChange={(e, p) => setPage(p)}
                    sx={{ '& p': { m: 0 } }} // setting margin to 0 because some style is putting it un-necessarily
                  />
                </When>
              </Paper>
            </Container>
          </>
        }
      />
      <Route exact path="/:id" element={<Seller />} />
    </Routes>
  );
};

export default SellersAccounts;
