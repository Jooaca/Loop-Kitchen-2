import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        width: '100%'
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="animate-fade-in"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 18px',
              borderRadius: '12px',
              backgroundColor: toast.type === 'success' ? '#C4F135' : toast.type === 'error' ? '#FF6B6B' : '#121417',
              color: toast.type === 'success' ? '#121417' : '#FFFFFF',
              border: '2px solid #121417',
              boxShadow: '4px 4px 0px #121417',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            {toast.type === 'success' && <CheckCircle2 size={20} color="#121417" />}
            {toast.type === 'error' && <AlertCircle size={20} color="#FFFFFF" />}
            {toast.type === 'info' && <Info size={20} color="#C4F135" />}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} style={{ color: 'inherit', padding: 0 }}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
