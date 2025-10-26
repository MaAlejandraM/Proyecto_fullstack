import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';


const EMOTIONS = [
  { emoji: '😊', nombre: 'Alegría', color: '#B8D8C0' },
  { emoji: '😔', nombre: 'Tristeza', color: '#A9C5E8' },
  { emoji: '😡', nombre: 'Rabia', color: '#F6B8B8' },
  { emoji: '😰', nombre: 'Ansiedad', color: '#F3E2A9' },
  { emoji: '😌', nombre: 'Calma', color: '#D7EFD9' },
];

const makeKey = (correo) => `historialEmociones_${correo}`;

const loadEntriesForUser = (correo) => {
  if (!correo) return [];
  try {
    const raw = localStorage.getItem(makeKey(correo));
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error leyendo entradas del diario', e);
    return [];
  }
};

const saveEntriesForUser = (correo, list) => {
  if (!correo) return false;
  try {
    localStorage.setItem(makeKey(correo), JSON.stringify(list));
    return true;
  } catch (e) {
    console.error('Error guardando entradas del diario', e);
    return false;
  }
};

export default function Diario() {
  const { user } = useAuth();
  const correo = user?.correo || null;

  
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [journalEntry, setJournalEntry] = useState('');
  const [entries, setEntries] = useState([]); 
  const [showAll, setShowAll] = useState(false);
  const [message, setMessage] = useState('');

  
  useEffect(() => {
    if (!correo) {
      setEntries([]);
      return;
    }
    const loaded = loadEntriesForUser(correo);
    setEntries(loaded);
  }, [correo]);

  
  const handleSave = () => {
    
    if (!(selectedEmotion || (journalEntry && journalEntry.trim()))) return setMessage('Selecciona una emoción o escribe algo.');
    if (!correo) return setMessage('Debes iniciar sesión para guardar entradas');

    const entrada = {
      emotion: selectedEmotion || null,
      thoughts: (journalEntry && journalEntry.trim()) || '',
      date: new Date().toLocaleString(),
      nombreUsuario: user?.nombre || ''
    };

    const nuevo = [entrada, ...entries];
    const ok = saveEntriesForUser(correo, nuevo);
    if (!ok) return setMessage('No se pudo guardar la entrada.');

    setEntries(nuevo);
    setJournalEntry('');
    setSelectedEmotion(null);
    setMessage('Entrada guardada');
    setTimeout(() => setMessage(''), 2000);
  };

  
  const entriesForEmotion = () => {
    if (!selectedEmotion) return entries.slice(0, showAll ? 1000 : 10);
    const filtered = entries.filter(e => e.emotion && e.emotion.nombre === selectedEmotion.nombre);
    return filtered.slice(0, showAll ? 1000 : 10);
  };

  
  const clearEntries = () => {
    if (!correo) return setMessage('Debes iniciar sesión');
    if (!window.confirm('¿Borrar todas las entradas?')) return;

    const ok = saveEntriesForUser(correo, []);
    if (!ok) return setMessage('No se pudo limpiar el historial');

    setEntries([]);
    setMessage('Historial borrado');
    setTimeout(() => setMessage(''), 1800);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Diario Emocional</h2>
        <p className="small-muted">Registra cómo te sientes hoy.</p>

        <div className="my-3">
          <label className="form-label" style={{ fontWeight: 600 }}>¿Cómo te sientes?</label>
          <div id="emotionSelector" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
            {EMOTIONS.map((em) => (
              <div
                key={em.nombre}
                className={`emotion-btn ${selectedEmotion?.nombre === em.nombre ? 'selected' : ''}`}
                onClick={() => setSelectedEmotion(em)}
                style={{ cursor: 'pointer', padding: 8 }}
              >
                <div style={{ fontSize: 20 }}>{em.emoji}</div>
                <div className="small-muted">{em.nombre}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="my-3">
          <label htmlFor="thoughts" className="form-label" style={{ fontWeight: 600 }}>Escribe sobre tu día:</label>
          <textarea
            id="thoughts"
            rows={5}
            className="input"
            placeholder="¿Qué pasó hoy? ¿Por qué te sientes así?"
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
          />
        </div>

        <div className="d-flex gap-2">
          <button id="saveEntry" className="btn" onClick={handleSave} disabled={!(selectedEmotion || journalEntry.trim())}>
            Guardar Entrada
          </button>
      
          <button className="btn ghost" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Mostrar menos' : 'Mostrar más'}
          </button>
          <button id="clearEntries" className="btn ghost" onClick={clearEntries}>
            Limpiar historial
          </button>
        </div>

        {message && <p className="small-muted mt-2">{message}</p>}

        <div className="mt-4" id="entriesList">
          {selectedEmotion ? (
            <h4>Entradas para {selectedEmotion.emoji} {selectedEmotion.nombre}</h4>
          ) : (
            <h4>Historial reciente</h4>
          )}

          {entriesForEmotion().length === 0 ? (
            <p className="small-muted">No hay entradas</p>
          ) : (
            <div>
              {entriesForEmotion().map((en, i) => (
                <div key={i} style={{ borderLeft: `4px solid ${en.emotion?.color || '#ddd'}`, padding: 8, marginBottom: 8 }}>
                  <div className="small-muted">{en.date || en.createdAt}</div>
                  <strong>{en.emotion?.emoji || ''} {en.emotion?.nombre || ''}</strong>
                  <div>{en.thoughts || en.text || ''}</div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}