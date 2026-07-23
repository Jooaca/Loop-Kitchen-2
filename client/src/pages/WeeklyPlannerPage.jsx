import React, { useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Sparkles, ShoppingCart, Clock, Users, DollarSign, Target, X, BookOpen, Utensils, Heart, CheckCircle2 } from 'lucide-react';
import { SkeletonCard } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';

export const WeeklyPlannerPage = () => {
  const [preferences, setPreferences] = useState({
    householdSize: 2,
    weeklyBudget: 150,
    maxPrepTime: 30,
    dietaryRestrictions: ['Sin restricciones'],
    allergies: [],
    likedFoods: 'Pollo, Palta, Huevos, Salmón, Ensaladas',
    dislikedFoods: 'Cilantro, Berenjena',
    mainGoal: 'Comer saludable y ahorrar dinero'
  });

  const [mealPlan, setMealPlan] = useState(() => {
    const saved = localStorage.getItem('loop_weekly_plan');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [generatingList, setGeneratingList] = useState(false);
  const [activeDay, setActiveDay] = useState('Lunes');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const { addToast } = useToast();
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await api.getActiveMealPlan();
        if (res.success && res.mealPlan) {
          setMealPlan(res.mealPlan);
          localStorage.setItem('loop_weekly_plan', JSON.stringify(res.mealPlan));
          if (res.mealPlan.days && res.mealPlan.days.length > 0) {
            setActiveDay(res.mealPlan.days[0].dayName);
          }
        }
      } catch (err) {
        // Fallback to localStorage state is already in state init
      }
    };
    fetchPlan();
  }, []);

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const res = await api.generateWeeklyPlan(preferences);
      if (res.success) {
        setMealPlan(res.mealPlan);
        localStorage.setItem('loop_weekly_plan', JSON.stringify(res.mealPlan));
        setActiveDay(res.mealPlan.days[0]?.dayName || 'Lunes');
        addToast('¡Plan Semanal de 3 días variado generado!', 'success');
      } else {
        addToast(res.message || 'Error al generar plan semanal', 'error');
      }
    } catch (error) {
      addToast('Error al conectar con la IA', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroceryList = async () => {
    if (!mealPlan) return;
    setGeneratingList(true);
    try {
      const res = await api.generateGroceryFromPlan();
      if (res.success) {
        addToast(res.message, 'success');
        navigate('/grocery');
      } else {
        addToast(res.message || 'Error al generar la lista de compras', 'error');
      }
    } catch (error) {
      addToast('Error de comunicación con el servidor', 'error');
    } finally {
      setGeneratingList(false);
    }
  };

  const handleOpenRecipeModal = (meal, mealType) => {
    setSelectedRecipe({ ...meal, mealType });
  };

  const handleCloseRecipeModal = () => {
    setSelectedRecipe(null);
  };

  const handleCookRecipe = async (recipe) => {
    try {
      const res = await api.useIngredients(recipe.ingredients);
      if (res.success) {
        addToast('¡Receta cocinada! Se descontaron los ingredientes de tu despensa.', 'success');
        handleCloseRecipeModal();
      } else {
        addToast(res.message || 'Error al cocinar', 'error');
      }
    } catch (error) {
      addToast('Error al conectar con la despensa', 'error');
    }
  };

  return (
    <div style={{ padding: '20px 16px' }} className="animate-fade-in">
      {/* Title & Badge Header */}
      <div style={{ marginBottom: '20px' }}>
        <div className="badge badge-dark" style={{ marginBottom: '6px' }}>
          <Sparkles size={14} color="var(--color-lime)" /> Planificador ⭐
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Plan Semanal IA</h1>
        <p style={{ color: 'var(--color-gray-text)', fontSize: '0.85rem', marginTop: '2px' }}>
          Toca en cualquier comida para ver su receta paso a paso.
        </p>
      </div>

      {/* Preferences Form Accordion Card */}
      <div className="card-brutal" style={{ marginBottom: '24px', padding: '16px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Target size={18} color="var(--color-lime-dark)" /> Preferencias
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.75rem', marginBottom: '4px' }}>Personas</label>
            <input
              type="number"
              min="1"
              max="10"
              value={preferences.householdSize}
              onChange={(e) => setPreferences({ ...preferences, householdSize: Number(e.target.value) })}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1.5px solid var(--color-border)', outline: 'none', fontSize: '0.85rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.75rem', marginBottom: '4px' }}>Presupuesto ($)</label>
            <input
              type="number"
              min="20"
              value={preferences.weeklyBudget}
              onChange={(e) => setPreferences({ ...preferences, weeklyBudget: Number(e.target.value) })}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1.5px solid var(--color-border)', outline: 'none', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        <button
          onClick={handleGeneratePlan}
          disabled={loading}
          className="btn-brutal"
          style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
        >
          {loading ? 'Generando Plan con IA...' : <><Sparkles size={16} /> Generar Plan Semanal</>}
        </button>
      </div>

      {/* Generated Meal Plan Display */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : !mealPlan ? (
        <EmptyState
          icon={Calendar}
          title="Sin plan de comidas"
          description="Presiona 'Generar Plan Semanal' para recibir tu menú personalizado."
          actionText="Generar Mi Plan"
          onAction={handleGeneratePlan}
        />
      ) : (
        <div>
          {/* Day Navigation Scroll Tabs */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
            {mealPlan.days.map((day) => (
              <button
                key={day.dayName}
                onClick={() => setActiveDay(day.dayName)}
                className={`btn-brutal ${activeDay === day.dayName ? '' : 'btn-secondary'}`}
                style={{ padding: '8px 14px', whiteSpace: 'nowrap', fontSize: '0.8rem' }}
              >
                {day.dayName}
              </button>
            ))}
          </div>

          {/* Meals for Active Day */}
          {mealPlan.days
            .filter((day) => day.dayName === activeDay)
            .map((day) => (
              <div key={day.dayName} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Desayuno */}
                <div
                  className="card-brutal"
                  onClick={() => handleOpenRecipeModal(day.breakfast, 'Desayuno')}
                  style={{ backgroundColor: 'var(--color-white)', cursor: 'pointer', padding: '14px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="badge badge-lime">🍳 Desayuno</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-lime-dark)' }}>Ver Receta 📖</span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '4px' }}>{day.breakfast.title}</h3>
                  <p style={{ color: 'var(--color-gray-text)', fontSize: '0.8rem' }}>{day.breakfast.description}</p>
                </div>

                {/* Almuerzo */}
                <div
                  className="card-brutal"
                  onClick={() => handleOpenRecipeModal(day.lunch, 'Almuerzo')}
                  style={{ backgroundColor: 'var(--color-white)', cursor: 'pointer', padding: '14px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="badge badge-coral">🥗 Almuerzo</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-coral)' }}>Ver Receta 📖</span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '4px' }}>{day.lunch.title}</h3>
                  <p style={{ color: 'var(--color-gray-text)', fontSize: '0.8rem' }}>{day.lunch.description}</p>
                </div>

                {/* Merienda */}
                <div
                  className="card-brutal"
                  onClick={() => handleOpenRecipeModal(day.snack, 'Merienda')}
                  style={{ backgroundColor: 'var(--color-white)', cursor: 'pointer', padding: '14px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="badge badge-blue">🍎 Merienda</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-blue)' }}>Ver Receta 📖</span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '4px' }}>{day.snack.title}</h3>
                  <p style={{ color: 'var(--color-gray-text)', fontSize: '0.8rem' }}>{day.snack.description}</p>
                </div>

                {/* Cena */}
                <div
                  className="card-brutal"
                  onClick={() => handleOpenRecipeModal(day.dinner, 'Cena')}
                  style={{ backgroundColor: 'var(--color-white)', cursor: 'pointer', padding: '14px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="badge badge-dark">🍲 Cena</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-lime)' }}>Ver Receta 📖</span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '4px' }}>{day.dinner.title}</h3>
                  <p style={{ color: 'var(--color-gray-text)', fontSize: '0.8rem' }}>{day.dinner.description}</p>
                </div>
              </div>
            ))}

          {/* Action Footer for Meal Plan */}
          <div className="card-brutal" style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--color-cream)', textAlign: 'center' }}>
            <h4 style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px' }}>¿Listo para el supermercado?</h4>
            <p style={{ color: 'var(--color-gray-text)', fontSize: '0.8rem', marginBottom: '12px' }}>
              Genera tu lista de compras automatizada en 1-Click.
            </p>
            <button
              onClick={handleCreateGroceryList}
              disabled={generatingList}
              className="btn-brutal"
              style={{ width: '100%', backgroundColor: 'var(--color-lime)', padding: '10px' }}
            >
              <ShoppingCart size={16} /> Crear lista del supermercado
            </button>
          </div>
        </div>
      )}

      {/* MODAL DETALLE DE RECETA MOBILE */}
      {selectedRecipe && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center'
        }}>
          <div className="card-brutal animate-fade-in" style={{
            width: '100%',
            maxWidth: '480px',
            maxHeight: '85vh',
            overflowY: 'auto',
            backgroundColor: 'var(--color-white)',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            padding: '24px 20px',
            position: 'relative'
          }}>
            <button
              onClick={handleCloseRecipeModal}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                backgroundColor: 'var(--color-gray-light)',
                borderRadius: '50%',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} color="#121417" />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span className="badge badge-lime">{selectedRecipe.mealType || 'Receta'}</span>
              <span className="badge badge-dark" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} /> {selectedRecipe.prepTimeMinutes || 20} min
              </span>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '6px' }}>{selectedRecipe.title}</h2>
            <p style={{ color: 'var(--color-gray-text)', fontSize: '0.85rem', marginBottom: '16px' }}>{selectedRecipe.description}</p>

            {/* Ingredientes Requeridos */}
            <div style={{ marginBottom: '18px', backgroundColor: 'var(--color-gray-light)', padding: '14px', borderRadius: '10px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Utensils size={16} color="var(--color-lime-dark)" /> Ingredientes:
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedRecipe.ingredients?.map((ing, idx) => (
                  <li key={idx} style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} color="#2B8A3E" />
                    <span>{ing.name} — {ing.quantity} {ing.unit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pasos de Preparación */}
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={16} color="var(--color-coral)" /> Paso a Paso:
              </h3>
              {selectedRecipe.steps && selectedRecipe.steps.length > 0 ? (
                <ol style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                  {selectedRecipe.steps.map((step, idx) => (
                    <li key={idx} style={{ lineHeight: 1.35 }}>
                      <strong>{step}</strong>
                    </li>
                  ))}
                </ol>
              ) : (
                <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-text)' }}>
                  Paso 1: Cocinar los ingredientes principales a fuego medio. Paso 2: Emplatar y disfrutar caliente.
                </p>
              )}
            </div>

            {/* Tip Saludable */}
            {selectedRecipe.healthyTip && (
              <div style={{ backgroundColor: 'var(--color-lime)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#121417', marginBottom: '18px' }}>
                💡 Tip de Nutrición: {selectedRecipe.healthyTip}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', width: '100%' }}>
              <button
                onClick={() => handleCookRecipe(selectedRecipe)}
                className="btn-brutal"
                style={{ flex: 1, minWidth: '120px', padding: '10px', fontSize: '0.85rem', backgroundColor: 'var(--color-lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
              >
                🍳 Cocinar
              </button>
              <button
                onClick={() => {
                  addToast('¡Receta guardada en favoritos!', 'success');
                  handleCloseRecipeModal();
                }}
                className="btn-brutal btn-secondary"
                style={{ flex: 1, minWidth: '100px', padding: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
              >
                <Heart size={14} /> Guardar
              </button>
              <button onClick={handleCloseRecipeModal} className="btn-brutal btn-secondary" style={{ padding: '10px 16px', fontSize: '0.85rem' }}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
