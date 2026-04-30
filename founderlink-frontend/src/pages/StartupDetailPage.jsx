import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { startupAPI, milestoneAPI } from '../api/services';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function StartupDetailsPage() {
  const { id } = useParams();
  const { role } = useAuth();
  const cleanRole = role?.replace('ROLE_', '') || '';
  const [startup, setStartup] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ title: '', description: '', targetDate: '' });
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    Promise.all([
      startupAPI.getById(id),
      milestoneAPI.getByStartup(id)
    ]).then(([sRes, mRes]) => {
      setStartup(sRes.data);
      setMilestones(mRes.data || []);
    }).catch(() => setError('Failed to load details.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    try {
      const res = await milestoneAPI.create({ ...newMilestone, startupId: id });
      setMilestones([...milestones, res.data]);
      setShowAddMilestone(false);
      setNewMilestone({ title: '', description: '', targetDate: '' });
    } catch (err) { alert('Failed to add milestone'); }
  };

  const handleRequestToJoin = async () => {
    setIsRequesting(true);
    try {
      // Need to import teamAPI at the top
      const { teamAPI } = await import('../api/services');
      await teamAPI.requestJoin({ startupId: id });
      alert('Join request sent successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send request. You may have already requested.');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleUpdateStatus = async (mId, status) => {
    try {
      const res = await milestoneAPI.updateStatus(mId, status);
      setMilestones(milestones.map(m => m.id === mId ? res.data : m));
    } catch (err) { alert('Failed to update milestone'); }
  };

  if (loading) return <div className="app-shell"><main className="main-content"><div className="spinner-wrap"><div className="spinner" /></div></main></div>;
  if (error) return <div className="app-shell"><main className="main-content"><div className="alert alert-error">{error}</div></main></div>;
  if (!startup) return <div className="app-shell"><main className="main-content"><div className="empty">Startup not found</div></main></div>;

  const isManagement = cleanRole === 'FOUNDER' || cleanRole === 'COFOUNDER';

  return (
    <div className="app-shell">
      <Sidebar role={cleanRole} />
      <main className="main-content">
        <div className="fade-up">
          <Link to="/startups" className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem', background: 'var(--bg-card)' }}>← Back to startups</Link>
          
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 600, color: 'var(--text-1)' }}>{startup.name}</h1>
              <span className="badge badge-live">Active</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
              <div>
                <h3 style={{ fontSize: '0.875rem', color: 'var(--text-1)', fontWeight: 600, marginBottom: '0.75rem' }}>Description</h3>
                <p style={{ color: 'var(--text-2)', lineHeight: 1.6, fontSize: '0.875rem' }}>{startup.description}</p>
                
                <div style={{ marginTop: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '2.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-2)', display: 'block', fontWeight: 500, marginBottom: '0.25rem' }}>Target funding</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-1)', fontSize: '1.25rem' }}>₹{startup.fundingGoal?.toLocaleString()}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-2)', display: 'block', fontWeight: 500, marginBottom: '0.25rem' }}>Current raised</span>
                    <span style={{ fontWeight: 600, color: 'var(--success)', fontSize: '1.25rem' }}>₹{startup.currentFunding?.toLocaleString() || 0}</span>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '1.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '0.875rem', color: 'var(--text-1)', fontWeight: 600, marginBottom: '1.25rem' }}>Startup info</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--text-2)', fontSize: '0.875rem', fontWeight: 500 }}>Founder</span>
                    <span style={{ color: 'var(--text-1)', fontWeight: 500, fontSize: '0.875rem' }}>{startup.founderEmail}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--text-2)', fontSize: '0.875rem', fontWeight: 500 }}>Industry</span>
                    <span style={{ color: 'var(--text-1)', fontWeight: 500, fontSize: '0.875rem' }}>{startup.industry}</span>
                  </div>
                </div>

                {cleanRole === 'INVESTOR' && (
                  <button className="btn btn-primary btn-full" style={{ marginTop: '1.5rem' }}>Invest now</button>
                )}
                {cleanRole === 'COFOUNDER' && (
                  <button 
                    className="btn btn-primary btn-full" 
                    style={{ marginTop: '1.5rem' }} 
                    onClick={handleRequestToJoin} 
                    disabled={isRequesting}
                  >
                    {isRequesting ? 'Requesting...' : 'Request to join team'}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-1)' }}>Milestones</h2>
              {isManagement && (
                <button className="btn btn-primary btn-sm" onClick={() => setShowAddMilestone(true)}>+ Add new</button>
              )}
            </div>

            {showAddMilestone && (
              <form onSubmit={handleAddMilestone} style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input className="form-input" placeholder="e.g. Launch Beta" value={newMilestone.title} onChange={e => setNewMilestone({...newMilestone, title: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Target date</label>
                  <input type="date" className="form-input" value={newMilestone.targetDate} onChange={e => setNewMilestone({...newMilestone, targetDate: e.target.value})} required />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn btn-primary">Save</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddMilestone(false)}>Cancel</button>
                </div>
              </form>
            )}

            {milestones.length === 0 ? (
              <p style={{ color: 'var(--text-2)', textAlign: 'center', padding: '2rem', fontWeight: 500 }}>No milestones registered</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {milestones.map(m => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <h4 style={{ fontWeight: 600, color: 'var(--text-1)', fontSize: '0.875rem' }}>{m.title}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-2)', fontWeight: 500, marginTop: '0.25rem' }}>Target: {new Date(m.targetDate).toLocaleDateString()}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <span className={`badge badge-${m.status?.toLowerCase().replace('_', '-')}`}>{m.status}</span>
                      {isManagement && m.status !== 'COMPLETED' && (
                        <button className="btn btn-primary btn-sm" onClick={() => handleUpdateStatus(m.id, 'COMPLETED')}>Mark as complete</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
