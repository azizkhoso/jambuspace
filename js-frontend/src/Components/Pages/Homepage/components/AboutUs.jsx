import React from "react";
import { Row, Col } from "react-bootstrap";
import NetworkEngineering from "../../../assets/network-engineering.png";
import Devops from "../../../assets/devops.png";
import Working from "../../../assets/working.jpg";
import Logo from "../../../assets/logo.png";
import Security from "../../../assets/security.png";
import CloudComputing from "../../../assets/cloud-computing.png";
import AutomationEngineering from "../../../assets/automation-engineering.png";

const AboutUs = () => {
  return (
    <Row className="about-us">
      <h4 className="home-section-heading">
        We are not Just a Freelance Platform but a Technology Company at Heart
      </h4>
      <Col md={4} className="py-3 d-flex flex-column justify-content-center">
        <img
          className="section-image"
          src={NetworkEngineering}
          alt="How-it-works-clients"
        />
        <img
          className="section-image"
          src={Devops}
          alt="How-it-works-clients"
        />
      </Col>
      <Col md={4} className="py-3 d-flex flex-column justify-content-center">
        <img
          className="section-image"
          src={Working}
          alt="How-it-works-clients"
        />
        <img className="section-image" src={Logo} alt="How-it-works-clients" />
        <img
          className="section-image"
          src={Security}
          alt="How-it-works-clients"
        />
      </Col>
      <Col md={4} className="py-3 d-flex flex-column justify-content-center">
        <img
          className="section-image"
          src={CloudComputing}
          alt="How-it-works-clients"
        />
        <img
          className="section-image"
          src={AutomationEngineering}
          alt="How-it-works-clients"
        />
      </Col>
    </Row>
  );
};

export default AboutUs;
