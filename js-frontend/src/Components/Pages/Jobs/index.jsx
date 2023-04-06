import React, { useEffect, useState } from 'react';
import JobCard from './components/JobCard';
import '../../Stylesheet/Jobs/jobs.scss';
import '../../Stylesheet/Jobs/jobsdetails.scss';
import { Box, Button, Grid, Typography, Container } from '@mui/material';
import { getJobs } from '../../api/seller';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Else, If, Then } from 'react-if';
import CircularLoader from '../../Common/CircularLoader';

const JobsPage = () => {
  const [searchText, setSearchText] = useState('');
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getJobs()
      .then((res) => {
        setJobs(res.data);
        setJobsLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Container maxWidth="lg">
      <Box mb={3}>
        <Typography variant="h2" className="color-primary font-rebrand fw-bold m-0">
          Jobs
        </Typography>
        <Box mx={3}>
          <Typography variant="body1" className="text-muted">
            Here are some jambu-space jobs for you. Lets pick one!!!
          </Typography>
        </Box>
      </Box>
      <Box mb={2}>
        <Typography variant="h5" className="m-0 mb-1">
          Top Projects you may like
        </Typography>
        <Typography variant="body2" className="mb-0">
          These projects are highly rated by other clients
        </Typography>
      </Box>
      <Grid container alignItems="center" justify="space-between">
        <Grid item xs={9} />
        <Grid item xs={3}>
          <Box display="flex">
            <TextField
              size="small"
              placeholder="Search Jobs"
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="text" onClick={() => setSearchText('')}>
              Reset
            </Button>
          </Box>
        </Grid>
      </Grid>
      <If condition={jobsLoading}>
        <Then>
          <Box display="flex" justifyContent="center" my={4}>
            <CircularLoader />
          </Box>
        </Then>
        <Else>
          <Box display="flex" justifyContent="start" flexWrap="wrap" my={4}>
            {jobs
              .filter((job) => job.title.toLowerCase().includes(searchText.toLowerCase()))
              .map((item, idx) => (
                <JobCard key={idx} job={item} />
              ))}
          </Box>
        </Else>
      </If>
    </Container>
  );
};

export default JobsPage;
