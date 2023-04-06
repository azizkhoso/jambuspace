import React, { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { BsCheckCircle } from 'react-icons/bs';
import { ImCancelCircle } from 'react-icons/im';
import { STATUS } from '../../utils/contants';
import { BASE_URL } from '../../utils/contants';
import { useState } from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';
const currentUser = JSON.parse(localStorage.getItem('authUser'));
const isSeller = localStorage.getItem('userType') === 'seller' ? true : false;
const Icons = {
  PLACED: (
    <>
      <Button
        variant="outlined"
        color="success"
        endIcon={<BsCheckCircle color="green" />}
        style={{
          marginRight: '15px',
        }}
      >
        APPROVE
      </Button>
      <Button variant="outlined" color="error" endIcon={<ImCancelCircle color="red" />}>
        CANCEL
      </Button>
    </>
  ),
  COMPLETED: (
    <>
      <Button
        variant="outlined"
        color="success"
        style={{
          marginRight: '15px',
        }}
      >
        View Order
      </Button>
    </>
  ),
  CANCELED: (
    <>
      <Button
        variant="outlined"
        color="success"
        style={{
          marginRight: '15px',
        }}
      >
        View Order
      </Button>
    </>
  ),
  STARTED: (
    <>
      <Button>Placed</Button>
      <Button>ACasfas</Button>
    </>
  ),
  PENDING: (
    <>
      <Button>Placed</Button>
      <Button>ACasfas</Button>
    </>
  ),
  DELIVERED: (
    <>
      <Button>Placed</Button>
      <Button>ACasfas</Button>
    </>
  ),
  REVISIONS: (
    <>
      <Button>Placed</Button>
      <Button>ACasfas</Button>
    </>
  ),
};
const columns = [
  {
    field: !isSeller ? 'seller' : 'buyer',
    headerName: !isSeller ? 'Seller' : 'Buyer',
    flex: 1,
  },
  { field: 'gig', headerName: 'Gig', flex: 1 },
  { field: 'duration', headerName: 'Duration', flex: 1 },
  { field: 'status', headerName: 'Status' },
  { field: 'budget', headerName: 'Budget' },
  {
    field: 'actions',
    headerName: 'Actions',
    flex: 1,
    renderCell: (params) => {
      switch (params.row.status) {
        case STATUS.PLACED:
          return (
            <>
              <Button
                variant="outlined"
                color="success"
                endIcon={<BsCheckCircle color="green" />}
                style={{
                  marginRight: '15px',
                }}
                onClick={() => {
                  axios
                    .post(`${BASE_URL}/api/payments/checkout`, {
                      gig: params.row.gigId,
                      seller: params.row.sellerId,
                      buyer: params.row.buyerId,
                      orderId: params.row.id,
                    })
                    .then(({ data }) => {
                      console.log(data);
                      window.location.href = data.url;
                    });
                }}
              >
                APPROVE
              </Button>
              <Button variant="outlined" color="error" endIcon={<ImCancelCircle color="red" />}>
                CANCEL
              </Button>
            </>
          );
        case STATUS.COMPLETED:
          return (
            <>
              <Button
                variant="outlined"
                color="success"
                style={{
                  marginRight: '15px',
                }}
              >
                View Order
              </Button>
            </>
          );
        case STATUS.CANCELED:
          return (
            <>
              <Button
                variant="outlined"
                color="warning"
                style={{
                  marginRight: '15px',
                }}
              >
                View Order
              </Button>
            </>
          );
        case STATUS.PAID:
          return (
            <>
              <Button
                variant="outlined"
                color="success"
                style={{
                  marginRight: '15px',
                }}
              >
                Paid
              </Button>
            </>
          );
        default:
          return (
            <>
              <Button
                variant="outlined"
                color="warning"
                style={{
                  marginRight: '15px',
                }}
              >
                View Order
              </Button>
            </>
          );
      }
    },
  },
];

const DataGridView = ({ rows }) => {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      pageSize={5}
      rowsPerPageOptions={[5]}
      disableSelectionOnClick
      style={{
        height: '400px',
        justifyContent: 'center',
        textAlign: 'center',
        margin: 'auto',
      }}
    />
  );
};

DataGridView.defaultProps = {
  rows: [],
};

DataGridView.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.node),
};

export default DataGridView;
