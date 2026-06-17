import React from 'react';
const PasswordModal = ({ isOpen, onClose, onSubmit, payload, setPayload, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#040507]/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="premium-card max-w-md w-full p-6 space-y-6 shadow-2xl animate-scale-up">
        <div>
          <h3 className="text-sm font-bold tracking-wider text-white uppercase">Modify Security Key</h3>
          <p className="text-xs text-gray-500 mt-1">Alter current account login password authorization rules.</p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-gray-400 text-xs font-medium">Current Secure Password</label>
            <input 
              type="password" 
              required 
              className="input-field" 
              value={payload.currentPassword}
              onChange={e => setPayload({...payload, currentPassword: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-gray-400 text-xs font-medium">New Secure Access Token</label>
            <input 
              type="password" 
              required 
              className="input-field" 
              value={payload.newPassword}
              onChange={e => setPayload({...payload, newPassword: e.target.value})}
            />
          </div>
          <div className="flex gap-3 justify-end pt-2 text-xs">
            <button type="button" onClick={onClose} className="secondary-btn">Cancel</button>
            <button type="submit" disabled={loading} className="action-btn disabled:opacity-50">
              {loading ? 'Updating...' : 'Commit Change'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;