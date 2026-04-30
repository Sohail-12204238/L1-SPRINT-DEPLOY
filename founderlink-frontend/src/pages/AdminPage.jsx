import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { startupAPI } from '../api/services';

/* ─── Admin Sidebar ───────────────────────────────────────────── */
function AdminSidebar() {
  const location = useLocation();
  const isActive = (p) => location.pathname === p;
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-section">
        <div className="admin-sidebar-label">Admin</div>
        {[
          { to: '/admin', icon: <GridIcon />, label: 'Dashboard' },
          { to: '/startups', icon: <RocketIcon />, label: 'Startups' },
          { to: '/admin', icon: <UsersIcon />, label: 'Users' },
          { to: '/admin', icon: <ChartIcon />, label: 'Analytics' },
        ].map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className={`admin-sidebar-link${isActive(item.to) ? ' active' : ''}`}
          >
            <span className="admin-sidebar-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}

/* ─── SVG Icons ───────────────────────────────────────────────── */
function GridIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
}
function RocketIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>;
}
function UsersIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
function ChartIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
}
function TrendUpIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
}

/* ─── Stat Card ───────────────────────────────────────────────── */
function StatCard({ label, value, sub, subColor = 'var(--green)', icon }) {
  return (
    <div className="adm-stat-card">
      <p className="adm-stat-label">{label}</p>
      <p className="adm-stat-value">{value}</p>
      {sub && (
        <p className="adm-stat-sub" style={{ color: subColor }}>
          {subColor === 'var(--green)' && <TrendUpIcon />} {sub}
        </p>
      )}
    </div>
  );
}

/* ─── Bar Chart — pure CSS ────────────────────────────────────── */
const CHART_DATA = [
  { day: 'M', count: 18, weekend: false },
  { day: 'T', count: 24, weekend: false },
  { day: 'W', count: 15, weekend: false },
  { day: 'T', count: 32, weekend: false },
  { day: 'F', count: 28, weekend: false },
  { day: 'Sa', count: 42, weekend: true },
  { day: 'Su', count: 38, weekend: true },
];
const maxCount = Math.max(...CHART_DATA.map(d => d.count));

