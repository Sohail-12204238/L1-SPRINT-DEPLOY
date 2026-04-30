import { useState } from 'react';
import { investmentAPI } from '../api/services';
import Modal from './Modal';

export default function FounderPitchModal({ investor, myStartups, onClose }) {
  const [form, setForm] = useState({ startupId: '', proposedAmount: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await investmentAPI.sendRequest({
        startupId: parseInt(form.startupId),
        investorEmail: investor.email,
        proposedAmount: parseFloat(form.proposedAmount),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request.');
    } finally {
      setLoading(false);
    }
  };

  const initials = investor.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'IN';

  return (
    <Modal title="Pitch to Investor" onClose={onClose}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '.75rem',
        background: 'rgba(255,255,255,.04)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '.75rem 1rem', marginBottom: '1.25rem'
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9, background: 'var(--purple-dim)',
          color: 'var(--purple)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '.85rem', fontWeight: 800, flexShrink: 0
        }}>{initials}</div>
        <div>
          <p style={{ fontWeight: 700, color: 'var(--text-1)', fontSize: '.88rem' }}>{investor.name}</p>
          <p style={{ fontSize: '.75rem', color: 'var(--text-3)', marginTop: '.1rem' }}>{investor.email}</p>
        </div>
      </div>

      {success ? (
        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>🚀</div>
          <p style={{ fontWeight: 700, color: 'var(--text-1)', marginBottom: '.4rem' }}>Pitch Sent!</p>
          <p style={{ fontSize: '.85rem', color: 'var(--text-2)', marginBottom: '1.25rem' }}>
            {investor.name} has been notified and will review your startup.
          </p>
          <button className="btn btn-primary" onClick={onClose}>Done</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select Startup to Pitch</label>
            <select className="form-select" value={form.startupId} onChange={e => setForm({...form, startupId: e.target.value})} required>
              <option value="">Choose a startup...</option>
              {myStartups.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Proposed Funding Amount (₹)</label>
            <input type="number" className="form-input" placeholder="e.g. 5000000" 
              value={form.proposedAmount} onChange={e => setForm({...form, proposedAmount: e.target.value})} required />
          </div>
          
          {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

          <div style={{ display: 'flex', gap: '.75rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading || !form.startupId} style={{ flex: 2 }}>
              {loading ? 'Sending...' : 'Send Pitch →'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
