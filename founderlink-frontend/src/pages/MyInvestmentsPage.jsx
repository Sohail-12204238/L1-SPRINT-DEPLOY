import { useEffect, useState } from 'react';
import { investmentAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const STATUS_MAP = { PENDING:'pending', APPROVED:'approved', REJECTED:'rejected' };

export default function MyInvestmentsPage() {
  const { role } = useAuth();
  const cleanRole = role?.replace('ROLE_', '') || '';
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    investmentAPI.getMyInvestments()
      .then(r => setInvestments(r.data))
      .catch(() => setError('Failed to load investments.'))
      .finally(() => setLoading(false));
  }, []);

  const total = investments.reduce((a,i) => a + (i.amount||0), 0);
  const approved = investments.filter(i => i.status === 'APPROVED').length;
  const pending = investments.filter(i => i.status === 'PENDING').length;

  return (
    <div className="app-shell">
      <Sidebar role={cleanRole} />
      <main className="main-content">
        <div className="page-toprow">
          <div>
            <h1 className="page-h1">My Portfolio</h1>
            <p className="page-sub">Track all your investments across startups</p>
          </div>
        </div>

        {/* Summary stats */}
        <div className="stats-row" style={{ gridTemplateColumns:'repeat(3,1fr)', marginBottom:'1.5rem' }}>
          <div className="stat-card">
            <p className="stat-label">Total Investments</p>
            <p className="stat-value">{investments.length}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Total Amount</p>
            <p className="stat-value" style={{ fontSize:'1.2rem' }}>₹{total.toLocaleString()}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Approved / Pending</p>
            <p className="stat-value" style={{ fontSize:'1.2rem' }}>
              <span style={{ color:'var(--success)' }}>{approved}</span>
              <span style={{ color:'var(--text-3)', fontWeight:400, fontSize:'.9rem' }}> / </span>
              <span style={{ color:'var(--warning)' }}>{pending}</span>
            </p>
          </div>
        </div>

        {loading && <div className="spinner-wrap"><div className="spinner" /></div>}
        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {!loading && investments.length === 0 && (
          <div className="empty">
            <p className="empty-title">No investments yet</p>
            <p>Browse startups and invest to build your portfolio</p>
          </div>
        )}

        <div className="inv-table-wrapper">
          {investments.length > 0 && (
            <table className="inv-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Startup</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv, i) => (
                  <tr key={inv.id}>
                    <td style={{ color:'var(--text-3)', fontSize:'.8rem' }}>{i+1}</td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:'.6rem' }}>
                        <div style={{ width:32,height:32,borderRadius:8,background:'rgba(108,92,231,.2)',color:'#a78bfa',
                          display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.7rem',fontWeight:800 }}>
                          #{inv.startupId}
                        </div>
                        <span style={{ fontWeight:600, color:'var(--text-1)' }}>Startup #{inv.startupId}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight:600, color:'var(--success)' }}>₹{inv.amount?.toLocaleString()}</td>
                    <td><span className={`badge badge-${STATUS_MAP[inv.status]||'pending'}`}>{inv.status}</span></td>
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
        .stats-row{display:grid;gap:1rem;margin-bottom:2rem;}
        .stat-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:1.1rem 1.25rem;}
        .stat-label{font-size:.75rem;color:var(--text-2);font-weight:500;margin-bottom:.35rem;}
        .stat-value{font-size:1.65rem;font-weight:600;color:var(--text-1);}
        .inv-table-wrapper{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);overflow:hidden;}
        .inv-table{width:100%;border-collapse:collapse;}
        .inv-table th{padding:.75rem 1.25rem;text-align:left;font-size:.875rem;font-weight:500;color:var(--text-2);border-bottom:1px solid var(--border);}
        .inv-table td{padding:.85rem 1.25rem;border-bottom:1px solid var(--border);vertical-align:middle;font-size:.88rem; color:var(--text-1);}
        .inv-table tr:hover td{background:var(--bg-hover);}
      `}</style>
    </div>
  );
}
