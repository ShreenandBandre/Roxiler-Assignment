import React from 'react';

const StoreFilters = ({ searchName, setSearchName, searchAddress, setSearchAddress }) => {
  return (
    <div className="premium-card p-6 space-y-4">
      <div className="border-b border-[#222634] pb-2">
        <h3 className="text-xs font-semibold tracking-wide text-white uppercase">Search Node Filters</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Search Store Label</label>
          <input 
            type="text" 
            placeholder="Type business store name..." 
            className="input-field"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Search Geographical Location</label>
          <input 
            type="text" 
            placeholder="Type physical address coordinates..." 
            className="input-field"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default StoreFilters;