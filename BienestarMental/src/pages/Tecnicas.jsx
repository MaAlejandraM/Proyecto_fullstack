import React, { useState, useRef, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap'; 

export default function Tecnicas() {
  
  const [breathState, setBreathState] = useState('idle'); 
  const breathIntervalRef = useRef(null);

  
  const groundingSteps = [
    'Nombra 5 cosas que puedas ver',
    'Nombra 4 cosas que puedas tocar',
    'Nombra 3 cosas que puedas escuchar',
    'Nombra 2 cosas que puedas oler',
    'Nombra 1 cosa que puedas saborear'
  ];
  const [groundIndex, setGroundIndex] = useState(-1);
  const groundIntervalRef = useRef(null);

  
  const [circleScale, setCircleScale] = useState(1);

  
  const startBreathing = () => {
    if (breathIntervalRef.current) return; 
    setBreathState('inhale');
    setCircleScale(1.2);
    let state = 'inhale';
    breathIntervalRef.current = setInterval(() => {
      if (state === 'inhale') {
        state = 'hold';
        setBreathState('hold');
      } else if (state === 'hold') {
        state = 'exhale';
        setBreathState('exhale');
        setCircleScale(0.8);
      } else {
        state = 'inhale';
        setBreathState('inhale');
        setCircleScale(1.2);
      }
    }, 4000);
  };

  const stopBreathing = () => {
    if (breathIntervalRef.current) {
      clearInterval(breathIntervalRef.current);
      breathIntervalRef.current = null;
    }
    setBreathState('idle');
    setCircleScale(1);
  };

  
  const startGrounding = () => {
    if (groundIntervalRef.current) return; 
    setGroundIndex(0);
    groundIntervalRef.current = setInterval(() => {
      setGroundIndex(prev => {
        if (prev + 1 < groundingSteps.length) return prev + 1;
        // completar
        clearInterval(groundIntervalRef.current);
        groundIntervalRef.current = null;
        return groundingSteps.length; 
      });
    }, 6000);
  };

  
  useEffect(() => {
    return () => {
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
      if (groundIntervalRef.current) clearInterval(groundIntervalRef.current);
    };
  }, []);

  return (
    <div className="container">
      <Card className="p-3">
        <Card.Body>
          <Card.Title as="h2">Técnicas de Bienestar</Card.Title>
          <Card.Subtitle className="mb-3 text-muted small-muted">
            Ejercicios de respiración y grounding para encontrar la calma.
          </Card.Subtitle>

          <div className="mt-4">
            <h4>Respiración guiada</h4>
            <p>Observa las instrucciones y sigue el movimiento del círculo.</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div
                  aria-hidden
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg,#9be7ff,#7ec8ff)',
                    transform: `scale(${circleScale})`,
                    transition: 'transform 600ms ease',
                    margin: 'auto'
                  }}
                />
                <div className="small-muted mt-2" style={{ minHeight: '1.5rem' }}>
                  {breathState === 'idle' && 'Presiona iniciar para comenzar'}
                  {breathState === 'inhale' && 'Inhala...'}
                  {breathState === 'hold' && 'Mantén...'}
                  {breathState === 'exhale' && 'Exhala...'}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Button onClick={startBreathing} disabled={!!breathIntervalRef.current} variant="primary">Iniciar respiración</Button>
                <Button onClick={stopBreathing} variant="secondary">Detener</Button>
              </div>
            </div>

            <p className="mt-3 small-muted">Sigue el ritmo: inhale (4s) → hold (4s) → exhale (4s).</p>
          </div>

          <hr className="my-4" />

          <div className="mt-3">
            <h4>Grounding 5-4-3-2-1</h4>
            <p>Usa tus 5 sentidos para conectarte con el presente.</p>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: 12 }}>
              <Button onClick={startGrounding} disabled={!!groundIntervalRef.current} variant="primary">Iniciar Grounding</Button>
              <div className="small-muted">{groundIndex === -1 ? 'Pulsa iniciar para comenzar' : ''}</div>
            </div>

            <div className="mt-3">
              {groundIndex >= 0 && groundIndex < groundingSteps.length && (
                <div className="p-3" style={{ borderRadius: 8, background: '#f8f9fa' }}>
                  <strong>Paso {groundIndex + 1}:</strong>
                  <div className="mt-2">{groundingSteps[groundIndex]}</div>
                </div>
              )}

              {groundIndex >= groundingSteps.length && (
                <div className="p-3" style={{ borderRadius: 8, background: '#e6ffe6' }}>
                  Ejercicio completado ✅
                </div>
              )}
            </div>

            <ul style={{listStyleType: 'none', paddingLeft: 0, lineHeight: '1.8', marginTop: 16}}>
              <li>👁️ Identifica <strong>5</strong> cosas que puedas ver a tu alrededor.</li>
              <li>🖐️ Identifica <strong>4</strong> cosas que puedas tocar.</li>
              <li>🎧 Identifica <strong>3</strong> cosas que puedas oír.</li>
              <li>👃 Identifica <strong>2</strong> cosas que puedas oler.</li>
              <li>👅 Identifica <strong>1</strong> cosa que puedas saborear.</li>
            </ul>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}