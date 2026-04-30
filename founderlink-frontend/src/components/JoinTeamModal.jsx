import { useState } from 'react';
import { teamAPI } from '../api/services';

export default function JoinTeamModal({ startup, onClose }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleJoin = async () => {
    setLoading(true);
    try {
      await teamAPI.join({ startupId: startup.id });
      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch (err) {
      alert('Failed to send join request. Maybe you are already a member?');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Join {startup.name}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body" style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          {success ? (
            <div className="fade-in">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <h3 style={{ color: 'var(--green)' }}>Request Sent!</h3>
              <p style={{ color: 'var(--text-2)' }}>The founder has been notified.</p>
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--text-1)', marginBottom: '1.5rem' }}>
                Are you sure you want to request to join the team for <strong>{startup.name}</strong>?
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={handleJoin} disabled={loading}>
                  {loading ? 'Sending...' : 'Confirm Request'}
                </button>
                <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
