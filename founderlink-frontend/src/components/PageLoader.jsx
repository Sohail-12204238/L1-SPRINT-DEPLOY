import React from 'react';

export default function PageLoader() {
  return (
    <>
      <style>{`
        @keyframes fl-spin {
          to { transform: rotate(360deg); }
        }
        .fl-loader-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          background: #ffffff;
          z-index: 9999;
        }
        @media (prefers-color-scheme: dark) {
          .fl-loader-overlay { background: #0f1a0f; }
        }
        .fl-loader-ring-wrap {
          position: relative;
          width: 108px;
          height: 108px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fl-loader-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 5px solid rgba(22, 101, 52, 0.15);
          border-top-color: #16a34a;
          animation: fl-spin 1s linear infinite;
        }
        .fl-loader-logo {
          width: 58px;
          height: 58px;
          object-fit: contain;
        }
        .fl-loader-text {
          margin-top: 18px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: #16a34a;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>
      <div className="fl-loader-overlay">
        <div className="fl-loader-ring-wrap">
          <div className="fl-loader-ring" />
          <img src="/logo.png" alt="Loading FounderLink" className="fl-loader-logo" />
        </div>
        <p className="fl-loader-text">FounderLink</p>
      </div>
    </>
  );
}

