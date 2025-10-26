import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        
        if (email.length < 3 || password.length < 3) {
            setError("Los datos ingresados deben ser mayores a 3 caracteres");
            setLoading(false);
            return;
        }

        try {
            await login({ email, password });
            navigate('/'); 
        } catch (err) {
            setError(err.message || "Ocurrió un error inesperado.");
            setLoading(false);
        }
        
    };

    return (
        
        <div className="container">
            <div className="card" style={{ maxWidth: '400px', margin: '50px auto', padding: '30px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--text)' }}>Iniciar Sesión</h2>

                {error && <Alert variant="danger">{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="UserLabel" style={{ display: 'block', marginBottom: '5px', fontWeight: 600, color: 'var(--text)' }}>Correo Electrónico</label>
                        <input
                            type="email"
                            id="UserLabel"
                            className="input" 
                            placeholder="correo@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="inputPassword6" style={{ display: 'block', marginBottom: '5px', fontWeight: 600, color: 'var(--text)' }}>Contraseña</label>
                        <input
                            type="password"
                            id="inputPassword6"
                            className="input"
                            placeholder="Tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="3"
                        />
                    </div>
                    <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                    </button>
                    <p style={{ marginTop: '15px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.9rem' }}>
                        ¿No tienes cuenta? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Regístrate aquí</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}