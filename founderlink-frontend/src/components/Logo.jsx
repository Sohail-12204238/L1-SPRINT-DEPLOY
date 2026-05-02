import React from 'react';

export default function Logo({ showText = true, size = 48 }) {
  // Use the image provided by the user
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <img 
        src="/logo.png" 
        alt="FounderLink" 
        style={{ 
          height: size, 
          width: 'auto', 
          maxWidth: '100%',
          objectFit: 'contain'
        }} 
      />
    </div>
  );
}
