import React from "react";

export default function Recursos() {
  const recursos = [
    {
      titulo: "Trastornos de ansiedad (Mayo Clinic)",
      descripcion:
        "Información médica confiable sobre síntomas, causas y estrategias para manejar la ansiedad.",
      url: "https://www.mayoclinic.org/es/diseases-conditions/anxiety/symptoms-causes/syc-20350961",
    },
    {
      titulo: "¿Qué es el Mindfulness? (Psicología y Mente)",
      descripcion:
        "Una guía completa en español para entender la atención plena y sus beneficios psicológicos.",
      url: "https://psicologiaymente.com/meditacion/mindfulness-que-es",
    },
    {
      titulo: "Meditación guiada para calmar la mente (YouTube)",
      descripcion:
        "Ejercicio de 10 minutos en español para reducir el estrés y volver a la calma.",
      url: "https://www.youtube.com/watch?v=8XJ8p8x4kRw", // Enlace a un video popular en español
    },
    {
      titulo: "Técnicas de relajación para el estrés (MedlinePlus)",
      descripcion:
        "Consejos prácticos y médicos para aprender a relajar el cuerpo y la mente.",
      url: "https://medlineplus.gov/spanish/ency/patientinstructions/000874.htm",
    },
    {
      titulo: "Higiene del sueño: Cómo dormir mejor",
      descripcion:
        "Recomendaciones para mejorar tus hábitos de sueño y descanso.",
      url: "https://enfamilia.aeped.es/vida-sana/higiene-sueno-como-dormir-bien",
    },
  ];

  return (
    <div className="container page-container">
      <div className="card">
        <h2>📚 Recursos de Bienestar</h2>
        <p className="small-muted">
          Materiales, artículos y videos seleccionados para ayudarte a gestionar tu salud emocional.
        </p>

        <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: 16 }}>
          {recursos.map((r, index) => (
            <li
              key={index}
              className="p-3 mb-2"
              style={{
                borderBottom: "1px solid #eee",
                cursor: "pointer",
                borderRadius: "8px",
                transition: "background-color 0.2s"
              }}
              onClick={() => window.open(r.url, "_blank")}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <div className="d-flex justify-content-between align-items-center">
                <strong style={{ color: "var(--primary)", fontSize: "1.1rem" }}>
                  {r.titulo}
                </strong>
                <span style={{ fontSize: "1.2rem" }}>🔗</span>
              </div>
              <p className="small-muted mb-0" style={{ marginTop: 4 }}>
                {r.descripcion}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}