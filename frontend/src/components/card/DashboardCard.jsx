import React from 'react';

const DashboardCard = ({ count, title }) => {
  return (
    <div className="relative group border border-violet-300 bg-gradient-to-br from-violet-50 to-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-200/40 via-transparent to-violet-300/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"></div>
      <p className="text-sm font-medium text-violet-700 tracking-wide mb-2">
        {title}
      </p>
      <p className="text-3xl font-bold text-gray-800 group-hover:scale-110 transition-transform duration-300">
        {count}
      </p>
    </div>
  );
};

export default DashboardCard;
