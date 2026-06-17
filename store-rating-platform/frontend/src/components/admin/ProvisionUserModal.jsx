import React from 'react';

const ProvisionUserModal = ({ isOpen, onClose, onSubmit, form, setForm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#040507]/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="premium-card max-w-md w-full p-6 space-y-6 shadow-2xl animate-scale-up">
        <div>
          <h3 className="text-sm font-bold tracking-wider text-white uppercase">Provision User Profile</h3>
          <p className="text-xs text-gray-500 mt-1">Deploy dynamic accounts into primary instance records.</p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name" required className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input type="email" placeholder="Email Address" required className="input-field" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input type="password" placeholder="System Access Password" required className="input-field" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          <select className="input-field appearance-none" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
            <option value="STORE_OWNER">Store Owner (Partner Profile)</option>
            <option value="ADMIN">System Administrator</option>
            <option value="NORMAL_USER">Standard Public Customer</option>
          </select>
          <textarea placeholder="Address (Optional)" rows="2" className="input-field resize-none" value={form.address} onChange={e => setForm({...form, address: e.target.value})}></textarea>
          <div className="flex gap-3 justify-end pt-2 text-xs">
            <button type="button" onClick={onClose} className="secondary-btn">Cancel</button>
            <button type="submit" className="action-btn">Commit Structure</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProvisionUserModal;