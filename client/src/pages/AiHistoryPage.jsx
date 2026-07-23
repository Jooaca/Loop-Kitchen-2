import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { History, Sparkles, Calendar, ShoppingCart, Clock } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

export const AiHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await api.getAiHistory();
        if (res.success) {
          setHistory(res.history);
        }
      } catch (error) {
        addToast('Error al cargar historial', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }} className="animate-fade-in">
      <div style={{ marginBottom: '28px' }}>
        <div className="badge badge-dark" style={{ marginBottom: '8px' }}>Bitácora IA</div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900 }}>Historial de Consultas IA</h1>
        <p style={{ color: 'var(--color-gray-text)', fontSize: '1rem' }}>
          Registro automático de tus recetas inteligentes, planes semanales creados y optimizaciones de compras para reutilizar.
        </p>
      </div>

      {loading ? (
        <p>Cargando historial...</p>
      ) : history.length === 0 ? (
        <EmptyState
          icon={History}
          title="Historial de IA vacío"
          description="Genera recetas o tu primer plan semanal con Gemini para guardar automáticamente tus registros."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {history.map((item) => (
            <div key={item._id} className="card-brutal" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="badge badge-lime" style={{ fontSize: '0.8rem' }}>
                  {item.actionType === 'SMART_RECIPES' ? '🍳 RECETAS IA' : item.actionType === 'WEEKLY_PLANNER' ? '📅 PLAN SEMANAL' : '🛒 OPTIMIZACIÓN CARRITO'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} /> {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>

              <div style={{ fontSize: '0.95rem' }}>
                {item.actionType === 'SMART_RECIPES' && (
                  <p><strong>Recetas Generadas:</strong> {item.aiResponse?.map(r => r.title).join(', ')}</p>
                )}
                {item.actionType === 'WEEKLY_PLANNER' && (
                  <p><strong>Título del Plan:</strong> {item.aiResponse?.title || 'Plan Semanal Personalizado'}</p>
                )}
                {item.actionType === 'CART_OPTIMIZER' && (
                  <p><strong>Resumen:</strong> {item.aiResponse?.optimizationSummary || 'Carrito optimizado'}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
