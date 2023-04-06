import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import SingleReview from './SingleReview';
import { API_URL } from '../../../utils/contants';

function Reviews({ selectedUser }) {
  const user = selectedUser || JSON.parse(localStorage.getItem('authUser'));
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get(API_URL + `auth/${user?._id}/reviews`)
      .then((res) => setReviews(res.data))
      .then((err) => console.log(err));
  }, []);

  return (
    <div className="reviews">
      <h2 className="py-3 section-heading txt-primary">Reviews</h2>
      <div className="d-flex justify-content-between flex-wrap">
        {reviews.length > 0 ? (
          reviews.map((item) => <SingleReview review={item} key={item.id} />)
        ) : (
          <p>You don&apos;t have any review yet</p>
        )}
      </div>
    </div>
  );
}

Reviews.propTypes = {
  selectedUser: PropTypes.object.isRequired,
};

export default Reviews;
