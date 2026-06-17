import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import API from '../services/api';


import AdminHeader from '../components/admin/AdminHeader';
import StatsGrid from '../components/admin/StatsGrid';
import UsersDirectory from '../components/admin/UsersDirectory';
import StoresDirectory from '../components/admin/StoresDirectory';
import ProvisionUserModal from '../components/admin/ProvisionUserModal';
import DeployStoreModal from '../components/admin/DeployStoreModal';
import InspectUserModal from '../components/admin/InspectUserModal';
import '../App.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [usersList, setUsersList] = useState([]);
  const [storesList, setStoresList] = useState([]);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Toggles Matrices
  const [showUserModal, setShowUserModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Global Context Target Filters
  const [userFilter, setUserFilter] = useState({ name: '', email: '', address: '', role: '' });
  const [storeFilter, setStoreFilter] = useState({ name: '', email: '', address: '' });

  // Payload Registries
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'STORE_OWNER', address: '' });
  const [storeForm, setStoreForm] = useState({ name: '', email: '', address: '', ownerName: '', ownerEmail: '' });

  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchAllAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, storesRes] = await Promise.all([
        API.get('/admin/dashboard'),
        API.get('/admin/users'),
        API.get('/admin/stores')
      ]);

      setStats(statsRes.data?.data || statsRes.data || { users: 0, stores: 0, ratings: 0 });
      setUsersList(usersRes.data?.data || usersRes.data || []);
      setStoresList(storesRes.data?.data || storesRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to sync control center database streams.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  (async () => {
    await fetchAllAdminData();
  })();
}, []);

  const handleViewUserDetail = async (userId) => {
    try {
      const res = await API.get(`/admin/users/${userId}`);
      setSelectedUserDetail(res.data?.data || res.data);
      setShowDetailModal(true);
    } catch (err) { setError(err.message || 'Something went wrong'); }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/users', userForm);
      alert('User provisioned successfully!');
      setShowUserModal(false);
      setUserForm({ name: '', email: '', password: '', role: 'STORE_OWNER', address: '' });
      fetchAllAdminData();
    } catch (err) { setError(err.message); }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/stores', storeForm);
      alert('Store and automatic owner profile successfully deployed!');
      setShowStoreModal(false);
      setStoreForm({ name: '', email: '', address: '', ownerName: '', ownerEmail: '' });
      fetchAllAdminData();
    } catch (err) { setError(err.message); }
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  // Real-time Runtime Filter Configurations
  const filteredUsers = usersList.filter(u => 
    u.name?.toLowerCase().includes(userFilter.name.toLowerCase()) &&
    u.email?.toLowerCase().includes(userFilter.email.toLowerCase()) &&
    u.address?.toLowerCase().includes(userFilter.address.toLowerCase()) &&
    (userFilter.role === '' || u.role === userFilter.role)
  );

  const filteredStores = storesList.filter(s => 
    s.name?.toLowerCase().includes(storeFilter.name.toLowerCase()) &&
    s.email?.toLowerCase().includes(storeFilter.email.toLowerCase()) &&
    s.address?.toLowerCase().includes(storeFilter.address.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#090a0f] text-gray-100 flex flex-col antialiased">
      <AdminHeader onLogout={handleLogoutClick} />

      <main className="flex-grow max-w-7xl w-full mx-auto px-8 py-12 space-y-10">
        {error && <div className="bg-red-950/30 border border-red-900/40 text-red-400 p-4 rounded-xl text-xs tracking-wide">{error}</div>}

        {/* Global Node Controls Header */}
        <div className="flex flex-wrap gap-4 justify-between items-center border-b border-[#222634] pb-6">
          <div>
            <h2 className="text-2xl font-semibold text-white tracking-tight">Admin DashView</h2>
            <p className="text-xs text-gray-500 mt-1 tracking-wide">Audit telemetry logs, filter system entries or register nodes.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowUserModal(true)} className="action-btn !text-xs !py-2 !px-4">+ Provision Accounts</button>
            <button onClick={() => setShowStoreModal(true)} className="secondary-btn !text-xs !py-2 !px-4">+ Deploy Store Node</button>
          </div>
        </div>

        {/* System Analytics Metrics Row */}
        <StatsGrid stats={stats} />

        {/* Primary Data Structures Rendering Window */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 text-xs tracking-widest uppercase">Syncing dynamic structural layouts...</p>
          </div>
        ) : (
          <div className="space-y-10 animate-fade-in">
            <UsersDirectory 
              users={filteredUsers} 
              filter={userFilter} 
              setFilter={setUserFilter} 
              onInspect={handleViewUserDetail} 
            />

            <StoresDirectory 
              stores={filteredStores} 
              filter={storeFilter} 
              setFilter={setStoreFilter} 
            />
          </div>
        )}
      </main>

      {/* System Overlay Sheet Matrix */}
      <ProvisionUserModal 
        isOpen={showUserModal} 
        onClose={() => setShowUserModal(false)} 
        onSubmit={handleCreateUser} 
        form={userForm} 
        setForm={setUserForm} 
      />

      <DeployStoreModal 
        isOpen={showStoreModal} 
        onClose={() => setShowStoreModal(false)} 
        onSubmit={handleCreateStore} 
        form={storeForm} 
        setForm={setStoreForm} 
      />

      <InspectUserModal 
        isOpen={showDetailModal} 
        onClose={() => setShowDetailModal(false)} 
        detail={selectedUserDetail} 
      />
    </div>
  );
};

export default AdminDashboard;