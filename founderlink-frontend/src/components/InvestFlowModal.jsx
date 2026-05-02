import { useState } from 'react';
import { investmentAPI } from '../api/services';
import Modal from './Modal';

const STEPS = [
  { id: 1, label: 'Amount' },
  { id: 2, label: 'Instrument' },
  { id: 3, label: 'Confirm' },
  { id: 4, label: 'Done' },
];

const QUICK = [
  { label: '₹10L', value: 1000000, tag: 'Quick select' },
  { label: '₹25L', value: 2500000, tag: 'Popular' },
  { label: '₹50L', value: 5000000, tag: '' },
];

export default function InvestFlowModal({ startup, onClose }) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(1000000);
  const [instrument, setInstrument] = useState('SAFE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fundingGoal = startup.fundingGoal || 10000000;
  const alreadyRaised = Math.floor(fundingGoal * 0.92);
  const remaining = fundingGoal - alreadyRaised;
  const pct = Math.round((amount / fundingGoal) * 100);

  const abbr = startup.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

  const formatINR = (val) => `₹${(val/100000).toFixed(0)}L`;
  const formatFull = (val) => `₹${val.toLocaleString('en-IN')}`;

  const stepState = (id) => {
    if (id < step) return 'done';
    if (id === step) return 'active';
    return 'idle';
  };

  const handleConfirm = async () => {
    setLoading(true); setError('');
    try {
      await investmentAPI.create({ startupId: startup.id, amount });
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <Modal title="" onClose={onClose} wide>
      {/* Stepper */}
      <div className="flow-stepper">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flow-step-item">
            <div className={`flow-step-num ${stepState(s.id)}`}>
              {stepState(s.id) === 'done' ? '✓' : s.id}
            </div>
            <span className={`flow-step-label ${stepState(s.id)}`}>{s.label}</span>
            {i < STEPS.length - 1 && <div className="flow-step-line" />}
          </div>
        ))}
      </div>

      <div className="flow-body">
        {/* Left panel */}
        <div className="flow-left">
          {step === 1 && (
            <>
              <h2 className="flow-panel-title">Investment amount</h2>
              <p className="flow-panel-sub">Minimum ₹5L · Maximum ₹50L per investor</p>

              <div className="flow-amount-display">
                <span className="flow-label">Amount</span>
                <span className="flow-big-amount">{formatFull(amount)}</span>
              </div>

              {/* Slider */}
              <input
                id="invest-slider"
                type="range"
                min={500000}
                max={5000000}
                step={100000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="flow-slider"
              />
              <div className="flow-slider-labels">
                <span>₹5L</span><span>₹50L</span>
              </div>

              <div className="flow-quick-row">
                {QUICK.map((q) => (
                  <button
                    key={q.value}
                    id={`quick-${q.label}`}
                    className={`flow-quick-btn${amount === q.value ? ' selected' : ''}`}
                    onClick={() => setAmount(q.value)}
                  >
                    <span>{q.label}</span>
                    {q.tag && <span className="flow-quick-tag">{q.tag}</span>}
                  </button>
                ))}
              </div>

              {error && <div className="alert alert-error">⚠️ {error}</div>}

              <button id="flow-next-1" className="btn btn-primary btn-full" style={{ marginTop: '.5rem' }}
                onClick={() => setStep(2)}>
                Continue to Instrument →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="flow-panel-title">Investment instrument</h2>
              <p className="flow-panel-sub">Select how you'd like to invest.</p>
              <div className="instrument-options">
                {['SAFE', 'EQUITY', 'CONVERTIBLE_NOTE'].map((inst) => (
                  <label key={inst} className={`instrument-opt${instrument === inst ? ' selected' : ''}`}>
                    <input type="radio" name="instrument" value={inst}
                      checked={instrument === inst}
                      onChange={() => setInstrument(inst)} />
                    <div>
                      <div className="inst-name">{inst.replace('_', ' ')}</div>
                      <div className="inst-desc">
                        {inst === 'SAFE' ? 'Simple Agreement for Future Equity — most common early-stage.'
                          : inst === 'EQUITY' ? 'Direct equity stake in the company.'
                          : 'Converts to equity at next funding round.'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '.75rem', marginTop: '.75rem' }}>
                <button className="btn btn-secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>← Back</button>
                <button id="flow-next-2" className="btn btn-primary" onClick={() => setStep(3)} style={{ flex: 2 }}>Continue to Confirm →</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="flow-panel-title">Confirm investment</h2>
              <p className="flow-panel-sub">Review your investment details before confirming.</p>
              <div className="confirm-details">
                <div className="confirm-row"><span>Amount</span><strong>{formatFull(amount)}</strong></div>
                <div className="confirm-row"><span>Instrument</span><strong>{instrument.replace('_', ' ')}</strong></div>
                <div className="confirm-row"><span>Startup</span><strong>{startup.name}</strong></div>
              </div>
              {error && <div className="alert alert-error">⚠️ {error}</div>}
              <div style={{ display: 'flex', gap: '.75rem', marginTop: '.75rem' }}>
                <button className="btn btn-secondary" onClick={() => setStep(2)} style={{ flex: 1 }}>← Back</button>
                <button id="flow-confirm" className="btn btn-primary" disabled={loading} onClick={handleConfirm} style={{ flex: 2 }}>
                  {loading ? 'Submitting…' : 'Confirm Investment →'}
                </button>
              </div>
            </>
          )}

          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <h2 className="flow-panel-title">Investment submitted!</h2>
              <p style={{ color: 'var(--text-2)', marginBottom: '1.5rem' }}>
                Your investment of {formatFull(amount)} in {startup.name} is now <strong style={{ color: 'var(--warning)' }}>PENDING</strong> review.
              </p>
              <button id="flow-done" className="btn btn-primary" onClick={onClose}>Done</button>
            </div>
          )}
        </div>

        {/* Right panel (summary card) */}
        {step < 4 && (
          <div className="flow-right">
            <div className="flow-summary-card">
              <div className="flow-sum-header">
                <div className="scn-abbr" style={{ background: 'rgba(5,118,66,.15)', color: 'var(--primary)', width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.78rem', fontWeight: 800 }}>{abbr}</div>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--text-1)', fontSize: '.92rem' }}>{startup.name}</p>
                  <p style={{ fontSize: '.75rem', color: 'var(--text-2)', marginTop: '.1rem' }}>
                    {startup.stage?.replace('_', ' ')} · {startup.industry}
                  </p>
                </div>
              </div>
              <div className="divider" />
              <div className="flow-sum-row">
                <span>Funding ask</span>
                <strong>{formatFull(fundingGoal)}</strong>
              </div>
              <div className="flow-sum-row">
                <span>Already raised</span>
                <strong style={{ color: 'var(--success)' }}>{formatFull(alreadyRaised)}</strong>
              </div>
              <div className="flow-sum-row">
                <span>Remaining</span>
                <strong style={{ color: 'var(--success)' }}>{formatFull(remaining)}</strong>
              </div>
              <div className="progress-track" style={{ margin: '.75rem 0' }}>
                <div className="progress-fill" style={{ width: `${Math.round(alreadyRaised/fundingGoal*100)}%` }} />
              </div>
              <div className="divider" />
              <p style={{ fontSize: '.75rem', color: 'var(--text-3)', marginBottom: '.35rem' }}>Your investment</p>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{formatFull(amount)}</p>
              <p style={{ fontSize: '.78rem', color: 'var(--text-2)' }}>~{pct}% of funding ask</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .flow-stepper{display:flex;align-items:center;gap:.4rem;margin-bottom:1.5rem;}
        .flow-step-item{display:flex;align-items:center;gap:.4rem;}
        .flow-step-num{
          width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;
          font-size:.75rem;font-weight:700;flex-shrink:0;transition:all .2s;
        }
        .flow-step-num.done{background:var(--primary);color:#fff;}
        .flow-step-num.active{background:var(--primary);color:#fff;}
        .flow-step-num.idle{background:var(--bg-hover);color:var(--text-3);border:1px solid var(--border);}
        .flow-step-label{font-size:.82rem;font-weight:500;}
        .flow-step-label.active{color:var(--text-1);}
        .flow-step-label.done{color:var(--text-2);}
        .flow-step-label.idle{color:var(--text-3);}
        .flow-step-line{flex:1;height:1px;background:var(--border);min-width:30px;}

        .flow-body{display:flex;gap:1.5rem;align-items:flex-start;}
        .flow-left{flex:1;min-width:0;}
        .flow-right{width:220px;flex-shrink:0;}

        .flow-panel-title{font-size:1.1rem;font-weight:700;color:var(--text-1);margin-bottom:.3rem;}
        .flow-panel-sub{font-size:.82rem;color:var(--text-2);margin-bottom:1.25rem;}

        .flow-amount-display{display:flex;flex-direction:column;margin-bottom:.75rem;}
        .flow-label{font-size:.75rem;color:var(--text-2);font-weight:600;text-transform:uppercase;letter-spacing:.04em;}
        .flow-big-amount{font-size:1.65rem;font-weight:800;color:var(--primary);}

        .flow-slider{
          width:100%;margin:.25rem 0 .4rem;
          -webkit-appearance:none;height:4px;border-radius:2px;
          background:var(--border);outline:none;cursor:pointer;
        }
        .flow-slider::-webkit-slider-thumb{
          -webkit-appearance:none;width:18px;height:18px;border-radius:50%;
          background:var(--primary);cursor:pointer;box-shadow:0 0 0 3px rgba(5,118,66,.3);
        }
        .flow-slider-labels{display:flex;justify-content:space-between;font-size:.72rem;color:var(--text-3);margin-bottom:.85rem;}

        .flow-quick-row{display:flex;gap:.6rem;margin-bottom:1.1rem;flex-wrap:wrap;}
        .flow-quick-btn{
          flex:1;background:var(--bg-app);border:1px solid var(--border);
          color:var(--text-1);border-radius:var(--radius-sm);padding:.6rem .75rem;
          cursor:pointer;text-align:left;transition:all .18s;font-family:'Inter',sans-serif;
          display:flex;flex-direction:column;gap:.15rem;
        }
        .flow-quick-btn:hover{border-color:var(--primary);background:var(--primary-dim);}
        .flow-quick-btn.selected{border-color:var(--primary);background:var(--primary-dim);}
        .flow-quick-btn span:first-child{font-size:.92rem;font-weight:700;}
        .flow-quick-tag{font-size:.68rem;color:var(--text-3);}

        .flow-summary-card{
          background:var(--bg-app);border:1px solid var(--border);
          border-radius:var(--radius-md);padding:1.1rem;
        }
        .flow-sum-header{display:flex;align-items:center;gap:.7rem;margin-bottom:.75rem;}
        .flow-sum-row{display:flex;justify-content:space-between;margin-bottom:.5rem;font-size:.83rem;color:var(--text-2);}
        .flow-sum-row strong{color:var(--text-1);}

        .instrument-options{display:flex;flex-direction:column;gap:.6rem;margin-bottom:1rem;}
        .instrument-opt{
          display:flex;align-items:flex-start;gap:.75rem;
          background:var(--bg-app);border:1px solid var(--border);
          border-radius:var(--radius-sm);padding:.85rem;cursor:pointer;transition:all .18s;
        }
        .instrument-opt.selected{border-color:var(--primary);background:var(--primary-dim);}
        .instrument-opt input[type=radio]{accent-color:var(--primary);margin-top:.2rem;flex-shrink:0;}
        .inst-name{font-size:.88rem;font-weight:600;color:var(--text-1);}
        .inst-desc{font-size:.78rem;color:var(--text-2);margin-top:.2rem;line-height:1.4;}

        .confirm-details{display:flex;flex-direction:column;gap:.5rem;margin-bottom:1rem;}
        .confirm-row{display:flex;justify-content:space-between;padding:.75rem;background:var(--bg-app);border-radius:8px;font-size:.87rem;color:var(--text-2);}
        .confirm-row strong{color:var(--text-1);}

        @media(max-width:600px){
          .flow-body{flex-direction:column;}
          .flow-right{width:100%;}
        }
      `}</style>
    </Modal>
  );
}
