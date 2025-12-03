import React, { useEffect, useState } from "react";



export default function Emergencia() {
  const [contactos, setContactos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);

  const API = "http://3.239.97.16:8080";

  useEffect(() => {
    const cargarContactos = async () => {
      try {
        const resp = await fetch(`${API}/api/emergencia`);

        if (!resp.ok) {
          setMensaje("No se pudieron cargar los contactos de emergencia.");
          setLoading(false);
          return;
        }

        const data = await resp.json();
        setContactos(data);
      } catch (error) {
        setMensaje("Error de conexión con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    cargarContactos();
  }, []);

  return (
    <div className="contenedor-principal">
      <div className="formulario">
        <h2>Contactos de Emergencia</h2>

        {loading && <p>Cargando contactos...</p>}

        {mensaje && <p className="error">{mensaje}</p>}

        {!loading && contactos.length > 0 && (
          <ul className="lista-emergencia">
            {contactos.map((c) => (
              <li key={c.id} className="card-emergencia">
                <strong>{c.nombre}</strong>
                <br />

                <a
                  href={`tel:${c.telefono}`}
                  className="telefono-emergencia"
                >
                  {c.telefono}
                </a>

                {c.descripcion && (
                  <p className="descripcion-emergencia">{c.descripcion}</p>
                )}
              </li>
            ))}
          </ul>
        )}

        <p className="mensaje-apoyo">
          <strong>No estás solo.</strong> Si lo necesitas, busca ayuda profesional.
        </p>
      </div>
    </div>
  );
}
