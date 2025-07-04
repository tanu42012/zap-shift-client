import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 px-4 text-center">
      <h1 className="text-6xl font-bold text-error mb-4">403</h1>
      <h2 className="text-3xl font-semibold mb-2">Access Denied</h2>
      <p className="text-gray-500 mb-6">You do not have permission to view this page.</p>
      
      <Link to="/" className="btn btn-primary text-black">
        Go to Homepage
      </Link>
    </div>
  );
};

export default Forbidden;
