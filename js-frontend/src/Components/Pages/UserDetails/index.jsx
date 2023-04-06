import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { API_URL } from '../../utils/contants';
import PersonalInfoView from './components/PersonalInfoView';
import Reviews from '../AccountProfile/components/Reviews';

const UserDetails = () => {
  const { userID } = useParams();
    const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    axios
      .get(API_URL + `auth/${userID}`)
      .then((res) => setSelectedUser(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Container className="profile-page py-5 container-2">
      <PersonalInfoView selectedUser={selectedUser} />
      <Reviews selectedUser={selectedUser} />
    </Container>
  );
};

export default UserDetails;
