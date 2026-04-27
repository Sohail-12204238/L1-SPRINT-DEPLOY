import { useEffect, useState } from 'react';
import { startupAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';

const STAGES = ['IDEA', 'MVP', 'EARLY_TRACTION', 'SCALING'];
const STAGE_LABELS = { IDEA: 'Pre-Seed', MVP: 'Seed', EARLY_TRACTION: 'Series A', SCALING: 'Series B+' };
const STAGE_COLORS = { IDEA: '#6c5ce7', MVP: '#06b6d4', EARLY_TRACTION: '#f59e0b', SCALING: '#00c853' };

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
            <p className="page-sub">Manage your startup portfolio</p>
          </div>
          <button id="create-startup-btn" className="btn btn-primary" onClick={openCreate}>+ New Startup</button>
        </div>

        {loading && <div className="spinner-wrap"><div className="spinner" /></div>}
        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {!loading && startups.length === 0 && (
          <div className="empty">
            <span className="empty-icon">🚀</span>
            <p className="empty-title">No startups yet</p>
            <p>Click "+ New Startup" to create your first one</p>
          </div>
        )}

        <div className="startup-list">
          {startups.map(s => {
            const color = STAGE_COLORS[s.stage] || '#6c5ce7';
            const abbr = s.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
            const pct = Math.min(95, Math.floor(Math.random()*70)+20);
            return (
              <div key={s.id} className="startup-row" style={{ flexDirection:'column', alignItems:'stretch', gap:'.65rem' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                  {s.logoUrl ? (
                    <img src={s.logoUrl} alt={s.name} className="startup-logo-img" />
                  ) : (
                    <div className="startup-abbr" style={{ background:color+'22', color }}>{abbr}</div>
                  )}
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
                      <span className="startup-row-name">{s.name}</span>
                      <span className="badge badge-live">{STAGE_LABELS[s.stage] || s.stage}</span>
                    </div>
                    <p className="startup-row-meta">{s.industry} · ₹{(s.fundingGoal/100000).toFixed(0)}L goal</p>
                  </div>
                  <div style={{ display:'flex', gap:'.4rem' }}>
                    <button id={`edit-${s.id}`} className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}>✏️ Edit</button>
                    <button id={`delete-${s.id}`} className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>🗑️</button>
                  </div>
                </div>
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.3rem' }}>
                    <span style={{ fontSize:'.75rem', color:'var(--text-2)' }}>₹{Math.floor(s.fundingGoal*pct/100/100000)}L raised</span>
                    <span style={{ fontSize:'.75rem', fontWeight:700, color:'var(--purple)' }}>{pct}%</span>
                  </div>
                  <div className="progress-track"><div className="progress-fill" style={{ width:`${pct}%` }} /></div>
                </div>
                <p style={{ fontSize:'.8rem', color:'var(--text-3)', lineHeight:1.4 }}>{s.description}</p>
              </div>
            );
          })}
        </div>

        {showForm && (
          <Modal title={editTarget ? `Edit ${editTarget.name}` : 'New Startup'} onClose={() => setShowForm(false)} wide>
            {formError && <div className="alert alert-error">⚠️ {formError}</div>}
            <form onSubmit={handleSave}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <div className="form-group">
                  <label className="form-label">Startup Name</label>
                  <input id="form-name" type="text" className="form-input" placeholder="FounderLink Inc."
                    value={form.name} onChange={e => setForm({...form,name:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Industry</label>
                  <input id="form-industry" type="text" className="form-input" placeholder="FinTech, HealthTech…"
                    value={form.industry} onChange={e => setForm({...form,industry:e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Logo URL</label>
                <input id="form-logo" type="url" className="form-input" placeholder="https://example.com/logo.png"
                  value={form.logoUrl} onChange={e => setForm({...form,logoUrl:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea id="form-desc" className="form-textarea" value={form.description}
                  onChange={e => setForm({...form,description:e.target.value})} required />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <div className="form-group">
                  <label className="form-label">Problem Statement</label>
                  <textarea id="form-problem" className="form-textarea" style={{ minHeight:80 }} value={form.problemStatement}
                    onChange={e => setForm({...form,problemStatement:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Solution</label>
                  <textarea id="form-solution" className="form-textarea" style={{ minHeight:80 }} value={form.solution}
                    onChange={e => setForm({...form,solution:e.target.value})} required />
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <div className="form-group">
                  <label className="form-label">Funding Goal (₹)</label>
                  <input id="form-goal" type="number" min={1} className="form-input" value={form.fundingGoal}
                    onChange={e => setForm({...form,fundingGoal:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Stage</label>
                  <select id="form-stage" className="form-select" value={form.stage}
                    onChange={e => setForm({...form,stage:e.target.value})}>
                    {STAGES.map(s => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display:'flex', gap:'.75rem', marginTop:'.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)} style={{ flex:1 }}>Cancel</button>
                <button id="save-startup" type="submit" className="btn btn-primary" disabled={saving} style={{ flex:2 }}>
                  {saving ? 'Saving…' : editTarget ? 'Update Startup' : 'Create Startup'}
                </button>
              </div>
            </form>
          </Modal>
        )}

        <style>{`
          .page-toprow{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;}
          .page-h1{font-size:1.45rem;font-weight:800;color:#fff;}
          .page-sub{font-size:.87rem;color:var(--text-2);margin-top:.2rem;}
          .startup-list{display:flex;flex-direction:column;gap:.75rem;}
          .startup-logo-img{width:36px;height:36px;border-radius:10px;object-fit:cover;flex-shrink:0;border:1px solid var(--border);}
        `}</style>
      </main>
    </div>
  );
}
