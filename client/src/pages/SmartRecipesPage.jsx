
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Sparkles, Clock, Flame, CheckCircle, AlertTriangle, Plus, Trash2, Heart } from 'lucide-react';
import { SkeletonCard } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';

export const SmartRecipesPage = () => {
  const [ingredients, setIngredients] = useState(() => {
    const saved = localStorage.getItem('loop_smart_ingredients');
    return saved ? JSON.parse(saved) : [];
  });
  const [newIngredient, setNewIngredient] = useState('');
  const [recipes, setRecipes] = useState(() => {
    const saved = localStorage.getItem('loop_smart_recipes');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [loadingPantry, setLoadingPantry] = useState(true);
  const { addToast } = useToast();

  const [showAddToPlannerModal, setShowAddToPlannerModal] = useState(false);
  const [selectedRecipeForPlan, setSelectedRecipeForPlan] = useState(null);
  const [targetDay, setTargetDay] = useState('Lunes');
  const [targetMeal, setTargetMeal] = useState('breakfast');

  useEffect(() => {
    if (ingredients.length > 0) {
      localStorage.setItem('loop_smart_ingredients', JSON.stringify(ingredients));
    }
  }, [ingredients]);

  useEffect(() => {
    if (recipes.length > 0) {
      localStorage.setItem('loop_smart_recipes', JSON.stringify(recipes));
    }
  }, [recipes]);

  useEffect(() => {
    const fetchPantry = async () => {
      try {
        const saved = localStorage.getItem('loop_smart_ingredients');
        if (!saved || JSON.parse(saved).length === 0) {
          const res = await api.getPantry();
          if (res.success && res.pantry) {
            if (res.pantry.length > 0) {
              setIngredients(res.pantry.map(i => i.name.toLowerCase()));
            } else {
              setIngredients(['pollo', 'tomate', 'cebolla', 'arroz', 'queso']);
            }
          }
        }
      } catch (err) {
        addToast('No se pudo cargar la despensa.', 'error');
      } finally {
        setLoadingPantry(false);
      }
    };
    fetchPantry();
  }, []);

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim().toLowerCase())) {
      setIngredients([...ingredients, newIngredient.trim().toLowerCase()]);
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (ing) => {
    setIngredients(ingredients.filter(i => i !== ing));
  };

  const handleGenerateRecipes = async () => {
    if (ingredients.length === 0) {
      addToast('Añade al menos 1 ingrediente para generar recetas.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.getSmartRecipes({ customPantry: ingredients });
      if (res.success) {
        setRecipes(res.recipes);
        addToast('¡Recetas inteligentes generadas con Gemini!', 'success');
      } else {
        addToast(res.message || 'Error al obtener recetas', 'error');
      }
    } catch (error) {
      addToast('Error de comunicación con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCookRecipe = async (recipe) => {
    try {
      const res = await api.useIngredients(recipe.ingredients);
      if (res.success) {
        addToast('¡Receta cocinada! Se descontaron los ingredientes de tu despensa.', 'success');
        const names = res.pantry.map(i => i.name.toLowerCase());
        setIngredients(names);
      } else {
        addToast(res.message || 'Error al cocinar', 'error');
      }
    } catch (error) {
      addToast('Error de comunicación al cocinar', 'error');
    }
  };

  const handleAddToPlannerConfirm = async () => {
    if (!selectedRecipeForPlan) return;
    try {
      let plan = null;
      try {
        const res = await api.getActiveMealPlan();
        if (res.success && res.mealPlan) {
          plan = res.mealPlan;
        }
      } catch (err) {
        // network error
      }

      if (!plan) {
        const saved = localStorage.getItem('loop_weekly_plan');
        if (saved) {
          plan = JSON.parse(saved);
        }
      }

      const emptyMeal = {
        title: "Sin receta",
        description: "Toca para sugerir o agregar una receta.",
        prepTimeMinutes: 0,
        ingredients: [],
        steps: [],
        healthyTip: ""
      };

      if (!plan || !plan.days || plan.days.length === 0) {
        plan = {
          title: 'Plan Personalizado',
          days: ['Lunes', 'Martes', 'Miércoles'].map(day => ({
            dayName: day,
            breakfast: { ...emptyMeal },
            lunch: { ...emptyMeal },
            snack: { ...emptyMeal },
            dinner: { ...emptyMeal }
          }))
        };
      }

      // Check if day exists
      let dayObj = plan.days.find(d => d.dayName.toLowerCase() === targetDay.toLowerCase());
      if (!dayObj) {
        dayObj = {
          dayName: targetDay,
          breakfast: { ...emptyMeal },
          lunch: { ...emptyMeal },
          snack: { ...emptyMeal },
          dinner: { ...emptyMeal }
        };
        plan.days.push(dayObj);
      }

      // Safe check for other meal types on the day object so it doesn't crash WeeklyPlannerPage
      if (!dayObj.breakfast) dayObj.breakfast = { ...emptyMeal };
      if (!dayObj.lunch) dayObj.lunch = { ...emptyMeal };
      if (!dayObj.snack) dayObj.snack = { ...emptyMeal };
      if (!dayObj.dinner) dayObj.dinner = { ...emptyMeal };

      dayObj[targetMeal] = {
        title: selectedRecipeForPlan.title,
        description: selectedRecipeForPlan.description || '',
        prepTimeMinutes: selectedRecipeForPlan.prepTimeMinutes || 15,
        ingredients: selectedRecipeForPlan.ingredients || [],
        steps: selectedRecipeForPlan.steps || [],
        healthyTip: selectedRecipeForPlan.tips ? selectedRecipeForPlan.tips[0] : ''
      };

      try {
        await api.saveWeeklyPlan(plan);
      } catch (err) {
        // save offline fallback only
      }
      localStorage.setItem('loop_weekly_plan', JSON.stringify(plan));

      const mealLabel = targetMeal === 'breakfast' ? 'Desayuno' : targetMeal === 'lunch' ? 'Almuerzo' : targetMeal === 'snack' ? 'Merienda' : 'Cena';
      addToast(`¡Receta agregada al plan del ${targetDay} (${mealLabel})!`, 'success');
      setShowAddToPlannerModal(false);
      setSelectedRecipeForPlan(null);
    } catch (error) {
      console.error(error);
      addToast('Error al agregar al planificador.', 'error');
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div className="badge badge-lime" style={{ marginBottom: '8px' }}>Funcionalidad IA 1</div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900 }}>Recetas Inteligentes con Gemini IA</h1>
        <p style={{ color: 'var(--color-gray-text)', fontSize: '1rem' }}>
          Indica los alimentos disponibles en tu hogar y la IA creará platos nutritivos con tiempos, calorías e ingredientes faltantes.
        </p>
      </div>

      {/* Ingredient Tag Selector */}
      <div className="card-brutal" style={{ marginBottom: '36px', padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px' }}>Tus Ingredientes Disponibles:</h3>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' }}>
          {ingredients.map((ing) => (
            <span
              key={ing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                backgroundColor: 'var(--color-lime)',
                border: '2px solid #121417',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '0.9rem',
                boxShadow: '2px 2px 0px #121417'
              }}
            >
              {ing}
              <button onClick={() => handleRemoveIngredient(ing)} style={{ padding: 0, display: 'flex', alignItems: 'center' }}>
                <Trash2 size={14} color="#121417" />
              </button>
            </span>
          ))}
        </div>

        <form onSubmit={handleAddIngredient} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            placeholder="Añadir otro ingrediente (ej. palta, espinaca)"
            style={{
              flex: 1,
              minWidth: '220px',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '2px solid var(--color-border)',
              outline: 'none',
              fontSize: '0.95rem'
            }}
          />
          <button type="submit" className="btn-brutal btn-secondary" style={{ padding: '10px 18px' }}>
            <Plus size={18} /> Agregar
          </button>
          <button
            type="button"
            onClick={handleGenerateRecipes}
            disabled={loading}
            className="btn-brutal"
            style={{ padding: '10px 24px' }}
          >
            {loading ? 'Cocinando recetas con IA...' : <><Sparkles size={18} /> Generar Recetas IA</>}
          </button>
        </form>
      </div>

      {/* Recipe Cards List */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px' }}>
          {recipes.length > 0 ? `Recetas Sugeridas (${recipes.length})` : 'Recetas Generadas'}
        </h2>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : recipes.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="Sin recetas generadas aún"
            description="Haz clic en 'Generar Recetas IA' para que Gemini analice tus ingredientes y cree platos exquisitos."
            actionText="Generar Recetas Ahora"
            onAction={handleGenerateRecipes}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {recipes.map((recipe, index) => (
              <div key={index} className="card-brutal" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>{recipe.title}</h3>
                    <span className="badge badge-dark">{recipe.difficulty}</span>
                  </div>

                  <p style={{ color: 'var(--color-gray-text)', fontSize: '0.9rem', marginBottom: '16px' }}>
                    {recipe.description}
                  </p>

                  <div style={{ display: 'flex', gap: '14px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px', color: 'var(--color-dark)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={16} color="var(--color-lime-dark)" /> {recipe.prepTimeMinutes} min
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Flame size={16} color="var(--color-coral)" /> {recipe.nutritionalInfo?.calories || 400} kcal
                    </span>
                    <span>Proteína: {recipe.nutritionalInfo?.protein || 25}g</span>
                  </div>

                  <div style={{ borderTop: '1px solid var(--color-gray-light)', paddingTop: '12px', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '6px' }}>Ingredientes Faltantes:</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {recipe.ingredients.filter(i => !i.inPantry).length === 0 ? (
                        <span style={{ fontSize: '0.85rem', color: '#2B8A3E', fontWeight: 700 }}>¡Tienes todos los ingredientes! 🎉</span>
                      ) : (
                        recipe.ingredients.filter(i => !i.inPantry).map((ing, i) => (
                          <span key={i} className="badge badge-coral">{ing.name} ({ing.quantity} {ing.unit})</span>
                        ))
                      )}
                    </div>
                  </div>

                  {recipe.healthyVariants && recipe.healthyVariants.length > 0 && (
                    <div style={{ backgroundColor: 'var(--color-gray-light)', padding: '10px 12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '12px' }}>
                      <strong>Variante Saludable:</strong> {recipe.healthyVariants[0]}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', width: '100%' }}>
                  <button
                    onClick={() => handleCookRecipe(recipe)}
                    className="btn-brutal"
                    style={{ width: '100%', backgroundColor: 'var(--color-lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    🍳 Cocinar Receta
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRecipeForPlan(recipe);
                      setShowAddToPlannerModal(true);
                    }}
                    className="btn-brutal btn-secondary"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    📅 Agregar al Planificador
                  </button>
                  <button
                    onClick={() => addToast('¡Receta guardada en tus favoritos!', 'success')}
                    className="btn-brutal btn-secondary"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Heart size={16} /> Guardar en Favoritos
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Agregar al Planificador */}
      {showAddToPlannerModal && selectedRecipeForPlan && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '16px'
        }} className="animate-fade-in">
          <div className="card-brutal animate-slide-up" style={{ backgroundColor: 'var(--color-cream)', maxWidth: '400px', width: '100%', padding: '24px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '8px' }}>📅 Agregar a mi Plan</h3>
            <p style={{ color: 'var(--color-gray-text)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Elige el día y la comida donde quieres planificar <strong>{selectedRecipeForPlan.title}</strong>:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '4px' }}>Día de la semana:</label>
                <select
                  value={targetDay}
                  onChange={(e) => setTargetDay(e.target.value)}
                  className="input-brutal"
                  style={{ width: '100%', padding: '8px' }}
                >
                  <option value="Lunes">Lunes</option>
                  <option value="Martes">Martes</option>
                  <option value="Miércoles">Miércoles</option>
                  <option value="Jueves">Jueves</option>
                  <option value="Viernes">Viernes</option>
                  <option value="Sábado">Sábado</option>
                  <option value="Domingo">Domingo</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '4px' }}>Tipo de comida:</label>
                <select
                  value={targetMeal}
                  onChange={(e) => setTargetMeal(e.target.value)}
                  className="input-brutal"
                  style={{ width: '100%', padding: '8px' }}
                >
                  <option value="breakfast">🍳 Desayuno</option>
                  <option value="lunch">🥗 Almuerzo</option>
                  <option value="snack">🍎 Merienda</option>
                  <option value="dinner">🍲 Cena</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleAddToPlannerConfirm}
                className="btn-brutal"
                style={{ flex: 1, padding: '10px', fontSize: '0.85rem', backgroundColor: 'var(--color-lime)' }}
              >
                Confirmar
              </button>
              <button
                onClick={() => {
                  setShowAddToPlannerModal(false);
                  setSelectedRecipeForPlan(null);
                }}
                className="btn-brutal btn-secondary"
                style={{ padding: '10px 16px', fontSize: '0.85rem' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
