import React from 'react';

import { Button, Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { getStripeLoginLink, createStripeId } from '../../../../../api/seller';
import useGlobalState from '../../../../../hooks/useGlobalState';
import { Else, If, Then } from 'react-if';

export default function Payment() {
  const { user } = useGlobalState();
  const [isLoggingIn, setLoggingIn] = React.useState(false);

  const { isLoading: isCreating, mutate: setupAccount } = useMutation(() => createStripeId(), {
    onSuccess: ({ data }) => {
      window.location.href = data.url; // redirect to Stripe Connect form
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
            <Typography variant="h6">Payment</Typography>
          </Grid>
          <If condition={!user.stripeId}>
            <Then>
              <Grid item xs={12}>
                <Button variant="contained" disabled={isCreating} onClick={() => setupAccount()}>
                  {isCreating ? <CircularProgress size="22px" /> : 'Setup Stripe Account'}
                </Button>
              </Grid>
            </Then>
            <Else>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  disabled={isLoggingIn}
                  onClick={() => {
                    setLoggingIn(true);
                    getStripeLoginLink()
                      .then(({ data }) => {
                        window.location.href = data.url;
                      })
                      .catch((err) => toast.error(err.response?.data?.message || err.message));
                  }}
                >
                  {isLoggingIn ? <CircularProgress size="22px" /> : 'Login to Stripe'}
                </Button>
              </Grid>
            </Else>
          </If>
        </Grid>
      </CardContent>
    </Card>
  );
}
