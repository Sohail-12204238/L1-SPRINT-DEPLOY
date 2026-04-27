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
            <h2 className="modal-title">{title}</h2>
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
          background:rgba(0,0,0,0.72);
          backdrop-filter:blur(5px);
          display:flex;align-items:center;justify-content:center;
          padding:1rem;
        }
        .modal-box{
          background:#1a1a26;
          border:1px solid rgba(255,255,255,.1);
          border-radius:18px;
          width:100%;max-width:480px;
          box-shadow:0 24px 64px rgba(0,0,0,.6);
          position:relative;
        }
        .modal-wide{max-width:760px;}
        .modal-header{
          display:flex;align-items:center;justify-content:space-between;
          padding:1.1rem 1.4rem;
          border-bottom:1px solid rgba(255,255,255,.07);
        }
        .modal-title{font-size:1rem;font-weight:700;color:#fff;}
        .modal-close{
          background:none;border:none;color:rgba(255,255,255,.35);
          font-size:.9rem;cursor:pointer;padding:.25rem .5rem;
          border-radius:6px;transition:all .15s;
        }
        .modal-close:hover{background:rgba(239,68,68,.15);color:#f87171;}
        .modal-close-corner{
          position:absolute;top:.9rem;right:1rem;
          background:none;border:none;color:rgba(255,255,255,.35);
          font-size:.9rem;cursor:pointer;padding:.25rem .5rem;
          border-radius:6px;transition:all .15s;z-index:1;
        }
        .modal-close-corner:hover{background:rgba(239,68,68,.15);color:#f87171;}
        .modal-body{padding:1.4rem;}
      `}</style>
    </div>
  );
}
