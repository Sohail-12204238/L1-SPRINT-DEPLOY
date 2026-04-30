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
      {sub && <p className="stat-sub" style={{ color: subColor || 'var(--text-3)' }}>{sub}</p>}
    </div>
  );
}

/* ─── Startup Row ─────────────────────────────────────────────── */
function StartupRow({ startup }) {
  // Derive status from stage
  const statusMap = { SCALING: 'live', EARLY_TRACTION: 'live', MVP: 'pending', IDEA: 'draft' };
  const status = statusMap[startup.stage] || 'draft';

  const abbr = startup.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['#6c5ce7', '#00c853', '#f59e0b', '#06b6d4', '#ef4444'];
  const color = colors[startup.id % colors.length] || '#6c5ce7';

  // Use real funding data — backend fundingGoal in rupees
  const goal = startup.fundingGoal || 10000000;
  const raisedPct = 92; // Would come from investment service; using placeholder until separate API call
  const raised = Math.floor(goal * raisedPct / 100);

  return (
    <div className="startup-row">
      <div className="startup-row-left">
        <div className="startup-abbr" style={{ background: color + '33', color }}>{abbr}</div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <span className="startup-row-name">{startup.name}</span>
            <span className={`badge badge-${status}`}>
              {status === 'live' ? 'Live' : status === 'pending' ? 'Pending' : 'Draft'}
            </span>
          </div>
          <p className="startup-row-meta">
            {startup.industry} · {startup.stage?.replace('_', ' ')}
          </p>
        </div>
      </div>
      {status === 'live' && (
        <div className="startup-row-progress">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.3rem' }}>
            <span className="progress-label">
              ₹{Math.floor(raised / 100000)}L raised of ₹{Math.floor(goal / 100000)}L
            </span>
            <span className="progress-pct">{raisedPct}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${raisedPct}%` }} />
          </div>
        </div>
      )}
      {status === 'pending' && (
        <p className="startup-row-waiting">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display:'inline',verticalAlign:'middle',marginRight:4 }}>
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          Awaiting admin approval — submitted 2 days ago
        </p>
      )}
      {status === 'draft' && (
        <p className="startup-row-waiting">Complete your profile to submit for review</p>
      )}
    </div>
  );
}

/* ─── Activity Row ────────────────────────────────────────────── */
function ActivityRow({ initials, text, sub, amount, color }) {
  return (
    <div className="activity-row">
      <div className="activity-avatar" style={{ background: color + '33', color }}>{initials}</div>
      <div style={{ flex: 1 }}>
        <span className="activity-text">{text}</span>
        {sub && <p className="activity-sub">{sub}</p>}
      </div>
      {amount && <span className="activity-amount">+{amount}</span>}
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
  const [loading, setLoading] = useState(true);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = email?.split('@')[0].split('.')[0];
  const displayFirst = firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : 'there';

  useEffect(() => {
    const load = async () => {
      try {
        const [t] = await Promise.allSettled([teamAPI.getMyTeams()]);
        setTeams(t.status === 'fulfilled' ? t.value.data : []);

        if (cleanRole === 'FOUNDER') {
          const [s] = await Promise.allSettled([startupAPI.getMyStartups()]);
          setStartups(s.status === 'fulfilled' ? s.value.data : []);
        }
        if (cleanRole === 'INVESTOR') {
          const [i] = await Promise.allSettled([investmentAPI.getMyInvestments()]);
          setInvestments(i.status === 'fulfilled' ? i.value.data : []);
        }
        if (cleanRole === 'COFOUNDER') {
          // Find the first startup the cofounder belongs to
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

  return (
    <div className="app-shell">
      <Sidebar role={cleanRole} />
      <main className="main-content">
        {/* Top row */}
        <div className="dash-toprow">
          <div>
            <h1 className="dash-greeting">{greeting}, {displayFirst}</h1>
            <p className="dash-subline">
              {cleanRole === 'FOUNDER'
                ? "Here's how your startups are performing today."
                : cleanRole === 'COFOUNDER'
                ? "Here is your startup's performance."
                : "Here's your investment portfolio overview."}
            </p>
          </div>
          {cleanRole === 'FOUNDER' && (
            <Link to="/my-startups" id="new-startup-btn" className="btn btn-primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Startup
            </Link>
          )}
          {cleanRole === 'INVESTOR' && (
            <Link to="/startups" id="browse-btn" className="btn btn-primary">Browse Startups →</Link>
          )}
        </div>

        {/* Stats */}
        <div className="stats-row fade-up">
          {cleanRole === 'FOUNDER' || cleanRole === 'COFOUNDER' ? (
            <>
              <StatCard
                label={cleanRole === 'FOUNDER' ? "Active Startups" : "My Startup"}
                value={loading ? '—' : startups.length || 0}
                sub={startups.length > 0 && startups[0].status === 'PENDING' ? 'Pending approval' : null}
                subColor="var(--green)"
              />
              <StatCard
                label="Funding Raised"
                value={startups.length ? `₹${(startups[0].currentFunding || 0).toLocaleString()}` : '—'}
                sub={`Goal: ₹${(startups[0].fundingGoal || 0).toLocaleString()}`}
              />
              <StatCard
                label="Team Size"
                value={loading ? '—' : teams.length || 0}
                sub={pendingInvites > 0 ? `${pendingInvites} invites pending` : null}
              />
              <StatCard label="Tasks Completed" value="8" sub="↑ 2 this week" subColor="var(--green)" />
            </>
          ) : (
            <>
              <StatCard
                label="My Investments"
                value={loading ? '—' : investments.length || 0}
                sub={`${investments.filter(i => i.status === 'PENDING').length} pending`}
              />
              <StatCard
                label="Total Invested"
                value={investments.length
                  ? `₹${investments.reduce((a, i) => a + (i.amount || 0), 0).toLocaleString('en-IN')}`
                  : '—'}
              />
              <StatCard
                label="Approved"
                value={investments.filter(i => i.status === 'APPROVED').length || '—'}
                sub="This month"
                subColor="var(--green)"
              />
              <StatCard label="Teams Joined" value={teams.length || '—'} />
            </>
          )}
        </div>

        {/* My Startups section (Founder & Cofounder) */}
        {(cleanRole === 'FOUNDER' || cleanRole === 'COFOUNDER') && (
          <div className="dash-section fade-up">
            <h2 className="section-title">{cleanRole === 'FOUNDER' ? 'My Startups' : 'Our Startup'}</h2>
            {loading ? (
              <div className="spinner-wrap"><div className="spinner" /></div>
            ) : startups.length === 0 ? (
              <div className="empty">
                <span className="empty-icon">🚀</span>
                <p className="empty-title">No startups yet</p>
                <p>{cleanRole === 'FOUNDER' ? 'Create your first startup to get started' : 'Join a startup team to see it here'}</p>
              </div>
            ) : (
              <div className="startup-list">
                {startups.map((s) => <StartupRow key={s.id} startup={s} />)}
              </div>
            )}
          </div>
        )}

        {/* Portfolio section (Investor) */}
        {cleanRole === 'INVESTOR' && investments.length > 0 && (
          <div className="dash-section fade-up">
            <h2 className="section-title">My Portfolio</h2>
            <div className="startup-list">
              {investments.map((inv) => (
                <div key={inv.id} className="startup-row">
                  <div className="startup-row-left">
                    <div className="startup-abbr" style={{ background: '#6c5ce733', color: '#a78bfa' }}>
                      #{inv.startupId}
                    </div>
                    <div>
                      <p className="startup-row-name">Startup #{inv.startupId}</p>
                      <p className="startup-row-meta">{inv.investorEmail}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontWeight: 700, color: '#4ade80' }}>₹{inv.amount?.toLocaleString('en-IN')}</span>
                    <span className={`badge badge-${inv.status?.toLowerCase()}`}>{inv.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="dash-section fade-up" style={{ animationDelay: '.15s' }}>
          <h2 className="section-title">Recent activity</h2>
          <div className="activity-list">
            <ActivityRow initials="VS" color="#6c5ce7"
              text="Vikram Singh invested ₹5L in PayEase FinTech"
              sub="2 hours ago"
              amount="₹5L" />
            <ActivityRow initials="PM" color="#00c853"
              text="Priya Mehta accepted your co-founder invite"
              sub="Yesterday" />
            <ActivityRow initials="RK" color="#f59e0b"
              text="Rahul K. updated startup profile"
              sub="Yesterday" />
          </div>
        </div>
      </main>

      <style>{`
        .dash-toprow{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.75rem;}
        .dash-greeting{font-size:1.55rem;font-weight:800;color:#fff;}
        .dash-subline{font-size:.88rem;color:var(--text-2);margin-top:.2rem;}

        .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem;}
        .stat-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.1rem 1.25rem;}
        .stat-label{font-size:.75rem;color:var(--text-2);font-weight:500;margin-bottom:.35rem;text-transform:uppercase;letter-spacing:.02em;}
        .stat-value{font-size:1.65rem;font-weight:800;color:#fff;}
        .stat-sub{font-size:.75rem;margin-top:.25rem;}

        .dash-section{margin-bottom:2rem;}
        .section-title{font-size:1rem;font-weight:700;color:#fff;margin-bottom:1rem;}

        .startup-list{display:flex;flex-direction:column;gap:.65rem;}
        .startup-row{
          background:var(--bg-card);border:1px solid var(--border);
          border-radius:var(--radius-md);padding:1rem 1.25rem;
          display:flex;align-items:center;gap:1rem;
          transition:border-color .18s;
        }
        .startup-row:hover{border-color:rgba(108,92,231,.3);}
        .startup-row-left{display:flex;align-items:center;gap:.85rem;flex:1;min-width:0;}
        .startup-abbr{
          width:38px;height:38px;border-radius:10px;flex-shrink:0;
          display:flex;align-items:center;justify-content:center;
          font-size:.78rem;font-weight:800;
        }
        .startup-row-name{font-size:.9rem;font-weight:700;color:#fff;}
        .startup-row-meta{font-size:.77rem;color:var(--text-2);margin-top:.1rem;}
        .startup-row-progress{flex:1;max-width:250px;}
        .progress-label{font-size:.75rem;color:var(--text-2);}
        .progress-pct{font-size:.75rem;font-weight:700;color:var(--purple);}
        .startup-row-waiting{font-size:.77rem;color:var(--text-3);}

        .activity-list{display:flex;flex-direction:column;gap:.5rem;}
        .activity-row{
          display:flex;align-items:center;gap:.85rem;
          background:var(--bg-card);border:1px solid var(--border);
          border-radius:var(--radius-md);padding:.85rem 1.25rem;
        }
        .activity-avatar{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;flex-shrink:0;}
        .activity-text{font-size:.85rem;color:#fff;font-weight:500;}
        .activity-sub{font-size:.75rem;color:var(--text-3);margin-top:.1rem;}
        .activity-amount{font-size:.82rem;font-weight:700;color:var(--green);background:var(--green-dim);border:1px solid rgba(0,200,83,.3);padding:.2rem .55rem;border-radius:6px;white-space:nowrap;}

        @media(max-width:900px){.stats-row{grid-template-columns:1fr 1fr;}}
        @media(max-width:600px){.stats-row{grid-template-columns:1fr;}}
      `}</style>
    </div>
  );
}
