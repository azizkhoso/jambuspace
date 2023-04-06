import React from "react";
import { Container } from "@mui/material";
import UserProfile from "./components/UserProfile";
import "../../Stylesheet/Profile/profile.scss";

const AccountProfile = () => {
  return (
    <Container className="profile-page mb-4 container-2">
      <UserProfile />
    </Container>
  );
};

export default AccountProfile;
