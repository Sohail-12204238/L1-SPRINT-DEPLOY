import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, userAPI } from '../api/services';
import './Auth.css';

/* ── Step configuration ──────────────────────────────────────── */
const STEPS = [
  { id: 1, label: 'Choose role' },
  { id: 2, label: 'Personal info' },
  { id: 3, label: 'Profile details' },
];

/* ── SVG Icons for role cards ────────────────────────────────── */
const FounderIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);
const InvestorIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const CoFounderIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const AdminIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ROLES = [
  {
    id: 'FOUNDER',
    label: 'Startup Founder',
    desc: 'Publish your startup, build a team, and attract investors.',
    Icon: FounderIcon,
    color: '#6c5ce7',
  },
  {
    id: 'INVESTOR',
    label: 'Investor',
    desc: 'Discover vetted startups and deploy capital with confidence.',
    Icon: InvestorIcon,
    color: '#00c853',
  },
  {
    id: 'COFOUNDER',
    label: 'Co-Founder',
    desc: 'Browse startups, join teams, and build something great.',
    Icon: CoFounderIcon,
    color: '#6c5ce7',
  },
  {
    id: 'ADMIN',
    label: 'Admin',
    desc: 'Platform administrators only. Invite required.',
    Icon: AdminIcon,
    color: '#666',
    disabled: true,
  },
];

/* ── Logo SVG ─────────────────────────────────────────────────── */
function LogoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('FOUNDER');

  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [profileForm, setProfileForm] = useState({
    skills: '', experience: '', bio: '', portfolioLinks: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /* ── Step 2 submit (register) ── */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.register({ ...authForm, role: selectedRole });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 3 submit (profile) ── */
  const handleProfile = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.login({ email: authForm.email, password: authForm.password });
      const token = res.data.token;
      localStorage.setItem('token', token);
      await userAPI.createProfile({ name: authForm.name, ...profileForm });
      navigate('/login');
    } catch {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const selectedRoleObj = ROLES.find((r) => r.id === selectedRole);

  const stepState = (id) => {
    if (id < step) return 'done';
    if (id === step) return 'active';
    return 'idle';
  };

  return (
    <div className="register-page">
      {/* Header */}
      <div className="register-header">
        <div className="register-logo">
          <div className="auth-logo-icon" style={{ background: 'var(--purple)' }}>
            <LogoIcon />
          </div>
          <span className="auth-logo-name">FounderLink</span>
        </div>

        {/* Stepper */}
        <div className="register-stepper">
          {STEPS.map((s, i) => (
            <div key={s.id} className="step-item" style={{ flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <div className={`step-num ${stepState(s.id)}`}>
                {stepState(s.id) === 'done' ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : s.id}
              </div>
              <span className={`step-label ${stepState(s.id)}`}>{s.label}</span>
              {i < STEPS.length - 1 && <div className="step-line" />}
            </div>
          ))}
        </div>
      </div>

      {/* ── STEP 1: Choose role ── */}
      {step === 1 && (
        <div className="register-body fade-up">
          <h1 className="register-title">Create your account</h1>
          <p className="register-sub">
            Select how you'll use FounderLink. This sets up your personalized experience.
          </p>

          <div className="role-grid">
            {ROLES.map((r) => {
              const isSelected = selectedRole === r.id;
              return (
                <div
                  key={r.id}
                  id={`role-${r.id.toLowerCase()}`}
                  className={`role-card${isSelected ? ' selected' : ''}${r.disabled ? ' disabled' : ''}`}
                  onClick={() => !r.disabled && setSelectedRole(r.id)}
                >
                  <div
                    className="role-card-icon"
                    style={{ background: `${r.color}22`, color: r.disabled ? '#555' : r.color }}
                  >
                    <r.Icon />
                  </div>
                  <h3 style={{ color: r.disabled ? 'var(--text-3)' : '#fff' }}>{r.label}</h3>
                  <p>{r.desc}</p>
                  {isSelected && !r.disabled && (
                    <div className="role-selected-badge">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Selected
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            id="continue-role"
            className="btn btn-primary btn-full btn-xl"
            onClick={() => setStep(2)}
          >
            Continue as {selectedRoleObj?.label} →
          </button>

          <p className="register-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      )}

      {/* ── STEP 2: Personal info ── */}
      {step === 2 && (
        <div className="register-body fade-up">
          <h1 className="register-title">Personal information</h1>
          <p className="register-sub">Set up your account credentials.</p>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <div className="register-form-card">
            <form onSubmit={handleRegister}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full name</label>
                  <input id="reg-name" type="text" className="form-input" placeholder="John Doe"
                    value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email address</label>
                  <input id="reg-email" type="email" className="form-input" placeholder="you@example.com"
                    value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input id="reg-password" type="password" className="form-input" placeholder="Min. 6 characters"
                  value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  required minLength={6} />
              </div>
              <div style={{ display: 'flex', gap: '.75rem', marginTop: '.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>
                  ← Back
                </button>
                <button id="reg-submit" type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2 }}>
                  {loading ? 'Creating account…' : 'Continue →'}
                </button>
              </div>
            </form>
          </div>

          <p className="register-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      )}

      {/* ── STEP 3: Profile details ── */}
      {step === 3 && (
        <div className="register-body fade-up">
          <h1 className="register-title">Build your profile</h1>
          <p className="register-sub">Help others know who you are. You can update this later.</p>

          <div className="register-form-card">
            <form onSubmit={handleProfile}>
              <div className="form-group">
                <label className="form-label">Skills</label>
                <input id="prof-skills" type="text" className="form-input" placeholder="React, Java, Finance…"
                  value={profileForm.skills} onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Experience</label>
                <input id="prof-exp" type="text" className="form-input" placeholder="5 years in FinTech"
                  value={profileForm.experience} onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea id="prof-bio" className="form-textarea" placeholder="Tell the community about yourself…"
                  value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Portfolio / Links (optional)</label>
                <input id="prof-portfolio" type="text" className="form-input"
                  placeholder="https://github.com/you, https://linkedin.com/in/you"
                  value={profileForm.portfolioLinks} onChange={(e) => setProfileForm({ ...profileForm, portfolioLinks: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '.75rem', marginTop: '.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/login')} style={{ flex: 1 }}>
                  Skip for now
                </button>
                <button id="prof-submit" type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2 }}>
                  {loading ? 'Saving…' : 'Complete Setup →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
