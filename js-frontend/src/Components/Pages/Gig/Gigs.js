import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CardMedia,
  CardContent,
  CardActions,
  CardHeader,
  Card,
  Typography,
  Grid,
  Tooltip,
} from '@mui/material';
import axios from 'axios';
import { BASE_URL } from '../../utils/contants';
const customStyles = {
  width: '35px',
  height: '35px',
  borderRadius: '50%',
};
const Gigs = () => {
  const user = JSON.parse(localStorage.getItem('authUser'));
  const [gigs, setGigs] = useState([]);
  useEffect(() => {
    axios.post(`${BASE_URL}/api/gig`, { id: user._id }).then(({ data }) => {
      setGigs(data);
    });
  }, []);
  return (
    <Grid container spacing={3} padding={8}>
      {gigs.map((gig, idx) => {
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
      })}
      <Grid item xs={12} sm={6} md={4} lg={3} alignItems="center" justify="center">
        <Link to={'/pages/creategigs'}>
          <i
            title="Add Gig"
            className="fas fa-plus fa-10x d-flex justify-content-center align-items-center bg-light"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '4px',
              color: '#555',
            }}
          ></i>
        </Link>
      </Grid>
    </Grid>
  );
};

export default Gigs;
