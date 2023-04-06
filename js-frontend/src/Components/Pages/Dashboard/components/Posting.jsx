import React from "react";
import moment from "moment";
import { Row, Col } from "react-bootstrap";
import { BsThreeDots } from "react-icons/bs";

const Posting = ({ post }) => {
  return (
    <div className="pb-3">
      <div className="d-flex justify-content-between mb-3">
        <h6>{post?.title}</h6>

        <BsThreeDots />
      </div>

      <Row className="justify-content-between">
        <Col
          xs={12}
          sm={12}
          md={6}
          lg={6}
          className="mb-3 mb-sm-3 mb-md-0 mb-lg-0"
        >
          <p className="mb-0">Public - Hours</p>
          <p className="mb-0">
            Posted {moment(post?.createdAt).fromNow()} by You
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default Posting;
