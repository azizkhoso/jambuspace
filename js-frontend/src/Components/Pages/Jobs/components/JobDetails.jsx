import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PsychologyIcon from '@mui/icons-material/Psychology';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import { If, Then, Else, When, Switch, Case } from 'react-if';
import moment from 'moment';
import useGlobalState from '../../../hooks/useGlobalState';
import { PageLoader } from '../../../../App';
import { useMutation, useQuery } from '@tanstack/react-query';
import { completeJob, getJob, getStripeCheckout } from '../../../api/client';
import { toast } from 'react-toastify';
import { getJobById } from '../../../api/seller';
import { Button, Typography } from '@mui/material';
import CircularLoader from '../../../Common/CircularLoader';

const JobDetails = () => {
  const { user } = useGlobalState();
  const { id } = useParams();
  const [isProcessing, setProcessing] = useState(false);
  const [selectedJob, setSelectedJob] = useState({});
  const [sellerBid, setSellerBid] = useState();
  const { isLoading: isCustomerLoading, refetch } = useQuery(
    ['customer-job', id],
    () => getJob(id),
    {
      enabled: user?.userType === 'customer', // only fetch when customer is logged in
      onSuccess: ({ data }) => setSelectedJob(data),
      onError: (err) => toast.error(err.response?.data.message || err.message),
    },
  );

  const { isLoading: isCompleting, mutate: setCompleted } = useMutation(() => completeJob(id), {
    onSuccess: () => refetch(),
    onError: (err) => toast.error(err.response?.data.message || err.message),
  });

  const { isLoading: isSellerLoading } = useQuery(['seller-job', id], () => getJobById(id), {
    enabled: user?.userType === 'seller', // only fetch when seller is logged in
    onSuccess: ({ data }) => {
      setSelectedJob(data);
      setSellerBid(data.bids[0]); // a seller can apply to a job only once
    },
    onError: (err) => toast.error(err.response?.data.message || err.message),
  });

  if (
    (user?.userType === 'customer' && isCustomerLoading) ||
    (user?.userType === 'seller' && isSellerLoading)
  )
    return <PageLoader />;
  return (
    <div>
      <div className="container mt-4">
        <div className="row">
          <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12 ">
            <Typography variant="h6">{selectedJob?.title}</Typography>
            <hr />
            <Typography vairant="body1">{selectedJob?.description}</Typography>
            <hr />
            <div className="row p-3">
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6">
                <div className="row">
                  <div className="col-1 pt-3">
                    <AccessTimeIcon style={{ fontSize: '17px' }} />
                  </div>
                  <div className="col-8 pt-1">
                    <p className="fw-bold details-p">
                      {moment(selectedJob?.dueDate, 'YYYY-MM-DD').format('MMM DD, YYYY')}
                    </p>
                  </div>
                  <div className="row">
                    <div className="col-1"></div>
                    <div className="col-8 text-muted">Deadline</div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6">
                <div className="row">
                  <div className="col-1 pt-3">
                    <PsychologyIcon style={{ fontSize: '17px' }} />
                  </div>
                  <div className="col-8 pt-1">
                    <p className="fw-bold details-p">{selectedJob?.experienceLevel}</p>
                  </div>
                  <div className="row">
                    <div className="col-1"></div>
                    <div className="col-8 text-muted">Experience Level</div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6">
                <div className="row">
                  <div className="col-1 pt-3">
                    <WorkIcon style={{ fontSize: '17px' }} />
                  </div>
                  <div className="col-8 pt-1">
                    <p className="fw-bold details-p">One time</p>
                  </div>
                  <div className="row">
                    <div className="col-1"></div>
                    <div className="col-8 text-muted">Project Type</div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6">
                <div className="row">
                  <div className="col-1 pt-3">
                    <AttachMoneyIcon style={{ fontSize: '17px' }} />
                  </div>
                  <div className="col-8 pt-1">
                    <p className="fw-bold details-p">{selectedJob?.budget}</p>
                  </div>
                  <div className="row">
                    <div className="col-1"></div>
                    <div className="col-8 text-muted">Budget</div>
                  </div>
                </div>
              </div>
              <hr className="mt-4" />

              <div className="mt-3 mb-3">
                <h4>Skills and Expertise</h4>
                <div className="mt-1">
                  {selectedJob?.technologies?.map((technology) => (
                    <Chip key={`unique${technology}`} className="chip-jobs" label={technology} />
                  ))}
                </div>
              </div>
              <hr className="mt-4" />
              <When condition={user?.userType === 'seller'}>
                <div>
                  <h4>About Client</h4>
                  <div className="row">
                    <div className="col-1">
                      <Avatar
                        sx={{ width: 55, height: 55 }}
                        alt="Remy Sharp"
                        src="https://www.w3schools.com/howto/img_avatar.png"
                      />
                    </div>
                    <h5 className="col-11 mt-4 px-3 fw-normal text-dark">
                      {selectedJob?.customer?.fullName}
                    </h5>
                  </div>
                </div>

                <hr className="mt-4" />
                <div className="">
                  <If condition={Boolean(sellerBid)}>
                    <Then>
                      <button
                        style={{ backgroundColor: '#003D69' }}
                        className="btn text-light  btn-md rounded-pill mb-4 mt-3"
                      >
                        Applied
                      </button>
                    </Then>
                    <Else>
                      <Link
                        style={{ backgroundColor: '#003D69' }}
                        className="btn text-light  btn-md rounded-pill mb-4 mt-3"
                        to={`/jobs/${selectedJob?._id}/submitproposal`}
                      >
                        Apply Now
                      </Link>
                    </Else>
                  </If>
                </div>
              </When>
              <When condition={user?.userType === 'customer'}>
                <div>
                  <h4>Proposals</h4>
                  {selectedJob?.bids?.map((v, i) => {
                    return (
                      <div className="card p-3" key={i}>
                        <div className="d-flex w-100">
                          <div className="w-75 ">
                            <h4>
                              {v.seller.fullName} <span>({v.status})</span>{' '}
                            </h4>
                          </div>
                          <div className="w-25 d-flex justify-content-end">
                            <h4>${v.amount} AUD</h4>
                          </div>
                        </div>
                        <div>
                          <p>{v.cover}</p>
                        </div>
                        <div className="d-flex">
                          <div className="w-75">
                            <div>Needs {`${v.duration}`}</div>
                          </div>
                          <div className="w-25 d-flex align-items-end justify-content-end">
                            <h6>
                              From:
                              {v.seller.country}
                            </h6>
                          </div>
                        </div>
                        <Switch>
                          <Case condition={v?.status !== 'HIRED' && !selectedJob?.hiredBid}>
                            {/* <Elements stripe={stripePromise}>
                              <Checkout bidId={v._id} />
                            </Elements> */}
                            <Button
                              sx={{ mt: 2 }}
                              variant="contained"
                              disabled={isProcessing}
                              onClick={() => {
                                setProcessing(true);
                                getStripeCheckout(id, v._id)
                                  .then(({ data }) => {
                                    window.location.href = data.url;
                                  })
                                  .catch((err) =>
                                    toast.error(err.response?.data.message || err.message),
                                  );
                              }}
                            >
                              {isProcessing ? <CircularLoader size="18px" /> : 'Pay'}
                            </Button>
                          </Case>
                          <Case condition={v?.status === 'HIRED'}>
                            <Button
                              sx={{ mt: 2 }}
                              variant="contained"
                              disabled={isCompleting}
                              onClick={() => setCompleted()}
                            >
                              {isCompleting ? <CircularLoader size="18px" /> : 'Complete'}
                            </Button>
                          </Case>
                        </Switch>
                        <Link
                          to={'/pages/chat'}
                          state={{
                            chatUser: {
                              id: v.seller._id,
                              fullName: v.seller.fullName,
                              userType: 'seller',
                            },
                          }}
                          style={{ display: 'flex', flexDirection: 'column' }}
                        >
                          <Button variant="contained" sx={{ my: 3 }}>
                            Chat
                          </Button>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </When>
            </div>
          </div>
          <When condition={!user}>
            <div className="col-xl-4 col-lg-4 col-md-0 col-sm-0 col-0 login-form-column mt-3">
              <div className=" mt-5  p-5 job-section-signup">
                <h4 className="text-light">Create a free profile to find work like this</h4>
                <p className=" text-light">
                  What are you waiting for register now to apply to a Job!
                </p>
                <Link
                  style={{ backgroundColor: '#003D69' }}
                  to="/signup"
                  className="btn text-light  btn-md w-100  mt-3"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </When>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
