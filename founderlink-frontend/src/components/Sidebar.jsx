import { Link, useLocation } from 'react-router-dom';

const founderNav = [
  { label: 'WORKSPACE', items: [
    { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
    { to: '/my-startups', icon: '○', label: 'My Startups' },
    { to: '/my-teams', icon: '△', label: 'Team' },
    { to: '/investor-requests', icon: '□', label: 'Requests' },
  ]},
  { label: 'TOOLS', items: [
    { to: '/my-startups', icon: '+', label: 'New Startup', newStartup: true },
    { to: '/startups', icon: '◎', label: 'Browse All' },
  ]},
];

const investorNav = [
  { label: 'WORKSPACE', items: [
    { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
    { to: '/startups', icon: '○', label: 'Startups' },
    { to: '/my-investments', icon: '△', label: 'Portfolio' },
    { to: '/incoming-requests', icon: '□', label: 'Inbox' },
  ]},
  { label: 'TOOLS', items: [
    { to: '/profile', icon: '◎', label: 'My Profile' },
  ]},
];

const cofounderNav = [
  { label: 'WORKSPACE', items: [
    { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
    { to: '/startups', icon: '○', label: 'Startups' },
    { to: '/my-teams', icon: '△', label: 'My Teams' },
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
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      ))}
      <div className="sidebar-section" style={{ marginTop: 'auto' }}>
        <Link to="/profile" id="sidebar-profile" className={`sidebar-link${isActive('/profile') ? ' active' : ''}`}>
          <span className="sidebar-icon">👤</span>
          Profile
        </Link>
      </div>
    </aside>
  );
}
