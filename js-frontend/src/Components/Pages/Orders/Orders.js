import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid, Tab, Tabs, Box, Typography } from '@mui/material';
import { Container } from 'react-bootstrap';
import DataGridView from '../../Common/DataGridView';
import axios from 'axios';
import { BASE_URL } from '../../utils/contants';

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem('authUser'));
  let isSeller = localStorage.getItem('userType') === 'seller' ? true : false;
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [rows, setRows] = useState([]);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/orders/${isSeller ? 'seller' : 'customer'}/${currentUser._id}`)
      .then(({ data }) => {
        console.log('orders -> ', data);
        setRows(
          data.orders.map((row) => ({
            id: row._id,
            seller: row?.seller?.username,
            buyer: row?.buyer?.username,
            gig: row.gig.title,
            duration: row.duration,
            status: row.status,
            budget: row.budget,
            sellerId: row?.seller?._id,
            buyerId: row?.buyer?._id,
            gigId: row?.gig?._id,
          })),
        );
      })
      .catch((err) => {
        console.log('err -> -> ', err);
      });
  }, []);
  return (
    <Container className="my-4">
      <Typography variant="h4" component="div">
        Orders
      </Typography>
      {isSeller ? (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} centered>
              <Tab label="Active" {...a11yProps(0)} />
              <Tab label="Completed" {...a11yProps(1)} />
              <Tab label="Canceled" {...a11yProps(2)} />
              {/* <Tab label="Starred" {...a11yProps(1)} /> */}
              {/* <Tab label="Delivered" {...a11yProps(3)} />*/}
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <DataGridView rows={rows} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <DataGridView rows={rows} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <DataGridView rows={rows} />
          </TabPanel>
          {/* <TabPanel value={value} index={3}>
              <DataGridView rows={orders} />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <DataGridView rows={orders} />
            </TabPanel> */}
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
              <Tab label="Active" {...a11yProps(0)} />
              <Tab label="Completed" {...a11yProps(1)} />
              <Tab label="Canceled" {...a11yProps(2)} />
              {/* <Tab label="Starred" {...a11yProps(1)} />
                <Tab label="Delivered" {...a11yProps(3)} /> */}
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <DataGridView rows={rows} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <DataGridView rows={rows} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <DataGridView rows={rows} />
          </TabPanel>
          {/* <TabPanel value={value} index={3}>
              <DataGridView rows={orders} />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <DataGridView rows={orders} />
            </TabPanel> */}
        </Box>
      )}
    </Container>
  );
  //   return (
  //     <>
  //     </>
  //   );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default Orders;
