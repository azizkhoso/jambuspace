import React from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { Button } from "antd";
import Technologies from "../../../assets/technologies.png";

const TechnologyArea = () => {
  const navigate = useNavigate();

  return (
    <Row className="technologies">
      <h4 className="home-section-heading">Technology Area we Focus On</h4>
      <Col md={6} className="py-3 d-flex flex-column">
        <img
          className="section-image"
          src={Technologies}
          alt="How-it-works-clients"
        />
        <div>
          <p>
            <span className="fw-bold pe-2">Disclaimer:</span>We do not hold a
            partnership license for the above companies but we list them here
            for informational purpose only.
          </p>
        </div>
      </Col>
      <Col md={6} className="py-3 d-flex flex-column">
        <h5 className="pt-3">Skills & resources</h5>
        <h3 className="fw-bold pt-3">Major Technology Stack</h3>
        <p className="pt-3">
          Technology is ever evolving and more and more skills are continuously
          needed to meet the demand of the industry. Our goal is to bridge the
          gap between clients and technology enthusiasts, freelancers, engineers
          and academics.
        </p>
        <div className="pt-3">
          <Button
            type="primary"
            className="section-btn"
            onClick={() => navigate("/pages/post-job")}
          >
            For Clients
          </Button>
          <Button
            type="primary"
            className="section-btn"
            onClick={() => navigate("/jobs")}
          >
            For Talents
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default TechnologyArea;
