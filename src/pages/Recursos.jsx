import React from 'react';
import { ListGroup } from 'react-bootstrap'; 

export default function Recursos() {
  return (
    <div className="container">
      <div className="card">
        <h2>Recursos</h2>
        <p className="small-muted">Artículos y ejercicios para tu bienestar.</p>

        <ListGroup variant="flush" className="mt-3">
          <ListGroup.Item action href="#" onClick={e => e.preventDefault()} className="p-3">
            <strong style={{color: 'var(--text)'}}>Artículo: Entendiendo la Ansiedad</strong>
            <p className="small-muted mb-0">Aprende sobre qué es la ansiedad y cómo se manifiesta.</p>
          </ListGroup.Item>
          <ListGroup.Item action href="#" onClick={e => e.preventDefault()} className="p-3">
            <strong style={{color: 'var(--text)'}}>Ejercicio: Meditación guiada de 5 minutos</strong>
            <p className="small-muted mb-0">Un audio simple para empezar tu día con calma.</p>
          </ListGroup.Item>
          <ListGroup.Item action href="#" onClick={e => e.preventDefault()} className="p-3">
            <strong style={{color: 'var(--text)'}}>Artículo: La importancia de una rutina de sueño</strong>
            <p className="small-muted mb-0">Consejos para mejorar tu descanso y tu salud mental.</p>
          </ListGroup.Item>
           <ListGroup.Item action href="#" onClick={e => e.preventDefault()} className="p-3">
            <strong style={{color: 'var(--text)'}}>Enlace: Recursos de Salud Mental MINSAL</strong>
            <p className="small-muted mb-0">Accede a la guía oficial del Ministerio de Salud.</p>
          </ListGroup.Item>
        </ListGroup>
      </div>
    </div>
  );
}