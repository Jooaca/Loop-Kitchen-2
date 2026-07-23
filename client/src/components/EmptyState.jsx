import React from 'react';

export const EmptyState = ({ title, description, actionText, onAction, icon: Icon }) => {
  return (
    <div className="card-brutal" style={{
      textAlign: 'center',
      padding: '48px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      backgroundColor: 'var(--color-white)'
    }}>
      {Icon && (
        <div style={{
          backgroundColor: 'var(--color-lime)',
          padding: '16px',
          borderRadius: '50%',
          border: '2px solid var(--color-border)',
          boxShadow: '2px 2px 0px #121417'
        }}>
          <Icon size={36} color="#121417" />
        </div>
      )}
      <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{title}</h3>
      <p style={{ color: 'var(--color-gray-text)', maxWidth: '450px', margin: '0 auto' }}>{description}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn-brutal" style={{ marginTop: '8px' }}>
          {actionText}
        </button>
      )}
    </div>
  );
};
