import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import API from '../services/api';
import '../App.css';

const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const [showPassModal, setShowPassModal] = useState(false);
  const [passwordPayload, setPasswordPayload] = useState({ currentPassword: '', newPassword: '' });
  const [passLoading, setPassLoading] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchOwnerMetrics = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const response = await API.get('/store-owner/dashboard');
      const parsedData = response.data?.data || response.data;
      if (parsedData) {
        setDashboardData(parsedData);
      } else {
        throw new Error("Invalid response format received.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to sync platform metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  (async () => {
    await fetchOwnerMetrics(); 
  })();
}, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setPassLoading(true);
    try {
      await API.put('/users/update-password', passwordPayload);
      setSuccess('Credentials modified. Synchronizing safe logout schema...');
      setPasswordPayload({ currentPassword: '', newPassword: '' });
      setTimeout(() => {
        setShowPassModal(false);
        logout();
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed processing request.');
    } finally {
      setPassLoading(false);
    }
  };

  const storeInstance = dashboardData?.store;
  const averageRating = dashboardData?.store?.averageRating ?? 0;
  const ratersList = dashboardData?.raters || [];
  const totalRatings = ratersList.length;

  return (
    <div className="min-h-screen bg-[#090a0f] text-gray-100 flex flex-col antialiased">
      {/* Premium Minimalist Top Bar */}
      <header className="border-b border-[#222634] bg-[#090a0f]/80 backdrop-blur-md sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-bold tracking-[0.2em] text-gray-400 uppercase">CONSOLE PANEL</h1>
          <p className="text-xs text-gray-500 mt-0.5">Operator: <span className="text-gray-300 font-medium">{user?.name}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => { setError(''); setSuccess(''); setShowPassModal(true); }} className="secondary-btn !py-1.5 !px-3.5 !text-xs">
            Security Key
          </button>
          <button onClick={() => { logout(); navigate('/login'); }} className="action-btn !py-1.5 !px-3.5 !text-xs">
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container Dashboard */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-8 py-12 space-y-10">
        {error && <div className="bg-red-950/30 border border-red-900/40 text-red-400 p-4 rounded-xl text-xs tracking-wide">{error}</div>}
        {success && <div className="bg-gray-900 border border-gray-800 text-gray-300 p-4 rounded-xl text-xs tracking-wide">{success}</div>}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 text-xs tracking-widest uppercase">Fetching Records...</p>
          </div>
        ) : !storeInstance ? (
          <div className="text-center py-20 premium-card max-w-xl mx-auto p-8">
            <p className="text-gray-400 text-sm font-medium tracking-wide">No enterprise profile mapping discovered.</p>
            <p className="text-gray-600 text-xs mt-2">Please interface with configuration management to bind your terminal parameters.</p>
          </div>
        ) : (
          <div className="space-y-10 animate-fade-in">
            {/* Store Identification Details */}
            <div className="border-b border-[#222634] pb-6">
              <h2 className="text-2xl font-semibold text-white tracking-tight">{storeInstance.name}</h2>
              <p className="text-xs text-gray-500 mt-1 tracking-wide">Establishment Metrics Ledger & Dynamic Analytics</p>
            </div>

            {/* Metrics Structural Core Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="premium-card p-6 flex flex-col justify-between min-h-[140px]">
                <span className="text-gray-500 text-[11px] font-bold tracking-widest uppercase">AVERAGE WEIGHT SCORE</span>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-4xl font-light text-white tracking-tighter">{Number(averageRating).toFixed(2)}</span>
                  <span className="text-xs text-gray-500 font-medium">/ 5.00</span>
                </div>
              </div>
              
              <div className="premium-card p-6 flex flex-col justify-between min-h-[140px]">
                <span className="text-gray-500 text-[11px] font-bold tracking-widest uppercase">TOTAL COMMITTED VOLUMES</span>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-4xl font-light text-white tracking-tighter">{totalRatings}</span>
                  <span className="text-xs text-gray-500 font-medium">Audits</span>
                </div>
              </div>

              <div className="premium-card p-6 flex flex-col justify-between min-h-[140px]">
                <span className="text-gray-500 text-[11px] font-bold tracking-widest uppercase">ESTABLISHMENT DOMAIN</span>
                <p className="text-xs text-gray-300 leading-relaxed font-medium mt-4 line-clamp-2">{storeInstance.address || 'Operational HQ Address Default'}</p>
              </div>
            </div>

            {/* Dynamic Customer Data Ledger */}
            <div className="premium-card overflow-hidden">
              <div className="px-6 py-5 border-b border-[#222634] bg-[#11131d]">
                <h3 className="text-sm font-semibold text-white tracking-wide">Customer Evaluation Indexes</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">Verified system transactions compiled via user security protocols</p>
              </div>

              {ratersList.length === 0 ? (
                <div className="p-16 text-center text-gray-600 text-xs tracking-wider">
                  No evaluation parameters logged inside current system ledger.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#222634] text-gray-500 uppercase text-[10px] font-bold tracking-widest bg-[#0d0f17]">
                        <th className="px-6 py-3.5">Client Profile</th>
                        <th className="px-6 py-3.5">Network Node Address</th>
                        <th className="px-6 py-3.5 text-right">Contributed Weight</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222634]/50">
                      {ratersList.map((rater, index) => {
                     const starCount = Math.max(0, Math.min(5, Number(rater.rating) || 0));
    
                     return (
                          <tr key={rater.id || index} className="hover:bg-[#1c202e]/30 transition-colors duration-150">
                          <td className="px-6 py-4 text-[#e2a83f] font-mono">
          
                          {"★".repeat(starCount) + "☆".repeat(5 - starCount)} ({starCount})
        </td>
      </tr>
    );
  })
}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* --- PREMIUM COMPACT PASSWORD MODAL OVERLAY --- */}
      {showPassModal && (
        <div className="fixed inset-0 bg-[#040507]/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="premium-card max-w-md w-full p-6 space-y-6 shadow-2xl animate-scale-up">
            <div>
              <h3 className="text-sm font-bold tracking-wider text-white uppercase">Modify Security Key</h3>
              <p className="text-xs text-gray-500 mt-1">Alter current authorization token mapping instructions.</p>
            </div>
            
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-gray-400 text-xs font-medium">Active Passcode</label>
                <input type="password" required className="input-field" value={passwordPayload.currentPassword} onChange={e => setPasswordPayload({...passwordPayload, currentPassword: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-400 text-xs font-medium">New Signature Token</label>
                <input type="password" required className="input-field" value={passwordPayload.newPassword} onChange={e => setPasswordPayload({...passwordPayload, newPassword: e.target.value})} />
              </div>
              <div className="flex gap-3 justify-end pt-2 text-xs">
                <button type="button" onClick={() => setShowPassModal(false)} className="secondary-btn">Cancel</button>
                <button type="submit" disabled={passLoading} className="action-btn disabled:opacity-50">
                  {passLoading ? 'Updating...' : 'Commit Mutation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;