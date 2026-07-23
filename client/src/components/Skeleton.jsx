import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="card-brutal animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div className="skeleton" style={{ height: '24px', width: '60%' }}></div>
      <div className="skeleton" style={{ height: '16px', width: '90%' }}></div>
      <div className="skeleton" style={{ height: '16px', width: '75%' }}></div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <div className="skeleton" style={{ height: '32px', width: '80px', borderRadius: '20px' }}></div>
        <div className="skeleton" style={{ height: '32px', width: '100px', borderRadius: '20px' }}></div>
      </div>
    </div>
  );
};
