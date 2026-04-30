import { useEffect, useState } from 'react';
import { teamAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';

export default function MyTeamsPage() {
  const { role } = useAuth();
  const cleanRole = role?.replace('ROLE_', '') || '';
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ startupId: '', userEmail: '', role: 'DEVELOPER' });

  useEffect(() => {
    teamAPI.getMyTeams()
      .then(res => setTeams(res.data || []))
      .catch(() => setError('Failed to load teams.'))
      .finally(() => setLoading(false));
  }, []);

  const handleResponse = async (id, status) => {
    try {
      const isAccept = status === 'ACCEPTED';
      await teamAPI.respond(id, isAccept);
      setTeams(teams.map(t => t.id === id ? { ...t, status } : t));
    } catch { alert('Failed to respond.'); }
  };

  return (
    <div className="app-shell">
      <Sidebar role={cleanRole} />
      <main className="main-content">
        <div className="page-toprow">
          <div>
            <h1 className="page-h1">Team collaboration</h1>
            <p className="page-sub">Manage roles and active partnerships</p>
          </div>
          {cleanRole === 'FOUNDER' && (
            <button className="btn btn-primary" onClick={() => setShowInvite(true)}>
              Invite partner
            </button>
          )}
        </div>

        {loading && <div className="spinner-wrap"><div className="spinner" /></div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="team-grid">
          {teams.map(t => (
            <div key={t.id} className="card team-card">
              <div className="team-card-header">
                <div className="team-avatar">{t.userEmail?.[0].toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <h3 className="team-name">{t.userEmail}</h3>
                  <span className="badge badge-role">{t.role}</span>
                </div>
              </div>
              
              <div className="team-details">
                <div className="team-detail-item">
                  <span>Status</span>
                  <p className={t.status === 'INVITED' || t.status === 'REQUEST_PENDING' ? 'status-pending' : 'status-active'}>
                    {t.status}
                  </p>
                </div>
                <div className="team-detail-item">
                  <span>Startup ID</span>
                  <p>#{t.startupId}</p>
                </div>
              </div>

              {t.status === 'INVITED' && cleanRole !== 'FOUNDER' && (
                <div className="team-actions">
                  <button className="btn btn-primary btn-sm btn-full" onClick={() => handleResponse(t.id, 'ACCEPTED')}>
                    Accept Invite
                  </button>
                  <button className="btn btn-secondary btn-sm btn-full" onClick={() => handleResponse(t.id, 'REJECTED')}>
                    Reject
                  </button>
                </div>
              )}

              {t.status === 'REQUEST_PENDING' && cleanRole === 'FOUNDER' && (
                <div className="team-actions">
                  <button className="btn btn-success btn-sm btn-full" onClick={() => handleResponse(t.id, 'ACCEPTED')}>
                    Approve Request
                  </button>
                  <button className="btn btn-danger btn-sm btn-full" onClick={() => handleResponse(t.id, 'REJECTED')}>
                    Deny
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {showInvite && (
          <Modal title="Invite new partner" onClose={() => setShowInvite(false)}>
            <form onSubmit={(e) => { e.preventDefault(); /* API call */ setShowInvite(false); }}>
              <div className="form-group">
                <label className="form-label">Startup ID</label>
                <input className="form-input" placeholder="e.g. 12" required />
              </div>
              <div className="form-group">
                <label className="form-label">Partner Email</label>
                <input className="form-input" placeholder="user@example.com" required />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-select">
                  <option value="DEVELOPER">Developer</option>
                  <option value="MARKETING">Marketing</option>
                  <option value="OPERATIONS">Operations</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowInvite(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Send invite</button>
              </div>
            </form>
          </Modal>
        )}
      </main>

      <style>{`
        .page-toprow{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:2.5rem;border-bottom:1px solid var(--border);padding-bottom:1.5rem;}
        .page-h1{font-size:1.875rem;font-weight:600;color:var(--text-1);}
        .page-sub{font-size:0.875rem;color:var(--text-2);margin-top:0.5rem;}

        .team-grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:1.5rem;}
        .team-card{
          display:flex; flex-direction:column;
        }
        
        .team-card-header{display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem;}
        .team-avatar{
          width:42px; height:42px; border-radius:50%;
          color:#fff; display:flex; align-items:center; justify-content:center;
          font-weight:600; font-size:1rem; background:var(--primary);
        }
        .team-name{font-size:1rem; font-weight:600; color:var(--text-1); margin-bottom:0.25rem;}
        
        .team-details{display:grid; grid-template-columns:1fr 1fr; gap:1rem; padding:1rem; background:var(--bg-app); border:1px solid var(--border); border-radius:var(--radius-sm); margin-bottom:1.5rem;}
        .team-detail-item span{display:block; font-size:0.75rem; color:var(--text-2); font-weight:500; margin-bottom:0.25rem;}
        .team-detail-item p{font-size:0.875rem; font-weight:600; color:var(--text-1);}
        .status-pending{color:var(--warning) !important;}
        .status-active{color:var(--success) !important;}
        
        .team-actions{display:flex; flex-direction:column; gap:0.5rem; margin-top:auto;}
      `}</style>
    </div>
  );
}
