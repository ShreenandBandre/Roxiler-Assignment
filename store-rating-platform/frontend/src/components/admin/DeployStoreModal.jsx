import React from 'react';

const DeployStoreModal = ({ isOpen, onClose, onSubmit, form, setForm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#040507]/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="premium-card max-w-md w-full p-6 space-y-6 shadow-2xl animate-scale-up">
        <div>
          <h3 className="text-sm font-bold tracking-wider text-white uppercase">Instant Store Deployment</h3>
          <p className="text-xs text-gray-500 mt-1">Generates active retail coordinates and owner profiles simultaneously.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <input type="text" placeholder="Store/Outlet Commercial Name" required className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input type="email" placeholder="Store Business Contact Email" required className="input-field" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input type="text" placeholder="Physical Address Location Coordinates" required className="input-field" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
          <div className="space-y-3 pt-4 border-t border-[#222634]">
            <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase block">Partner Node Context</span>
            <input type="text" placeholder="Owner Full Name" required className="input-field" value={form.ownerName} onChange={e => setForm({...form, ownerName: e.target.value})} />
            <input type="email" placeholder="Owner Login Email" required className="input-field" value={form.ownerEmail} onChange={e => setForm({...form, ownerEmail: e.target.value})} />
          </div>
          <div className="flex gap-3 justify-end pt-2 text-xs">
            <button type="button" onClick={onClose} className="secondary-btn">Cancel</button>
            <button type="submit" className="action-btn">Deploy Everything</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeployStoreModal;