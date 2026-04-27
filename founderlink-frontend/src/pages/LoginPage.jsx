import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function LogoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

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
      // Admin → /admin, others → /dashboard
      const cleanRole = role.replace('ROLE_', '');
      navigate(cleanRole === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── LEFT PANEL ── */}
      <div className="auth-left">
        <div className="auth-left-logo">
          <div className="auth-logo-icon"><LogoIcon /></div>
          <span className="auth-logo-name">FounderLink</span>
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
                <span className="auth-check">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
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
            <span className="auth-stat-val">1,240</span>
            <span className="auth-stat-label">Founders</span>
          </div>
          <div className="auth-stat">
            <span className="auth-stat-val">380</span>
            <span className="auth-stat-label">Investors</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-right">
        <div className="auth-right-inner fade-up">
          <h1 className="auth-right-title">Welcome back</h1>
          <p className="auth-right-sub">Sign in to your FounderLink account</p>

          {/* Tab switcher */}
          <div className="auth-tabs">
            <button
              id="tab-signin"
              className={`auth-tab ${tab === 'signin' ? 'active' : ''}`}
              onClick={() => setTab('signin')}
            >Sign in</button>
            <Link to="/register" id="tab-register" className="auth-tab">Register</Link>
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                id="login-email"
                type="email"
                name="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <span className="auth-forgot">Forgot password?</span>
              </div>
              <input
                id="login-password"
                type="password"
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>

            <label className="auth-remember">
              <input id="remember-me" type="checkbox" />
              <span>Remember me for 7 days</span>
            </label>

            <button id="login-submit" type="submit" className="btn btn-primary btn-full btn-xl" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in to FounderLink →'}
            </button>
          </form>

          <div className="divider-text" style={{ margin: '1.25rem 0' }}>or continue with</div>

          <button id="google-btn" className="btn-google">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.706c-.18-.54-.282-1.117-.282-1.706s.102-1.166.282-1.706V4.962H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.038l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 6.294C4.672 4.169 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          <p className="auth-tos">
            By signing in you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
