import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../api/services';

/* ─── Icons ─────────────────────────────────────────────────────── */
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const GridIcon   = () => <Icon d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />;
const UsersIcon  = () => <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />;
const RocketIcon = () => <Icon d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zm7.5-1.5-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2zM9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />;
const TrashIcon  = () => <Icon d="M3 6h18M19 6l-1 14H6L5 6M9 6V4h6v2" />;
const CheckIcon  = () => <Icon d="M20 6 9 17l-5-5" />;
const XIcon      = () => <Icon d="M18 6 6 18M6 6l12 12" />;
const LogoutIcon = () => <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />;

/* ─── Confirm Modal ──────────────────────────────────────────────── */
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="adm-modal-overlay">
      <div className="adm-modal">
        <p className="adm-modal-msg">{message}</p>
        <div className="adm-modal-btns">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger"    onClick={onConfirm}>Yes, delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Toast ──────────────────────────────────────────────────────── */
function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return <div className={`adm-toast adm-toast-${type}`}>{msg}</div>;
}

/* ─── Sidebar ────────────────────────────────────────────────────── */
function Sidebar({ tab, setTab, onLogout }) {
  const items = [
    { key: 'dashboard', label: 'Dashboard', Icon: GridIcon },
    { key: 'users',     label: 'Manage Users',    Icon: UsersIcon },
    { key: 'startups',  label: 'Manage Startups', Icon: RocketIcon },
  ];
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <img src="/logo.png" alt="FounderLink" style={{ height: 36, objectFit: 'contain' }} />
        <span className="admin-sidebar-label-title">Admin Panel</span>
      </div>
      <div className="admin-sidebar-section">
        {items.map(({ key, label, Icon: Ic }) => (
          <button
            key={key}
            className={`admin-sidebar-link${tab === key ? ' active' : ''}`}
            onClick={() => setTab(key)}
          >
            <span className="admin-sidebar-icon"><Ic /></span>
            {label}
          </button>
        ))}
      </div>
      <button className="admin-sidebar-logout" onClick={onLogout}>
        <LogoutIcon /> Sign out
      </button>
    </aside>
  );
}

/* ─── Stat Card ──────────────────────────────────────────────────── */
function StatCard({ label, value, sub, color = 'var(--primary)' }) {
  return (
    <div className="adm-stat-card">
      <p className="adm-stat-label">{label}</p>
      <p className="adm-stat-value" style={{ color }}>{value}</p>
      {sub && <p className="adm-stat-sub">{sub}</p>}
    </div>
  );
}

