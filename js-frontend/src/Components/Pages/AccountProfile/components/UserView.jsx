/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import { API_URL, BASE_URL } from "../../../utils/contants";

const UserView = () => {
  const { userID } = useParams();
  const [selectedUser, setSelectedUser] = useState();

  useEffect(() => {
    axios
      .get(API_URL + `auth/${userID}`)
      .then(res => setSelectedUser(res.data))
      .catch(err => console.log(err));
  }, []);

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
          <h4 className="font-primary">{selectedUser.fullName}</h4>
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
    </Row>
  );
};

export default UserView;
