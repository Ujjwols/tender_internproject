
import React from "react";

const Welcome = () => {
  return (
    <div className="text-left slide-in">
      <div className="inline-block px-3 py-1 mb-4 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
        Admin Dashboard
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to Admin Portal
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl">
        Manage your procurement processes, tenders, and evaluations efficiently
      </p>
    </div>
  );
};

export default Welcome;
