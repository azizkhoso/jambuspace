import React from 'react';
import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import StarRating from 'react-star-ratings';

function SingleReview({ review }) {
  return (
    <Col md={6} key={review.id}>
      <div className="mx-2 single-review">
        <div className="w-100 d-flex justify-content-between">
          <h4>{review.username}</h4>
          <StarRating
            rating={review.rating}
            starDimension="20px"
            starSpacing="2px"
            starRatedColor="#DAA034"
          />
        </div>
        <p>{review.description}</p>
      </div>
    </Col>
  );
}

SingleReview.propTypes = {
  review: PropTypes.object.isRequired,
};

export default SingleReview;
