import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserPlus, Sparkles } from 'lucide-react';

export const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await register(username, email, password);
      if (res.success) {
        addToast(`¡Cuenta creada con éxito, ${res.user.username}!`, 'success');
        navigate('/app');
      } else {
        addToast(res.message || 'Error al registrarse', 'error');
      }
    } catch (err) {
      addToast('Error de conexión con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '60px auto', padding: '0 24px' }}>
      <div className="card-brutal animate-fade-in" style={{ padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', backgroundColor: 'var(--color-lime)', padding: '12px', borderRadius: '14px', border: '2px solid #121417', marginBottom: '12px' }}>
            <Sparkles size={28} color="#121417" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Crear Cuenta</h2>
          <p style={{ color: 'var(--color-gray-text)', fontSize: '0.9rem', marginTop: '4px' }}>Únete a la nueva era de la planificación culinaria</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>Nombre de Usuario</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Agustina Rossi"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '2px solid var(--color-border)',
                outline: 'none',
                fontFamily: 'inherit',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agustina@ejemplo.com"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '2px solid var(--color-border)',
                outline: 'none',
                fontFamily: 'inherit',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>Contraseña</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '2px solid var(--color-border)',
                outline: 'none',
                fontFamily: 'inherit',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-brutal" style={{ width: '100%', marginTop: '8px' }}>
            {loading ? 'Creando cuenta...' : <><UserPlus size={18} /> Crear Cuenta Gratis</>}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--color-gray-text)' }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ fontWeight: 700, color: 'var(--color-dark)', textDecoration: 'underline' }}>Inicia sesión aquí</Link>
        </div>
      </div>
    </div>
  );
};
