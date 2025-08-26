import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-5xl font-bold mb-4 text-red-600">
        401 - Unauthorized
      </h1>
      <p className="text-lg mb-6">
        You do not have permission to view this page.
      </p>
      <Link
        to="/"
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized;
