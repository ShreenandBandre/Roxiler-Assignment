import React from 'react';

const InspectUserModal = ({ isOpen, onClose, detail }) => {
  if (!isOpen || !detail) return null;

  return (
    <div className="fixed inset-0 bg-[#040507]/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="premium-card max-w-md w-full p-6 space-y-6 shadow-2xl animate-scale-up">
        <div className="border-b border-[#222634] pb-3">
          <h3 className="text-sm font-bold tracking-wider text-white uppercase">Schema Inspection Insights</h3>
          <p className="text-[11px] text-gray-500 font-mono mt-1">UUID: {detail.id}</p>
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-500 text-[10px] font-bold tracking-wider uppercase block">Full Name</span>
              <span className="text-white font-medium text-sm mt-0.5 block">{detail.name}</span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] font-bold tracking-wider uppercase block">System Privilege</span>
              <span className="text-gray-300 font-mono mt-0.5 block">{detail.role}</span>
            </div>
          </div>

          <div>
            <span className="text-gray-500 text-[10px] font-bold tracking-wider uppercase block">Registered Email</span>
            <span className="text-gray-300 font-mono mt-0.5 block">{detail.email}</span>
          </div>

          <div>
            <span className="text-gray-500 text-[10px] font-bold tracking-wider uppercase block">Physical Address</span>
            <span className="text-gray-400 mt-0.5 block">{detail.address || 'Not Provided'}</span>
          </div>

          {/* Conditional Telemetry for Store Owner Profiles */}
          {detail.role === 'STORE_OWNER' && (
            <div className="p-4 bg-[#0d0f17] border border-[#222634] rounded-xl space-y-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Bound Business Telemetry</span>
              {detail.store ? (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-500 text-[10px]">Store Label</span>
                    <p className="text-white font-medium mt-0.5">{detail.store.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px]">Average Metric</span>
                    <p className="text-white font-bold font-mono mt-0.5">★ {detail.store.averageRating ? Number(detail.store.averageRating).toFixed(2) : '0.00'}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 italic text-[11px]">No functional store bound to this owner yet.</p>
              )}
            </div>
          )}
        </div>

        <div className="pt-2">
          <button onClick={onClose} className="action-btn w-full !text-xs text-center">
            Close Inspection Stream
          </button>
        </div>
      </div>
    </div>
  );
};

export default InspectUserModal;