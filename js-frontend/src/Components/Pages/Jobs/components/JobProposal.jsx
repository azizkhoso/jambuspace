import MenuItem from '@mui/material/MenuItem';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addBid, getJobById } from '../../../api/seller';
import { PageLoader } from '../../../../App';
import { TextField } from '@mui/material';
import { Else, If, Then } from 'react-if';

const JobProposal = () => {
  const { id } = useParams();
  const [selectedJob, setSelectedJob] = React.useState();
  const navigate = useNavigate();
  const client = useQueryClient();
  const { isLoading } = useQuery(['seller-job', id], () => getJobById(id), {
    onSuccess: ({ data }) => {
      setSelectedJob(data);
      if (data.bids[0]) {
        // a seller can apply to a job only once
        toast.error('Already applied to the job');
        navigate('/pages/dashboard');
      }
    },
    onError: (err) => toast.error(err.response?.data.message || err.message),
  });

  const { isLoading: isSubmitting, mutate } = useMutation((vals) => addBid(vals), {
    onSuccess: () => {
      client.invalidateQueries('seller-bids');
      navigate('/pages/dashboard');
    },
    onError: (err) => toast.error(err.response?.data.message || err.message),
  });

  const [visible, setVisible] = useState(false);
  const [duration, setDuration] = React.useState('Less than Month');
  const [cover, setCover] = useState('');
  const [amount, setAmount] = useState('');
  const [image, setImage] = useState();
  var [milestones, setMilestones] = useState([
    {
      description: '',
      dueDate: '',
      amount: '',
    },
  ]);

  const handleChange = (event) => {
    setDuration(event.target.value);
  };

  const mileStoneInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...milestones];
    list[index][name] = value;
    setMilestones(list);

    var totalAmount = 0;
    for (var i = 0; i < milestones?.length; i++) {
      const milestoneAmount = Number(milestones[i].amount);
      totalAmount = milestoneAmount + totalAmount;
      setAmount(totalAmount);
    }
  };

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        description: '',
        dueDate: '',
        amount: '',
      },
    ]);
  };

  const deleteMilestone = (i) => {
    setAmount(amount - milestones[i].amount);

    const list = [...milestones];
    list.splice(i, 1);
    setMilestones(list);
  };

  const submit = () => {
    var issue = false;
    if (visible) {
      for (var i = 0; i < milestones.length; i++) {
        if (milestones[i].description === undefined || milestones[i].description.length === 0) {
          issue = true;
        } else if (milestones[i].amount === undefined || milestones[i].amount.length === 0) {
          issue = true;
        } else if (milestones[i].dueDate === undefined || milestones[i].dueDate.length === 0) {
          issue = true;
        }
      }
    }
    if (cover.length === 0 || cover === undefined) {
      alert('Cover Required');
    } else if (image === undefined) {
      alert('Image Required');
    } else if (duration === undefined || duration.length == 0) {
      alert('Duration Details Required');
    } else if (amount === undefined || amount.length == 0) {
      alert('Amount Required');
    } else if (issue === true) {
      alert('Enter each milesone data complete');
    } else {
      const form = new FormData();
      form.append('cover', cover);
      form.append('image', image);
      form.append('duration', duration);
      form.append('job', selectedJob._id);
      if (visible) {
        form.append('milestones', JSON.stringify(milestones));
      }
      form.append('amount', amount);

      mutate(form);
    }
  };

  const clearAllInputs = () => {
    setMilestones([
      {
        description: '',
        dueDate: '',
        amount: 0,
      },
    ]);
    setAmount(0);
  };

  if (isLoading) return <PageLoader />;
  return (
    <div>
      <div className="container">
        <h3 className="mt-2">Submit Proposal</h3>
        <div
          className="d-flex justify-content-between  p-3 px-4"
          style={{
            border: '1px solid silver',
            borderRadius: '4px 4px 0px 0px',
            borderBottom: '0px solid',
          }}
        >
          <h4 className="mb-0">Terms</h4>
          <h5 className="text-muted">Client&apos;s budget: ${selectedJob?.budget} AUD</h5>
        </div>
        <div
          style={{
            border: '1px solid silver',
            borderRadius: '0px 0px 4px 4px',
          }}
        >
          <div className="container p-3 px-4">
            <p className="fw-bold text-primary">How do you want to be paid?</p>
            <div>
              <input
                type="radio"
                id="html"
                name="fav_language"
                checked={visible}
                onClick={() => {
                  setVisible(true);
                  clearAllInputs();
                }}
              />
              <lable className="fw-normal fs-6 mx-2">Milestone</lable>
              <p className="text-muted">
                Divide the project into smaller segments, called milestones. You&apos;ll be paid for
                milestones as they are completed and approved.
              </p>
            </div>
            <div>
              <input
                type="radio"
                id="html"
                name="fav_language"
                checked={!visible}
                onClick={() => {
                  setVisible(false);
                  clearAllInputs();
                }}
              />
              <lable className="fw-normal fs-6 mx-2">By Project</lable>
              <p className="text-muted">
                Get your entire payment at the end, when all work has been delivered.
              </p>
            </div>
            <If condition={visible}>
              <Then>
                <div>
                  <p className="fw-bold text-primary">
                    How many milestones do you want to include?
                  </p>
                  {milestones?.map((v, i) => {
                    return (
                      <div key={i} className="row my-3" style={{ position: 'relative' }}>
                        {i > 0 ? (
                          <div
                            onClick={() => deleteMilestone(i)}
                            style={{
                              position: 'absolute',
                              top: -5,
                              right: 18,
                              width: 32,
                            }}
                            className="cursor-pointer d-flex justify-content-center input-group-append"
                          >
                            <span className="input-group-text">X</span>
                          </div>
                        ) : null}
                        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                          <label name="description" className="mb-2 fs-5 fw-bold">
                            Description
                          </label>
                          <input
                            value={v.description}
                            onChange={(e) => mileStoneInputChange(e, i)}
                            type="text"
                            name="description"
                            className="form-control"
                          />
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                          <label className="mb-2 fs-5 fw-bold">Due Date</label>
                          <input
                            name="dueDate"
                            onChange={(e) => mileStoneInputChange(e, i)}
                            value={v.dueDate}
                            type="date"
                            className="form-control"
                          />
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                          <label className="mb-2 fs-5 fw-bold">Amount</label>
                          <div className="input-group ">
                            <div className="input-group-prepend">
                              <span className="input-group-text">$</span>
                            </div>
                            <input
                              type="number"
                              className="form-control"
                              name="amount"
                              value={v.amount}
                              onChange={(e) => mileStoneInputChange(e, i)}
                              aria-label="Amount (to the nearest dollar)"
                            />
                            <div className="input-group-append">
                              <span className="input-group-text">.00</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="w-50">
                    <div
                      onClick={() => addMilestone()}
                      className="mt-4 cursor-pointer w-25 d-flex justify-content-center input-group-append"
                    >
                      <span className="input-group-text">Add Milestone</span>
                    </div>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between mt-4">
                      <div>
                        <label className="fs-6 fw-bold">Total price of project</label>
                        <p>This includes all milestones, and is the amount your client will see</p>
                      </div>
                      <div className="align-self-center">
                        <p className="fs-5 fw-bolder">{amount}</p>
                      </div>
                    </div>
                    <hr />
                  </div>
                  <div>
                    <div className="d-flex justify-content-between mt-4">
                      <div>
                        <label className="fs-6 fw-bold">JumboSpace Service Fee</label>
                        {/* <p>This includes all milestones, and is the amount your client will see</p> */}
                      </div>
                      <div className="align-self-center">
                        <p className="fs-5 fw-bolder">
                          {(amount * selectedJob?.companyMargin).toFixed(2)}$
                        </p>
                      </div>
                    </div>
                    <hr />
                  </div>
                  <div>
                    <div className="d-flex justify-content-between mt-4">
                      <div>
                        <label className="fs-6 fw-bold">You will receive</label>
                        <p>Your estimated payment, after service fees</p>
                      </div>
                      <div className="align-self-center">
                        <p className="fs-5 fw-bolder">
                          {Number(amount * (1 - selectedJob?.companyMargin)).toFixed(2)}$
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Then>
              <Else>
                <div>
                  <p className="fw-bold text-primary">
                    What is the full amount you&apos;d like to bid for this job?
                  </p>
                  <div>
                    <div className="d-flex justify-content-between mt-4">
                      <div>
                        <label className="fs-6 fw-bold">Bid</label>
                        <p>Total amount the client will see on your proposal</p>
                      </div>
                      <div className="align-self-center">
                        <div className="">
                          <div className="input-group ">
                            <div className="input-group-prepend">
                              <span className="input-group-text">$</span>
                            </div>
                            <input
                              type="number"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              name="bid"
                              className="form-control"
                              aria-label="Amount (to the nearest dollar)"
                            />
                            <div className="input-group-append">
                              <span className="input-group-text">.00</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mt-4">
                      <div>
                        <label className="fs-6 fw-bold">JumboSpace Service Fee</label>
                        <p>This includes all milestones, and is the amount your client will see</p>
                      </div>
                      <div className="align-self-center">
                        <p className="fs-5 fw-normal text-danger">
                          {(amount * selectedJob?.companyMargin).toFixed(2)}$
                        </p>
                      </div>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mt-4">
                      <div>
                        <label className="fs-6 fw-bold">You’ll Receive</label>
                        <p>The estimated amount you&apos;ll receive after service fees </p>
                      </div>
                      <div className="align-self-center">
                        <p className="fs-5 fw-bold text-success">
                          {(amount * (1 - selectedJob?.companyMargin)).toFixed(2)}$
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Else>
            </If>
          </div>
        </div>

        <div className="mt-5" style={{ border: '1px solid silver', borderRadius: '4px' }}>
          <div className="container p-3 px-4">
            <h4>How long this project will take?</h4>
            <TextField
              size="small"
              id="duration"
              label="Duration of the project"
              select
              name="duration"
              value={duration}
              onChange={handleChange}
            >
              <MenuItem value={'Less than Month'}>Less than Month</MenuItem>
              <MenuItem value={'Month'}>Month</MenuItem>
              <MenuItem value={'More than a Month'}>More than a Month</MenuItem>
              <MenuItem value={'3 to 6 Month'}>3 to 6 Month</MenuItem>
              <MenuItem value={'More than 6 Month'}>More than 6 Month</MenuItem>
            </TextField>
          </div>
        </div>
        <div className="mt-5" style={{ border: '1px solid silver', borderRadius: '4px' }}>
          <div className="container p-3 px-4">
            <h4>Cover Letter</h4>
            <textarea
              placeholder="Describe your job"
              className="form-control"
              name="description"
              cols="30"
              rows="5"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
            ></textarea>
            <div className="mb-3 mt-4">
              <h5 htmlFor="formFile" className="form-label">
                Drop your works and CV there
              </h5>
              <input
                onChange={(e) => setImage(e.target.files[0])}
                name="image"
                className="form-control"
                type="file"
                id="formFile"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 mb-3 ">
          <button
            disabled={isSubmitting}
            onClick={() => submit()}
            className="btn btn-primary btn-lg w-100"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobProposal;
