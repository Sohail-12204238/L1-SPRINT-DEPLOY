import { useEffect, useState } from 'react';
import { userAPI, startupAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import CofounderInviteModal from '../components/CofounderInviteModal';

const EXP_FILTERS = [
  { label: 'All', min: 0, max: 100 },
  { label: '0-1 yrs', min: 0, max: 1 },
  { label: '1-3 yrs', min: 1, max: 3 },
  { label: '3-5 yrs', min: 3, max: 5 },
  { label: '5+ yrs', min: 5, max: 100 },
];

export default function FindCofoundersPage() {
  const { role } = useAuth();
  const cleanRole = role?.replace('ROLE_', '') || '';
  const [cofounders, setCofounders] = useState([]);
  const [myStartups, setMyStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [expFilter, setExpFilter] = useState('All');
  const [inviteTarget, setInviteTarget] = useState(null);

  useEffect(() => {
    Promise.all([
      userAPI.getCofounders(),
      startupAPI.getMyStartups()
    ]).then(([cRes, sRes]) => {
      setCofounders(cRes.data || []);
      setMyStartups(sRes.data || []);
    }).catch(() => setError('FAILED TO LOAD CO-FOUNDERS.'))
      .finally(() => setLoading(false));
  }, []);

  // Parse experience years from strings like "2 years in AI"
  const parseExpYears = (expStr) => {
    if (!expStr) return 0;
    const match = expStr.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const activeExp = EXP_FILTERS.find(f => f.label === expFilter) || EXP_FILTERS[0];

  const filtered = cofounders.filter(c => {
    const matchesSearch = !search || 
      c.name?.toLowerCase().includes(search.toLowerCase()) || 
      c.skills?.toLowerCase().includes(search.toLowerCase());
    
    const years = parseExpYears(c.experience);
    const matchesExp = years >= activeExp.min && years <= activeExp.max;

    return matchesSearch && matchesExp;
  });

  return (
    <div className="app-shell">
      <Sidebar role={cleanRole} />
      <main className="main-content">
        <div className="page-toprow">
          <div>
            <h1 className="page-h1">Find Co-founders</h1>
            <p className="page-sub">Connect with talented professionals</p>
          </div>
        </div>

        {/* Filters Row */}
        <div className="cf-filters">
          <input className="form-input cf-search" 
            placeholder="Search by name or skills..."
            value={search} onChange={e => setSearch(e.target.value)} />

          <div className="cf-filter-group">
            <span className="cf-filter-label">Experience:</span>
            <div className="cf-pill-row">
              {EXP_FILTERS.map(f => (
                <button
                  key={f.label}
                  className={`cf-pill${expFilter === f.label ? ' active' : ''}`}
                  onClick={() => setExpFilter(f.label)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && <div className="spinner-wrap"><div className="spinner" /></div>}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && filtered.length === 0 && (
          <div className="card empty">
            <p className="empty-title">No co-founders match your filters</p>
          </div>
        )}

        <div className="investor-grid">
          {filtered.map(cf => {
            const initials = cf.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'CF';
            return (
              <div key={cf.id} className="card investor-card fade-up">
                <div className="inv-card-header">
                  <div className="inv-avatar">{initials}</div>
                  <div style={{ flex: 1 }}>
                    <h3 className="inv-name">{cf.name}</h3>
                    <p className="inv-email">{cf.experience || 'Professional'}</p>
                  </div>
                </div>
                
                <p className="inv-bio">{cf.bio || "Passionate about building scalable products and looking for the next big challenge."}</p>
                
                {cf.skills && (
                  <div className="inv-interests">
                    {cf.skills.split(',').map(s => (
                      <span key={s} className="inv-tag">{s.trim()}</span>
                    ))}
                  </div>
                )}

                <div className="inv-footer">
                  <button className="btn btn-primary btn-full" onClick={() => setInviteTarget(cf)}>
                    Invite to team
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {inviteTarget && (
          <CofounderInviteModal 
            cofounder={inviteTarget} 
            myStartups={myStartups}
            onClose={() => setInviteTarget(null)} 
          />
        )}
      </main>

      <style>{`
        .page-toprow{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:2rem;border-bottom:1px solid var(--border);padding-bottom:1.5rem;}
        .page-h1{font-size:1.875rem;font-weight:600;color:var(--text-1);}
        .page-sub{font-size:0.875rem;color:var(--text-2);margin-top:0.5rem;}

        .cf-filters{
          display:flex; flex-direction:column; gap:1rem; margin-bottom:2rem;
          padding:1.25rem; background:var(--bg-card); border:1px solid var(--border);
          border-radius:var(--radius-md);
        }
        .cf-search{ max-width:100%; }
        .cf-filter-group{
          display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;
        }
        .cf-filter-label{
          font-size:0.8rem; font-weight:600; color:var(--text-2); white-space:nowrap;
        }
        .cf-pill-row{ display:flex; gap:0.4rem; flex-wrap:wrap; }
        .cf-pill{
          padding:0.35rem 0.85rem; font-size:0.8rem; font-weight:500;
          border:1px solid var(--border); border-radius:20px;
          background:transparent; color:var(--text-2); cursor:pointer;
          transition:var(--transition); font-family:'Inter',sans-serif;
        }
        .cf-pill:hover{ border-color:var(--primary); color:var(--primary); }
        .cf-pill.active{
          background:var(--primary); color:#fff; border-color:var(--primary);
        }

        .investor-grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(340px, 1fr)); gap:1.5rem;}
        .investor-card{
          display:flex; flex-direction:column; gap:1.5rem;
        }
        
        .inv-card-header{display:flex; align-items:center; gap:1rem;}
        .inv-avatar{
          width:48px; height:48px; border-radius: 50%;
          color:#fff; display:flex; align-items:center; justify-content:center;
          font-weight:600; font-size:1rem; background:var(--primary-hover);
        }
        .inv-name{font-size:1rem; font-weight:600; color:var(--text-1);}
        .inv-email{font-size:0.875rem; color:var(--text-2); margin-top: 0.25rem;}
        
        .inv-bio{font-size:0.875rem; color:var(--text-2); line-height:1.5; min-height:3rem; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;}
        
        .inv-interests{display:flex; gap:0.5rem; flex-wrap:wrap;}
        .inv-tag{font-size:0.75rem; padding:0.25rem 0.6rem; border:1px solid var(--border); color:var(--text-2); font-weight:500; border-radius: var(--radius-md); background:var(--bg-app);}
        
        .inv-footer{margin-top:auto; padding-top:1.5rem; border-top:1px solid var(--border);}

        @media(max-width:600px){
          .cf-filter-group{ flex-direction:column; align-items:flex-start; }
        }
      `}</style>
    </div>
  );
}
