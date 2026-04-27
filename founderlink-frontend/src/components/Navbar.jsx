import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

// ─── SVG Logo Icon ────────────────────────────────────────────────────────────
function LogoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

// Pages where the Navbar should be hidden (they have their own full-page layout)
const HIDDEN_ROUTES = ['/login', '/register'];

export default function Navbar() {
  const { isAuthenticated, role, email, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const cleanRole = role?.replace('ROLE_', '') || '';

  // Hide on auth pages
  if (HIDDEN_ROUTES.includes(location.pathname)) return null;

  const initials = email ? email.slice(0, 2).toUpperCase() : 'U';
  const displayName = email
    ? email.split('@')[0].split('.').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')
    : '';

  const handleLogout = () => { logout(); navigate('/login'); };

  const isActive = (path) => location.pathname === path;

  const founderTabs = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/my-startups', label: 'My Startups' },
    { to: '/my-teams', label: 'Team' },
    { to: '/investor-requests', label: 'Requests' },
  ];
  const investorTabs = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/startups', label: 'Startups' },
    { to: '/my-investments', label: 'My Investments' },
    { to: '/incoming-requests', label: 'Inbox' },
    { to: '/my-teams', label: 'Teams' },
  ];
  const adminTabs = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/startups', label: 'Startups' },
    { to: '/admin', label: 'Users' },
    { to: '/admin', label: 'Analytics' },
  ];

  const tabs = cleanRole === 'FOUNDER' ? founderTabs
    : cleanRole === 'INVESTOR' ? investorTabs
    : cleanRole === 'ADMIN' ? adminTabs
    : founderTabs;

  return (
    <header className="topbar">
      {/* Brand */}
      <div className="topbar-brand">
        <Link to={isAuthenticated ? (cleanRole === 'ADMIN' ? '/admin' : '/dashboard') : '/'} className="topbar-logo">
          <div className="topbar-logo-icon"><LogoIcon /></div>
          <span className="topbar-logo-name">FounderLink</span>
        </Link>
        {isAuthenticated && cleanRole === 'ADMIN' && (
          <span className="topbar-admin-pill">Admin</span>
        )}
        {isAuthenticated && <div className="topbar-divider" />}
      </div>

      {/* Center tabs */}
      {isAuthenticated && (
        <nav className="topbar-tabs">
          {tabs.map((t) => (
            <Link
              key={t.to + t.label}
              to={t.to}
              className={`topbar-tab${isActive(t.to) ? ' active' : ''}`}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      )}

      {/* Right side */}
      <div className="topbar-right">
        {isAuthenticated ? (
          <>
            <button className="topbar-notif" id="notif-btn" title="Notifications">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="notif-dot">3</span>
            </button>
            <div className="topbar-user" onClick={handleLogout} title="Click to logout" id="user-menu">
              <div className="topbar-avatar">{initials}</div>
              <span className="topbar-uname">{displayName || email}</span>
              <span className={`topbar-role-pill role-${cleanRole.toLowerCase()}`}>{cleanRole}</span>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm" id="nav-login">Sign in</Link>
            <Link to="/register" className="btn btn-primary btn-sm" id="nav-register">Get started</Link>
          </>
        )}
      </div>
    </header>
  );
}
