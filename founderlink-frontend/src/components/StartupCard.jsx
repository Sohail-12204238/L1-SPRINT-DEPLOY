const STAGE_COLORS = {
  IDEA: { bg: 'rgba(99,102,241,0.1)', color: '#6366f1', label: '💡 Idea' },
  MVP: { bg: 'rgba(6,182,212,0.1)', color: '#0891b2', label: '⚙️ MVP' },
  EARLY_TRACTION: { bg: 'rgba(245,158,11,0.1)', color: '#b45309', label: '📈 Early Traction' },
  SCALING: { bg: 'rgba(16,185,129,0.1)', color: '#057642', label: '🚀 Scaling' },
};

export default function StartupCard({ startup, actions, compact = false }) {
  const stage = STAGE_COLORS[startup.stage] || {};

  return (
    <div className="card startup-card">
      {/* Stage badge top */}
      <div className="startup-card-header">
        <span
          className="startup-stage-badge"
          style={{ background: stage.bg, color: stage.color }}
        >
          {stage.label || startup.stage}
        </span>
        <span className="startup-industry-tag">{startup.industry}</span>
      </div>

      <h3 className="startup-card-name">{startup.name}</h3>
      <p className="startup-card-desc">{startup.description}</p>

      {!compact && (
        <>
          <div className="startup-detail-row">
            <div className="startup-detail">
              <span className="detail-label">Problem</span>
              <span className="detail-value">{startup.problemStatement}</span>
            </div>
            <div className="startup-detail">
              <span className="detail-label">Solution</span>
              <span className="detail-value">{startup.solution}</span>
            </div>
          </div>
        </>
      )}

      <div className="startup-card-footer">
        <div className="funding-goal">
          <span className="funding-label">Funding Goal</span>
          <span className="funding-amount">${startup.fundingGoal?.toLocaleString()}</span>
        </div>
        <div className="founder-email">{startup.founderEmail}</div>
      </div>

      {actions && <div className="startup-card-actions">{actions}</div>}

      <style>{`
        .startup-card { display: flex; flex-direction: column; gap: 0.85rem; }
        .startup-card-header { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
        .startup-stage-badge {
          font-size: 0.72rem; font-weight: 700; padding: 0.25rem 0.65rem;
          border-radius: 999px; letter-spacing: 0.3px;
        }
        .startup-industry-tag {
          font-size: 0.75rem; color: var(--text-3);
          border: 1px solid var(--border);
          padding: 0.2rem 0.55rem; border-radius: 999px;
        }
        .startup-card-name { font-size: 1.1rem; font-weight: 700; color: var(--text-1); }
        .startup-card-desc {
          font-size: 0.88rem; color: var(--text-2);
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .startup-detail-row { display: flex; flex-direction: column; gap: 0.6rem; }
        .startup-detail { display: flex; flex-direction: column; gap: 0.15rem; }
        .detail-label { font-size: 0.7rem; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.5px; }
        .detail-value { font-size: 0.83rem; color: var(--text-2);
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .startup-card-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: auto; padding-top: 0.75rem; border-top: 1px solid var(--border); }
        .funding-label { display: block; font-size: 0.68rem; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.4px; font-weight: 600; }
        .funding-amount { font-size: 1rem; font-weight: 800; color: var(--primary); }
        .founder-email { font-size: 0.75rem; color: var(--text-3); }
        .startup-card-actions { padding-top: 0.75rem; border-top: 1px solid var(--border); }
      `}</style>
    </div>
  );
}
