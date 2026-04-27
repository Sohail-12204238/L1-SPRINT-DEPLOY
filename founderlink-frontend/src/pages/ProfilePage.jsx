import { useEffect, useState } from 'react';
import { userAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

export default function ProfilePage() {
  const { email, role } = useAuth();
  const cleanRole = role?.replace('ROLE_', '') || '';
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState({ name:'', skills:'', experience:'', bio:'', portfolioLinks:'' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');

  useEffect(() => {
    userAPI.getByEmail(email)
      .then(r => {
        const p = r.data;
        setProfile(p);
        setForm({ name:p.name||'', skills:p.skills||'', experience:p.experience||'', bio:p.bio||'', portfolioLinks:p.portfolioLinks||'' });
      })
      .catch(() => { setIsNew(true); setEditMode(true); })
      .finally(() => setLoading(false));
  }, [email]);

  const handleSave = async (e) => {
    e.preventDefault(); setMsg(''); setSaving(true);
    try {
      const res = isNew || !profile
        ? await userAPI.createProfile(form)
        : await userAPI.updateProfile(profile.id, form);
      setProfile(res.data); setIsNew(false); setEditMode(false);
      setMsg('Profile saved!'); setMsgType('success');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to save.'); setMsgType('error');
    } finally { setSaving(false); }
  };

  const initials = (form.name || email || 'U').slice(0, 2).toUpperCase();

  if (loading) return (
    <div className="app-shell">
      <Sidebar role={cleanRole} />
      <main className="main-content"><div className="spinner-wrap"><div className="spinner" /></div></main>
    </div>
  );

  return (
    <div className="app-shell">
      <Sidebar role={cleanRole} />
      <main className="main-content" style={{ maxWidth: 720 }}>
        <div className="page-toprow">
          <div>
            <h1 className="page-h1">👤 My Profile</h1>
            <p className="page-sub">{email}</p>
          </div>
          {!editMode && profile && (
            <button id="edit-profile-btn" className="btn btn-secondary" onClick={() => setEditMode(true)}>✏️ Edit Profile</button>
          )}
        </div>

        {isNew && (
          <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
            ℹ️ Set up your profile to get discovered by the community.
          </div>
        )}
        {msg && <div className={`alert alert-${msgType}`} style={{ marginBottom: '1rem' }}>{msg}</div>}

        {/* Profile header card */}
        <div className="profile-hero">
          <div className="profile-avatar-lg">{initials}</div>
          <div>
            <h2 className="profile-display-name">{profile?.name || form.name || 'Your Name'}</h2>
            <p className="profile-email-sub">{email}</p>
            <span className={`badge badge-${cleanRole.toLowerCase()}`}>{cleanRole}</span>
          </div>
        </div>

        {editMode ? (
          <div className="card" style={{ marginTop: '1.25rem' }}>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input id="pf-name" type="text" className="form-input" placeholder="John Doe"
                    value={form.name} onChange={e => setForm({...form, name:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Skills</label>
                  <input id="pf-skills" type="text" className="form-input" placeholder="React, Java, Finance…"
                    value={form.skills} onChange={e => setForm({...form, skills:e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Experience</label>
                <input id="pf-exp" type="text" className="form-input" placeholder="5 years in FinTech"
                  value={form.experience} onChange={e => setForm({...form, experience:e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea id="pf-bio" className="form-textarea" placeholder="Tell the community about yourself…"
                  value={form.bio} onChange={e => setForm({...form, bio:e.target.value})} required style={{ minHeight:110 }} />
              </div>
              <div className="form-group">
                <label className="form-label">Portfolio Links (optional)</label>
                <input id="pf-portfolio" type="text" className="form-input"
                  placeholder="https://github.com/you, https://linkedin.com/in/you"
                  value={form.portfolioLinks} onChange={e => setForm({...form, portfolioLinks:e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '.75rem', marginTop: '.25rem' }}>
                {!isNew && <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)} style={{ flex:1 }}>Cancel</button>}
                <button id="save-profile-btn" type="submit" className="btn btn-primary" disabled={saving} style={{ flex:2 }}>
                  {saving ? 'Saving…' : isNew ? 'Create Profile' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        ) : profile && (
          <div className="card" style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {[
              { label:'🛠 Skills', value: profile.skills },
              { label:'💼 Experience', value: profile.experience },
              { label:'📝 Bio', value: profile.bio },
              { label:'🔗 Portfolio', value: profile.portfolioLinks },
            ].filter(f => f.value).map(f => (
              <div key={f.label}>
                <p style={{ fontSize:'.72rem', fontWeight:700, color:'rgba(167,139,250,.8)', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'.35rem' }}>{f.label}</p>
                <p style={{ fontSize:'.9rem', color:'var(--text-2)', lineHeight:1.5 }}>{f.value}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <style>{`
        .page-toprow{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;}
        .page-h1{font-size:1.45rem;font-weight:800;color:#fff;}
        .page-sub{font-size:.87rem;color:var(--text-2);margin-top:.2rem;}
        .profile-hero{
          background:var(--bg-card);border:1px solid var(--border);
          border-radius:var(--radius-lg);padding:1.5rem;
          display:flex;align-items:center;gap:1.25rem;
        }
        .profile-avatar-lg{
          width:68px;height:68px;border-radius:50%;
          background:linear-gradient(135deg,#6c5ce7,#8b5cf6);
          display:flex;align-items:center;justify-content:center;
          font-size:1.5rem;font-weight:800;color:#fff;flex-shrink:0;
        }
        .profile-display-name{font-size:1.2rem;font-weight:700;color:#fff;}
        .profile-email-sub{font-size:.82rem;color:var(--text-2);margin:.2rem 0 .45rem;}
      `}</style>
    </div>
  );
}
