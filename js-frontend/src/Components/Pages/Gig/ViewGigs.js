import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Card, CardMedia, CardContent, Grid, Typography, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../utils/contants';
import Loader from '../../Common/Loader';
const customStyles = {
  width: '35px',
  height: '35px',
  borderRadius: '50%',
};
const ViewGig = () => {
  let URL = `${BASE_URL}/api/gig`;
  const [gigs, setGigs] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Axios.get(URL)
      .then((success) => {
        setGigs(success.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(true);
      });
  }, []);
  return loading ? (
    <Loader />
  ) : (
    <Grid container spacing={3} padding={8}>
      {Array.isArray(gigs) ? (
        gigs.map((gig, idx) => {
          return (
            <Grid key={idx} item xs={12} sm={6} md={4} lg={3}>
              <Card>
                <CardMedia component="img" height="140" image={BASE_URL + gig.image?.url} />
                <CardContent>
                  <Tooltip title={gig.title}>
                    <Link to={`/gigs/${gig._id}`}>
                      <Typography gutterBottom variant="h5" component="div" noWrap>
                        {gig.title}
                      </Typography>
                    </Link>
                  </Tooltip>
                  <Tooltip title={gig.description}>
                    <Typography variant="body2" noWrap>
                      {gig.description}
                    </Typography>
                  </Tooltip>
                  <Typography paddingY={1} variant="body1" noWrap>
                    Starting At: {gig.price}$
                  </Typography>
                  <Typography paddingY={1} variant="body1" noWrap>
                    <Link to={`/user-detail/${gig?.user?._id}`}>
                      <img src={`${BASE_URL + gig?.user?.image?.url}`} style={customStyles} />
                      <Typography
                        variant="body1"
                        component="span"
                        paddingX={1}
                        sx={{ display: 'inline' }}
                      >
                        {gig?.user?.username}
                      </Typography>
                    </Link>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })
      ) : (
        <Typography gutterBottom variant="h5" component="div" noWrap>
          There Are No Gigs To Show
        </Typography>
      )}
    </Grid>
  );
};

export default ViewGig;
