import React, { useState } from "react";
import "../styles/ayuda.css"; // SOLO este import

export default function Ayuda() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="help-button" onClick={() => setOpen(!open)}>?</button>

      {open && (
        <div className="help-panel">
          <h5>¿Qué es Bienestar Mental?</h5>
          <p>
            Esta plataforma te ayuda a gestionar tu bienestar emocional con herramientas como:
          </p>

          <ul>
            <li>Chat de apoyo emocional IA (Serenamente)</li>
            <li>Diario personal con emociones</li>
            <li>Técnicas de relajación</li>
            <li>Recursos y artículos</li>
            <li>Números de emergencia</li>
          </ul>

          <button className="btn-close-help" onClick={() => setOpen(false)}>
            Cerrar
          </button>
        </div>
      )}
    </>
  );
}
