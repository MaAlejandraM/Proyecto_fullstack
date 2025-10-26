import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

export default function Register() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [pass1, setPass1] = useState('');
    const [pass2, setPass2] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        
        if (!email || !nombre || !pass1 || !pass2) {
            setError("Todos los campos deben ser llenados");
            setLoading(false);
            return;
        }
        if (pass1 !== pass2) {
            setError("Las contraseñas no coinciden");
            setLoading(false);
            return;
        }
        if (pass1.length < 3) {
             setError("La contraseña debe tener al menos 3 caracteres.");
             setLoading(false);
             return;
        }


        try {
            await register({
                nombreCompleto: nombre,
                correoElectronico: email,
                password: pass1 
            });
            
            navigate('/');
        } catch (err) {
            setError(err.message || "Ocurrió un error inesperado.");
            setLoading(false);
        }
    };

    return (
        
        <div className="container">
            <div className="card" style={{ maxWidth: '400px', margin: '50px auto', padding: '30px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--text)' }}>Crear Cuenta</h2>

                {error && <Alert variant="danger">{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="nombreCompleto" style={{ display: 'block', marginBottom: '5px', fontWeight: 600, color: 'var(--text)' }}>Nombre Completo</label>
                        <input
                            type="text"
                            id="nombreCompleto"
                            className="input"
                            placeholder="Tu nombre completo"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="correoElectronico" style={{ display: 'block', marginBottom: '5px', fontWeight: 600, color: 'var(--text)' }}>Correo Electrónico</label>
                        <input
                            type="email"
                            id="correoElectronico"
                            className="input"
                            placeholder="correo@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="password1" style={{ display: 'block', marginBottom: '5px', fontWeight: 600, color: 'var(--text)' }}>Contraseña</label>
                        <input
                            type="password"
                            id="password1"
                            className="input"
                            placeholder="Tu contraseña"
                            value={pass1}
                            onChange={(e) => setPass1(e.target.value)}
                            required
                            minLength="3"
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="password2" style={{ display: 'block', marginBottom: '5px', fontWeight: 600, color: 'var(--text)' }}>Repetir Contraseña</label>
                        <input
                            type="password"
                            id="password2"
                            className="input"
                            placeholder="Confirma tu contraseña"
                            value={pass2}
                            onChange={(e) => setPass2(e.target.value)}
                            required
                            minLength="3"
                        />
                    </div>
                    <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Registrando...' : 'Registrar'}
                    </button>
                </form>
                <p style={{ marginTop: '15px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.9rem' }}>
                    ¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Inicia sesión aquí</Link>
                </p>
            </div>
        </div>
    );
}