import { Check, Delete } from '@mui/icons-material';
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
import { toast } from 'react-toastify';
import CircularLoader from '../../Common/CircularLoader';
import {
  deleteNotification,
  getNotifications,
  getNotificationsCount,
  readNotification,
} from '../../api/seller';

const ROWS_PER_PAGE = 1;

const SellerNotifications = () => {
  const client = useQueryClient();
  const [page, setPage] = React.useState(0);
  const [notifications, setNotifications] = useState([]);
  const [totalCount, setTotalCount] = useState(-1); // -1 represents we don't know total numbers

  useQuery(['seller-notifications-count'], () => getNotificationsCount(), {
    onSuccess: ({ data }) => setTotalCount(data.total),
    onError: (err) => toast.error(err.response?.data.message || err?.message),
  });

  const { isLoading } = useQuery(
    ['seller-notifications', page],
    () => getNotifications(page * ROWS_PER_PAGE),
    {
      onSuccess: ({ data }) => setNotifications(data),
      onError: (err) => toast.error(err.response?.data.message || err?.message),
    },
  );

  const { mutate: markAsReadNotification } = useMutation((id) => readNotification(id), {
    onSuccess: () => client.invalidateQueries(['seller-notifications']),
    onError: (err) => toast.error(err.response?.data.message || err?.message),
  });

  const { mutate: deleteSellerNotification } = useMutation((id) => deleteNotification(id), {
    onSuccess: () =>
      client.invalidateQueries(['seller-notifications', 'seller-notifications-count']),
    onError: (err) => toast.error(err.response?.data.message || err?.message),
  });

  return (
    <>
      <Typography variant="h4" textAlign="center" mt={3}>
        Notifications
      </Typography>
      <Container maxWidth="lg">
        <Paper sx={{ my: 6 }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bolder' }}>
                    Image
                  </TableCell>
                  <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bolder' }}>
                    Description
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
                <Case condition={notifications.length === 0}>
                  <Box position="absolute" left={0} right={0} py={1}>
                    <Typography fontSize="sm" textAlign="center">
                      No records available
                    </Typography>
                  </Box>
                </Case>
                <Case condition={notifications.length > 0}>
                  <TableBody>
                    {notifications.map((row) => {
                      return (
                        <TableRow hover key={row._id}>
                          <TableCell>
                            <img
                              style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                              src={process.env.REACT_APP_BACKEND_URL + row?.image?.url}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography>{row.description}</Typography>
                          </TableCell>
                          <TableCell>
                            <When condition={!row.isRead}>
                              <IconButton
                                color="primary"
                                onClick={() => markAsReadNotification(row._id)}
                              >
                                <Check />
                              </IconButton>
                            </When>
                            <IconButton
                              color="error"
                              onClick={() => deleteSellerNotification(row._id)}
                            >
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
          <When condition={(notifications.length > 0 || page > 0) && !isLoading}>
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
  );
};

export default SellerNotifications;