/* ─── Dashboard Tab ──────────────────────────────────────────────── */
function DashboardTab({ users, startups }) {
  const founders   = users.filter(u => u.role === 'ROLE_FOUNDER').length;
  const investors  = users.filter(u => u.role === 'ROLE_INVESTOR').length;
  const cofounders = users.filter(u => u.role === 'ROLE_COFOUNDER').length;

  return (
    <>
      <h2 className="adm-page-title">Overview</h2>
      <div className="adm-stats-row">
        <StatCard label="Total Users"     value={users.length}    sub="Registered accounts" />
        <StatCard label="Total Startups"  value={startups.length} sub="On platform" color="var(--primary)" />
        <StatCard label="Founders"        value={founders}        sub="Active founders" />
        <StatCard label="Investors"       value={investors}       sub="Active investors" />
      </div>

      <div className="adm-content-grid">
        {/* Role breakdown */}
        <div className="adm-queue-card">
          <p className="adm-queue-title" style={{ marginBottom: '1.25rem' }}>User Role Breakdown</p>
          {[
            { label: 'Founders',   count: founders,   color: '#16a34a' },
            { label: 'Investors',  count: investors,  color: '#0ea5e9' },
            { label: 'Co-founders',count: cofounders, color: '#8b5cf6' },
          ].map(r => {
            const pct = users.length ? Math.round((r.count / users.length) * 100) : 0;
            return (
              <div key={r.label} className="adm-dist-row">
                <div className="adm-dist-top">
                  <span className="adm-dist-label">{r.label}</span>
                  <span className="adm-dist-val">{r.count} · {pct}%</span>
                </div>
                <div className="adm-dist-track">
                  <div className="adm-dist-fill" style={{ width: `${pct}%`, background: r.color }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent startups */}
        <div className="adm-queue-card">
          <p className="adm-queue-title" style={{ marginBottom: '1rem' }}>Recent Startups</p>
          {startups.slice(0, 5).map(s => (
            <div key={s.id} className="adm-recent-row">
              <div>
                <p className="adm-queue-name">{s.name}</p>
                <p className="adm-queue-sector">{s.sector || 'N/A'} · {s.stage || 'N/A'}</p>
              </div>
              <span className={`adm-badge adm-badge-${(s.status || 'pending').toLowerCase()}`}>
                {s.status || 'PENDING'}
              </span>
            </div>
          ))}
          {startups.length === 0 && <p className="adm-empty">No startups yet.</p>}
        </div>
      </div>
    </>
  );
}

/* ─── Users Tab ──────────────────────────────────────────────────── */
function UsersTab({ users, onDelete }) {
  const [search, setSearch] = useState('');
  const filtered = users.filter(u =>
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const roleLabel = r => (r || '').replace('ROLE_', '');
  const roleColor = r => ({
    ROLE_ADMIN: '#ef4444', ROLE_FOUNDER: '#16a34a',
    ROLE_INVESTOR: '#0ea5e9', ROLE_COFOUNDER: '#8b5cf6',
  }[r] || '#6b7280');

  return (
    <>
      <div className="adm-tab-header">
        <h2 className="adm-page-title">Users ({users.length})</h2>
        <input
          className="adm-search"
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="adm-table-card">
        <div className="adm-table-cols adm-users-cols">
          <span>Name</span><span>Email</span><span>Role</span><span>Actions</span>
        </div>
        {filtered.length === 0 && <p className="adm-empty">No users found.</p>}
        {filtered.map(u => (
          <div key={u.id} className="adm-table-row adm-users-cols">
            <span className="adm-queue-name">{u.name || '—'}</span>
            <span className="adm-queue-sector" style={{ color: 'var(--text-2)' }}>{u.email}</span>
            <span>
              <span className="adm-badge" style={{ background: roleColor(u.role) + '22', color: roleColor(u.role), border: `1px solid ${roleColor(u.role)}44` }}>
                {roleLabel(u.role)}
              </span>
            </span>
            <span>
              {u.role !== 'ROLE_ADMIN' && (
                <button className="btn btn-danger btn-sm" onClick={() => onDelete('user', u.id, u.name || u.email)}>
                  <TrashIcon /> Remove
                </button>
              )}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─── Startups Tab ───────────────────────────────────────────────── */
function StartupsTab({ startups, onDelete, onApprove, onReject }) {
  const [search, setSearch] = useState('');
  const filtered = startups.filter(s =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.sector || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="adm-tab-header">
        <h2 className="adm-page-title">Startups ({startups.length})</h2>
        <input
          className="adm-search"
          placeholder="Search by name or sector…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="adm-table-card">
        <div className="adm-table-cols adm-startups-cols">
          <span>Name</span><span>Sector</span><span>Stage</span><span>Status</span><span>Actions</span>
        </div>
        {filtered.length === 0 && <p className="adm-empty">No startups found.</p>}
        {filtered.map(s => (
          <div key={s.id} className="adm-table-row adm-startups-cols">
            <span className="adm-queue-name">{s.name}</span>
            <span className="adm-queue-sector">{s.sector || '—'}</span>
            <span className="adm-queue-sector">{s.stage || '—'}</span>
            <span>
              <span className={`adm-badge adm-badge-${(s.status || 'pending').toLowerCase()}`}>
                {s.status || 'PENDING'}
              </span>
            </span>
            <span className="adm-action-btns">
              {(!s.status || s.status === 'PENDING') && (
                <>
                  <button className="btn btn-success btn-sm" title="Approve" onClick={() => onApprove(s.id)}>
                    <CheckIcon />
                  </button>
                  <button className="btn btn-secondary btn-sm" title="Reject" onClick={() => onReject(s.id)}>
                    <XIcon />
                  </button>
                </>
              )}
              <button className="btn btn-danger btn-sm" title="Delete" onClick={() => onDelete('startup', s.id, s.name)}>
                <TrashIcon />
              </button>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─── Main Admin Page ────────────────────────────────────────────── */
export default function AdminPage({ tab: initialTab = 'dashboard' }) {
  const { logout } = useAuth();
  const navigate   = useNavigate();

  const [tab,      setTab]      = useState(initialTab);
  const [users,    setUsers]    = useState([]);
  const [startups, setStartups] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [confirm,  setConfirm]  = useState(null); // { type, id, name }
  const [toast,    setToast]    = useState(null);  // { msg, type }

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [uRes, sRes] = await Promise.all([
        adminAPI.getAllUsers(),
        adminAPI.getAllStartups(),
      ]);
      setUsers(uRes.data || []);
      setStartups(sRes.data || []);
    } catch (e) {
      showToast('Failed to load data. Check your connection.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = (type, id, name) => setConfirm({ type, id, name });

  const confirmDelete = async () => {
    const { type, id, name } = confirm;
    setConfirm(null);
    try {
      if (type === 'user')    { await adminAPI.deleteUser(id);    setUsers(p => p.filter(u => u.id !== id)); }
      if (type === 'startup') { await adminAPI.deleteStartup(id); setStartups(p => p.filter(s => s.id !== id)); }
      showToast(`${name} has been removed.`);
    } catch { showToast('Delete failed. Try again.', 'error'); }
  };

  const handleApprove = async (id) => {
    try {
      await adminAPI.approveStartup(id);
      setStartups(p => p.map(s => s.id === id ? { ...s, status: 'APPROVED' } : s));
      showToast('Startup approved!');
    } catch { showToast('Approve failed.', 'error'); }
  };

  const handleReject = async (id) => {
    try {
      await adminAPI.rejectStartup(id);
      setStartups(p => p.map(s => s.id === id ? { ...s, status: 'REJECTED' } : s));
      showToast('Startup rejected.');
    } catch { showToast('Reject failed.', 'error'); }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="adm-shell">
      <Sidebar tab={tab} setTab={setTab} onLogout={handleLogout} />

      <main className="adm-main">
        {loading ? (
          <div className="adm-loading">
            <div className="adm-spin" />
            <p>Loading admin data…</p>
          </div>
        ) : (
          <>
            {tab === 'dashboard' && <DashboardTab users={users} startups={startups} />}
            {tab === 'users'     && <UsersTab users={users} onDelete={handleDelete} />}
            {tab === 'startups'  && (
              <StartupsTab
                startups={startups}
                onDelete={handleDelete}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            )}
          </>
        )}
      </main>

      {confirm && (
        <ConfirmModal
          message={`Are you sure you want to delete "${confirm.name}"? This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setConfirm(null)}
        />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

      <style>{`
        /* Shell */
        .adm-shell{display:flex;min-height:100vh;padding-top:60px;background:var(--bg-page);}

        /* Sidebar */
        .admin-sidebar{
          width:230px;flex-shrink:0;
          background:var(--bg-surface);
          border-right:1px solid var(--border);
          padding:0;
          position:fixed;left:0;top:60px;bottom:0;
          display:flex;flex-direction:column;
          overflow-y:auto;
        }
        .admin-sidebar-logo{
          display:flex;align-items:center;gap:.65rem;
          padding:1.25rem 1.25rem .75rem;
          border-bottom:1px solid var(--border);
        }
        .admin-sidebar-label-title{font-size:.82rem;font-weight:700;color:var(--text-1);}
        .admin-sidebar-section{flex:1;padding:.75rem 0;}
        .admin-sidebar-link{
          display:flex;align-items:center;gap:.65rem;
          width:100%;padding:.6rem 1.25rem;
          font-size:.875rem;font-weight:500;
          color:var(--text-2);background:none;border:none;
          cursor:pointer;text-align:left;
          border-left:3px solid transparent;
          transition:all .15s;
        }
        .admin-sidebar-link:hover{color:var(--text-1);background:var(--bg-hover);}
        .admin-sidebar-link.active{
          color:var(--primary);background:rgba(22,163,74,.08);
          border-left-color:var(--primary);font-weight:700;
        }
        .admin-sidebar-icon{display:flex;align-items:center;opacity:.75;}
        .admin-sidebar-logout{
          display:flex;align-items:center;gap:.65rem;
          padding:.75rem 1.25rem;margin:.5rem;
          font-size:.85rem;color:var(--danger,#ef4444);
          background:none;border:1px solid rgba(239,68,68,.25);
          border-radius:8px;cursor:pointer;
          transition:background .15s;
        }
        .admin-sidebar-logout:hover{background:rgba(239,68,68,.08);}

        /* Main */
        .adm-main{flex:1;margin-left:230px;padding:2rem 1.75rem;min-height:calc(100vh - 60px);}
        .adm-page-title{font-size:1.35rem;font-weight:700;color:var(--text-1);margin-bottom:1.25rem;}

        /* Stat cards */
        .adm-stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem;}
        .adm-stat-card{background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:1.1rem 1.25rem;}
        .adm-stat-label{font-size:.75rem;color:var(--text-2);font-weight:500;margin-bottom:.3rem;}
        .adm-stat-value{font-size:1.7rem;font-weight:700;margin-bottom:.2rem;}
        .adm-stat-sub{font-size:.73rem;color:var(--text-3);}

        /* Grid */
        .adm-content-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;}

        /* Queue / table card */
        .adm-queue-card,.adm-table-card{
          background:var(--bg-card);border:1px solid var(--border);
          border-radius:12px;padding:1.25rem;overflow:hidden;
        }
        .adm-queue-title{font-size:.95rem;font-weight:700;color:var(--text-1);}
        .adm-queue-name{font-size:.875rem;font-weight:700;color:var(--text-1);}
        .adm-queue-sector{font-size:.75rem;color:var(--text-3);margin-top:.1rem;}

        /* Badges */
        .adm-badge{
          display:inline-block;padding:.2rem .55rem;border-radius:999px;
          font-size:.7rem;font-weight:700;
        }
        .adm-badge-pending{background:rgba(234,179,8,.15);color:#ca8a04;border:1px solid rgba(234,179,8,.3);}
        .adm-badge-approved{background:rgba(22,163,74,.12);color:#15803d;border:1px solid rgba(22,163,74,.25);}
        .adm-badge-rejected{background:rgba(239,68,68,.1);color:#dc2626;border:1px solid rgba(239,68,68,.2);}

        /* Table */
        .adm-tab-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;flex-wrap:wrap;gap:.75rem;}
        .adm-tab-header .adm-page-title{margin-bottom:0;}
        .adm-search{
          padding:.5rem .85rem;font-size:.85rem;
          border:1px solid var(--border);border-radius:8px;
          background:var(--bg-surface);color:var(--text-1);
          outline:none;min-width:220px;
        }
        .adm-search:focus{border-color:var(--primary);}
        .adm-table-cols{
          display:grid;padding:.5rem .75rem;
          font-size:.73rem;font-weight:700;color:var(--text-3);
          border-bottom:1px solid var(--border);margin-bottom:.25rem;
          text-transform:uppercase;letter-spacing:.04em;
        }
        .adm-users-cols{grid-template-columns:1.2fr 1.8fr .9fr .8fr;}
        .adm-startups-cols{grid-template-columns:1.4fr .9fr .8fr .8fr 1.2fr;}
        .adm-table-row{
          display:grid;align-items:center;
          padding:.65rem .75rem;border-bottom:1px solid var(--border);
          transition:background .15s;
        }
        .adm-table-row:last-child{border-bottom:none;}
        .adm-table-row:hover{background:var(--bg-hover);}
        .adm-action-btns{display:flex;gap:.35rem;}
        .adm-empty{text-align:center;color:var(--text-3);font-size:.85rem;padding:1.5rem;}

        /* Role dist */
        .adm-dist-row{margin-bottom:1rem;}
        .adm-dist-row:last-child{margin-bottom:0;}
        .adm-dist-top{display:flex;justify-content:space-between;margin-bottom:.45rem;}
        .adm-dist-label{font-size:.83rem;color:var(--text-2);font-weight:500;}
        .adm-dist-val{font-size:.83rem;font-weight:700;color:var(--text-1);}
        .adm-dist-track{height:7px;background:var(--bg-hover);border-radius:999px;overflow:hidden;}
        .adm-dist-fill{height:100%;border-radius:999px;transition:width .5s ease;}

        /* Recent row */
        .adm-recent-row{
          display:flex;justify-content:space-between;align-items:center;
          padding:.6rem 0;border-bottom:1px solid var(--border);
        }
        .adm-recent-row:last-child{border-bottom:none;}

        /* Loading */
        .adm-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;height:60vh;color:var(--text-3);}
        @keyframes adm-spin{to{transform:rotate(360deg)}}
        .adm-spin{width:36px;height:36px;border:3px solid var(--border);border-top-color:var(--primary);border-radius:50%;animation:adm-spin .9s linear infinite;}

        /* Confirm modal */
        .adm-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:1000;}
        .adm-modal{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:2rem;max-width:400px;width:90%;}
        .adm-modal-msg{font-size:.95rem;color:var(--text-1);margin-bottom:1.5rem;line-height:1.5;}
        .adm-modal-btns{display:flex;gap:.75rem;justify-content:flex-end;}

        /* Toast */
        .adm-toast{
          position:fixed;bottom:1.5rem;right:1.5rem;
          padding:.75rem 1.25rem;border-radius:10px;
          font-size:.85rem;font-weight:600;
          box-shadow:0 8px 24px rgba(0,0,0,.15);
          z-index:9999;animation:slideUp .25s ease;
        }
        .adm-toast-success{background:#16a34a;color:#fff;}
        .adm-toast-error{background:#dc2626;color:#fff;}
        @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}

        /* Responsive */
        @media(max-width:1100px){
          .adm-stats-row{grid-template-columns:1fr 1fr;}
          .adm-content-grid{grid-template-columns:1fr;}
        }
        @media(max-width:768px){
          .admin-sidebar{display:none;}
          .adm-main{margin-left:0;padding:1.25rem;}
          .adm-stats-row{grid-template-columns:1fr 1fr;}
          .adm-users-cols,.adm-startups-cols{grid-template-columns:1fr 1fr;}
        }
        @media(max-width:500px){
          .adm-stats-row{grid-template-columns:1fr;}
        }
      `}</style>
    </div>
  );
}
