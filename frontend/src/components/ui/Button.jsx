import React from 'react';

const Button = ({ text, onClick, className = '', type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-all duration-200 ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
