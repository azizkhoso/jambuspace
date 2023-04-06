import React, { useEffect, useReducer, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Grid,
  Typography,
  Tooltip,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  TextField,
} from '@mui/material';
import { BASE_URL, STATUS } from '../../utils/contants';
import Loader from '../../Common/Loader';

const customStyles = {
  width: '35px',
  height: '35px',
  borderRadius: '50%',
};

const ViewGig = () => {
  const { id } = useParams();
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'SELLER':
          return {
            ...state,
            seller: action.payload,
          };
        case 'GIG':
          return {
            ...state,
            gig: action.payload,
          };
        case 'ORDER':
          return {
            ...state,
            order: action.payload,
          };
        case 'DESCRIPTION':
          return {
            ...state,
            description: action.payload,
          };
        case 'DURATION':
          return {
            ...state,
            duration: action.payload,
          };
        case 'ERROR':
          return {
            ...state,
            error: action.payload,
          };
        case 'DIALOG':
          return {
            ...state,
            dialog: action.payload,
          };
        case 'DISABLEPLACEORDER':
          return {
            ...state,
            disablePlaceOrder: action.payload,
          };
        case 'DATE':
          return {
            ...state,
            date: action.payload,
          };
        default:
          return state;
      }
    },
    {
      user: JSON.parse(localStorage.getItem('authUser')),
      seller: {},
      gig: {},
      order: {},
      description: '',
      duration: '',
      error: false,
      dialog: false,
      disablePlaceOrder: false,
      date: 'text',
    },
  );
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/gig/${id}`)
      .then(({ data }) => {
        dispatch({ type: 'SELLER', payload: data.user });
        dispatch({ type: 'GIG', payload: data });
      })
      .catch();
  }, []);
  const handlePlaceOrderClick = () => {
    if (!state.description || !state.duration) {
      dispatch({ type: 'ERROR', payload: true });
    } else {
      const orderDetails = {
        buyer: state.user._id,
        seller: state.seller._id,
        gig: state.gig._id,
        description: state.description,
        duration: state.duration,
        budget: state.gig.price,
        status: STATUS.PLACED,
      };
      dispatch({ type: 'ERROR', payload: false });
      dispatch({ type: 'DISABLEPLACEORDER', payload: true });
      dispatch({
        type: 'ORDER',
        payload: orderDetails,
      });
      axios
        .post(`${BASE_URL}/api/orders/`, orderDetails)
        .then(({ data }) => {
          dispatch({ type: 'DIALOG', payload: false });
          dispatch({ type: 'DISABLEPLACEORDER', payload: false });
          toast(`Order Placed | Order ID: ${data.payload._id}`, {
            autoClose: 1500,
            pauseOnHover: false,
          });
          setTimeout(() => {
            window.location.href = '/pages/orders';
          }, 2500);
        })
        .catch((error) => {
          dispatch({ type: 'DISABLEPLACEORDER', payload: false });
        });
    }
  };
  return (
    <div>
      <Dialog open={state.dialog}>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          <DialogContentText>Describe Your Task Briefly To The Seller</DialogContentText>
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={state.description}
            onChange={(e) => dispatch({ type: 'DESCRIPTION', payload: e.target.value })}
          />
          {state.error && (
            <Typography variant="caption" color="error">
              Description Is A Mandatory Field
            </Typography>
          )}
          <TextField
            margin="dense"
            label="Duration"
            type={state.date}
            fullWidth
            variant="standard"
            value={state.duration}
            onFocus={() => dispatch({ type: 'DATE', payload: 'date' })}
            onChange={(e) => dispatch({ type: 'DURATION', payload: e.target.value })}
          />
          {state.error && (
            <Typography variant="caption" color="error">
              Duration Is A Mandatory Field
            </Typography>
          )}
          <TextField
            margin="dense"
            label="Seller"
            type="text"
            fullWidth
            variant="standard"
            value={state.seller.username}
            disabled
          />
          <TextField
            margin="dense"
            label="Gig"
            type="text"
            fullWidth
            variant="standard"
            value={state.gig.title}
            disabled
          />
          <TextField
            margin="dense"
            label="Budget"
            type="text"
            fullWidth
            variant="standard"
            value={`$${state.gig.price}`}
            disabled
          />
        </DialogContent>
        <DialogActions>
          <Button
            size="medium"
            variant="outlined"
            onClick={() => dispatch({ type: 'DIALOG', payload: false })}
          >
            Cancel
          </Button>
          <Button
            size="medium"
            variant="outlined"
            disabled={state.disablePlaceOrder}
            onClick={handlePlaceOrderClick}
          >
            Place Order
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={3} padding={8}>
        {Object.keys(state.gig).length ? (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card>
              <CardMedia component="img" height="140" image={BASE_URL + state.gig.image.url} />
              <CardContent
                style={{
                  paddingBottom: '0px',
                }}
              >
                <Tooltip title={state.gig.title}>
                  <Typography gutterBottom variant="h5" component="div" noWrap>
                    {state.gig.title}
                  </Typography>
                </Tooltip>
                <Tooltip title={state.gig.description}>
                  <Typography variant="body2" noWrap>
                    {state.gig.description}
                  </Typography>
                </Tooltip>
                <Typography paddingY={1} variant="body1" noWrap>
                  Starting At: {state.gig.price}$
                </Typography>
                <Typography paddingY={1} variant="body1" noWrap>
                  <Link to={`/user-detail/${state.seller._id}`}>
                    <img
                      src={`${BASE_URL + state.gig.user.image.url}`}
                      style={customStyles}
                      alt="Seller Profile"
                    />
                    <Typography
                      variant="body1"
                      component="span"
                      paddingX={1}
                      sx={{ display: 'inline' }}
                    >
                      {state.gig.user.username}
                    </Typography>
                  </Link>
                </Typography>
              </CardContent>
              <CardActions
                style={{
                  justifyContent: 'space-between',
                  padding: '8px 16px 16px 16px',
                }}
              >
                <Button
                  size="medium"
                  variant="outlined"
                  onClick={() => dispatch({ type: 'DIALOG', payload: true })}
                >
                  Buy This Gig
                </Button>
                <Button
                  size="medium"
                  variant="outlined"
                  title="Cope Link To Clipboard"
                  onClick={() => {
                    toast('Link Copied To Clipboard');
                    window.navigator.clipboard.writeText(window.location.href);
                  }}
                >
                  Share
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Loader />
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default ViewGig;
