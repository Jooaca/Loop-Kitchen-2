import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Sparkles, Calendar, ShoppingCart, Archive, ArrowRight, Utensils, X, Clock, Heart, BookOpen, CheckCircle2 } from 'lucide-react';
import { SkeletonCard } from '../components/Skeleton';
import { useToast } from '../context/ToastContext';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [pantryCount, setPantryCount] = useState(0);
  const [groceryCount, setGroceryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [mealPlan, setMealPlan] = useState(() => {
    const saved = localStorage.getItem('loop_weekly_plan');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeDay, setActiveDay] = useState('Lunes');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pantryRes, groceryRes, planRes] = await Promise.all([
          api.getPantry(),
          api.getGroceryList(),
          api.getActiveMealPlan()
        ]);

        if (pantryRes.success) setPantryCount(pantryRes.pantry.length);
        if (groceryRes.success) setGroceryCount(groceryRes.groceryList.items.length);
        
        if (planRes.success && planRes.mealPlan) {
          setMealPlan(planRes.mealPlan);
          localStorage.setItem('loop_weekly_plan', JSON.stringify(planRes.mealPlan));
          if (planRes.mealPlan.days && planRes.mealPlan.days.length > 0) {
            setActiveDay(planRes.mealPlan.days[0].dayName);
          }
        }
      } catch (error) {
        console.error('Dashboard load error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('loop_weekly_plan');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.days && parsed.days.length > 0) {
        setActiveDay(parsed.days[0].dayName);
      }
    }
  }, []);

  const handleOpenRecipeModal = (meal, mealType) => {
    if (!meal) return;
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
        // Update pantry count stat on dashboard
        const pantryRes = await api.getPantry();
        if (pantryRes.success) {
          setPantryCount(pantryRes.pantry.length);
        }
      } else {
        addToast(res.message || 'Error al cocinar', 'error');
      }
    } catch (error) {
      addToast('Error al conectar con la despensa', 'error');
    }
  };

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

      {/* Tu Menú del Día o Planificador Semanal IA */}
      {mealPlan ? (
        <div className="card-brutal" style={{ padding: '18px', marginBottom: '20px', backgroundColor: 'var(--color-cream)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div className="badge badge-dark" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} color="var(--color-lime)" /> Menú Semanal Activo
            </div>
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', maxWidth: '60%', paddingBottom: '4px' }}>
              {mealPlan.days.map((day) => (
                <button
                  key={day.dayName}
                  onClick={() => setActiveDay(day.dayName)}
                  className={`btn-brutal ${activeDay === day.dayName ? '' : 'btn-secondary'}`}
                  style={{ padding: '4px 8px', fontSize: '0.7rem', whiteSpace: 'nowrap' }}
                >
                  {day.dayName}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {mealPlan.days
              .filter((day) => day.dayName === activeDay)
              .map((day) => (
                <React.Fragment key={day.dayName}>
                  {day.breakfast && (
                    <div
                      onClick={() => handleOpenRecipeModal(day.breakfast, 'Desayuno')}
                      style={{ backgroundColor: 'var(--color-white)', cursor: 'pointer', padding: '10px', borderRadius: '8px', border: '2px solid var(--color-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      className="animate-fade-in"
                    >
                      <div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-lime-dark)' }}>Desayuno:</span>
                        <strong style={{ fontSize: '0.85rem', marginLeft: '6px' }}>{day.breakfast.title || 'Sin receta'}</strong>
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-lime-dark)' }}>Ver 📖</span>
                    </div>
                  )}

                  {day.lunch && (
                    <div
                      onClick={() => handleOpenRecipeModal(day.lunch, 'Almuerzo')}
                      style={{ backgroundColor: 'var(--color-white)', cursor: 'pointer', padding: '10px', borderRadius: '8px', border: '2px solid var(--color-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      className="animate-fade-in"
                    >
                      <div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-coral)' }}>Almuerzo:</span>
                        <strong style={{ fontSize: '0.85rem', marginLeft: '6px' }}>{day.lunch.title || 'Sin receta'}</strong>
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-coral)' }}>Ver 📖</span>
                    </div>
                  )}

                  {day.snack && (
                    <div
                      onClick={() => handleOpenRecipeModal(day.snack, 'Merienda')}
                      style={{ backgroundColor: 'var(--color-white)', cursor: 'pointer', padding: '10px', borderRadius: '8px', border: '2px solid var(--color-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      className="animate-fade-in"
                    >
                      <div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-blue)' }}>Merienda:</span>
                        <strong style={{ fontSize: '0.85rem', marginLeft: '6px' }}>{day.snack.title || 'Sin receta'}</strong>
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-blue)' }}>Ver 📖</span>
                    </div>
                  )}

                  {day.dinner && (
                    <div
                      onClick={() => handleOpenRecipeModal(day.dinner, 'Cena')}
                      style={{ backgroundColor: 'var(--color-white)', cursor: 'pointer', padding: '10px', borderRadius: '8px', border: '2px solid var(--color-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      className="animate-fade-in"
                    >
                      <div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-dark)' }}>Cena:</span>
                        <strong style={{ fontSize: '0.85rem', marginLeft: '6px' }}>{day.dinner.title || 'Sin receta'}</strong>
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-lime-dark)' }}>Ver 📖</span>
                    </div>
                  )}
                </React.Fragment>
              ))}
          </div>
        </div>
      ) : (
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
      )}

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

      {/* MODAL DETALLE DE RECETA MOBILE DESDE EL INICIO */}
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
                {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 ? (
                  selectedRecipe.ingredients.map((ing, idx) => (
                    <li key={idx} style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={14} color="#2B8A3E" />
                      <span>{ing.name} — {ing.quantity} {ing.unit}</span>
                    </li>
                  ))
                ) : (
                  <li style={{ fontSize: '0.8rem', color: 'var(--color-gray-text)' }}>No se especifican ingredientes para esta comida.</li>
                )}
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
                  Paso 1: Preparar los ingredientes principales. Paso 2: Servir y disfrutar de forma saludable.
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
                🍳 Cocinar receta
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
                Volver para atrás
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
