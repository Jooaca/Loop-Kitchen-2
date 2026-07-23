import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Archive, Plus, Trash2, Tag, Layers } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

export const PantryPage = () => {
  const [pantryItems, setPantryItems] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Proteínas');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('unid');
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const loadPantry = async () => {
    try {
      const res = await api.getPantry();
      if (res.success) {
        setPantryItems(res.pantry);
      }
    } catch (error) {
      addToast('Error al cargar la despensa', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPantry();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await api.addPantryItem({ name, category, quantity: Number(quantity), unit });
      if (res.success) {
        setPantryItems(res.pantry);
        setName('');
        setQuantity(1);
        addToast('¡Ingrediente añadido a tu despensa!', 'success');
      }
    } catch (error) {
      addToast('Error al añadir ingrediente', 'error');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const res = await api.deletePantryItem(itemId);
      if (res.success) {
        setPantryItems(res.pantry);
        addToast('Ingrediente eliminado', 'info');
      }
    } catch (error) {
      addToast('Error al eliminar ingrediente', 'error');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div className="badge badge-lime" style={{ marginBottom: '8px' }}>Inventario</div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900 }}>Despensa Actual</h1>
        <p style={{ color: 'var(--color-gray-text)', fontSize: '1rem' }}>
          Mantén al día tus ingredientes en stock. Gemini IA utilizará esta información para evitar que compres lo que ya tienes.
        </p>
      </div>

      {/* Add Item Form */}
      <form onSubmit={handleAddItem} className="card-brutal" style={{ padding: '20px', marginBottom: '36px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ejemplo: Pechuga de Pollo"
          style={{ flex: 2, minWidth: '180px', padding: '10px 14px', borderRadius: '8px', border: '2px solid var(--color-border)', outline: 'none' }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ width: '140px', padding: '10px 14px', borderRadius: '8px', border: '2px solid var(--color-border)', outline: 'none', backgroundColor: '#FFF' }}
        >
          <option value="Proteínas">Proteínas</option>
          <option value="Verduras">Verduras</option>
          <option value="Frutas">Frutas</option>
          <option value="Lácteos">Lácteos</option>
          <option value="Granos">Granos</option>
          <option value="Especias">Especias</option>
          <option value="General">General</option>
        </select>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={{ width: '70px', padding: '10px 10px', borderRadius: '8px', border: '2px solid var(--color-border)', outline: 'none' }}
        />
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          style={{ width: '90px', padding: '10px 10px', borderRadius: '8px', border: '2px solid var(--color-border)', outline: 'none', backgroundColor: '#FFF' }}
        >
          <option value="unid">unid</option>
          <option value="g">g</option>
          <option value="kg">kg</option>
          <option value="ml">ml</option>
          <option value="l">l</option>
        </select>
        <button type="submit" className="btn-brutal" style={{ padding: '10px 20px' }}>
          <Plus size={18} /> Añadir
        </button>
      </form>

      {/* Stock Grid */}
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px' }}>En Stock ({pantryItems.length})</h2>

        {pantryItems.length === 0 ? (
          <EmptyState
            icon={Archive}
            title="Tu despensa está vacía"
            description="Agrega tus alimentos disponibles para que la IA arme recetas personalizadas."
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {pantryItems.map((item) => (
              <div key={item._id} className="card-brutal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{item.name}</h3>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <span className="badge badge-dark" style={{ fontSize: '0.7rem' }}>{item.category}</span>
                    <span className="badge badge-lime" style={{ fontSize: '0.7rem' }}>{item.quantity} {item.unit}</span>
                  </div>
                </div>
                <button onClick={() => handleDeleteItem(item._id)} style={{ padding: '6px', color: 'var(--color-coral)' }} title="Eliminar">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
