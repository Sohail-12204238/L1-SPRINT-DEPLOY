import { useState } from 'react';
import { investmentAPI } from '../api/services';
import Modal from './Modal';

export default function InvestModal({ startup, onClose }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      await investmentAPI.create({ startupId: startup.id, amount: parseFloat(amount) });
      setSuccess('Investment submitted! The founder will review your request.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit investment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`💰 Invest in ${startup.name}`} onClose={onClose}>
      <p style={{ color: 'rgba(241,245,249,0.6)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
        Your investment will be marked <strong style={{ color: '#fcd34d' }}>PENDING</strong> until the founder approves it.
      </p>

      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {success && (
        <div className="alert alert-success">
          ✅ {success}
          <button className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }} onClick={onClose}>Close</button>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Investment Amount (USD)</label>
            <input
              id="invest-amount"
              type="number"
              className="form-input"
              placeholder="e.g. 50000"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
            <button id="invest-submit" type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2 }}>
              {loading ? 'Submitting…' : 'Submit Investment'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
