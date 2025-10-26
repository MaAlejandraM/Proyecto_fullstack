import React from 'react';
import { Card, ListGroup } from 'react-bootstrap'; 

export default function Emergencia() {
  return (
    <div className="container page-container">
      
      <Card style={{borderColor: '#dc3545', borderWidth: '2px'}} className="p-3">
        <Card.Body>
          <Card.Title as="h2" style={{color: '#dc3545'}}>Ayuda Inmediata</Card.Title>
          <Card.Subtitle className="mb-3 text-muted small-muted">
            Si estás en una crisis o tu vida corre peligro, por favor, contacta a un profesional inmediatamente.
          </Card.Subtitle>

          
          <ListGroup variant="flush" className="mt-3">
            <ListGroup.Item action href="tel:131" className="p-3">
              <strong style={{fontSize: '1.1rem', color: 'var(--text)'}}>SAMU (Emergencias Médicas)</strong>
              <p className="mb-0">Teléfono: <strong>131</strong></p>
            </ListGroup.Item>
            <ListGroup.Item action href="tel:6003607777" className="p-3"> {/* Número actualizado o genérico */}
              <strong style={{fontSize: '1.1rem', color: 'var(--text)'}}>Salud Responde</strong>
              <p className="mb-0">Teléfono: <strong>600 360 7777</strong> (Opción de ayuda psicológica)</p>
            </ListGroup.Item>
             <ListGroup.Item action href="tel:133" className="p-3">
              <strong style={{fontSize: '1.1rem', color: 'var(--text)'}}>Carabineros (Emergencia Policial)</strong>
              <p className="mb-0">Teléfono: <strong>133</strong></p>
            </ListGroup.Item>
          </ListGroup>
          <p className="mt-4"><strong>No estás solo/a.</strong> Busca ayuda profesional si la necesitas.</p>
        </Card.Body>
      </Card>
    </div>
  );
}