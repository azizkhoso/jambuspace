import { Delete } from '@mui/icons-material';
import { Card, CardContent, CardMedia, Grid, IconButton, Stack, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Else, If, Then } from 'react-if';
import { getJobs, deleteJob as dltJob } from '../../api/admin';

const AllJobs = () => {
  const [showAllPostings, setShowAllPostings] = useState(false);
  const [postings, setPostings] = useState([]);
  const toggleShowPostings = () => setShowAllPostings(!showAllPostings);

  useEffect(() => {
    getJobs()
      .then((res) => setPostings(res.data))
      .then((err) => console.log(err));
  }, []);
  const deleteJob = useCallback(async (job) => {
    dltJob(job._id)
      .then(() => {
        toast('Job Deleted Successfully');
        getJobs()
          .then((res) => setPostings(res.data))
          .then((err) => console.log(err));
      })
      .catch(() => {
        toast('There was an error while deleting job');
      });
  }, []);

  return (
    <div>
      <Typography className="text-center mt-4" variant="h3">
        All Jobs
      </Typography>
      <Grid container my={4}>
        <Grid item xs={12} sm={12} md={12}>
          <Card className="shadow border-radius mb-4">
            <div className="card-head d-flex justify-content-between border-bottom p-3">
              <Typography className="mb-0 txt-primary cursor-pointer" onClick={toggleShowPostings}>
                See {showAllPostings ? 'Less' : 'All'} Postings
              </Typography>
            </div>
            <CardContent className="card-body p-3">
              <Grid container spacing={3}>
                <If condition={postings.length > 0}>
                  <Then>
                    {postings.slice(0, !showAllPostings ? 3 : undefined).map((item, idx) => (
                      <Grid key={idx} item xs={12} md={3}>
                        <Card key={idx} sx={{ maxWidth: 345 }}>
                          <CardContent>
                            <CardMedia
                              component="img"
                              height="140"
                              image={process.env.BACKEND_URL + item?.image?.url}
                            />
                            <Typography gutterBottom variant="h6" component="div" noWrap>
                              {item.title}
                            </Typography>
                            <Typography variant="body2" noWrap>
                              {item.description}
                            </Typography>
                            <Typography variant="body2" marginTop={1} noWrap>
                              Budget: {item.budget}$
                            </Typography>
                            <Typography variant="body2" marginTop={1} noWrap>
                              CustomerID: {item.customerID}
                            </Typography>
                            <Typography variant="body2" marginTop={1} noWrap>
                              Duration: {item.duration}
                            </Typography>
                            <Typography variant="body2" marginTop={1} noWrap>
                              ExperienceLevel: {item.experienceLevel}
                            </Typography>
                            <Typography variant="body2" marginTop={1} noWrap>
                              Hours Needed: {item.hoursNeeded}
                            </Typography>
                            <Typography variant="body2" marginTop={1} noWrap>
                              Technologies: {item.technologies}
                            </Typography>
                            <Typography variant="body2" marginTop={1} noWrap>
                              Updated At: {item.updatedAt}
                            </Typography>
                            <Stack
                              direction="row"
                              marginTop={2}
                              style={{ display: 'flex', justifyContent: 'space-between' }}
                            >
                              <IconButton onClick={() => deleteJob(item)}>
                                <Delete />
                              </IconButton>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Then>
                  <Else>
                    <Typography variant="body1" marginX={3} marginTop={2}>
                      You Haven&apos;t Posted Any Job Yet
                    </Typography>
                  </Else>
                </If>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default AllJobs;
