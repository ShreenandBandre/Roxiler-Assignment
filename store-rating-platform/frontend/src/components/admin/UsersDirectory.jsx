import React from 'react';
const UsersDirectory = ({ users, filter, setFilter, onInspect }) => {
  return (
    <div className="premium-card overflow-hidden">
      <div className="px-6 py-5 border-b border-[#222634] bg-[#11131d]">
        <h3 className="text-sm font-semibold text-white tracking-wide">System Accounts Directory</h3>
        <p className="text-[11px] text-gray-500 mt-0.5">Use below multi-column matrices filters to locate accounts</p>
      </div>

      {/* Inputs Filter Node */}
      <div className="p-6 bg-[#0d0f17] border-b border-[#222634] grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input type="text" placeholder="Filter by Name..." className="input-field" value={filter.name} onChange={e => setFilter({...filter, name: e.target.value})} />
        <input type="text" placeholder="Filter by Email..." className="input-field" value={filter.email} onChange={e => setFilter({...filter, email: e.target.value})} />
        <input type="text" placeholder="Filter by Address..." className="input-field" value={filter.address} onChange={e => setFilter({...filter, address: e.target.value})} />
        <select className="input-field appearance-none" value={filter.role} onChange={e => setFilter({...filter, role: e.target.value})}>
          <option value="">All Roles Matrix</option>
          <option value="NORMAL_USER">NORMAL_USER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="STORE_OWNER">STORE_OWNER</option>
        </select>
      </div>

      {/* Accounts Table Matrix */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#222634] text-gray-500 uppercase text-[10px] font-bold tracking-widest bg-[#0d0f17]">
              <th className="px-6 py-3.5">Account Name</th>
              <th className="px-6 py-3.5">Email Identifier</th>
              <th className="px-6 py-3.5">Physical Address</th>
              <th className="px-6 py-3.5">Access Privilege</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222634]/50">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-[#1c202e]/30 transition-colors duration-150">
                <td className="px-6 py-4 font-medium text-gray-300">{user.name}</td>
                <td className="px-6 py-4 text-gray-500 font-mono tracking-tight">{user.email}</td>
                <td className="px-6 py-4 text-gray-400">{user.address || '—'}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-md font-mono text-[10px] bg-[#0d0f17] border border-[#222634] text-gray-300">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => onInspect(user.id)} className="text-gray-300 hover:text-white font-medium hover:underline cursor-pointer">Inspect Schema</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersDirectory;