// Spinner.js
import React from 'react';
import { RingLoader,BeatLoader  } from 'react-spinners';

const Spinner = ({ color = "#07cae8", size = 20 }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black opacity-50">
      <BeatLoader  color={color} size={size} />
    </div>
  );
};

export default Spinner;
