import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { startupAPI, investmentAPI, teamAPI } from '../api/services';
import Sidebar from '../components/Sidebar';

/* ─── Stat Card ───────────────────────────────────────────────── */
function StatCard({ label, value, sub, subColor }) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {sub && <p className="stat-sub" style={{ color: subColor || 'var(--text-muted)' }}>{sub}</p>}
    </div>
  );
}

/* ─── Startup Row ─────────────────────────────────────────────── */
function StartupRow({ startup }) {
  const statusMap = { SCALING: 'live', EARLY_TRACTION: 'live', MVP: 'pending', IDEA: 'draft' };
  const status = statusMap[startup.stage] || 'draft';

  const abbr = startup.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const goal = startup.fundingGoal || 10000000;
  const raisedPct = 92;
  const raised = Math.floor(goal * raisedPct / 100);

  return (
    <div className="startup-row">
      <div className="startup-row-left">
        <div className="startup-abbr">{abbr}</div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <span className="startup-row-name">{startup.name}</span>
            <span className={`badge badge-${status}`}>
              {status}
            </span>
          </div>
          <p className="startup-row-meta">
            {startup.industry} · {startup.stage?.replace('_', ' ')}
          </p>
        </div>
      </div>
      {status === 'live' && (
        <div className="startup-row-progress">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.4rem' }}>
            <span className="progress-label">
              ₹{Math.floor(raised / 100000)}L RAISED
            </span>
            <span className="progress-pct">{raisedPct}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${raisedPct}%` }} />
          </div>
        </div>
      )}
      {status !== 'live' && (
        <p className="startup-row-waiting">
          Status: {status}
        </p>
      )}
    </div>
  );
}

/* ─── Activity Row ────────────────────────────────────────────── */
function ActivityRow({ initials, text, sub, amount }) {
  return (
    <div className="activity-row">
      <div className="activity-avatar">{initials}</div>
      <div style={{ flex: 1 }}>
        <span className="activity-text">{text}</span>
        {sub && <p className="activity-sub">{sub}</p>}
      </div>
      {amount && <span className="activity-amount">{amount}</span>}
    </div>
  );
}

/* ─── Dashboard Page ──────────────────────────────────────────── */
export default function DashboardPage() {
  const { role, email } = useAuth();
  const cleanRole = role?.replace('ROLE_', '') || '';

  const [startups, setStartups] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = email?.split('@')[0].split('.')[0];
  const displayFirst = firstName || 'User';

  useEffect(() => {
    const load = async () => {
      try {
        const [t, n] = await Promise.allSettled([
          teamAPI.getMyTeams(),
          import('../api/services').then(m => m.notificationAPI.getAll())
        ]);
        setTeams(t.status === 'fulfilled' ? t.value.data : []);
        setNotifications(n.status === 'fulfilled' ? n.value.data : []);

        if (cleanRole === 'FOUNDER') {
          const [s] = await Promise.allSettled([startupAPI.getMyStartups()]);
          setStartups(s.status === 'fulfilled' ? s.value.data : []);
        }
        if (cleanRole === 'INVESTOR') {
          const [i] = await Promise.allSettled([investmentAPI.getMyInvestments()]);
          setInvestments(i.status === 'fulfilled' ? i.value.data : []);
        }
        if (cleanRole === 'COFOUNDER') {
          const myTeams = t.status === 'fulfilled' ? t.value.data : [];
          if (myTeams.length > 0) {
            const sId = myTeams[0].startupId;
            const res = await startupAPI.getById(sId);
            setStartups([res.data]);
          }
        }
      } finally { setLoading(false); }
    };
    load();
  }, [cleanRole]);

  const pendingInvites = teams.filter(t => t.status === 'INVITED').length;
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="app-shell">
      <Sidebar role={cleanRole} />
      <main className="main-content">
        <div className="dash-toprow">
          <div>
            <h1 className="dash-greeting">{greeting}, {displayFirst}</h1>
            <p className="dash-subline">
              Here's how your startups are performing today.
            </p>
          </div>
          {cleanRole === 'FOUNDER' && (
            <Link to="/my-startups" className="btn btn-primary">Create startup</Link>
          )}
        </div>

        <div className="stats-row">
          <StatCard
            label="Active Startups"
            value={loading ? '—' : startups.length || 0}
            sub={startups.length > 0 && startups[0].status === 'PENDING' ? '1 pending approval' : ''}
            subColor="var(--success)"
          />
          <StatCard
            label="Total Raised"
            value={startups.length ? `₹${(startups[0].currentFunding || 0).toLocaleString()}` : '—'}
            sub={startups.length ? `Target: ₹${(startups[0].fundingGoal || 0).toLocaleString()}` : ''}
            subColor="var(--success)"
          />
          <StatCard
            label="Team Members"
            value={loading ? '—' : teams.length || 0}
            sub={pendingInvites > 0 ? `${pendingInvites} invites pending` : ''}
          />
          <StatCard
            label="Notifications"
            value={loading ? '—' : notifications.length}
            sub={unreadCount > 0 ? `${unreadCount} unread →` : 'All caught up'}
            subColor="var(--primary)"
          />
        </div>

        <div className="dash-grid">
          <div className="dash-section">
            <h2 className="section-title">My Startups</h2>
            {loading ? (
              <div className="spinner-wrap"><div className="spinner" /></div>
            ) : startups.length === 0 ? (
              <div className="card glass-card">
                <p className="empty-title">No active startups detected</p>
              </div>
            ) : (
              <div className="startup-list">
                {startups.map((s) => <StartupRow key={s.id} startup={s} />)}
              </div>
            )}
          </div>

          <div className="dash-section">
            <h2 className="section-title">Recent activity</h2>
            <div className="activity-list">
              {notifications.length > 0 ? (
                notifications.slice(0, 5).map(n => {
                  const initials = n.title ? n.title.substring(0, 2).toUpperCase() : 'FL';
                  const date = new Date(n.createdAt);
                  const formattedDate = !isNaN(date) ? date.toLocaleDateString() : 'Recently';
                  return (
                    <ActivityRow 
                      key={n.id || Math.random()} 
                      initials={initials} 
                      text={n.message} 
                      sub={formattedDate} 
                    />
                  );
                })
              ) : (
                <div className="card glass-card">
                  <p className="empty-title" style={{ fontSize: '0.85rem' }}>No recent activity to display.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .dash-toprow{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:2rem;}
        .dash-greeting{font-size:1.5rem;font-weight:600;color:var(--text-1);margin-bottom:0.25rem;}
        .dash-subline{font-size:0.875rem;color:var(--text-2);}

        .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;margin-bottom:2.5rem;}
        .stat-card{
          background:var(--bg-card); border:1px solid var(--border); padding:1.25rem;
          border-radius:var(--radius-md); transition:var(--transition);
        }
        .stat-card:hover{ border-color:var(--border-light); }
        
        .stat-label{font-size:0.875rem;color:var(--text-2);font-weight:500;margin-bottom:0.5rem;}
        .stat-value{font-size:1.5rem;font-weight:600;color:var(--text-1);}
        .stat-sub{font-size:0.75rem;margin-top:0.5rem;}

        .dash-grid{display:grid;grid-template-columns:1fr;gap:2rem;}
        .dash-section{margin-bottom:2rem;}
        .section-title{font-size:1rem;font-weight:600;color:var(--text-1);margin-bottom:1rem;}

        .startup-list{display:flex;flex-direction:column;gap:1rem;}
        .startup-row{
          background:var(--bg-card); border:1px solid var(--border); padding:1.25rem;
          display:flex;align-items:center;gap:1.5rem; border-radius:var(--radius-md); transition:var(--transition);
        }
        .startup-row:hover{ border-color:var(--border-light); }
        .startup-row-left{display:flex;align-items:center;gap:1.5rem;flex:1;}
        .startup-abbr{width:40px;height:40px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:600;background:var(--primary);color:#fff;}
        .startup-row-name{font-size:1rem;font-weight:600;color:var(--text-1);}
        .startup-row-meta{font-size:0.75rem;color:var(--text-2);margin-top:0.25rem;}
        
        .startup-row-progress{flex:1;max-width:300px;}
        .progress-label{font-size:0.75rem;font-weight:500;color:var(--text-2);}
        .progress-pct{font-size:0.75rem;font-weight:500;color:var(--primary);}
        .progress-track{height:6px;background:var(--bg-hover);border-radius:10px;overflow:hidden;margin-top:0.5rem;}
        .progress-fill{height:100%;background:var(--primary);}
        .startup-row-waiting{font-size:0.75rem;color:var(--text-3);}

        .activity-list{display:flex;flex-direction:column;gap:1rem;}
        .activity-row{
          display:flex;align-items:center;gap:1rem; background:var(--bg-card);
          border:1px solid var(--border); padding:1rem 1.25rem; border-radius:var(--radius-md);
        }
        .activity-avatar{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.875rem;font-weight:600;color:#fff;background:var(--primary-hover);}
        .activity-text{font-size:0.875rem;color:var(--text-1);font-weight:500;}
        .activity-sub{font-size:0.75rem;color:var(--text-3);margin-top:0.25rem;}

        @media(max-width:1400px){.stats-row{grid-template-columns:repeat(2,1fr);}}
      `}</style>
    </div>
  );
}
