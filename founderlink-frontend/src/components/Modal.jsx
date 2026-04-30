import { useEffect } from 'react';

export default function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal-box${wide ? ' modal-wide' : ''}`}>
        {title && (
          <div className="modal-header">
            <h2 className="modal-title">{title.toUpperCase()}</h2>
            <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
          </div>
        )}
        {!title && (
          <button className="modal-close-corner" onClick={onClose} aria-label="Close">✕</button>
        )}
        <div className="modal-body">{children}</div>
      </div>

      <style>{`
        .modal-overlay{
          position:fixed;inset:0;z-index:2000;
          background:rgba(0,0,0,0.85);
          backdrop-filter:blur(8px);
          display:flex;align-items:center;justify-content:center;
          padding:1.5rem;
        }
        .modal-box{
          background:var(--bg-card);
          border:1px solid var(--border);
          border-radius:2px;
          width:100%;max-width:500px;
          box-shadow:var(--shadow);
          position:relative;
        }
        .modal-wide{max-width:800px;}
        .modal-header{
          display:flex;align-items:center;justify-content:space-between;
          padding:1.5rem 2rem;
          border-bottom:1px solid var(--border);
        }
        .modal-title{font-size:.85rem;font-weight:900;color:var(--text-1);letter-spacing:1px;}
        .modal-close{
          background:none;border:none;color:var(--text-3);
          font-size:1rem;cursor:pointer;transition:all .2s;
        }
        .modal-close:hover{color:var(--purple);}
        .modal-close-corner{
          position:absolute;top:1rem;right:1.5rem;
          background:none;border:none;color:var(--text-3);
          font-size:1rem;cursor:pointer;z-index:1;
        }
        .modal-body{padding:2rem;}
      `}</style>
    </div>
  );
}
