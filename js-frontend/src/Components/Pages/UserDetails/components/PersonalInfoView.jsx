import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@mui/material';
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { API_URL, BASE_URL } from '../../../utils/contants';

const PersonalInfoView = ({ selectedUser }) => {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem('authUser'));

  const handleMessageButtonClick = () => {
    const payload = {
      senderID: loggedInUser._id,
      receiverID: selectedUser._id,
    };
    axios
      .post(API_URL + 'conversations', payload)
      .then(() => navigate('/pages/chat'))
      .catch((err) => console.log(err));
  };

  return (
    <Row className="user-profile">
      {/* User Profile Image */}
      <Col md={3} className="user-img-section">
        <div className="profile-img-wrapper">
          <img src={BASE_URL + selectedUser?.image?.url} alt="User Profile" />
        </div>
      </Col>

      {/* User Details */}
      <Col md={9} className="user-detail-section">
        <div className="w-100 d-flex justify-content-between">
          <h4 className="font-primary">{selectedUser?.fullName}</h4>
        </div>
        {selectedUser?.email && (
          <div className="w-100 d-flex justify-content-between">
            <h5>{selectedUser?.email}</h5>
          </div>
        )}
        {selectedUser?.company && (
          <div className="w-100 d-flex justify-content-between">
            <p className="w-75">{selectedUser?.company}</p>
          </div>
        )}
      </Col>

      {loggedInUser && (
        <Button
          variant="contained"
          className="w-auto send-message-btn"
          onClick={handleMessageButtonClick}
        >
          Send Message
        </Button>
      )}
    </Row>
  );
};

PersonalInfoView.propTypes = {
  selectedUser: PropTypes.object.isRequired,
};

export default PersonalInfoView;
