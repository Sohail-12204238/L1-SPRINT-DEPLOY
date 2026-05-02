import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-page">
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-inner fade-up">
          <div className="hero-pill">Intelligence Startup Ecosystem</div>

          <h1 className="hero-h1">
            The best <span className="h-accent">strategic</span>
            <br /> solutions.
          </h1>

          <p className="hero-p">
            FounderLink is a modern microservices platform where visionary founders secure capital and strategic investors discover the next scale opportunity.
          </p>

          <div className="hero-cta">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary">Go to workspace</Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">Get started</Link>
                <Link to="/login" className="btn btn-secondary">Sign in</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ──────────────────────────────────────────────── */}
      <section className="stats-bar">
        {[
          { val: '₹48Cr+', label: 'Total funded' },
          { val: '1,240',  label: 'Founders' },
          { val: '380',    label: 'Investors' },
          { val: '500+',   label: 'Startups' },
        ].map((s) => (
          <div key={s.label} className="stats-bar-item">
            <span className="stats-bar-val">{s.val}</span>
            <span className="stats-bar-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ─── FEATURES ───────────────────────────────────────────────── */}
      <section className="features-section">
        <div className="features-inner">
          <p className="section-eyebrow">Core Capabilities</p>
          <h2 className="section-h2">Built for scale and performance</h2>

          <div className="features-grid">
            {[
              { title: 'Founder Hub', desc: 'Launch startups, manage cap tables, and attract vetted investors.' },
              { title: 'Investor Portal', desc: 'Browse curated listings and deploy capital with confidence.' },
              { title: 'Team Sync', desc: 'Build your core team with role-based access and invites.' },
              { title: 'Secure Gateway', desc: 'JWT authentication via API Gateway with header propagation.' },
              { title: 'Microservices', desc: 'Distributed architecture with Eureka and Docker deployment.' },
              { title: 'Real-time Events', desc: 'RabbitMQ event bus for instant cross-service notifications.' },
            ].map((f) => (
              <div key={f.title} className="feat-card">
                <div className="feat-indicator" />
                <h3 className="feat-title">{f.title}</h3>
                <p className="feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="footer-brand" style={{ display: 'flex', justifyContent: 'center' }}>
          <Logo size={32} />
        </div>
        <p className="footer-copy">© 2026 FounderLink. Powered by Strategic Intelligence.</p>
      </footer>

      <style>{`
        .landing-page{ background: #fff; overflow-x: hidden; }

        .hero-section{
          min-height: 85vh; display: flex; align-items: center; justify-content: center;
          text-align: center; padding: 4rem 2rem; position: relative;
          background: linear-gradient(180deg, #f8fafc 0%, #eef2f6 100%);
        }
        .hero-inner{ max-width: 900px; }
        .hero-pill{
          display: inline-block; padding: 0.5rem 1rem; border: 1px solid var(--border);
          color: var(--primary); font-size: 0.75rem; font-weight: 600;
          margin-bottom: 2rem; background: var(--primary-dim); border-radius: 20px;
          border-color: rgba(5, 118, 66, 0.2);
        }
        .hero-h1{
          font-size: clamp(2.5rem, 8vw, 4.5rem); font-weight: 700; line-height: 1.1;
          color: var(--text-1); margin-bottom: 2rem; letter-spacing: -2px;
        }
        .h-accent{ color: var(--primary); }
        .hero-p{
          font-size: 1.125rem; color: var(--text-2); max-width: 600px;
          margin: 0 auto 3rem; line-height: 1.6; font-weight: 400;
        }
        .hero-cta{ display:flex; gap:1.5rem; justify-content:center; }

        .stats-bar{
          display:flex; justify-content:center; background: #fff;
          border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
          padding: 3rem 1.5rem;
        }
        .stats-bar-item{ flex:1; max-width:280px; text-align:center; border-right: 1px solid var(--border); }
        .stats-bar-item:last-child{ border-right:none; }
        .stats-bar-val{ display:block; font-size:2.5rem; font-weight:700; color:var(--text-1); }
        .stats-bar-label{ display:block; font-size:0.875rem; color:var(--text-2); margin-top:0.5rem; font-weight:500; }

        .features-section{ padding: 8rem 2rem; background: var(--bg-app); }
        .features-inner{ max-width:1100px; margin:0 auto; }
        .section-eyebrow{ font-size:0.875rem; font-weight:600; color:var(--primary); margin-bottom:1rem; }
        .section-h2{ font-size:2.5rem; font-weight:700; color:var(--text-1); margin-bottom:4rem; letter-spacing: -1px; }
        .features-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:1.5rem; }
        .feat-card{
          background:#fff; border: 1px solid var(--border);
          padding:2rem; position:relative; transition:var(--transition);
          border-radius: var(--radius-md);
        }
        .feat-card:hover{ box-shadow: 0 4px 16px rgba(0,0,0,0.08); transform:translateY(-3px); }
        .feat-indicator{ position:absolute; top:0; left:0; width:4px; height:0; background:var(--primary); transition:height 0.3s; border-radius: 4px 0 0 0; }
        .feat-card:hover .feat-indicator{ height:100%; }
        .feat-title{ font-size:1rem; font-weight:600; color:var(--text-1); margin-bottom:0.75rem; }
        .feat-desc{ font-size:0.875rem; color:var(--text-2); line-height:1.6; }

        .landing-footer{
          border-top:1px solid var(--border); padding:3rem 2rem;
          display:flex; align-items:center; justify-content:space-between;
          background: #fff;
        }
        .footer-name{ font-size:1rem; font-weight:600; color:var(--text-1); }
        .footer-copy{ font-size:0.875rem; color:var(--text-3); }

        @media(max-width:768px){
          .stats-bar{ flex-direction: column; }
          .stats-bar-item{ border-right:none; border-bottom:1px solid var(--border); padding-bottom:2rem; margin-bottom:2rem; max-width:100%; }
          .stats-bar-item:last-child{ border-bottom:none; margin-bottom:0; padding-bottom:0; }
          .hero-cta{ flex-direction:column; }
        }
      `}</style>
    </div>
  );
}
