import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, userAPI } from '../api/services';
import Logo from '../components/Logo';
import './Auth.css';

const STEPS = [
  { id: 1, label: 'Choose role' },
  { id: 2, label: 'Personal info' },
  { id: 3, label: 'Profile details' },
];

const ROLES = [
  {
    id: 'FOUNDER',
    label: 'Startup Founder',
    desc: 'Publish your startup, build a team, and attract investors.',
    color: 'var(--primary)',
  },
  {
    id: 'INVESTOR',
    label: 'Investor',
    desc: 'Discover vetted startups and deploy capital with confidence.',
    color: 'var(--success)',
  },
  {
    id: 'COFOUNDER',
    label: 'Co-Founder',
    desc: 'Browse startups, join teams, and build something great.',
    color: 'var(--primary)',
  },
];



export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('FOUNDER');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [profileForm, setProfileForm] = useState({ skills: '', experience: '', bio: '', portfolioLinks: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Step 1: Register in auth-service
      await authAPI.register({ ...authForm, role: selectedRole });

      // Step 2: Auto-login to get token
      const loginRes = await authAPI.login({ email: authForm.email, password: authForm.password });
      const token = loginRes.data.token;
      localStorage.setItem('token', token);

      // Step 3: Auto-create a minimal profile so user appears in Find Investors/Cofounders
      try {
        await userAPI.createProfile({
          name: authForm.name,
          skills: 'Pending setup',
          experience: '0 years',
          bio: 'This profile is pending setup. Check back later!',
          portfolioLinks: ''
        });
      } catch (err) {
        console.error("Auto-create failed:", err.response?.data);
        // Profile may already exist — that's fine
      }

      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Update profile with the extra details filled in step 3
      // We need the user's profile ID first — fetch it
      const profileRes = await userAPI.getByEmail(authForm.email);
      const userId = profileRes.data?.id;
      if (userId) {
        await userAPI.updateProfile(userId, {
          name: authForm.name,
          skills: profileForm.skills,
          experience: profileForm.experience,
          bio: profileForm.bio,
          portfolioLinks: profileForm.portfolioLinks,
        });
      }
      navigate('/login');
    } catch {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const stepState = (id) => {
    if (id < step) return 'done';
    if (id === step) return 'active';
    return 'idle';
  };

  return (
    <div className="register-page">
      <div className="register-header">
        <div className="register-logo" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Logo size={48} showText={false} />
        </div>

        <div className="register-stepper">
          {STEPS.map((s, i) => (
            <div key={s.id} className="step-item">
              <div className={`step-num ${stepState(s.id)}`}>{s.id}</div>
              <span className={`step-label ${stepState(s.id)}`}>{s.label}</span>
              {i < STEPS.length - 1 && <div className="step-line" />}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="register-body fade-up">
          <h1 className="register-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Create your account</h1>
          <p className="register-sub" style={{ color: 'var(--text-2)', marginBottom: '2rem' }}>Select how you'll use FounderLink. This sets up your personalized experience.</p>

          <div className="role-grid">
            {ROLES.map((r) => {
              const isSelected = selectedRole === r.id;
              return (
                <div
                  key={r.id}
                  className={`role-card${isSelected ? ' selected' : ''}`}
                  onClick={() => setSelectedRole(r.id)}
                >
                  <h3>{r.label}</h3>
                  <p>{r.desc}</p>
                </div>
              );
            })}
          </div>

          <button className="btn btn-primary btn-full" style={{ padding: '1rem' }} onClick={() => setStep(2)}>
            Continue as {ROLES.find(r => r.id === selectedRole)?.label || selectedRole} →
          </button>
          <p className="register-footer">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      )}

      {step === 2 && (
        <div className="register-body fade-up">
          <h1 className="register-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Personal Info</h1>
          <p className="register-sub" style={{ color: 'var(--text-2)', marginBottom: '2rem' }}>Secure your access to the workspace.</p>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input type="text" className="form-input" placeholder="John Doe"
                value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input type="email" className="form-input" placeholder="you@example.com"
                value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="Min. 6 characters"
                value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                required minLength={6} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>Back</button>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2 }}>Continue →</button>
            </div>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="register-body fade-up">
          <h1 className="register-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Build Profile</h1>
          <p className="register-sub" style={{ color: 'var(--text-2)', marginBottom: '2rem' }}>How should the community see you?</p>
          <form onSubmit={handleProfile}>
            <div className="form-group">
              <label className="form-label">Skills</label>
              <input type="text" className="form-input" placeholder="React, Java, Finance..."
                value={profileForm.skills} onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Experience</label>
              <input type="text" className="form-input" placeholder="e.g. 5 years in FinTech"
                value={profileForm.experience} onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-textarea" placeholder="Tell the community about yourself..."
                value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Portfolio / LinkedIn (Optional)</label>
              <input type="text" className="form-input" placeholder="https://linkedin.com/in/you"
                value={profileForm.portfolioLinks} onChange={(e) => setProfileForm({ ...profileForm, portfolioLinks: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/login')} style={{ flex: 1 }}>Skip for now</button>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2 }}>Complete setup</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
