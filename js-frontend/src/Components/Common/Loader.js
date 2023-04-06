import React from 'react';
import loader from '../assets/loader.gif';

const Loader = () => {
  return (
    <div
      style={{
        height: '50vh',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <img
        src={loader}
        style={{
          width: '5rem',
        }}
      />
    </div>
  );
};

export default Loader;
