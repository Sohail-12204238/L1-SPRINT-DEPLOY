import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { startupAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import InvestFlowModal from '../components/InvestFlowModal';
import InvestorRequestModal from '../components/InvestorRequestModal';
import Sidebar from '../components/Sidebar';

const STAGE_MAP = {
  IDEA: { label: 'Pre-Seed', color: '#6c5ce7' },
  MVP: { label: 'Seed', color: '#06b6d4' },
  EARLY_TRACTION: { label: 'Series A', color: '#f59e0b' },
  SCALING: { label: 'Series B+', color: '#00c853' },
};

export default function StartupsPage() {
  const { role } = useAuth();
  const cleanRole = role?.replace('ROLE_', '') || '';

  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [investTarget, setInvestTarget] = useState(null);
  const [requestTarget, setRequestTarget] = useState(null);

  useEffect(() => {
    startupAPI.getAll()
      .then((res) => setStartups(res.data))
      .catch(() => setError('Failed to load startups.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = startups.filter((s) => {
    const q = search.toLowerCase();
    const match = s.name.toLowerCase().includes(q) || s.industry.toLowerCase().includes(q);
    const stageOk = stageFilter ? s.stage === stageFilter : true;
    return match && stageOk;
  });

  return (
    <div className="app-shell">
      <Sidebar role={cleanRole} />
      <main className="main-content">
        <div className="page-toprow">
          <div>
            <h1 className="page-h1">🌐 Browse Startups</h1>
            <p className="page-sub">Discover vetted startups seeking investment and co-founders</p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="filter-bar">
          <input id="search-startups" className="form-input" style={{ flex: 1 }}
            placeholder="🔍 Search by name or industry…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
          <select id="stage-filter" className="form-select" style={{ width: 160 }}
            value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}>
            <option value="">All stages</option>
            <option value="IDEA">Pre-Seed</option>
            <option value="MVP">Seed</option>
            <option value="EARLY_TRACTION">Series A</option>
            <option value="SCALING">Series B+</option>
          </select>
        </div>

        {loading && <div className="spinner-wrap"><div className="spinner" /></div>}
        {error && <div className="alert alert-error">⚠️ {error}</div>}

        {!loading && filtered.length === 0 && (
          <div className="empty"><span className="empty-icon">🔭</span>
            <p className="empty-title">No startups found</p><p>Try different filters</p>
          </div>
        )}

        <div className="startup-cards-grid">
          {filtered.map((s) => {
            const stage = STAGE_MAP[s.stage] || {};
            const abbr = s.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
            const pct = Math.min(95, Math.floor(Math.random()*70)+20);
            return (
              <div key={s.id} className="startup-card-new">
                <div className="scn-header">
                  {s.logoUrl ? (
                    <img src={s.logoUrl} alt={s.name} className="scn-logo-img" />
                  ) : (
                    <div className="scn-abbr" style={{ background: stage.color+'22', color: stage.color }}>{abbr}</div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 className="scn-name">{s.name}</h3>
                    <p className="scn-meta">{s.industry} · {stage.label} · {s.founderEmail?.split('@')[0]}</p>
                  </div>
                  <span className="badge badge-live">Live</span>
                </div>

                <p className="scn-desc">{s.description}</p>

                <div className="scn-tags">
                  <span className="scn-tag">{stage.label}</span>
                  <span className="scn-tag">{s.industry}</span>
                </div>

                <div className="scn-funding">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.35rem' }}>
                    <span className="scn-funding-label">Funding goal</span>
                    <span className="scn-funding-val">₹{(s.fundingGoal/100000).toFixed(0)}L</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '.3rem' }}>
                    <span style={{ fontSize: '.72rem', color: 'var(--text-3)' }}>₹{Math.floor(s.fundingGoal*pct/100/100000)}L raised</span>
                    <span style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--purple)' }}>{pct}%</span>
                  </div>
                </div>

                <div className="scn-actions">
                  {cleanRole === 'INVESTOR' && (
                    <button id={`invest-${s.id}`} className="btn btn-primary btn-sm" onClick={() => setInvestTarget(s)}>
                      Invest Now
                    </button>
                  )}
                  {cleanRole === 'FOUNDER' && (
                    <button id={`req-inv-${s.id}`} className="btn btn-secondary btn-sm" onClick={() => setRequestTarget(s)}>
                      Request Investor
                    </button>
                  )}
                  <Link to={`/startup/${s.id}`} className="btn btn-ghost btn-sm">View Details →</Link>
                </div>
              </div>
            );
          })}
        </div>

        {investTarget && <InvestFlowModal startup={investTarget} onClose={() => setInvestTarget(null)} />}
        {requestTarget && <InvestorRequestModal startup={requestTarget} onClose={() => setRequestTarget(null)} />}
      </main>

      <style>{`
        .page-toprow{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;}
        .page-h1{font-size:1.45rem;font-weight:800;color:#fff;}
        .page-sub{font-size:.87rem;color:var(--text-2);margin-top:.2rem;}
        .filter-bar{display:flex;gap:.75rem;margin-bottom:1.5rem;align-items:center;flex-wrap:wrap;}
        .startup-cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.25rem;}
        .startup-card-new{
          background:var(--bg-card);border:1px solid var(--border);
          border-radius:var(--radius-lg);padding:1.35rem;
          display:flex;flex-direction:column;gap:.85rem;
          transition:border-color .2s,transform .2s;
        }
        .startup-card-new:hover{border-color:rgba(108,92,231,.4);transform:translateY(-2px);}
        .scn-header{display:flex;align-items:center;gap:.85rem;}
        .scn-abbr{
          width:42px;height:42px;border-radius:12px;flex-shrink:0;
          display:flex;align-items:center;justify-content:center;
          font-size:.82rem;font-weight:800;
        }
        .scn-logo-img{width:42px;height:42px;border-radius:12px;object-fit:cover;flex-shrink:0;border:1px solid var(--border);}
        .scn-name{font-size:.95rem;font-weight:700;color:#fff;}
        .scn-meta{font-size:.75rem;color:var(--text-2);margin-top:.1rem;}
        .scn-desc{font-size:.83rem;color:var(--text-2);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
        .scn-tags{display:flex;gap:.4rem;flex-wrap:wrap;}
        .scn-tag{
          font-size:.7rem;padding:.18rem .55rem;border-radius:6px;
          background:rgba(255,255,255,.06);color:var(--text-2);border:1px solid var(--border);
        }
        .scn-funding-label{font-size:.75rem;color:var(--text-2);}
        .scn-funding-val{font-size:.82rem;font-weight:700;color:#fff;}
        .scn-actions{display:flex;gap:.5rem;padding-top:.25rem;border-top:1px solid var(--border);}
      `}</style>
    </div>
  );
}
