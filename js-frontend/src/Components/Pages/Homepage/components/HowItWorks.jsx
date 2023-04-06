import React from "react";
import { Row, Col } from "react-bootstrap";
import HowItWorksClients from "../../../assets/how-it-works-clients.png";
import HowItWorksEngineers from "../../../assets/how-it-works-engineers.png";

const HowItWorks = () => {
  return (
    <Row className="how-it-works">
      <h4 className="home-section-heading">How it Works?</h4>
      <Col md={6} className="py-3 d-flex justify-content-center">
        <img
          className="section-image"
          src={HowItWorksClients}
          alt="How-it-works-clients"
        />
      </Col>
      <Col md={6} className="py-3 d-flex justify-content-center">
        <img
          className="section-image"
          src={HowItWorksEngineers}
          alt="How-it-works-clients"
        />
      </Col>
    </Row>
  );
};

export default HowItWorks;
