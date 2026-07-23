import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Sparkles, Calendar, ShoppingCart, Archive, ArrowRight, Utensils } from 'lucide-react';
import { SkeletonCard } from '../components/Skeleton';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [pantryCount, setPantryCount] = useState(0);
  const [groceryCount, setGroceryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pantryRes, groceryRes] = await Promise.all([
          api.getPantry(),
          api.getGroceryList()
        ]);

        if (pantryRes.success) setPantryCount(pantryRes.pantry.length);
        if (groceryRes.success) setGroceryCount(groceryRes.groceryList.items.length);
      } catch (error) {
        console.error('Dashboard load error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div style={{ padding: '20px 16px' }} className="animate-fade-in">
      {/* Welcome Banner */}
      <div className="card-brutal" style={{ backgroundColor: 'var(--color-lime)', padding: '20px', marginBottom: '20px' }}>
        <div className="badge badge-dark" style={{ marginBottom: '8px' }}>Dashboard Loop Kitchen</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '6px', color: '#121417' }}>
          ¡Hola, {user?.username?.split(' ')[0] || 'Cocinero'}! 👋
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#121417', opacity: 0.9, lineHeight: 1.35 }}>
          Tu asistente culinario personal. Organiza tus comidas semanales y aprovecha tus ingredientes con Gemini IA.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div className="card-brutal" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-gray-text)' }}>DESPENSA</span>
            <Archive size={18} color="var(--color-lime-dark)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900 }}>{loading ? '...' : pantryCount}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-gray-text)' }}>ítems en stock</span>
        </div>

        <div className="card-brutal" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-gray-text)' }}>CARRITO</span>
            <ShoppingCart size={18} color="var(--color-coral)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900 }}>{loading ? '...' : groceryCount}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-gray-text)' }}>por comprar</span>
        </div>
      </div>

      {/* Main Feature Banner: Weekly Planner ⭐ */}
      <div className="card-brutal" style={{ padding: '18px', marginBottom: '20px', backgroundColor: 'var(--color-white)' }}>
        <div className="badge badge-lime" style={{ marginBottom: '8px' }}>Funcionalidad Principal ⭐</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '6px' }}>Planificación Semanal IA</h2>
        <p style={{ color: 'var(--color-gray-text)', fontSize: '0.85rem', marginBottom: '14px', lineHeight: 1.35 }}>
          Genera menús de Lunes a Domingo y crea tu lista de compras en 1-Click.
        </p>
        <Link to="/planner" className="btn-brutal" style={{ width: '100%', padding: '10px' }}>
          Planificar Mi Semana <ArrowRight size={16} />
        </Link>
      </div>

      {/* Secondary Features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="card-brutal" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={20} color="var(--color-lime-dark)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Recetas Inteligentes</h3>
          </div>
          <p style={{ color: 'var(--color-gray-text)', fontSize: '0.82rem', marginBottom: '12px' }}>
            Crea recetas paso a paso con los ingredientes disponibles en tu despensa.
          </p>
          <Link to="/recipes" className="btn-brutal btn-secondary" style={{ width: '100%', padding: '8px' }}>
            Generar Recetas
          </Link>
        </div>

        <div className="card-brutal" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ShoppingCart size={20} color="var(--color-coral)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Optimizar Carrito</h3>
          </div>
          <p style={{ color: 'var(--color-gray-text)', fontSize: '0.82rem', marginBottom: '12px' }}>
            Revisa tu lista de compras con Gemini IA para ahorrar presupuesto.
          </p>
          <Link to="/grocery" className="btn-brutal btn-secondary" style={{ width: '100%', padding: '8px' }}>
            Ver Mi Carrito
          </Link>
        </div>
      </div>
    </div>
  );
};
