import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import './Auth.css';



export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('signin');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tab === 'register') { navigate('/register'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      const token = res.data.token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email = payload.sub;
      const role = payload.role || payload.roles?.[0] || '';
      login(token, email, role);
      const cleanRole = role.replace('ROLE_', '');
      navigate(cleanRole === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-logo">
          <Logo size={48} showText={false} />
        </div>
        <div className="auth-left-body">
          <h2 className="auth-left-tagline">Connect. Build.<br />Fund your vision.</h2>
          <p className="auth-left-sub">
            Where startup founders meet investors and co-founders ready to build the next big thing.
          </p>
          <ul className="auth-features">
            {[
              'Discover 500+ vetted startups seeking investment',
              'Direct messaging between founders and investors',
              'Track funding rounds and portfolio performance',
            ].map((f) => (
              <li key={f}>
                <span className="auth-check" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="auth-stats">
          <div className="auth-stat">
            <span className="auth-stat-val">₹48Cr+</span>
            <span className="auth-stat-label">Total funded</span>
          </div>
          <div className="auth-stat">
            <span className="auth-stat-val">1.2K</span>
            <span className="auth-stat-label">Founders</span>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-right-inner">
          <h1 className="auth-right-title">Welcome back</h1>
          <p className="auth-right-sub">Sign in to your FounderLink account</p>

          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === 'signin' ? 'active' : ''}`}
              onClick={() => setTab('signin')}
            >Sign in</button>
            <Link to="/register" className="auth-tab">Register</Link>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <div>
                <label className="form-label">Password</label>
              </div>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-remember">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me for 7 days</label>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign in to FounderLink →'}
            </button>
          </form>

          <p className="auth-tos">
            By signing in you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
