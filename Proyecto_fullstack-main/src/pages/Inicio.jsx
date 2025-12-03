import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Link, useNavigate } from 'react-router-dom';



const quotes = [
    "Respira. Estás haciendo lo mejor que puedes.",
    "Un paso a la vez.",
    "Sé amable contigo hoy."
];

export default function Inicio() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [dailyQuote, setDailyQuote] = useState('');

    
    useEffect(() => {
        // Este efecto ahora solo se encarga de la cita diaria.
        // La redirección la maneja RutasProtegidas.jsx
        setDailyQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, []);

    // Si el usuario aún no se ha cargado, devolvemos null.
    // El componente RutasProtegidas se encargará de mostrar "Cargando..." o de redirigir.
    if (!user) {
        return null;
    }

    const userName = user.nombre.split(' ')[0];

    return (
        
        <div className="container page-container">
            <div className="card card-compact"> 
                <h2 id="greeting">Hola, {userName} 👋</h2>
                <p id="dailyQuote" className="small-muted">{dailyQuote}</p>
            </div>

            <div className="grid" style={{ marginTop: '16px' }}> 
                {/* La tarjeta del Diario solo se muestra si el usuario NO es un invitado */}
                {!user.isGuest && <Link className="card card-compact" to="/diario"><h4>📓 Diario emocional</h4><p className="small-muted">Registra cómo te sientes</p></Link>}
                
                <Link className="card card-compact" to="/tecnicas"><h4>🧘 Técnicas</h4><p className="small-muted">Respiración y grounding</p></Link>
                <Link className="card card-compact" to="/chat"><h4>💬 Chat de apoyo</h4><p className="small-muted">Habla con un voluntario</p></Link>
                <Link className="card card-compact" to="/recursos"><h4>📚 Recursos</h4><p className="small-muted">Artículos y ejercicios</p></Link>
                <Link className="card card-compact" to="/emergencia"><h4>🚨 Emergencia</h4><p className="small-muted">Contactos de ayuda inmediata</p></Link>
            </div>
        </div>
    );
}