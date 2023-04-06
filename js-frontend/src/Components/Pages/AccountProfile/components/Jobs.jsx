/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { BASE_URL } from "../../../utils/contants";
import {getJobs}from '../../../api/client'
import { Else, If, Then } from 'react-if';

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  initialSlide: 1,
  centerMode: true,
  centerPadding: "0px",
  arrows: true,
  nextArrow: <FaAngleRight color="#000" />,
  prevArrow: <FaAngleLeft color="#000" />,
  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

function Jobs() {
  const user = JSON.parse(localStorage.getItem("authUser"));
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    
    getJobs(user?._id).then((res)=>setJobs(res.data)).catch(err=>console.log(err));

    // axios
    //   .get(API_URL + `auth/${user?._id}/jobs`)
    //   .then(res => setJobs(res.data))
    //   .then(err => console.log(err));

  }, []);

  return (
    <Row className="jobs-slider-section py-5 my-5">
      <h2 className="py-3 pb-0 m-0 section-heading txt-primary">Jobs</h2>
      <If condition={jobs.length > 0}>
            <Then>
            <Col>
          <Slider className="p-0" {...settings}>
            {jobs.map(item => (
              <div className="job-wrapper" key={item.id}>
                <Card className="job-card">
                  <Card.Img variant="top" src={BASE_URL + item?.image?.url} />
                  <Card.Body>
                    <Card.Title>{item.title}</Card.Title>
                    <Card.Text>
                      {item.description.length > 100
                        ? item.description.substring(0, 100)
                        : item.description}
                      ...
                    </Card.Text>
                    <Link to={`/jobs/${item.id}`}>Read More</Link>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </Slider>
        </Col>
            </Then>
            <Else>
            <p>You don't have any job yet</p>
            </Else>
          </If>
    </Row>
  );
}

export default Jobs;
