import React, { useState, useEffect, useRef } from 'react';
import { Form, Button } from 'react-bootstrap'; // Usar Form y Button
import { useAuth } from '../auth/AuthContext';

const makeKey = (correo) => `mensajesChat_${correo}`;

const loadMessages = (correo) => {
  if (!correo) return [];
  try {
    const raw = localStorage.getItem(makeKey(correo));
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error cargando mensajes', e);
    return [];
  }
};

const saveMessages = (correo, list) => {
  if (!correo) return false;
  try {
    localStorage.setItem(makeKey(correo), JSON.stringify(list));
    return true;
  } catch (e) {
    console.error('Error guardando mensajes', e);
    return false;
  }
};

export default function Chat() {
  const { user } = useAuth();
  const userCorreo = user?.correo || null;

  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const mountedRef = useRef(false);

  
  useEffect(() => {
    mountedRef.current = true;
    const initial = userCorreo ? loadMessages(userCorreo) : [
      { sender: 'Voluntario', text: '¡Hola! ¿Cómo te sientes hoy?' },
      { sender: 'Tú', text: 'Hola, me siento un poco ansioso por el trabajo.' },
      { sender: 'Voluntario', text: 'Lamento oír eso. ¿Quieres hablar sobre qué es lo que te preocupa?' },
    ];
    setChatHistory(initial);

    return () => { mountedRef.current = false; };
  }, [userCorreo]);

  
  useEffect(() => {
    if (!userCorreo) return;
    try {
      saveMessages(userCorreo, chatHistory);
    } catch (e) {
      console.error('No se pudo persistir chatHistory', e);
    }
  }, [chatHistory, userCorreo]);

  const appendMessage = (msg) => {
    setChatHistory(prev => {
      const next = [...prev, msg];
      
      return next;
    });
  };

  const handleSend = (e) => {
    e.preventDefault();
    const text = message.trim();
    if (!text) return;

    const senderName = user?.nombre || 'Tú';
    appendMessage({ sender: senderName, text });
    setMessage('');

    
    setTimeout(() => {
      if (!mountedRef.current) return;
      const respuestas = [
        'Entiendo. Cuéntame más.',
        'Estoy aquí para escucharte.',
        '¿Qué crees que podría ayudarte ahora?',
        'Gracias por compartir. ¿Cómo te hace sentir eso?'
      ];
      const respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];
      appendMessage({ sender: 'Voluntario', text: respuesta });
    }, 1200);
  };

  const handleClear = () => {
    if (!userCorreo) {
      setChatHistory([]);
      return;
    }
    try {
      localStorage.removeItem(makeKey(userCorreo));
    } catch (e) {
      console.error('Error limpiando chat', e);
    }
    setChatHistory([]);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Chat de Apoyo</h2>
        <p className="small-muted">Habla con un voluntario anónimo. (Esto es una simulación)</p>

        <div className="chat-box my-3" id="chatBox">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className="mb-2 card card-compact"
              style={{ background: msg.sender === (user?.nombre || 'Tú') ? 'var(--accent)' : 'var(--card)',
                       textAlign: msg.sender === (user?.nombre || 'Tú') ? 'right' : 'left',
                       marginLeft: msg.sender === (user?.nombre || 'Tú') ? 'auto' : '0',
                       maxWidth: '80%'
                     }}
            >
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
        </div>

        <div className="d-flex gap-2">
          <Form className="flex-grow-1" onSubmit={handleSend}>
            <Form.Control
              type="text"
              className="input"
              placeholder="Escribe tu mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Form>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={handleSend} className="btn">Enviar</Button>
            <Button variant="secondary" onClick={handleClear} className="btn ghost">Limpiar</Button>
          </div>
        </div>
      </div>
    </div>
  );
}