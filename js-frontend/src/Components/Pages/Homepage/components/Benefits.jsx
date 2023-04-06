import React from "react";
import { Row, Col } from "react-bootstrap";
import Freelancers from "../../../assets/for-freelancers.png";
import Clients from "../../../assets/for-clients.png";

const Benefits = () => {
  return (
    <Row className="benefits">
      <h4 className="home-section-heading">Benefits of Joining Us</h4>
      <Col md={6} className="py-3 d-flex flex-column align-items-center">
        <img
          className="section-image"
          src={Freelancers}
          alt="How-it-works-clients"
        />
        <h3>For Freelancers</h3>
      </Col>
      <Col md={6} className="py-3 d-flex flex-column align-items-center">
        <img
          className="section-image"
          src={Clients}
          alt="How-it-works-clients"
        />
        <h3>For Clients</h3>
      </Col>
    </Row>
  );
};

export default Benefits;
