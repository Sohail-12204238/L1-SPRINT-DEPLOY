import { useState } from 'react';
import { teamAPI } from '../api/services';
import Modal from './Modal';

export default function CofounderInviteModal({ cofounder, myStartups, onClose }) {
  const [form, setForm] = useState({ startupId: '', role: 'CTO' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const TEAM_ROLES = ['CTO', 'CPO', 'MARKETING_HEAD', 'ENGINEERING_LEAD'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await teamAPI.invite({
        startupId: parseInt(form.startupId),
        userEmail: cofounder.email,
        role: form.role
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send invite.');
    } finally {
      setLoading(false);
    }
  };

  const initials = cofounder.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'CF';

  return (
    <Modal title="Invite to Team" onClose={onClose}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '.75rem',
        background: 'rgba(255,255,255,.04)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '.75rem 1rem', marginBottom: '1.25rem'
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9, background: 'var(--purple-dim)',
          color: 'var(--purple)', display: 'flex', alignItems: 'center', justifyCenter: 'center',
          fontSize: '.85rem', fontWeight: 800, flexShrink: 0
        }}>{initials}</div>
        <div>
          <p style={{ fontWeight: 700, color: 'var(--text-1)', fontSize: '.88rem' }}>{cofounder.name}</p>
          <p style={{ fontSize: '.75rem', color: 'var(--text-3)', marginTop: '.1rem' }}>{cofounder.email}</p>
        </div>
      </div>

      {success ? (
        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>📩</div>
          <p style={{ fontWeight: 700, color: 'var(--text-1)', marginBottom: '.4rem' }}>Invite Sent!</p>
          <p style={{ fontSize: '.85rem', color: 'var(--text-2)', marginBottom: '1.25rem' }}>
            {cofounder.name} has been invited to join your team.
          </p>
          <button className="btn btn-primary" onClick={onClose}>Done</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select Startup</label>
            <select className="form-select" value={form.startupId} onChange={e => setForm({...form, startupId: e.target.value})} required>
              <option value="">Choose a startup...</option>
              {myStartups.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Role for {cofounder.name}</label>
            <select className="form-select" value={form.role} onChange={e => setForm({...form, role: e.target.value})} required>
              {TEAM_ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
            </select>
          </div>
          
          {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

          <div style={{ display: 'flex', gap: '.75rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading || !form.startupId} style={{ flex: 2 }}>
              {loading ? 'Sending...' : 'Send Invite →'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
