import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import API from '../services/api';
import StoreHeader from '../components/store/StoreHeader';
import StoreFilters from '../components/store/StoreFilters';
import StoreCard from '../components/store/StoreCard';
import PasswordModal from '../components/store/PasswordModal';
import '../App.css';

const StoresFeed = () => {
  const [stores, setStores] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  // Search and Filter States
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');

  // Password Modal Controls
  const [showPassModal, setShowPassModal] = useState(false);
  const [passwordPayload, setPasswordPayload] = useState({ currentPassword: '', newPassword: '' });
  const [passLoading, setPassLoading] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch initial system states
  const fetchStores = async () => {
    try {
      setError('');
      const response = await API.get('/stores');
      setStores(response.data?.data || response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to sync stores stream.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  (async () => {
    await fetchStores();
  })();
}, []);

  // Handle Dynamic Rating Pipeline
  const handleRate = async (storeId, ratingValue) => {
    try {
      await API.post('/stores/rate', { storeId, value: ratingValue });
      fetchStores();
    } catch (err) {
      alert(err.message || 'Error processing rating submit/modification execution.');
    }
  };

  // Password submission coordinator
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setPassLoading(true);
    try {
      await API.put('/users/update-password', passwordPayload);
      setSuccess('Access security credentials modified successfully!');
      setPasswordPayload({ currentPassword: '', newPassword: '' });
      setTimeout(() => { setShowPassModal(false); setSuccess(''); }, 2000);
    } catch (err) {
      setError(err.message || 'Failed updating security authentication credentials.');
    } finally {
      setPassLoading(false);
    }
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  const filteredStores = stores.filter(store => 
    store.name?.toLowerCase().includes(searchName.toLowerCase()) &&
    store.address?.toLowerCase().includes(searchAddress.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#090a0f] text-gray-100 flex flex-col antialiased">
      {/* Navigation Layer */}
      <StoreHeader 
        userName={user?.name} 
        onOpenPasswordModal={() => { setError(''); setSuccess(''); setShowPassModal(true); }} 
        onLogout={handleLogoutClick} 
      />

      {/* Primary Workspace */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-8 py-12 space-y-10">
        <div className="border-b border-[#222634] pb-6">
          <h2 className="text-2xl font-semibold text-white tracking-tight">Available Outlets & Establishments</h2>
          <p className="text-xs text-gray-500 mt-1 tracking-wide">Browse active stores, verify total aggregated ratings and cast/modify your vote.</p>
        </div>

        {/* Global Notifications Panel */}
        {(error || success) && (
          <div className="space-y-2">
            {error && <div className="bg-red-950/30 border border-red-900/40 text-red-400 p-4 rounded-xl text-xs tracking-wide">{error}</div>}
            {success && <div className="bg-gray-900 border border-gray-800 text-gray-300 p-4 rounded-xl text-xs tracking-wide">{success}</div>}
          </div>
        )}

        {/* Filtering Systems */}
        <StoreFilters 
          searchName={searchName} 
          setSearchName={setSearchName} 
          searchAddress={searchAddress} 
          setSearchAddress={setSearchAddress} 
        />

        {/* Core Layout Canvas */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 text-xs tracking-widest uppercase">Syncing live database stream...</p>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="text-center py-20 premium-card max-w-xl mx-auto p-8">
            <p className="text-gray-400 text-sm font-medium tracking-wide">No store profiles match your filter queries.</p>
            <p className="text-gray-600 text-xs mt-2">Adjust search keywords parameters and retry navigation lookup.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredStores.map((store) => (
              <StoreCard 
                key={store.id} 
                store={store} 
                onRate={handleRate} 
              />
            ))}
          </div>
        )}
      </main>

      {/* Security Overlay sheet */}
      <PasswordModal 
        isOpen={showPassModal} 
        onClose={() => setShowPassModal(false)} 
        onSubmit={handleUpdatePassword} 
        payload={passwordPayload} 
        setPayload={setPasswordPayload} 
        loading={passLoading} 
      />
    </div>
  );
};

export default StoresFeed;