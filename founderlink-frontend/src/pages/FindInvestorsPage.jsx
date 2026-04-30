import { useEffect, useState } from 'react';
import { userAPI, startupAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import FounderPitchModal from '../components/FounderPitchModal';

export default function FindInvestorsPage() {
  const { role } = useAuth();
  const cleanRole = role?.replace('ROLE_', '') || '';
  const [investors, setInvestors] = useState([]);
  const [myStartups, setMyStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [requestTarget, setRequestTarget] = useState(null);

  useEffect(() => {
    Promise.all([
      userAPI.getInvestors(),
      startupAPI.getMyStartups()
    ]).then(([iRes, sRes]) => {
      setInvestors(iRes.data || []);
      setMyStartups(sRes.data || []);
    }).catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = investors.filter(i => 
    i.name?.toLowerCase().includes(search.toLowerCase()) || 
    i.bio?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-shell">
      <Sidebar role={cleanRole} />
      <main className="main-content">
        <div className="page-toprow">
          <div>
            <h1 className="page-h1">💎 Find Investors</h1>
            <p className="page-sub">Discover and connect with investors who match your vision</p>
          </div>
        </div>

        <div className="filter-bar">
          <input className="form-input" style={{ maxWidth: '400px' }}
            placeholder="🔍 Search by name or interests…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {loading && <div className="spinner-wrap"><div className="spinner" /></div>}
        {error && <div className="alert alert-error">⚠️ {error}</div>}

        {!loading && filtered.length === 0 && (
          <div className="empty">
            <span className="empty-icon">🤝</span>
            <p className="empty-title">No investors found</p>
            <p>Try a different search term</p>
          </div>
        )}

        <div className="investor-grid">
          {filtered.map(investor => {
            const initials = investor.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'IN';
            return (
              <div key={investor.id} className="investor-card fade-up">
                <div className="inv-card-header">
                  <div className="inv-avatar">{initials}</div>
                  <div style={{ flex: 1 }}>
                    <h3 className="inv-name">{investor.name}</h3>
                    <p className="inv-email">{investor.email}</p>
                  </div>
                  <span className="badge badge-investor">Investor</span>
                </div>
                
                <p className="inv-bio">{investor.bio || "Passionate about backing innovative startups and helping founders scale their vision to new heights."}</p>
                
                {investor.skills && (
                  <div className="inv-interests">
                    {investor.skills.split(',').map(s => (
                      <span key={s} className="inv-tag">{s.trim()}</span>
                    ))}
                  </div>
                )}

                <div className="inv-footer">
                  <button className="btn btn-primary btn-sm btn-full" onClick={() => setRequestTarget(investor)}>
                    Pitch My Startup
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {requestTarget && (
          <FounderPitchModal 
            investor={requestTarget} 
            myStartups={myStartups}
            onClose={() => setRequestTarget(null)} 
          />
        )}
      </main>

      <style>{`
        .page-toprow{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;}
        .page-h1{font-size:1.45rem;font-weight:800;color:var(--text-1);}
        .page-sub{font-size:.87rem;color:var(--text-2);margin-top:.2rem;}
        .filter-bar{margin-bottom:2rem;}
        
        .investor-grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:1.5rem;}
        .investor-card{
          background:var(--bg-card); border:1px solid var(--border); 
          border-radius:var(--radius-lg); padding:1.5rem;
          display:flex; flex-direction:column; gap:1rem;
          transition: all 0.2s;
        }
        .investor-card:hover{ border-color:var(--purple-border); transform:translateY(-2px); box-shadow:var(--shadow-purple); }
        
        .inv-card-header{display:flex; align-items:center; gap:1rem;}
        .inv-avatar{
          width:48px; height:48px; border-radius:14px; background:var(--purple-dim);
          color:var(--purple); display:flex; align-items:center; justify-content:center;
          font-weight:800; font-size:1.1rem; border:1px solid var(--purple-border);
        }
        .inv-name{font-size:1rem; font-weight:700; color:var(--text-1);}
        .inv-email{font-size:0.75rem; color:var(--text-3);}
        
        .inv-bio{font-size:0.85rem; color:var(--text-2); line-height:1.5; min-height:3.8rem; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;}
        
        .inv-interests{display:flex; gap:0.4rem; flex-wrap:wrap;}
        .inv-tag{font-size:0.7rem; padding:0.2rem 0.6rem; background:rgba(255,255,255,0.05); border:1px solid var(--border); border-radius:6px; color:var(--text-2);}
        
        .inv-footer{margin-top:auto; padding-top:1rem; border-top:1px solid var(--border);}
      `}</style>
    </div>
  );
}
