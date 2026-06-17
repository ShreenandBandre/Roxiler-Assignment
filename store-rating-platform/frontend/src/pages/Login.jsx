import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import '../App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      // Dynamic internal role mapping configuration routing
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'STORE_OWNER') navigate('/owner/dashboard');
      else navigate('/stores');
    } catch (err) {
      setError(err.message || 'Invalid credentials mapping execution.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090a0f] px-4 antialiased">
      <div className="premium-card max-w-sm w-full p-8 space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-sm font-bold tracking-[0.2em] text-white uppercase">Login Here</h2>
          <p className="text-xs text-gray-500 tracking-wide">Sign in to manage or rate corporate stores</p>
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-900/40 text-red-400 p-3 rounded-xl text-xs tracking-wide">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-gray-400 text-xs font-medium">Email Address</label>
            <input
              type="email"
              required
              className="input-field"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-gray-400 text-xs font-medium">Password</label>
            <input
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="action-btn w-full !text-xs !py-2.5 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-gray-500 tracking-wide">
          Don't have an account?{' '}
          <Link to="/signup" className="text-gray-300 font-medium hover:underline">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;