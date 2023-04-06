import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { getBids } from '../../api/seller';
import { Case, Switch, When } from 'react-if';
import CircularLoader from '../../Common/CircularLoader';
import useGlobalState from '../../hooks/useGlobalState';
import '../../Stylesheet/Dashboard/dashboard.scss';

const SellerDashboard = () => {
  const { user } = useGlobalState();
  const userType = user?.userType || '';
  const [showAllBids, setShowAllBids] = useState(false);
  const [bids, setBids] = useState([]);

  const { isLoading: isLoadingPosting } = useQuery(['seller-bids'], () => getBids(), {
    enabled: userType === 'seller', // only fetch when seller is logged in
    onSuccess: ({ data }) => setBids(data),
    onError: (err) => toast.error(err.response?.data.message || err.message),
  });

  const toggleShowBids = () => setShowAllBids(!showAllBids);

  return (
    <Container maxWidth="lg">
      <Grid container sx={{ my: 3 }} justifyContent="space-between" spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="div">
            Seller Dashboard
          </Typography>
        </Grid>
      </Grid>
      <Grid container sx={{ my: 4 }} spacing={2}>
        <Grid item xs={12} sm={12} md={8}>
          <div className="card shadow border-radius mb-4">
            <div className="card-head d-flex justify-content-between border-bottom p-3">
              <Typography variant="h5">Your Bids</Typography>
              <p className="mb-0 txt-primary cursor-pointer" onClick={toggleShowBids}>
                See {showAllBids ? 'Less' : 'All'} Bids
              </p>
            </div>
            <div className="card-body p-3">
              <Grid container spacing={3}>
                <Switch>
                  <Case condition={isLoadingPosting}>
                    <Grid item>
                      <CircularLoader />
                    </Grid>
                  </Case>
                  <Case condition={bids.length === 0}>
                    <Typography variant="body2" textAlign="center">
                      No jobs yet
                    </Typography>
                  </Case>
                  <Case condition={bids.length > 0}>
                    {bids.slice(0, showAllBids ? undefined : 3).map((item, idx) => (
                      <Grid key={idx} item xs={12} md={4}>
                        <Link to={`/jobs/${item?.job?._id}`}>
                          <Card key={idx} sx={{ maxWidth: 345 }}>
                            <When condition={Boolean(item?.image?.url)}>
                              <CardMedia
                                component="img"
                                height="140"
                                image={process.env.REACT_APP_BACKEND_URL + item?.image?.url}
                              />
                            </When>
                            <CardContent>
                              <Tooltip title={item.title}>
                                <Typography gutterBottom variant="h6" component="div" noWrap>
                                  {item.job?.title}
                                </Typography>
                              </Tooltip>
                              <Tooltip title={item.cover}>
                                <Typography variant="body2" noWrap>
                                  {item.cover}
                                </Typography>
                              </Tooltip>
                              <Typography variant="body2" marginTop={1} noWrap>
                                Budget: {item.amount}$
                              </Typography>
                              <Stack
                                direction="row"
                                marginTop={2}
                                style={{ display: 'flex', justifyContent: 'space-between' }}
                              >
                                <Chip
                                  label={item?.status}
                                  color={item?.status === 'PENDING' ? 'info' : 'error'}
                                />
                              </Stack>
                            </CardContent>
                          </Card>
                        </Link>
                      </Grid>
                    ))}
                  </Case>
                </Switch>
              </Grid>
            </div>
          </div>
          <div className="card shadow border-radius mb-4">
            <div className="card-head d-flex justify-content-between border-bottom p-3">
              <Typography variant="h5">Your Drafts</Typography>
              <p className="mb-0 txt-primary">See All Drafts</p>
            </div>
            <div className="card-body p-3">
              <Typography variant="body2">No Drafts</Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={4}>
          <div className="card shadow border-radius">
            <div className="card-head d-flex justify-content-between border-bottom p-3">
              <Typography variant="h5">Ready To Buy Projects</Typography>
            </div>
            <div className="p-3">
              <Typography variant="body1">
                Know What You Need But Not How To Get It Done? Buy A Project Priced & Scoped By A
                Pro To Start Working Right Away
              </Typography>
              <Typography style={{ fontWeight: 'bold' }}>
                We Think You Might Like Help With
              </Typography>
            </div>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SellerDashboard;
