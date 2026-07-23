import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Sparkles, ShoppingCart, Archive, History } from 'lucide-react';

export const BottomNav = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '480px',
      backgroundColor: 'var(--color-white)',
      borderTop: '2px solid var(--color-border)',
      borderLeft: '2px solid var(--color-border)',
      borderRight: '2px solid var(--color-border)',
      zIndex: 900,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '8px 4px 12px',
      boxShadow: '0 -4px 16px rgba(0,0,0,0.08)'
    }}>
      <Link
        to="/app"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          fontSize: '0.72rem',
          fontWeight: 800,
          color: isActive('/app') ? '#121417' : 'var(--color-gray-text)',
          padding: '4px 8px',
          borderRadius: '10px',
          backgroundColor: isActive('/app') ? 'var(--color-lime)' : 'transparent',
          border: isActive('/app') ? '1.5px solid #121417' : '1.5px solid transparent',
          transition: 'all 0.2s ease'
        }}
      >
        <LayoutDashboard size={18} />
        <span>Inicio</span>
      </Link>

      <Link
        to="/planner"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          fontSize: '0.72rem',
          fontWeight: 800,
          color: isActive('/planner') ? '#121417' : 'var(--color-gray-text)',
          padding: '4px 8px',
          borderRadius: '10px',
          backgroundColor: isActive('/planner') ? 'var(--color-lime)' : 'transparent',
          border: isActive('/planner') ? '1.5px solid #121417' : '1.5px solid transparent',
          transition: 'all 0.2s ease'
        }}
      >
        <Calendar size={18} />
        <span>Plan ⭐</span>
      </Link>

      <Link
        to="/recipes"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          fontSize: '0.72rem',
          fontWeight: 800,
          color: isActive('/recipes') ? '#121417' : 'var(--color-gray-text)',
          padding: '4px 8px',
          borderRadius: '10px',
          backgroundColor: isActive('/recipes') ? 'var(--color-lime)' : 'transparent',
          border: isActive('/recipes') ? '1.5px solid #121417' : '1.5px solid transparent',
          transition: 'all 0.2s ease'
        }}
      >
        <Sparkles size={18} />
        <span>Recetas</span>
      </Link>

      <Link
        to="/grocery"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          fontSize: '0.72rem',
          fontWeight: 800,
          color: isActive('/grocery') ? '#121417' : 'var(--color-gray-text)',
          padding: '4px 8px',
          borderRadius: '10px',
          backgroundColor: isActive('/grocery') ? 'var(--color-lime)' : 'transparent',
          border: isActive('/grocery') ? '1.5px solid #121417' : '1.5px solid transparent',
          transition: 'all 0.2s ease'
        }}
      >
        <ShoppingCart size={18} />
        <span>Compras</span>
      </Link>

      <Link
        to="/pantry"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          fontSize: '0.72rem',
          fontWeight: 800,
          color: isActive('/pantry') ? '#121417' : 'var(--color-gray-text)',
          padding: '4px 8px',
          borderRadius: '10px',
          backgroundColor: isActive('/pantry') ? 'var(--color-lime)' : 'transparent',
          border: isActive('/pantry') ? '1.5px solid #121417' : '1.5px solid transparent',
          transition: 'all 0.2s ease'
        }}
      >
        <Archive size={18} />
        <span>Despensa</span>
      </Link>

      <Link
        to="/history"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          fontSize: '0.72rem',
          fontWeight: 800,
          color: isActive('/history') ? '#121417' : 'var(--color-gray-text)',
          padding: '4px 8px',
          borderRadius: '10px',
          backgroundColor: isActive('/history') ? 'var(--color-lime)' : 'transparent',
          border: isActive('/history') ? '1.5px solid #121417' : '1.5px solid transparent',
          transition: 'all 0.2s ease'
        }}
      >
        <History size={18} />
        <span>Historial</span>
      </Link>
    </nav>
  );
};
