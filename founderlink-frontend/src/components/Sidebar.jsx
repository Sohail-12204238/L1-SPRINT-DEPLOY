import { Link, useLocation } from 'react-router-dom';

const founderNav = [
  { label: 'Workspace', items: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/my-startups', label: 'My Startups' },
    { to: '/my-teams', label: 'Team' },
    { to: '/investor-requests', label: 'Requests' },
  ]},
  { label: 'Tools', items: [
    { to: '/find-investors', label: 'Find Investors' },
    { to: '/find-cofounders', label: 'Find Co-founders' },
    { to: '/startups', label: 'Browse All' },
  ]},
];

const investorNav = [
  { label: 'Workspace', items: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/startups', label: 'Startups' },
    { to: '/my-investments', label: 'Portfolio' },
    { to: '/incoming-requests', label: 'Inbox' },
  ]},
  { label: 'Tools', items: [
    { to: '/profile', label: 'My Profile' },
  ]},
];

const cofounderNav = [
  { label: 'Workspace', items: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/startups', label: 'Startups' },
    { to: '/my-teams', label: 'My Teams' },
  ]},
];

export default function Sidebar({ role }) {
  const location = useLocation();
  const isActive = (p) => location.pathname === p;

  const nav = role === 'INVESTOR' ? investorNav
    : role === 'COFOUNDER' ? cofounderNav
    : founderNav;

  return (
    <aside className="sidebar">
      <div className="sidebar-header-spacer" />
      {nav.map((section) => (
        <div key={section.label} className="sidebar-section">
          <div className="sidebar-label">{section.label}</div>
          {section.items.map((item) => (
            <Link
              key={item.to + item.label}
              to={item.to}
              id={`sidebar-${item.label.toLowerCase().replace(/\s/g, '-')}`}
              className={`sidebar-link${isActive(item.to) ? ' active' : ''}`}
            >
              <div className="sidebar-indicator" />
              {item.label}
            </Link>
          ))}
        </div>
      ))}
      <div className="sidebar-section" style={{ marginTop: 'auto' }}>
        <Link to="/profile" id="sidebar-profile" className={`sidebar-link${isActive('/profile') ? ' active' : ''}`}>
          <div className="sidebar-indicator" />
          Profile
        </Link>
      </div>
    </aside>
  );
}
