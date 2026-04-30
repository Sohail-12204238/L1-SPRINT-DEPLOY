import { useEffect, useState } from 'react';
import { investmentAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

export default function IncomingRequestsPage() {
  const { role } = useAuth();
  const cleanRole = role?.replace('ROLE_', '') || '';
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acting, setActing] = useState({});
  const [msgs, setMsgs] = useState({});

  useEffect(() => {
    investmentAPI.getMyRequests()
      .then(r => setRequests(r.data))
      .catch(() => setError('Failed to load requests.'))
      .finally(() => setLoading(false));
  }, []);

  const respond = async (id, accept) => {
    setActing(p => ({ ...p, [id]: true }));
    try {
      const res = await investmentAPI.respondRequest(id, accept);
      setRequests(p => p.map(r => r.id === id ? res.data : r));
      setMsgs(p => ({ ...p, [id]: accept ? 'Accepted!' : 'Rejected' }));
    } catch { setMsgs(p => ({ ...p, [id]: 'Action failed' })); }
    finally { setActing(p => ({ ...p, [id]: false })); }
  };

  return (
    <div className="app-shell">
      <Sidebar role={cleanRole} />
      <main className="main-content">
        <div className="page-toprow">
          <div>
            <h1 className="page-h1">Inbox — Funding Requests</h1>
            <p className="page-sub">Investment requests sent to you by founders</p>
          </div>
        </div>

        {loading && <div className="spinner-wrap"><div className="spinner" /></div>}
        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {!loading && requests.length === 0 && (
          <div className="empty">
            <p className="empty-title">Inbox is empty</p>
            <p>Founders will send you investment requests here</p>
          </div>
        )}

        <div className="inv-table-wrapper">
          {requests.length > 0 && (
            <table className="inv-table">
              <thead>
                <tr>
                  <th>Startup</th>
                  <th>Proposed Amount</th>
                  <th>From Founder</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-1)' }}>#{req.startupId}</td>
                    <td style={{ fontWeight: 600, color: 'var(--success)' }}>₹{req.proposedAmount?.toLocaleString()}</td>
                    <td style={{ color: 'var(--text-2)', fontSize: '.83rem' }}>{req.founderEmail || '—'}</td>
                    <td>
                      <span className={`badge badge-${req.status?.toLowerCase() === 'pending' ? 'pending' : req.status?.toLowerCase() === 'accepted' ? 'approved' : 'rejected'}`}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      {msgs[req.id] ? (
                        <span style={{ fontSize: '.82rem', color: 'var(--text-3)' }}>{msgs[req.id]}</span>
                      ) : req.status === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: '.4rem' }}>
                          <button id={`accept-${req.id}`} className="btn btn-success btn-sm"
                            disabled={acting[req.id]} onClick={() => respond(req.id, true)}>✓ Accept</button>
                          <button id={`reject-${req.id}`} className="btn btn-danger btn-sm"
                            disabled={acting[req.id]} onClick={() => respond(req.id, false)}>✗ Reject</button>
                        </div>
                      ) : <span style={{ color: 'var(--text-3)', fontSize: '.8rem' }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <style>{`
        .page-toprow{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;}
        .page-h1{font-size:1.45rem;font-weight:600;color:var(--text-1);}
        .page-sub{font-size:.87rem;color:var(--text-2);margin-top:.2rem;}
        .inv-table-wrapper{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);overflow:hidden;}
        .inv-table{width:100%;border-collapse:collapse;}
        .inv-table th{padding:.75rem 1.25rem;text-align:left;font-size:.875rem;font-weight:500;color:var(--text-2);border-bottom:1px solid var(--border);}
        .inv-table td{padding:.85rem 1.25rem;border-bottom:1px solid var(--border);vertical-align:middle;font-size:.88rem; color:var(--text-1);}
        .inv-table tr:hover td{background:var(--bg-hover);}
      `}</style>
    </div>
  );
}
