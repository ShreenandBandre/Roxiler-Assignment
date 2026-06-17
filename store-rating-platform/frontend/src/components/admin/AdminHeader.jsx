import React, { useState } from 'react';

const AdminHeader = ({ onLogout }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleInputChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Updating terminal security keys...' });

    try {
      const token = localStorage.getItem('token'); 
      const response = await fetch('http://localhost:5000/api/users/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Security matrix updated successfully!' });
        setTimeout(() => {
          setIsModalOpen(false);
          setPasswordData({ currentPassword: '', newPassword: '' });
          setStatus({ type: '', message: '' });
        }, 2000);
      } else {
        setStatus({ type: 'error', message: data.message || 'Authentication override failed.' });
      }
    } catch { 
      setStatus({ type: 'error', message: 'Network linkage failure.' });
    }
  };

  return (
    <>
      <header className="border-b border-[#222634] bg-[#090a0f]/80 backdrop-blur-md sticky top-0 z-40 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-bold tracking-[0.2em] text-gray-400 uppercase">SYSTEM COMMAND CENTER</h1>
          <p className="text-xs text-gray-500 mt-0.5">Root Access Node: <span className="text-gray-300 font-medium">Admin</span></p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="text-xs text-gray-400 hover:text-white transition-colors border border-[#222634] px-3 py-1.5 rounded bg-[#11131e]"
          >
            Modify Credentials
          </button>

          <button onClick={onLogout} className="secondary-btn !py-1.5 !px-3.5 !text-xs">
            Sign Out Node
          </button>
        </div>
      </header>

      {/*  CYBERPUNK SECURITY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f111a] border border-[#222634] p-6 rounded-lg w-full max-w-md shadow-2xl relative">
            <h2 className="text-sm font-bold tracking-wider text-gray-300 uppercase mb-4">Update Security Access Keys</h2>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Current Master Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#090a0f] border border-[#222634] text-gray-300 text-xs rounded p-2.5 focus:border-blue-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">New Terminal Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#090a0f] border border-[#222634] text-gray-300 text-xs rounded p-2.5 focus:border-blue-500 focus:outline-none"
                  placeholder="Min 8 chars"
                />
              </div>

              {status.message && (
                <p className={`text-xs font-medium p-2 rounded ${
                  status.type === 'error' ? 'bg-red-950/40 text-red-400 border border-red-900/50' : 
                  status.type === 'success' ? 'bg-green-950/40 text-green-400 border border-green-900/50' : 'text-gray-400'
                }`}>
                  {status.message}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setStatus({ type: '', message: '' }); }}
                  className="px-3 py-2 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  disabled={status.type === 'loading'}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-4 py-2 rounded transition-colors disabled:opacity-50"
                >
                  Commit Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHeader;