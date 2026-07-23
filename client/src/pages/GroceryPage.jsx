import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ShoppingCart, CheckCircle, Plus, Sparkles, Trash2, DollarSign, Lightbulb } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

export const GroceryPage = () => {
  const [groceryList, setGroceryList] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const { addToast } = useToast();

  const loadList = async () => {
    try {
      const res = await api.getGroceryList();
      if (res.success) {
        setGroceryList(res.groceryList);
      }
    } catch (error) {
      addToast('Error al cargar la lista de compras', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const handleToggle = async (itemId) => {
    try {
      const res = await api.toggleBoughtItem(itemId);
      if (res.success) {
        setGroceryList(res.groceryList);
      }
    } catch (error) {
      addToast('Error al actualizar el producto', 'error');
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const currentItems = groceryList ? groceryList.items : [];
    const updatedItems = [
      ...currentItems,
      { name: newItemName.trim(), quantity: Number(newItemQty) || 1, unit: 'unid', isBought: false }
    ];

    try {
      const res = await api.saveGroceryList({ items: updatedItems });
      if (res.success) {
        setGroceryList(res.groceryList);
        setNewItemName('');
        setNewItemQty(1);
        addToast('Producto agregado al carrito', 'success');
      }
    } catch (error) {
      addToast('Error al guardar producto', 'error');
    }
  };

  const handleOptimizeCart = async () => {
    setOptimizing(true);
    try {
      const res = await api.optimizeCart();
      if (res.success) {
        setOptimizationResult(res.result);
        addToast('¡Carrito optimizado por Gemini IA!', 'success');
      } else {
        addToast(res.message || 'Error al optimizar carrito', 'error');
      }
    } catch (error) {
      addToast('Error al conectar con la IA', 'error');
    } finally {
      setOptimizing(false);
    }
  };

  const pendingItems = groceryList ? groceryList.items.filter(i => !i.isBought) : [];
  const boughtItems = groceryList ? groceryList.items.filter(i => i.isBought) : [];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div className="badge badge-coral" style={{ marginBottom: '8px' }}>Funcionalidad IA 2</div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900 }}>Lista de Compras Inteligente</h1>
          <p style={{ color: 'var(--color-gray-text)', fontSize: '1rem' }}>
            {groceryList?.title || 'Lista Calculada con tu Despensa'}
          </p>
        </div>

        <button
          onClick={handleOptimizeCart}
          disabled={optimizing || (pendingItems.length === 0 && boughtItems.length === 0)}
          className="btn-brutal"
          style={{ backgroundColor: 'var(--color-lime)', padding: '12px 22px' }}
        >
          {optimizing ? 'Analizando carrito...' : <><Sparkles size={18} /> Optimizar compra</>}
        </button>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="card-brutal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-gray-text)' }}>POR COMPRAR</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{pendingItems.length}</div>
          </div>
          <ShoppingCart size={28} color="var(--color-coral)" />
        </div>

        <div className="card-brutal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-lime)' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#121417' }}>COMPRADOS</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#121417' }}>{boughtItems.length}</div>
          </div>
          <CheckCircle size={28} color="#121417" />
        </div>
      </div>

      {/* Optimization Feedback Banner */}
      {optimizationResult && (
        <div className="card-brutal animate-fade-in" style={{ backgroundColor: '#121417', color: '#FFF', padding: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Sparkles size={24} color="var(--color-lime)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-lime)' }}>
              {optimizationResult.optimizationSummary || 'Recomendaciones de Gemini IA:'}
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {optimizationResult.recommendations?.map((rec, idx) => (
              <div key={idx} style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Item Form */}
      <form onSubmit={handleAddItem} className="card-brutal" style={{ padding: '16px 20px', marginBottom: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Nombre del producto (ej. Leche de Almendras)"
          style={{ flex: 2, minWidth: '200px', padding: '10px 14px', borderRadius: '8px', border: '2px solid var(--color-border)', outline: 'none' }}
        />
        <input
          type="number"
          min="1"
          value={newItemQty}
          onChange={(e) => setNewItemQty(e.target.value)}
          style={{ width: '80px', padding: '10px 14px', borderRadius: '8px', border: '2px solid var(--color-border)', outline: 'none' }}
        />
        <button type="submit" className="btn-brutal btn-secondary" style={{ padding: '10px 20px' }}>
          <Plus size={18} /> Agregar
        </button>
      </form>

      {/* Pending Items List */}
      <div style={{ marginBottom: '36px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '14px' }}>Pendientes ({pendingItems.length})</h2>

        {pendingItems.length === 0 ? (
          <div className="card-brutal" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-gray-text)' }}>
            ¡No tienes productos pendientes! Agrega algunos manualmente o genera una lista con el Plan Semanal.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pendingItems.map((item) => (
              <div
                key={item._id || item.name}
                onClick={() => handleToggle(item._id)}
                className="card-brutal"
                style={{
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '22px', height: '22px', border: '2px solid #121417', borderRadius: '6px' }}></div>
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>{item.name}</span>
                </div>
                <span className="badge badge-dark">{item.quantity} {item.unit || 'unid'}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bought Items List */}
      {boughtItems.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '14px', color: 'var(--color-gray-text)' }}>
            En el Carrito ({boughtItems.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', opacity: 0.7 }}>
            {boughtItems.map((item) => (
              <div
                key={item._id || item.name}
                onClick={() => handleToggle(item._id)}
                className="card-brutal"
                style={{
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  backgroundColor: 'var(--color-gray-light)',
                  textDecoration: 'line-through'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <CheckCircle size={22} color="#2B8A3E" />
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>{item.name}</span>
                </div>
                <span className="badge badge-dark">{item.quantity} {item.unit || 'unid'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
