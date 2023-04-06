import Chip from '@mui/material/Chip';
import moment from 'moment';
import React, { useEffect } from 'react';
import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { NotificationAdd, NotificationsActive } from '@mui/icons-material';
import { Box } from '@mui/material';
import useGlobalState from '../../../hooks/useGlobalState';
import { useMutation } from '@tanstack/react-query';
import { toggleSubscribe } from '../../../api/seller';
import { toast } from 'react-toastify';

const JobCard = ({ job }) => {
  const { user: seller, setUser } = useGlobalState();
  const navigate = useNavigate();
  const addedDaysBefore = Math.abs(new Date() - new Date(job?.createdAt)) / (1000 * 60 * 60 * 24);
  const label = addedDaysBefore < 5 ? 'New' : job?.customer?.rating === 5 ? 'Popular' : 'See';

  const { mutate: toggleSubscribeToTechnology } = useMutation((tech) => toggleSubscribe(tech), {
    onSuccess: ({ data }) => setUser({ subscriptions: data }),
    onError: (err) => toast.error(err.response?.data.message || err?.message),
  });

  return (
    <Col key={job._id} xs={12} sm={12} md={12} lg={6} className="my-2">
      <div className="job-card mx-2 border ">
        <div className="card-header-top ">
          {/* <img className="job-image" src={BASE_URL + job?.image?.url} alt="No Img " /> */}
        </div>

        <div className="card-body-content border-bottom py-3 px-3  d-flex flex-column justify-content-between">
          <h6 className=" mt-1 mb-3 text-capitalize fs-5">{job.title}</h6>

          <div className="row">
            <div className="col-2">
              {label && (
                <div className="top-tag bg-primary text-light text-center rounded-pill px-2 ">
                  <p className="mb-0" style={{ fontSize: '14px' }}>
                    {label}
                  </p>
                </div>
              )}
            </div>
            <div className="col-10 text-muted mb-2">
              Hourly- Posted {moment(job.createdAt).fromNow('h')}
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-4 ">
              <p className="p-0 m-0 fw-normal">{moment(job.dueDate).format('hh')}</p>
              <p className="text-muted p-0 m-0 ">Work Hours</p>
            </div>
            <div className="col-4">
              <p className="p-0 m-0 fw-normal">{job?.duration}</p>
              <p className="text-muted p-0 m-0 ">Duration</p>
            </div>
            <div className="col-4">
              <p className="p-0 m-0 fw-normal">{job?.experienceLevel}</p>
              <p className="text-muted p-0 m-0 ">Experience Level</p>
            </div>
          </div>
          <div>
            {/* <p className="dis-para mt-3">Hello There, Need an agile and smart colleague to help me with general day to day tasks. We will have a general overview of tasks for Hello There, Need an agile and smart colleague to help me with general day to day tasks. We will have a general overview of tasks fo w…</p> */}
            <p className="dis-para mt-3">{job?.description}</p>
          </div>
          <div className="mt-1">
            {job?.technologies.map((technology) => (
              <Box
                display="inline"
                width="fit-content"
                role="button"
                key={`unique${technology}`}
                onClick={(e) => {
                  e.preventDefault();
                  toggleSubscribeToTechnology(technology);
                }}
              >
                <Chip
                  icon={
                    !seller.subscriptions.find(
                      (s) => s.toLowerCase() === technology.toLowerCase(),
                    ) ? (
                      <NotificationAdd />
                    ) : (
                      <NotificationsActive />
                    )
                  }
                  className="chip-jobs"
                  label={technology}
                />
              </Box>
            ))}
          </div>
          <div className="mt-3 mb-2">
            <Link
              className="btn btn-primary btn-sm rounded-pill fw-normal col-3 "
              to={`/jobs/${job._id}`}
            >
              See More
            </Link>
          </div>
        </div>
      </div>
    </Col>
  );
};

JobCard.propTypes = {
  job: PropTypes.object.isRequired,
};

export default JobCard;
