import React from 'react';
import { Megaphone, Target, Flame, Mail, Send, Video, Instagram, Zap, CheckCircle2 } from 'lucide-react';

export const MarketingPage = () => {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div className="badge badge-coral" style={{ marginBottom: '8px', padding: '6px 14px' }}>
          <Megaphone size={16} /> Estrategia & Marketing de Startup
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900 }}>Loop Kitchen — Launch & Growth Playbook</h1>
        <p style={{ color: 'var(--color-gray-text)', fontSize: '1.05rem', maxWidth: '750px' }}>
          Estrategia completa de posicionamiento de mercado, storytelling, scripts para Reels/Instagram y automatización de embudos de conversión.
        </p>
      </div>

      {/* Grid Section 1: User Persona & Value Prop */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '36px' }}>
        <div className="card-brutal" style={{ backgroundColor: 'var(--color-white)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Target size={24} color="var(--color-lime-dark)" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>User Persona: Agustina (28 años)</h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-text)', marginBottom: '14px' }}>
            Profesional o estudiante ocupada que trabaja tiempo completo, valora su alimentación saludable pero carece de tiempo para planificar las compras y cocinar a diario.
          </p>
          <div style={{ backgroundColor: 'var(--color-gray-light)', padding: '12px 16px', borderRadius: '10px', fontSize: '0.85rem' }}>
            <strong>Pain Points Clave:</strong>
            <ul style={{ paddingLeft: '18px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Fatiga mental diaria por decidir qué cenar.</li>
              <li>Desperdicio de comida por mala organización.</li>
              <li>Presupuesto inflado por compras impulsivas.</li>
            </ul>
          </div>
        </div>

        <div className="card-brutal" style={{ backgroundColor: 'var(--color-lime)', color: '#121417' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Zap size={24} color="#121417" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Propuesta de Valor Única</h2>
          </div>
          <p style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '16px' }}>
            "Loop Kitchen es el copiloto culinario impulsado por IA que elimina la fatiga de decidir qué cocinar, reduce a cero el desperdicio de tu heladera y ahorra hasta un 30% en tu supermercado."
          </p>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9 }}>
            Tono de marca: Cercano, pragmático, moderno, inteligente y eficiente.
          </div>
        </div>
      </div>

      {/* Section 2: Automation Workflow */}
      <div className="card-brutal" style={{ marginBottom: '36px', padding: '28px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Mail size={22} color="var(--color-coral)" /> Flujo de Automatización & Emailing
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ border: '2px solid var(--color-border)', borderRadius: '12px', padding: '16px', backgroundColor: 'var(--color-cream)' }}>
            <span className="badge badge-dark" style={{ marginBottom: '8px' }}>PASO 1</span>
            <h4 style={{ fontWeight: 800 }}>Landing Page</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-text)' }}>Captación de registros con CTA interactivo y demo de IA.</p>
          </div>

          <div style={{ border: '2px solid var(--color-border)', borderRadius: '12px', padding: '16px', backgroundColor: 'var(--color-cream)' }}>
            <span className="badge badge-lime" style={{ marginBottom: '8px' }}>PASO 2</span>
            <h4 style={{ fontWeight: 800 }}>Welcome Email</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-text)' }}>Email automático de bienvenida con guía de primeros pasos.</p>
          </div>

          <div style={{ border: '2px solid var(--color-border)', borderRadius: '12px', padding: '16px', backgroundColor: 'var(--color-cream)' }}>
            <span className="badge badge-blue" style={{ marginBottom: '8px' }}>PASO 3</span>
            <h4 style={{ fontWeight: 800 }}>Newsletter Semanal</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-text)' }}>Envío cada domingo con menú sugerido según preferencias.</p>
          </div>

          <div style={{ border: '2px solid var(--color-border)', borderRadius: '12px', padding: '16px', backgroundColor: 'var(--color-cream)' }}>
            <span className="badge badge-coral" style={{ marginBottom: '8px' }}>PASO 4</span>
            <h4 style={{ fontWeight: 800 }}>Recordatorio Súper</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-text)' }}>Notificación previa al día de compras asignado.</p>
          </div>
        </div>
      </div>

      {/* Section 3: Social Media & Reels Scripts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        <div className="card-brutal">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Video size={22} color="var(--color-coral)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Reel Promocional #1: "Qué cocino hoy"</h3>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-text)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p><strong>Hook (0-3s):</strong> "Dejé de tirar comida a la basura usando esta IA..."</p>
            <p><strong>Desarrollo (3-15s):</strong> Muestra la pantalla ingresando pollo, cebolla y tomate. Gemini devuelve una receta en 2 segundos.</p>
            <p><strong>CTA (15-30s):</strong> "Prueba Loop Kitchen gratis en el link de mi perfil."</p>
          </div>
        </div>

        <div className="card-brutal">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Instagram size={22} color="var(--color-lime-dark)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Carrusel IG: "Ahorra $15.000 en el Súper"</h3>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-text)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p><strong>Slide 1:</strong> 5 Errores comunes al hacer tus compras de la semana.</p>
            <p><strong>Slide 2-4:</strong> Cómo la deducción de despensa evita compras repetidas.</p>
            <p><strong>Slide 5:</strong> Tu plan semanal personalizado con Loop Kitchen Beta.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
