// Spinner.js
import React from 'react';
import { RingLoader } from 'react-spinners';

const Spinner = ({ color = "#07cae8", size = 150 }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <RingLoader color={color} size={size} />
    </div>
  );
};

export default Spinner;
