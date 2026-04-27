import { useEffect, useState } from 'react';
import { teamAPI, startupAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';

const TEAM_ROLES = ['CTO', 'CPO', 'MARKETING_HEAD', 'ENGINEERING_LEAD'];
const ROLE_ICONS = { CTO:'⚙️', CPO:'📋', MARKETING_HEAD:'📣', ENGINEERING_LEAD:'🔧' };
const STATUS_MAP = { INVITED:'invited', JOINED:'approved', REJECTED:'rejected' };

export default function MyTeamsPage() {
  const { role } = useAuth();
  const cleanRole = role?.replace('ROLE_', '') || '';
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [myStartups, setMyStartups] = useState([]);
  const [showInvite, setShowInvite] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [inviteForm, setInviteForm] = useState({ startupId:'', userEmail:'', role:'CTO' });
  const [joinId, setJoinId] = useState('');
  const [inviting, setInviting] = useState(false);
  const [joining, setJoining] = useState(false);
  const [inviteMsg, setInviteMsg] = useState('');
  const [joinMsg, setJoinMsg] = useState('');

  const load = () => {
    teamAPI.getMyTeams().then(r => setTeams(r.data)).catch(() => setError('Failed.')).finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
    if (cleanRole === 'FOUNDER') startupAPI.getMyStartups().then(r => setMyStartups(r.data)).catch(() => {});
  }, [cleanRole]);

  const handleInvite = async (e) => {
    e.preventDefault(); setInviteMsg(''); setInviting(true);
    try {
      await teamAPI.invite({ ...inviteForm, startupId: parseInt(inviteForm.startupId) });
      setInviteMsg('✅ Invitation sent!'); load();
    } catch (err) { setInviteMsg('⚠️ ' + (err.response?.data?.message || 'Failed.')); }
    finally { setInviting(false); }
  };
  const handleJoin = async (e) => {
    e.preventDefault(); setJoinMsg(''); setJoining(true);
    try {
      await teamAPI.join({ startupId: parseInt(joinId) });
      setJoinMsg('✅ Joined successfully!'); load();
    } catch (err) { setJoinMsg('⚠️ ' + (err.response?.data?.message || 'Failed.')); }
    finally { setJoining(false); }
  };

  return (
    <div className="app-shell">
      <Sidebar role={cleanRole} />
      <main className="main-content">
        <div className="page-toprow">
          <div>
            <h1 className="page-h1">👥 Team</h1>
            <p className="page-sub">Your team memberships across all startups</p>
          </div>
          <div style={{ display:'flex', gap:'.6rem' }}>
            {cleanRole === 'FOUNDER' && (
              <button id="invite-member-btn" className="btn btn-primary" onClick={() => { setInviteMsg(''); setShowInvite(true); }}>
                + Invite Member
              </button>
            )}
            {cleanRole !== 'FOUNDER' && (
              <button id="join-team-btn" className="btn btn-secondary" onClick={() => { setJoinMsg(''); setShowJoin(true); }}>
                Join a Team
              </button>
            )}
          </div>
        </div>

        {loading && <div className="spinner-wrap"><div className="spinner" /></div>}
        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {!loading && teams.length === 0 && (
          <div className="empty">
            <span className="empty-icon">👥</span>
            <p className="empty-title">No team memberships yet</p>
            <p>{cleanRole === 'FOUNDER' ? 'Invite people to your startup teams' : 'Join a startup team'}</p>
          </div>
        )}

        <div className="team-grid">
          {teams.map(t => (
            <div key={t.id} className="team-card">
              <div className="team-card-top">
                <div className="team-role-icon">{ROLE_ICONS[t.role] || '👤'}</div>
                <span className={`badge badge-${STATUS_MAP[t.status] || 'invited'}`}>{t.status}</span>
              </div>
              <div className="team-role-name">{t.role?.replace('_', ' ')}</div>
              <div className="team-member-email">{t.userEmail}</div>
              <div className="team-card-footer">
                <span className="team-startup-id">Startup #{t.startupId}</span>
                {t.joinedAt && <span className="team-date">{new Date(t.joinedAt).toLocaleDateString()}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Invite Modal */}
        {showInvite && (
          <Modal title="Invite Team Member" onClose={() => setShowInvite(false)}>
            {inviteMsg && <div className={`alert ${inviteMsg.includes('✅') ? 'alert-success' : 'alert-error'}`}>{inviteMsg}</div>}
            <form onSubmit={handleInvite}>
              <div className="form-group">
                <label className="form-label">Startup</label>
                <select id="invite-startup" className="form-select" value={inviteForm.startupId}
                  onChange={e => setInviteForm({...inviteForm, startupId:e.target.value})} required>
                  <option value="">Select startup…</option>
                  {myStartups.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Member Email</label>
                <input id="invite-email" type="email" className="form-input" placeholder="member@example.com"
                  value={inviteForm.userEmail} onChange={e => setInviteForm({...inviteForm, userEmail:e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select id="invite-role" className="form-select" value={inviteForm.role}
                  onChange={e => setInviteForm({...inviteForm, role:e.target.value})}>
                  {TEAM_ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div style={{ display:'flex', gap:'.7rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowInvite(false)} style={{ flex:1 }}>Cancel</button>
                <button id="invite-submit" type="submit" className="btn btn-primary" disabled={inviting} style={{ flex:2 }}>
                  {inviting ? 'Sending…' : 'Send Invite'}
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* Join Modal */}
        {showJoin && (
          <Modal title="Join a Team" onClose={() => setShowJoin(false)}>
            {joinMsg && <div className={`alert ${joinMsg.includes('✅') ? 'alert-success' : 'alert-error'}`}>{joinMsg}</div>}
            <form onSubmit={handleJoin}>
              <div className="form-group">
                <label className="form-label">Startup ID</label>
                <input id="join-id" type="number" className="form-input" placeholder="e.g. 1"
                  value={joinId} onChange={e => setJoinId(e.target.value)} required />
              </div>
              <div style={{ display:'flex', gap:'.7rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowJoin(false)} style={{ flex:1 }}>Cancel</button>
                <button id="join-submit" type="submit" className="btn btn-primary" disabled={joining} style={{ flex:2 }}>
                  {joining ? 'Joining…' : 'Join Team'}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </main>

      <style>{`
        .page-toprow{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;}
        .page-h1{font-size:1.45rem;font-weight:800;color:#fff;}
        .page-sub{font-size:.87rem;color:var(--text-2);margin-top:.2rem;}
        .team-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem;}
        .team-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.25rem;display:flex;flex-direction:column;gap:.5rem;transition:border-color .2s;}
        .team-card:hover{border-color:rgba(108,92,231,.4);}
        .team-card-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:.35rem;}
        .team-role-icon{font-size:1.5rem;}
        .team-role-name{font-size:.95rem;font-weight:700;color:#fff;}
        .team-member-email{font-size:.78rem;color:var(--text-2);}
        .team-card-footer{display:flex;justify-content:space-between;margin-top:.35rem;padding-top:.5rem;border-top:1px solid var(--border);}
        .team-startup-id{font-size:.72rem;color:var(--text-3);font-weight:600;}
        .team-date{font-size:.72rem;color:var(--text-3);}
      `}</style>
    </div>
  );
}
