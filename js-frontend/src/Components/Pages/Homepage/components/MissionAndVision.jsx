import React from "react";
import { Row, Col } from "react-bootstrap";

const MissionAndVision = () => {
  return (
    <Row className="vision-and-mission">
      <h4 className="home-section-heading">Our Mission & Vision</h4>
      <Col md={6} className="py-5 d-flex flex-column justify-content-center">
        <h5 className="fw-bold">Mission</h5>
        <p>
          To create an on demand technical pool of highly skilled technological
          specialists and bridge the gap between clients and freelancers in a
          secure and reliable manner.
        </p>
      </Col>
      <Col md={6} className="py-5 d-flex flex-column justify-content-center">
        <h5 className="fw-bold">Vision</h5>
        <p>
          To build the worlds leading space where Network, Cloud, DevOps,
          Automation and Security Engineers can find suitable roles to work
          remotely with freedom and also build a community of talent to help
          advance the future of technology through engaging in discussions,
          participating in challenges and helping each other in any way
          possible.
        </p>
      </Col>
    </Row>
  );
};

export default MissionAndVision;
