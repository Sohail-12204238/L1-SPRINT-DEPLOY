import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { startupAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

export default function StartupsPage() {
  const { role } = useAuth();
  const cleanRole = role?.replace('ROLE_', '') || '';
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    startupAPI.getAll()
      .then(res => setStartups(res.data || []))
      .catch(() => setError('Failed to load startups.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = startups.filter(s => 
    s.name?.toLowerCase().includes(search.toLowerCase()) || 
    s.industry?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-shell">
      <Sidebar role={cleanRole} />
      <main className="main-content">
        <div className="page-toprow">
          <div>
            <h1 className="page-h1">Discover Startups</h1>
            <p className="page-sub">Explore vetted opportunities in the ecosystem</p>
          </div>
        </div>

        <div className="filter-bar">
          <input 
            className="form-input" 
            style={{ maxWidth: '450px' }}
            placeholder="Search by name, industry or stage..."
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>

        {loading && <div className="spinner-wrap"><div className="spinner" /></div>}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && filtered.length === 0 && (
          <div className="card empty-card">
            <p className="empty-title">No startups found matching your search</p>
          </div>
        )}

        <div className="card-grid">
          {filtered.map(startup => {
            const initials = startup.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'ST';
            return (
              <div key={startup.id} className="card startup-card glass-card fade-up">
                <div className="startup-card-header">
                  <div className="startup-card-abbr">{initials}</div>
                  <div style={{ flex: 1 }}>
                    <h3 className="startup-card-name">{startup.name}</h3>
                    <p className="startup-card-industry">{startup.industry}</p>
                  </div>
                </div>
                
                <p className="startup-card-desc">{startup.description || "No description provided."}</p>
                
                <div className="startup-card-stats">
                  <div className="startup-stat">
                    <span>Goal</span>
                    <p>₹{(startup.fundingGoal || 0).toLocaleString()}</p>
                  </div>
                  <div className="startup-stat">
                    <span>Stage</span>
                    <p>{startup.stage?.replace('_', ' ') || 'Idea'}</p>
                  </div>
                </div>

                <div className="startup-card-footer">
                  <Link to={`/startup/${startup.id}`} className="btn btn-primary btn-sm btn-full">
                    View details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <style>{`
        .page-toprow{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:2.5rem;border-bottom:1px solid var(--border);padding-bottom:1.5rem;}
        .page-h1{font-size:1.875rem;font-weight:600;color:var(--text-1);}
        .page-sub{font-size:0.875rem;color:var(--text-2);margin-top:0.5rem;}

        .filter-bar{margin-bottom:2rem;}
        
        .startup-card{
          display:flex; flex-direction:column; gap:1.25rem;
        }
        
        .startup-card-header{display:flex; align-items:center; gap:1rem;}
        .startup-card-abbr{
          width:48px; height:48px; border-radius:var(--radius-sm);
          color:#fff; display:flex; align-items:center; justify-content:center;
          font-weight:600; font-size:1rem; background:var(--primary);
        }
        .startup-card-name{font-size:1rem; font-weight:600; color:var(--text-1);}
        .startup-card-industry{font-size:0.875rem; color:var(--text-2); margin-top:0.25rem;}
        
        .startup-card-desc{font-size:0.875rem; color:var(--text-2); line-height:1.5; min-height:4rem; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;}
        
        .startup-card-stats{display:flex; gap:1.5rem; padding:1rem; background:var(--bg-app); border:1px solid var(--border); border-radius:var(--radius-sm);}
        .startup-stat span{display:block; font-size:0.75rem; color:var(--text-2); font-weight:500; margin-bottom:0.25rem;}
        .startup-stat p{font-size:0.875rem; font-weight:600; color:var(--text-1);}
        
        .startup-card-footer{margin-top:auto;}

        .empty-card{padding:4rem; text-align:center; background:var(--bg-card);}
      `}</style>
    </div>
  );
}
