import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, ShoppingCart, ShieldCheck, ArrowRight, TrendingUp, CheckCircle, Zap, DollarSign, Heart } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '60px 0 40px' }} className="animate-fade-in">
        <div className="badge badge-dark" style={{ marginBottom: '16px', padding: '6px 14px', fontSize: '0.85rem' }}>
          <Sparkles size={16} /> Loop Kitchen 2.0 Beta — Impulsado por Google Gemini IA
        </div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-1px' }}>
          Tu Asistente de Cocina Inteligente.<br />
          <span style={{ backgroundColor: 'var(--color-lime)', padding: '0 12px', border: '3px solid #121417', borderRadius: '12px', boxShadow: '4px 4px 0px #121417' }}>
            Planifica. Ahorra. Disfruta.
          </span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--color-gray-text)', maxWidth: '750px', margin: '0 auto 32px', fontWeight: 500 }}>
          Transforma lo que tienes en tu heladera en un menú semanal delicioso de 7 días, genera la lista de compras exacta sin desperdicios y ahorra dinero en el supermercado con Inteligencia Artificial.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn-brutal" style={{ fontSize: '1.1rem', padding: '14px 28px' }}>
            Probar gratis ahora <ArrowRight size={20} />
          </Link>
          <Link to="/login" className="btn-brutal btn-secondary" style={{ fontSize: '1.1rem', padding: '14px 28px' }}>
            Iniciar sesión
          </Link>
        </div>
      </section>

      {/* Feature Highlight Banner */}
      <section className="card-brutal" style={{ backgroundColor: 'var(--color-lime)', margin: '40px 0', padding: '36px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{ backgroundColor: '#121417', color: 'var(--color-lime)', padding: '12px', borderRadius: '12px' }}>
            <Calendar size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Planificador Semanal IA</h3>
            <p style={{ fontSize: '0.9rem', color: '#121417', opacity: 0.9 }}>Genera menús de Lunes a Domingo adaptados a tu presupuesto, alergias y objetivos.</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{ backgroundColor: '#121417', color: 'var(--color-lime)', padding: '12px', borderRadius: '12px' }}>
            <Sparkles size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Recetas con lo que Tienes</h3>
            <p style={{ fontSize: '0.9rem', color: '#121417', opacity: 0.9 }}>Ingresa tus ingredientes en la despensa y recibe recetas instantáneas paso a paso.</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{ backgroundColor: '#121417', color: 'var(--color-lime)', padding: '12px', borderRadius: '12px' }}>
            <ShoppingCart size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Carrito Inteligente</h3>
            <p style={{ fontSize: '0.9rem', color: '#121417', opacity: 0.9 }}>Crea tu lista de compras restando lo disponible y optimízala para ahorrar dinero.</p>
          </div>
        </div>
      </section>

      {/* Pain Points vs Loop Kitchen Comparison */}
      <section style={{ margin: '60px 0' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, textAlign: 'center', marginBottom: '40px' }}>
          ¿Por qué necesitas Loop Kitchen?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div className="card-brutal" style={{ backgroundColor: '#FFF0F0' }}>
            <h3 style={{ color: '#D93838', fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ❌ El Método Tradicional
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
              <li>• Agotamiento mental pensando "qué cocinar hoy".</li>
              <li>• Compras impulsivas y comida echada a perder en la heladera.</li>
              <li>• Gasto excesivo en delivery y comida rápida poco saludable.</li>
              <li>• Listas de supermercado en papel desorganizadas.</li>
            </ul>
          </div>

          <div className="card-brutal" style={{ backgroundColor: '#F4FCE3' }}>
            <h3 style={{ color: '#2B8A3E', fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ✅ Con Loop Kitchen Beta
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
              <li>• Plan de comidas semanal completo listo en 1-Click con Gemini IA.</li>
              <li>• Aprovechamiento al 100% de los ingredientes que ya tienes.</li>
              <li>• Ahorro estimado de hasta un 30% en tu presupuesto de supermercado.</li>
              <li>• Lista de supermercado calculada automáticamente.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="card-brutal" style={{ backgroundColor: '#121417', color: '#FFF', padding: '48px 36px', textAlign: 'center', margin: '60px 0' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--color-lime)', marginBottom: '16px' }}>
          Comienza a organizar tu cocina hoy mismo
        </h2>
        <p style={{ fontSize: '1.1rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto 28px' }}>
          Únete a la nueva era de la planificación alimentaria inteligente. Regístrate gratis en menos de 1 minuto.
        </p>
        <Link to="/register" className="btn-brutal" style={{ fontSize: '1.1rem', padding: '14px 32px' }}>
          Crear mi cuenta gratuita <ArrowRight size={20} />
        </Link>
      </section>
    </div>
  );
};
