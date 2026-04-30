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

  useEffect(() => {
    Promise.all([
      startupAPI.getById(id),
      milestoneAPI.getByStartup(id)
    ]).then(([sRes, mRes]) => {
      setStartup(sRes.data);
      setMilestones(mRes.data || []);
    }).catch(() => setError('Failed to load startup details.'))
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
          <Link to="/startups" className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem' }}>← Back to Startups</Link>
          
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-1)' }}>{startup.name}</h1>
              <span className="badge badge-live">{startup.status || 'Active'}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-2)', marginBottom: '0.5rem' }}>Description</h3>
                <p style={{ color: 'var(--text-1)', lineHeight: 1.6 }}>{startup.description}</p>
                
                <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', display: 'block', textTransform: 'uppercase' }}>Target Funding</span>
                    <span style={{ fontWeight: 700, color: 'var(--green)', fontSize: '1.2rem' }}>₹{startup.fundingGoal?.toLocaleString()}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', display: 'block', textTransform: 'uppercase' }}>Current Funding</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-1)', fontSize: '1.2rem' }}>₹{startup.currentFunding?.toLocaleString() || 0}</span>
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-2)', marginBottom: '1rem' }}>Startup Info</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-3)' }}>Founder</span>
                    <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>{startup.founderEmail}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-3)' }}>Created At</span>
                    <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>{startup.createdAt ? new Date(startup.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>

                {cleanRole === 'INVESTOR' && (
                  <button className="btn btn-primary btn-full" style={{ marginTop: '1.5rem' }}>Invest Now</button>
                )}
              </div>
            </div>
          </div>

          {/* Milestones Section */}
          <div className="card" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-1)' }}>🚀 Milestones</h2>
              {isManagement && (
                <button className="btn btn-secondary btn-sm" onClick={() => setShowAddMilestone(true)}>+ Add Milestone</button>
              )}
            </div>

            {showAddMilestone && (
              <form onSubmit={handleAddMilestone} style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--purple-border)' }}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input className="form-input" placeholder="e.g. Launch Beta" value={newMilestone.title} onChange={e => setNewMilestone({...newMilestone, title: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Target Date</label>
                  <input type="date" className="form-input" value={newMilestone.targetDate} onChange={e => setNewMilestone({...newMilestone, targetDate: e.target.value})} required />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-primary btn-sm">Save Milestone</button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAddMilestone(false)}>Cancel</button>
                </div>
              </form>
            )}

            {milestones.length === 0 ? (
              <p style={{ color: 'var(--text-3)', textAlign: 'center', padding: '2rem' }}>No milestones added yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {milestones.map(m => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div>
                      <h4 style={{ fontWeight: 600, color: 'var(--text-1)' }}>{m.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>Target: {new Date(m.targetDate).toLocaleDateString()}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span className={`badge badge-${m.status?.toLowerCase().replace('_', '-')}`}>{m.status}</span>
                      {isManagement && m.status !== 'COMPLETED' && (
                        <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(m.id, 'COMPLETED')}>Mark Done</button>
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
