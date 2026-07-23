import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, LogOut, Moon, Sun, User } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      backgroundColor: 'var(--color-white)',
      borderBottom: '2px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 900,
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: '480px',
      margin: '0 auto',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 900, fontSize: '1.15rem' }}>
        <div style={{
          backgroundColor: 'var(--color-lime)',
          padding: '4px 8px',
          borderRadius: '8px',
          border: '1.5px solid var(--color-border)',
          boxShadow: '1.5px 1.5px 0px #121417',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Sparkles size={16} color="#121417" />
          <span>Loop Kitchen</span>
        </div>
        <span style={{ fontSize: '0.6rem', backgroundColor: '#121417', color: 'var(--color-lime)', padding: '2px 6px', borderRadius: '10px', textTransform: 'uppercase', fontWeight: 800 }}>BETA</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button onClick={toggleTheme} className="btn-brutal btn-secondary" style={{ padding: '6px 8px', fontSize: '0.8rem' }} title="Cambiar Tema">
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--color-gray-light)', padding: '4px 8px', borderRadius: '12px' }}>
              <User size={14} /> {user.username.split(' ')[0]}
            </span>
            <button onClick={handleLogout} className="btn-brutal btn-danger" style={{ padding: '6px 8px' }} title="Cerrar Sesión">
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '6px' }}>
            <Link to="/login" className="btn-brutal btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem' }}>Entrar</Link>
            <Link to="/register" className="btn-brutal" style={{ padding: '6px 10px', fontSize: '0.75rem' }}>Registro</Link>
          </div>
        )}
      </div>
    </header>
  );
};
