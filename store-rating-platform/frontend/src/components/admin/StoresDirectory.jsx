import React from 'react';

const StoresDirectory = ({ stores, filter, setFilter }) => {
  return (
    <div className="premium-card overflow-hidden">
      <div className="px-6 py-5 border-b border-[#222634] bg-[#11131d]">
        <h3 className="text-sm font-semibold text-white tracking-wide">Active Commercial Stores Feed</h3>
        <p className="text-[11px] text-gray-500 mt-0.5">Filter and verify registered corporate outlet parameters</p>
      </div>

      {/* Store Filters Node */}
      <div className="p-6 bg-[#0d0f17] border-b border-[#222634] grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input type="text" placeholder="Filter by Store Name..." className="input-field" value={filter.name} onChange={e => setFilter({...filter, name: e.target.value})} />
        <input type="text" placeholder="Filter by Contact Email..." className="input-field" value={filter.email} onChange={e => setFilter({...filter, email: e.target.value})} />
        <input type="text" placeholder="Filter by Address/Coordinates..." className="input-field" value={filter.address} onChange={e => setFilter({...filter, address: e.target.value})} />
      </div>

      {/* Stores Table Layout */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#222634] text-gray-500 uppercase text-[10px] font-bold tracking-widest bg-[#0d0f17]">
              <th className="px-6 py-3.5">Store Outlets Label</th>
              <th className="px-6 py-3.5">Business Email</th>
              <th className="px-6 py-3.5">Physical Location</th>
              <th className="px-6 py-3.5">Assigned Owner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222634]/50">
            {stores.map(store => (
              <tr key={store.id} className="hover:bg-[#1c202e]/30 transition-colors duration-150">
                <td className="px-6 py-4 font-bold text-white tracking-tight">{store.name}</td>
                <td className="px-6 py-4 text-gray-500 font-mono tracking-tight">{store.email}</td>
                <td className="px-6 py-4 text-gray-400">{store.address}</td>
                <td className="px-6 py-4 text-gray-300 font-medium">{store.owner?.name || 'Automated Partner Node'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoresDirectory;