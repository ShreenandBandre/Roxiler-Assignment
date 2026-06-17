import React from 'react';
const StatsGrid = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="premium-card p-6 flex flex-col justify-between min-h-[140px]">
        <span className="text-gray-500 text-[11px] font-bold tracking-widest uppercase">Total System Users</span>
        <p className="text-4xl font-light text-white tracking-tighter mt-4">{stats.users}</p>
      </div>
      <div className="premium-card p-6 flex flex-col justify-between min-h-[140px]">
        <span className="text-gray-500 text-[11px] font-bold tracking-widest uppercase">Active Functional Stores</span>
        <p className="text-4xl font-light text-white tracking-tighter mt-4">{stats.stores}</p>
      </div>
      <div className="premium-card p-6 flex flex-col justify-between min-h-[140px]">
        <span className="text-gray-500 text-[11px] font-bold tracking-widest uppercase">Submitted Ratings</span>
        <p className="text-4xl font-light text-white tracking-tighter mt-4">{stats.ratings}</p>
      </div>
    </div>
  );
};

export default StatsGrid;