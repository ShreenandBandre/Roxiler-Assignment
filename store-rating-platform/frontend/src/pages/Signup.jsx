import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import '../App.css';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await signup(formData.name, formData.email, formData.password, formData.address);
      setSuccess('Account registered successfully! Redirecting to login window...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Signup processing logic configuration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090a0f] px-4 py-12 antialiased">
      <div className="premium-card max-w-sm w-full p-8 space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-sm font-bold tracking-[0.2em] text-white uppercase">CREATE ACCOUNT</h2>
          <p className="text-xs text-gray-500 tracking-wide">Join the ultimate public store rating platform</p>
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-900/40 text-red-400 p-3 rounded-xl text-xs tracking-wide">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-[#0d0f17] border border-[#222634] text-gray-300 p-3 rounded-xl text-xs tracking-wide">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-gray-400 text-xs font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              required
              className="input-field"
              placeholder="Alex Paul"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-gray-400 text-xs font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              required
              className="input-field"
              placeholder="alex@company.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-gray-400 text-xs font-medium">Password</label>
            <input
              type="password"
              name="password"
              required
              className="input-field"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-gray-400 text-xs font-medium">Physical Address (Optional)</label>
            <textarea
              name="address"
              rows="2"
              className="input-field resize-none"
              placeholder="Locality details..."
              value={formData.address}
              onChange={handleChange}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="action-btn w-full !text-xs !py-2.5 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-gray-500 tracking-wide">
          Already have an account?{' '}
          <Link to="/login" className="text-gray-300 font-medium hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;