function RegistrationChart() {
  return (
    <div className="adm-chart-card">
      <div className="adm-chart-header">
        <span className="adm-chart-title">New registrations (7 days)</span>
        <div className="adm-chart-legend">
          <span className="legend-dot weekday" /> Weekday
          <span className="legend-dot weekend" style={{ marginLeft: '.85rem' }} /> Weekend
        </div>
      </div>
      <div className="adm-bar-chart">
        {CHART_DATA.map((d, i) => {
          const pct = (d.count / maxCount) * 100;
          return (
            <div key={i} className="adm-bar-item">
              <span className="adm-bar-count">{d.count}</span>
              <div className="adm-bar-track">
                <div
                  className={`adm-bar-fill ${d.weekend ? 'weekend' : 'weekday'}`}
                  style={{ height: `${pct}%` }}
                />
              </div>
              <span className="adm-bar-label">{d.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Role Distribution ───────────────────────────────────────── */
function RoleDistribution() {
  const roles = [
    { label: 'Founders', count: 1240, total: 1620, color: '#6c5ce7' },
    { label: 'Investors', count: 380, total: 1620, color: '#a78bfa' },
    { label: 'Co-founders', count: 320, total: 1620, color: '#8b5cf6' },
  ];
  return (
    <div className="adm-dist-card">
      <p className="adm-chart-title" style={{ marginBottom: '1.25rem' }}>User role distribution</p>
      {roles.map((r) => {
        const pct = Math.round((r.count / r.total) * 100);
        return (
          <div key={r.label} className="adm-dist-row">
            <div className="adm-dist-top">
              <span className="adm-dist-label">{r.label}</span>
              <span className="adm-dist-val">
                {r.count.toLocaleString()} · {pct}%
              </span>
            </div>
            <div className="adm-dist-track">
              <div className="adm-dist-fill" style={{ width: `${pct}%`, background: r.color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Approval Queue ──────────────────────────────────────────── */
const MOCK_QUEUE = [
  { id: 1, name: 'EduLearn', sector: 'EdTech', stage: 'Pre-Seed', founder: 'Rahul K.', ask: '₹50L', daysAgo: 2 },
  { id: 2, name: 'MediScan AI', sector: 'HealthTech', stage: 'Seed', founder: 'Ananya', ask: '₹80L', daysAgo: 3 },
  { id: 3, name: 'FarmLink', sector: 'AgriTech', stage: 'Pre-Seed', founder: 'Mohan R.', ask: '₹30L', daysAgo: 5 },
  { id: 4, name: 'PayFast', sector: 'FinTech', stage: 'Pre-Seed', founder: 'Priya S.', ask: '₹60L', daysAgo: 7 },
];

function ApprovalQueue() {
  const [queue, setQueue] = useState(MOCK_QUEUE);
  const [acting, setActing] = useState({});

  const handleAction = async (id, approve) => {
    setActing(p => ({ ...p, [id]: true }));
    try {
      // In production: call adminAPI.approveStartup(id) or adminAPI.rejectStartup(id)
      // For now using mock — remove from queue after action
      await new Promise(r => setTimeout(r, 600));
      setQueue(q => q.filter(s => s.id !== id));
    } finally {
      setActing(p => ({ ...p, [id]: false }));
    }
  };

  return (
    <div className="adm-queue-card">
      <div className="adm-queue-header">
        <div>
          <p className="adm-queue-title">Startup approval queue</p>
          <p className="adm-queue-sub">{queue.length} pending review</p>
        </div>
        <button className="btn btn-secondary btn-sm">View all</button>
      </div>
      <div className="adm-queue-cols">
        <span>Startup</span>
        <span>Founder</span>
        <span>Ask</span>
        <span>Submitted</span>
        <span></span>
      </div>
      {queue.length === 0 ? (
        <div className="adm-queue-empty">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{color:'var(--text-3)'}}>
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <p>All caught up!</p>
        </div>
      ) : (
        queue.map((s) => (
          <div key={s.id} className="adm-queue-row">
            <div>
              <p className="adm-queue-name">{s.name}</p>
              <p className="adm-queue-sector">{s.sector} · {s.stage}</p>
            </div>
            <span className="adm-queue-founder">{s.founder}</span>
            <span className="adm-queue-ask">{s.ask}</span>
            <span className="adm-queue-date">{s.daysAgo}d ago</span>
            <div className="adm-queue-btns">
              <button
                id={`approve-${s.id}`}
                className="btn btn-success btn-sm"
                disabled={acting[s.id]}
                onClick={() => handleAction(s.id, true)}
              >
                {acting[s.id] ? '…' : 'Approve'}
              </button>
              <button
                id={`reject-${s.id}`}
                className="btn btn-danger btn-sm"
                disabled={acting[s.id]}
                onClick={() => handleAction(s.id, false)}
              >
                {acting[s.id] ? '…' : 'Reject'}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ─── Admin Dashboard Page ────────────────────────────────────── */
export default function AdminPage() {
  const { email, logout } = useAuth();
  const initials = email ? email.slice(0, 2) : 'Ad';

  return (
    <div className="adm-shell">
      <AdminSidebar />
      <main className="adm-main">
        {/* Stat cards */}
        <div className="adm-stats-row fade-up">
          <StatCard label="Total users" value="1,620" sub="↑ 42 today" />
          <StatCard label="Active startups" value="218" sub="7 pending review" subColor="var(--yellow)" />
          <StatCard label="Investments today" value="₹28L" sub="↑ 12% vs yesterday" />
          <StatCard label="Messages sent" value="1,847" sub="last 24 hours" subColor="var(--text-3)" />
        </div>

        {/* Main content grid */}
        <div className="adm-content-grid">
          {/* Left — Approval queue */}
          <div className="adm-content-left fade-up" style={{ animationDelay: '.08s' }}>
            <ApprovalQueue />
          </div>

          {/* Right — Charts */}
          <div className="adm-content-right fade-up" style={{ animationDelay: '.16s' }}>
            <RegistrationChart />
            <RoleDistribution />
          </div>
        </div>
      </main>

      <style>{`
        .adm-shell{display:flex;min-height:100vh;padding-top:60px;}

        /* Sidebar */
        .admin-sidebar{
          width:220px;flex-shrink:0;
          background:var(--bg-surface);
          border-right:1px solid var(--border);
          padding:1.25rem 0;
          position:fixed;left:0;top:60px;bottom:0;overflow-y:auto;
        }
        .admin-sidebar-section{margin-bottom:1.5rem;}
        .admin-sidebar-label{
          font-size:.75rem;font-weight:600;color:var(--text-2);
          padding:.25rem 1.25rem .5rem;
        }
        .admin-sidebar-link{
          display:flex;align-items:center;gap:.65rem;
          padding:.55rem 1.25rem;font-size:.87rem;font-weight:500;
          color:var(--text-2);text-decoration:none;
          transition:all .18s;border-left:2px solid transparent;
        }
        .admin-sidebar-link:hover{color:var(--text-1);background:rgba(255,255,255,.04);}
        .admin-sidebar-link.active{
          color:var(--text-1);background:var(--bg-hover);
          border-left-color:var(--primary);font-weight:600;
        }
        .admin-sidebar-icon{display:flex;align-items:center;opacity:.75;}

        /* Main */
        .adm-main{
          flex:1;margin-left:220px;
          padding:2rem 1.75rem;
          min-height:calc(100vh - 60px);
        }

        /* Stat cards */
        .adm-stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.75rem;}
        .adm-stat-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.1rem 1.25rem;}
        .adm-stat-label{font-size:.75rem;color:var(--text-2);font-weight:500;margin-bottom:.3rem;}
        .adm-stat-value{font-size:1.7rem;font-weight:600;color:var(--text-1);}
        .adm-stat-sub{font-size:.74rem;margin-top:.25rem;display:flex;align-items:center;gap:.3rem;}

        /* Content grid */
        .adm-content-grid{display:grid;grid-template-columns:1.4fr 1fr;gap:1.25rem;}
        .adm-content-left,.adm-content-right{display:flex;flex-direction:column;gap:1.25rem;}

        /* Approval queue */
        .adm-queue-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.25rem;overflow:hidden;}
        .adm-queue-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem;}
        .adm-queue-title{font-size:.95rem;font-weight:700;color:#fff;}
        .adm-queue-sub{font-size:.77rem;color:var(--text-3);margin-top:.15rem;}
        .adm-queue-cols{
          display:grid;grid-template-columns:1.4fr .8fr .7fr .7fr 1fr;
          padding:.4rem .5rem;font-size:.75rem;font-weight:600;
          color:var(--text-2);
          border-bottom:1px solid var(--border);margin-bottom:.25rem;
        }
        .adm-queue-row{
          display:grid;grid-template-columns:1.4fr .8fr .7fr .7fr 1fr;
          align-items:center;padding:.75rem .5rem;
          border-bottom:1px solid rgba(255,255,255,.04);
          transition:background .15s;
        }
        .adm-queue-row:last-child{border-bottom:none;}
        .adm-queue-row:hover{background:rgba(255,255,255,.02);}
        .adm-queue-name{font-size:.87rem;font-weight:700;color:#fff;}
        .adm-queue-sector{font-size:.73rem;color:var(--text-3);margin-top:.1rem;}
        .adm-queue-founder{font-size:.83rem;color:var(--text-2);}
        .adm-queue-ask{font-size:.87rem;font-weight:600;color:var(--primary);}
        .adm-queue-date{font-size:.77rem;color:var(--text-3);}
        .adm-queue-btns{display:flex;gap:.4rem;}
        .adm-queue-empty{display:flex;flex-direction:column;align-items:center;gap:.5rem;padding:1.5rem;color:var(--text-3);font-size:.85rem;}

        /* Bar chart */
        .adm-chart-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.25rem;}
        .adm-chart-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;}
        .adm-chart-title{font-size:.9rem;font-weight:700;color:#fff;}
        .adm-chart-legend{display:flex;align-items:center;font-size:.73rem;color:var(--text-2);}
        .legend-dot{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:.35rem;}
        .legend-dot.weekday{background:var(--primary);}
        .legend-dot.weekend{background:var(--primary-hover);}

        .adm-bar-chart{display:flex;align-items:flex-end;gap:.5rem;height:130px;padding-top:.5rem;}
        .adm-bar-item{display:flex;flex-direction:column;align-items:center;gap:.35rem;flex:1;}
        .adm-bar-count{font-size:.65rem;font-weight:700;color:var(--text-2);}
        .adm-bar-track{flex:1;width:100%;position:relative;display:flex;align-items:flex-end;border-radius:4px;overflow:hidden;background:rgba(255,255,255,.05);}
        .adm-bar-fill{width:100%;border-radius:4px 4px 0 0;transition:height .4s ease;}
        .adm-bar-fill.weekday{background:var(--primary);}
        .adm-bar-fill.weekend{background:var(--primary-hover);}
        .adm-bar-label{font-size:.7rem;color:var(--text-3);font-weight:500;}

        /* Role distribution */
        .adm-dist-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.25rem;}
        .adm-dist-row{margin-bottom:1rem;}
        .adm-dist-row:last-child{margin-bottom:0;}
        .adm-dist-top{display:flex;justify-content:space-between;margin-bottom:.45rem;}
        .adm-dist-label{font-size:.83rem;color:var(--text-2);font-weight:500;}
        .adm-dist-val{font-size:.83rem;font-weight:700;color:#fff;}
        .adm-dist-track{height:6px;background:rgba(255,255,255,.08);border-radius:999px;overflow:hidden;}
        .adm-dist-fill{height:100%;border-radius:999px;transition:width .5s ease;}

        @media(max-width:1100px){
          .adm-stats-row{grid-template-columns:1fr 1fr;}
          .adm-content-grid{grid-template-columns:1fr;}
        }
        @media(max-width:768px){
          .admin-sidebar{display:none;}
          .adm-main{margin-left:0;padding:1.25rem;}
          .adm-stats-row{grid-template-columns:1fr 1fr;}
        }
        @media(max-width:500px){
          .adm-stats-row{grid-template-columns:1fr;}
        }
      `}</style>
    </div>
  );
}
