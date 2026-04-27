import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-page">
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-glow g1" />
        <div className="hero-glow g2" />

        <div className="hero-inner">
          <div className="hero-pill">🚀 The Startup Ecosystem Platform</div>

          <h1 className="hero-h1">
            Connect <span className="h-purple">Founders</span>
            {' '}with the Right{' '}
            <span className="h-green">Investors</span>
          </h1>

          <p className="hero-p">
            FounderLink is a microservices-powered platform where startup founders raise capital,
            build dream teams, and investors discover the next big opportunity — all in one place.
          </p>

          <div className="hero-cta">
            {isAuthenticated ? (
              <Link to="/dashboard" id="hero-dashboard" className="btn btn-primary btn-xl">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" id="hero-register" className="btn btn-primary btn-xl">
                  Get started free →
                </Link>
                <Link to="/login" id="hero-login" className="btn btn-secondary btn-xl">
                  Sign in
                </Link>
              </>
            )}
          </div>

          {/* Floating chips */}
          <div className="hero-chips">
            {['🔐 JWT Auth', '⚡ Microservices', '📊 Investment Flows', '👥 Team Building', '🔔 RabbitMQ Events'].map((c) => (
              <span key={c} className="hero-chip">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ──────────────────────────────────────────────── */}
      <section className="stats-bar">
        {[
          { val: '₹48Cr+', label: 'Total funded' },
          { val: '1,240',  label: 'Founders' },
          { val: '380',    label: 'Investors' },
          { val: '500+',   label: 'Startups listed' },
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
          <p className="section-eyebrow">Platform Features</p>
          <h2 className="section-h2">Everything you need to build and fund</h2>

          <div className="features-grid">
            {[
              { icon: '🎯', title: 'For Founders', desc: 'Launch your startup, manage your cap table, invite team members and get discovered by top investors.', color: '#6c5ce7' },
              { icon: '💰', title: 'For Investors', desc: 'Browse curated startups, submit investments, receive founder outreach and track your portfolio.', color: '#00c853' },
              { icon: '👥', title: 'Team Building', desc: 'Invite CTO, CPO, Marketing Head and Engineering Lead to your startup with role-based access.', color: '#f59e0b' },
              { icon: '🔐', title: 'Secure by Design', desc: 'JWT via API Gateway, role-based Spring Security, header propagation between services.', color: '#06b6d4' },
              { icon: '⚡', title: 'Microservices', desc: 'Spring Boot microservices with Eureka discovery, API Gateway, and Docker Compose deployment.', color: '#8b5cf6' },
              { icon: '🔔', title: 'Real-time Events', desc: 'RabbitMQ event bus triggers instant notifications for investments, approvals, and invites.', color: '#ef4444' },
            ].map((f) => (
              <div key={f.title} className="feat-card" style={{ '--c': f.color }}>
                <div className="feat-icon" style={{ background: f.color + '20', color: f.color }}>{f.icon}</div>
                <h3 className="feat-title">{f.title}</h3>
                <p className="feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────────────────── */}
      <section className="how-section">
        <div className="how-inner">
          <p className="section-eyebrow">How it works</p>
          <h2 className="section-h2">Get started in 3 simple steps</h2>

          <div className="steps-row">
            {[
              { num: '1', title: 'Create your account', desc: 'Sign up as a Founder, Investor, or Co-founder. Each role unlocks a tailored dashboard.' },
              { num: '2', title: 'List or discover', desc: 'Founders publish startups. Investors browse verified listings with funding progress.' },
              { num: '3', title: 'Connect & grow', desc: 'Submit investments, send requests, build teams — all tracked with real-time status updates.' },
            ].map((s) => (
              <div key={s.num} className="step-card">
                <div className="step-num">{s.num}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────────── */}
      {!isAuthenticated && (
        <section className="cta-section">
          <div className="cta-box">
            <h2 className="cta-h2">Ready to build the future?</h2>
            <p className="cta-p">Join 1,620+ founders and investors already on FounderLink</p>
            <Link to="/register" id="cta-register" className="btn btn-primary btn-xl">
              Create Free Account →
            </Link>
          </div>
        </section>
      )}

      {/* ─── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="footer-brand">
          <span className="footer-icon">🔗</span>
          <span className="footer-name">FounderLink</span>
        </div>
        <p className="footer-copy">© 2026 FounderLink. Built with Spring Boot microservices.</p>
      </footer>

      <style>{`
        .landing-page{ padding-top: 60px; }

        /* Hero */
        .hero-section{
          min-height: 88vh; display: flex; align-items: center; justify-content: center;
          text-align: center; padding: 4rem 1.5rem 2rem; position: relative; overflow: hidden;
        }
        .hero-glow{
          position: absolute; border-radius: 50%; pointer-events: none; filter: blur(90px);
        }
        .g1{ width:500px; height:500px; background:radial-gradient(circle,rgba(108,92,231,.22) 0%,transparent 70%); top:-150px; left:-150px; }
        .g2{ width:400px; height:400px; background:radial-gradient(circle,rgba(0,200,83,.12) 0%,transparent 70%); bottom:-100px; right:-100px; }

        .hero-inner{ position: relative; z-index: 1; max-width: 800px; }

        .hero-pill{
          display: inline-flex; align-items: center; gap: .4rem;
          background: rgba(108,92,231,.12); border: 1px solid rgba(108,92,231,.3);
          color: #a78bfa; padding: .38rem 1rem; border-radius: 999px;
          font-size: .83rem; font-weight: 600; margin-bottom: 1.75rem;
          animation: fadeUp .5s ease both;
        }
        .hero-h1{
          font-size: clamp(2.4rem, 6vw, 4.2rem);
          font-weight: 900; line-height: 1.1; letter-spacing: -1.5px;
          color: #fff; margin-bottom: 1.1rem;
          animation: fadeUp .5s .08s ease both;
        }
        .h-purple{ background:linear-gradient(135deg,#6c5ce7,#a78bfa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .h-green{ background:linear-gradient(135deg,#00c853,#6ee7b7); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

        .hero-p{
          font-size: 1.05rem; color: rgba(255,255,255,.6); max-width: 580px;
          margin: 0 auto 2.25rem; line-height: 1.7;
          animation: fadeUp .5s .16s ease both;
        }
        .hero-cta{ display:flex; gap:.85rem; justify-content:center; flex-wrap:wrap; animation: fadeUp .5s .24s ease both; }

        .hero-chips{
          display:flex; flex-wrap:wrap; gap:.5rem; justify-content:center;
          margin-top: 2.75rem; animation: fadeUp .5s .32s ease both;
        }
        .hero-chip{
          background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
          color: rgba(255,255,255,.55); padding: .3rem .8rem;
          border-radius: 999px; font-size: .8rem; font-weight: 500;
        }

        /* Stats bar */
        .stats-bar{
          display:flex; justify-content:center; gap:0;
          background: #1a1a26; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
          padding: 1.5rem;
        }
        .stats-bar-item{
          flex:1; max-width:180px; text-align:center;
          padding: .5rem 1rem;
          border-right: 1px solid var(--border);
        }
        .stats-bar-item:last-child{ border-right:none; }
        .stats-bar-val{ display:block; font-size:1.6rem; font-weight:800; color:#fff; }
        .stats-bar-label{ display:block; font-size:.75rem; color:var(--text-3); margin-top:.15rem; font-weight:500; }

        /* Features */
        .features-section{ padding: 5rem 1.5rem; }
        .features-inner{ max-width:1100px; margin:0 auto; }
        .section-eyebrow{ font-size:.78rem; font-weight:700; color:var(--purple); text-transform:uppercase; letter-spacing:.08em; margin-bottom:.75rem; }
        .section-h2{ font-size:1.9rem; font-weight:800; color:#fff; margin-bottom:2.5rem; letter-spacing:-.5px; }
        .features-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:1.25rem; }
        .feat-card{
          background:#1a1a26; border:1px solid var(--border);
          border-radius:16px; padding:1.6rem;
          transition:all .22s; position:relative; overflow:hidden;
        }
        .feat-card::after{ content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:var(--c); opacity:0; transition:opacity .22s; }
        .feat-card:hover{ border-color:var(--c); transform:translateY(-3px); box-shadow:0 8px 30px rgba(0,0,0,.35); }
        .feat-card:hover::after{ opacity:.8; }
        .feat-icon{ width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.4rem; margin-bottom:1rem; }
        .feat-title{ font-size:.97rem; font-weight:700; color:#fff; margin-bottom:.5rem; }
        .feat-desc{ font-size:.84rem; color:var(--text-2); line-height:1.6; }

        /* How it works */
        .how-section{ padding:4rem 1.5rem; background:#1a1a26; border-top:1px solid var(--border); }
        .how-inner{ max-width:900px; margin:0 auto; }
        .steps-row{ display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; }
        .step-card{ text-align:center; padding:1.5rem; }
        .step-num{
          width:48px; height:48px; border-radius:50%;
          background:var(--purple-dim); border:2px solid var(--purple-border);
          color:var(--purple); font-size:1.1rem; font-weight:800;
          display:flex; align-items:center; justify-content:center;
          margin:0 auto 1rem;
        }
        .step-title{ font-size:.97rem; font-weight:700; color:#fff; margin-bottom:.5rem; }
        .step-desc{ font-size:.84rem; color:var(--text-2); line-height:1.6; }

        /* CTA */
        .cta-section{ padding:5rem 1.5rem; }
        .cta-box{
          max-width:560px; margin:0 auto; text-align:center;
          background:rgba(108,92,231,.07); border:1px solid rgba(108,92,231,.2);
          border-radius:24px; padding:3rem 2rem;
          box-shadow:0 0 80px rgba(108,92,231,.1);
        }
        .cta-h2{ font-size:1.7rem; font-weight:800; color:#fff; margin-bottom:.65rem; }
        .cta-p{ color:var(--text-2); margin-bottom:1.75rem; font-size:.93rem; }

        /* Footer */
        .landing-footer{
          border-top:1px solid var(--border);
          padding:1.75rem 2rem;
          display:flex; align-items:center; justify-content:space-between;
          flex-wrap:wrap; gap:.75rem;
        }
        .footer-brand{ display:flex; align-items:center; gap:.5rem; }
        .footer-icon{ font-size:1.1rem; }
        .footer-name{ font-size:.95rem; font-weight:700; color:#fff; }
        .footer-copy{ font-size:.8rem; color:var(--text-3); }

        @keyframes fadeUp{ from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }

        @media(max-width:600px){
          .steps-row{ grid-template-columns:1fr; }
          .stats-bar{ flex-wrap:wrap; }
          .stats-bar-item{ border-right:none; border-bottom:1px solid var(--border); max-width:100%; }
        }
      `}</style>
    </div>
  );
}
