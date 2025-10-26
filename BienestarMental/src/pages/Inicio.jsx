import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Link } from 'react-router-dom'; 


const quotes = [
    "Respira. Estás haciendo lo mejor que puedes.",
    "Un paso a la vez.",
    "Sé amable contigo hoy."
];

export default function Inicio() {
    const { user } = useAuth();
    const [dailyQuote, setDailyQuote] = useState('');

    
    useEffect(() => {
        setDailyQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, []); 

    
    const userName = user && user.nombre ? user.nombre.split(' ')[0] : 'usuario';

    return (
        
        <div className="container">
            <div className="card card-compact"> 
                <h2 id="greeting">Hola, {userName} 👋</h2>
                <p id="dailyQuote" className="small-muted">{dailyQuote}</p>
            </div>

            <div className="grid" style={{ marginTop: '16px' }}> 
                
                <Link className="card card-compact" to="/diario">
                    <h4>📓 Diario emocional</h4>
                    <p className="small-muted">Registra cómo te sientes</p>
                </Link>
                <Link className="card card-compact" to="/tecnicas">
                    <h4>🧘 Técnicas</h4>
                    <p className="small-muted">Respiración y grounding</p>
                </Link>
                <Link className="card card-compact" to="/chat">
                    <h4>💬 Chat de apoyo</h4>
                    <p className="small-muted">Habla con un voluntario</p>
                </Link>
                <Link className="card card-compact" to="/recursos">
                    <h4>📚 Recursos</h4>
                    <p className="small-muted">Artículos y ejercicios</p>
                </Link>
            </div>
        </div>
    );
}