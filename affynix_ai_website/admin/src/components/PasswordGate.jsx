import { useState, useEffect } from 'react';

/**
 * Password Gate Component
 * 
 * Adds an additional layer of password protection before accessing admin
 */

export default function PasswordGate({ children }) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if already authenticated
    const stored = sessionStorage.getItem('admin_gate_authenticated');
    if (stored === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get password from environment or use a default
    // In production, this should be set via Vercel environment variables
    const expectedPassword = import.meta.env.VITE_ADMIN_GATE_PASSWORD || process.env.ADMIN_GATE_PASSWORD;
    
    if (!expectedPassword) {
      // No password set, allow access
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_gate_authenticated', 'true');
      return;
    }
    
    if (password === expectedPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_gate_authenticated', 'true');
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return children;
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0B0B0B',
      color: '#fff'
    }}>
      <div style={{
        background: '#1A1A1A',
        padding: '3rem',
        borderRadius: '12px',
        border: '1px solid #C6A45E30',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '1rem',
          color: '#C6A45E',
          textAlign: 'center'
        }}>
          Admin Access
        </h1>
        <p style={{
          color: '#888',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Please enter the admin password to continue
        </p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={{
              width: '100%',
              padding: '1rem',
              background: '#0A0A0A',
              border: '1px solid #C6A45E30',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}
            autoFocus
          />
          
          {error && (
            <div style={{
              color: '#ff4444',
              marginBottom: '1rem',
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '1rem',
              background: '#C6A45E',
              color: '#0A0A0A',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Access Admin
          </button>
        </form>
      </div>
    </div>
  );
}

