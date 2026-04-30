import { useEffect, useState } from 'react';
import { investmentAPI, startupAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

export default function InvestorRequestsPage() {
  const { role } = useAuth();
  const cleanRole = role?.replace('ROLE_', '') || '';
  const [myStartups, setMyStartups] = useState([]);
  const [investmentsByStartup, setInvestmentsByStartup] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acting, setActing] = useState({});
  const [msgs, setMsgs] = useState({});

  useEffect(() => {
    startupAPI.getMyStartups().then(async (res) => {
      const startups = res.data;
      setMyStartups(startups);
      const results = {};
      await Promise.allSettled(startups.map(async (s) => {
        try { const r = await investmentAPI.getByStartup(s.id); results[s.id] = r.data; }
        catch { results[s.id] = []; }
      }));
      setInvestmentsByStartup(results);
    }).catch(() => setError('Failed to load data.')).finally(() => setLoading(false));
  }, []);

  const decide = async (investmentId, approve) => {
    setActing(p => ({ ...p, [investmentId]: true }));
    try {
      const res = approve
        ? await investmentAPI.approve(investmentId)
        : await investmentAPI.reject(investmentId);
      setInvestmentsByStartup(prev => {
        const u = { ...prev };
        for (const sid in u) u[sid] = u[sid].map(inv => inv.id === investmentId ? res.data : inv);
        return u;
      });
      setMsgs(p => ({ ...p, [investmentId]: approve ? 'Approved!' : 'Rejected' }));
    } catch { setMsgs(p => ({ ...p, [investmentId]: 'Failed' })); }
    finally { setActing(p => ({ ...p, [investmentId]: false })); }
  };

  return (
    <div className="app-shell">
      <Sidebar role={cleanRole} />
      <main className="main-content">
        <div className="page-toprow">
          <div>
            <h1 className="page-h1">Investment Management</h1>
            <p className="page-sub">Review and approve investments across your startups</p>
          </div>
        </div>

        {loading && <div className="spinner-wrap"><div className="spinner" /></div>}
        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {!loading && myStartups.length === 0 && (
          <div className="empty">
            <p className="empty-title">No startups yet</p>
            <p>Create a startup to start receiving investments</p>
          </div>
        )}

        {myStartups.map(startup => {
          const invs = investmentsByStartup[startup.id] || [];
          const abbr = startup.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
          return (
            <div key={startup.id} className="startup-section">
              <div className="section-header">
                <div className="section-abbr">{abbr}</div>
                <div>
                  <h2 className="section-name">{startup.name}</h2>
                  <p className="section-meta">{startup.industry} · {invs.length} investment{invs.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {invs.length === 0 ? (
                <p style={{ color: 'var(--text-3)', fontSize: '.85rem', padding: '.75rem 0' }}>No investments yet for this startup.</p>
              ) : (
                <div className="inv-table-wrapper">
                  <table className="inv-table">
                    <thead>
                      <tr><th>Investor</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {invs.map(inv => (
                        <tr key={inv.id}>
                          <td style={{ color: 'var(--text-1)', fontSize: '.87rem' }}>{inv.investorEmail}</td>
                          <td style={{ fontWeight: 600, color: 'var(--success)' }}>₹{inv.amount?.toLocaleString()}</td>
                          <td><span className={`badge badge-${inv.status?.toLowerCase() === 'pending' ? 'pending' : inv.status?.toLowerCase() === 'approved' ? 'approved' : 'rejected'}`}>{inv.status}</span></td>
                          <td>
                            {msgs[inv.id] ? (
                              <span style={{ fontSize: '.82rem', color: 'var(--text-3)' }}>{msgs[inv.id]}</span>
                            ) : inv.status === 'PENDING' ? (
                              <div style={{ display: 'flex', gap: '.4rem' }}>
                                <button id={`approve-${inv.id}`} className="btn btn-success btn-sm"
                                  disabled={acting[inv.id]} onClick={() => decide(inv.id, true)}>✓ Approve</button>
                                <button id={`reject-${inv.id}`} className="btn btn-danger btn-sm"
                                  disabled={acting[inv.id]} onClick={() => decide(inv.id, false)}>✗ Reject</button>
                              </div>
                            ) : <span style={{ color: 'var(--text-3)', fontSize: '.8rem' }}>—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </main>

      <style>{`
        .page-toprow{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;}
        .page-h1{font-size:1.45rem;font-weight:600;color:var(--text-1);}
        .page-sub{font-size:.87rem;color:var(--text-2);margin-top:.2rem;}
        .startup-section{margin-bottom:2rem;}
        .section-header{display:flex;align-items:center;gap:.85rem;margin-bottom:1rem;}
        .section-abbr{width:40px;height:40px;border-radius:var(--radius-sm);background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:600;flex-shrink:0;}
        .section-name{font-size:1rem;font-weight:600;color:var(--text-1);}
        .section-meta{font-size:.78rem;color:var(--text-2);margin-top:.1rem;}
        .inv-table-wrapper{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);overflow:hidden;}
        .inv-table{width:100%;border-collapse:collapse;}
        .inv-table th{padding:.75rem 1.25rem;text-align:left;font-size:.875rem;font-weight:500;color:var(--text-2);border-bottom:1px solid var(--border);}
        .inv-table td{padding:.85rem 1.25rem;border-bottom:1px solid var(--border);vertical-align:middle;font-size:.88rem; color:var(--text-1);}
        .inv-table tr:hover td{background:var(--bg-hover);}
      `}</style>
    </div>
  );
}
