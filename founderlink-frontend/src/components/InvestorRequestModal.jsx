import { useState } from 'react';
import { investmentAPI } from '../api/services';
import Modal from './Modal';

export default function InvestorRequestModal({ startup, onClose }) {
  const [form, setForm] = useState({ investorEmail: '', proposedAmount: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await investmentAPI.sendRequest({
        startupId: startup.id,
        investorEmail: form.investorEmail,
        proposedAmount: parseFloat(form.proposedAmount),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request.');
    } finally {
      setLoading(false);
    }
  };

  const abbr = startup.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Modal title="Request Investor" onClose={onClose}>
      {/* Startup context */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '.75rem',
        background: 'var(--bg-app)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '.75rem 1rem', marginBottom: '1.25rem'
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9, background: 'rgba(5,118,66,.15)',
          color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '.72rem', fontWeight: 800, flexShrink: 0
        }}>{abbr}</div>
        <div>
          <p style={{ fontWeight: 700, color: 'var(--text-1)', fontSize: '.88rem' }}>{startup.name}</p>
          <p style={{ fontSize: '.75rem', color: 'var(--text-2)', marginTop: '.1rem' }}>
            {startup.industry} · {startup.stage?.replace('_', ' ')}
          </p>
        </div>
      </div>

      {success ? (
        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>📨</div>
          <p style={{ fontWeight: 700, color: 'var(--text-1)', marginBottom: '.4rem' }}>Request sent!</p>
          <p style={{ fontSize: '.85rem', color: 'var(--text-2)', marginBottom: '1.25rem' }}>
            The investor will be notified and can accept or reject your request.
          </p>
          <button id="req-close" className="btn btn-primary" onClick={onClose}>Done</button>
        </div>
      ) : (
        <>
          <p style={{ fontSize: '.84rem', color: 'var(--text-2)', marginBottom: '1.1rem' }}>
            Send a direct funding request to an investor. They can accept or reject it from their inbox.
          </p>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Investor Email</label>
              <input
                id="req-investor-email"
                type="email"
                className="form-input"
                placeholder="investor@example.com"
                value={form.investorEmail}
                onChange={e => setForm({ ...form, investorEmail: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Proposed Amount (₹)</label>
              <input
                id="req-amount"
                type="number"
                className="form-input"
                placeholder="e.g. 5000000"
                min={1}
                value={form.proposedAmount}
                onChange={e => setForm({ ...form, proposedAmount: e.target.value })}
                required
              />
              {form.proposedAmount && (
                <p style={{ fontSize: '.75rem', color: 'var(--text-3)', marginTop: '.3rem' }}>
                  = ₹{Number(form.proposedAmount).toLocaleString('en-IN')}
                </p>
              )}
            </div>
            <div style={{ display: 'flex', gap: '.75rem', marginTop: '.25rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
                Cancel
              </button>
              <button id="req-submit" type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2 }}>
                {loading ? 'Sending…' : 'Send Request →'}
              </button>
            </div>
          </form>
        </>
      )}
    </Modal>
  );
}
