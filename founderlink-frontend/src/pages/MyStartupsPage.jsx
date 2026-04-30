import { useEffect, useState } from 'react';
import { startupAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';

const STAGES = ['IDEA', 'MVP', 'EARLY_TRACTION', 'SCALING'];
const STAGE_LABELS = { IDEA: 'Pre-Seed', MVP: 'Seed', EARLY_TRACTION: 'Series A', SCALING: 'Series B+' };

const emptyForm = { name:'', description:'', industry:'', problemStatement:'', solution:'', logoUrl:'', fundingGoal:'', stage:'IDEA' };

export default function MyStartupsPage() {
  const { role } = useAuth();
  const cleanRole = role?.replace('ROLE_', '') || '';
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    startupAPI.getMyStartups()
      .then(r => setStartups(r.data))
      .catch(() => setError('Failed to load startups.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditTarget(null); setForm(emptyForm); setFormError(''); setShowForm(true); };
  const openEdit = (s) => {
    setEditTarget(s);
    setForm({ name:s.name, description:s.description, industry:s.industry,
      problemStatement:s.problemStatement, solution:s.solution, logoUrl:s.logoUrl || '', fundingGoal:s.fundingGoal, stage:s.stage });
    setFormError(''); setShowForm(true);
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this startup?')) return;
    try { await startupAPI.delete(id); setStartups(p => p.filter(s => s.id !== id)); }
    catch { alert('Failed to delete.'); }
  };
  const handleSave = async (e) => {
    e.preventDefault(); setFormError(''); setSaving(true);
    try {
      const payload = { ...form, fundingGoal: parseFloat(form.fundingGoal) };
      if (editTarget) await startupAPI.update(editTarget.id, payload);
      else await startupAPI.create(payload);
      load(); setShowForm(false);
    } catch (err) { setFormError(err.response?.data?.message || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="app-shell">
      <Sidebar role={cleanRole} />
      <main className="main-content">
        <div className="page-toprow">
          <div>
            <h1 className="page-h1">My Startups</h1>
            <p className="page-sub">Portfolio management</p>
          </div>
          <button id="create-startup-btn" className="btn btn-primary" onClick={openCreate}>Create new</button>
        </div>

        {loading && <div className="spinner-wrap"><div className="spinner" /></div>}
        {error && <div className="alert alert-error">{error}</div>}
        {!loading && startups.length === 0 && (
          <div className="empty">
            <p className="empty-title">No startups registered</p>
          </div>
        )}

        <div className="startup-list">
          {startups.map(s => {
            const abbr = s.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
            const pct = 65;
            return (
              <div key={s.id} className="startup-item">
                <div className="si-header">
                  <div className="si-abbr">{abbr}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
                      <span className="si-name">{s.name}</span>
                      <span className="badge badge-live">{STAGE_LABELS[s.stage] || s.stage}</span>
                    </div>
                    <p className="si-meta">{s.industry} · Goal: ₹{(s.fundingGoal/100000).toFixed(0)}L</p>
                  </div>
                  <div style={{ display:'flex', gap:'0.5rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}>Edit</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleDelete(s.id)} style={{ color: 'var(--danger)' }}>Delete</button>
                  </div>
                </div>
                <div style={{ marginTop: '1.25rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.5rem' }}>
                    <span style={{ fontSize:'0.75rem', fontWeight: 500, color:'var(--text-2)' }}>Progress</span>
                    <span style={{ fontSize:'0.75rem', fontWeight: 600, color:'var(--primary)' }}>{pct}%</span>
                  </div>
                  <div className="progress-track" style={{ height:'6px', background:'var(--bg-hover)', borderRadius:'10px', overflow:'hidden' }}><div className="progress-fill" style={{ width:`${pct}%`, height:'100%', background:'var(--primary)' }} /></div>
                </div>
              </div>
            );
          })}
        </div>

        {showForm && (
          <Modal title={editTarget ? `Edit startup` : 'Create startup'} onClose={() => setShowForm(false)} wide>
            {formError && <div className="alert alert-error">{formError}</div>}
            <form onSubmit={handleSave}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Startup name</label>
                  <input type="text" className="form-input" placeholder="e.g. FounderLink Inc."
                    value={form.name} onChange={e => setForm({...form,name:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Industry</label>
                  <input type="text" className="form-input" placeholder="Fintech, Health..."
                    value={form.industry} onChange={e => setForm({...form,industry:e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" placeholder="Briefly describe your startup..."
                  value={form.description} onChange={e => setForm({...form,description:e.target.value})} required minLength={10} />
              </div>
              <div className="form-group">
                <label className="form-label">Problem Statement</label>
                <textarea className="form-textarea" placeholder="What problem are you solving?"
                  value={form.problemStatement} onChange={e => setForm({...form,problemStatement:e.target.value})} required minLength={10} />
              </div>
              <div className="form-group">
                <label className="form-label">Solution</label>
                <textarea className="form-textarea" placeholder="How are you solving it?"
                  value={form.solution} onChange={e => setForm({...form,solution:e.target.value})} required minLength={10} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Funding goal (₹)</label>
                  <input type="number" min={1} className="form-input" value={form.fundingGoal}
                    onChange={e => setForm({...form,fundingGoal:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Stage</label>
                  <select className="form-select" value={form.stage}
                    onChange={e => setForm({...form,stage:e.target.value})}>
                    {STAGES.map(s => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display:'flex', gap:'1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)} style={{ flex:1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex:2 }}>
                  {saving ? 'Saving...' : 'Save startup'}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </main>

      <style>{`
        .page-toprow{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:2rem;border-bottom:1px solid var(--border);padding-bottom:1.5rem;}
        .page-h1{font-size:1.875rem;font-weight:600;color:var(--text-1);}
        .page-sub{font-size:0.875rem;color:var(--text-2);margin-top:0.25rem;}

        .startup-list{display:flex;flex-direction:column;gap:1.5rem;}
        .startup-item{background:var(--bg-card);border:1px solid var(--border);padding:1.5rem; border-radius:var(--radius-md); transition:all .2s ease;}
        .startup-item:hover{border-color:var(--border-light);}
        .si-header{display:flex;align-items:center;gap:1.25rem;}
        .si-abbr{
          width:42px;height:42px;border-radius:var(--radius-sm);flex-shrink:0;
          display:flex;align-items:center;justify-content:center;
          font-size:1rem;font-weight:600;color:#fff;background:var(--primary);
        }
        .si-name{font-size:1rem;font-weight:600;color:var(--text-1);}
        .si-meta{font-size:0.75rem;color:var(--text-2);margin-top:0.25rem;}
      `}</style>
    </div>
  );
}
