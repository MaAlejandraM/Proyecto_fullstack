import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";

function Diario() {
  const { user, token } = useAuth();

  const [thoughts, setThoughts] = useState("");
  const [emotionId, setEmotionId] = useState("");
  const [entradas, setEntradas] = useState([]);
  const [emociones, setEmociones] = useState([]);
  const [mensaje, setMensaje] = useState("");
  
  // Estado para controlar cuántas se muestran (Empezamos con 3)
  const [visibleCount, setVisibleCount] = useState(3);

  const API = "http://52.200.198.23:8080";

  // -------------------------------------------------------------------
  // Cargar estados de ánimo
  // -------------------------------------------------------------------
  const cargarEmociones = async () => {
    if (!token) return;
    try {
      const resp = await fetch(`${API}/api/estado-animo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) throw new Error("Error al cargar emociones");
      const data = await resp.json();
      setEmociones(data);
    } catch (err) {
      console.error("Error emociones:", err);
    }
  };

  // -------------------------------------------------------------------
  // Cargar entradas
  // -------------------------------------------------------------------
  const cargarEntradas = async () => {
    if (!token || !user?.email) return;

    try {
      const resp = await fetch(`${API}/api/diario`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-User-Email": user.email,
        },
      });

      if (!resp.ok) throw new Error("Error al cargar entradas");

      const data = await resp.json();

      // ORDENAR: Las más recientes primero
      const ordenadas = data.sort((a, b) => new Date(b.date) - new Date(a.date));

      setEntradas(ordenadas);

    } catch (err) {
      console.error("Error entradas:", err);
    }
  };

  useEffect(() => {
    if (!token || !user?.email) return;
    cargarEmociones();
    cargarEntradas();
  }, [token, user]);

  // -------------------------------------------------------------------
  // Crear entrada
  // -------------------------------------------------------------------
  const crearEntrada = async (e) => {
    e.preventDefault();

    if (user?.isGuest) {
      setMensaje("En modo invitado no puedes crear entradas.");
      return;
    }

    if (!emotionId || !thoughts) {
      setMensaje("Completa todos los campos.");
      return;
    }

    const body = {
      emotionId: parseInt(emotionId),
      thoughts: thoughts,
    };

    try {
      const resp = await fetch(`${API}/api/diario`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-User-Email": user.email,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!resp.ok) throw new Error("Error al crear entrada");

      setMensaje("Entrada creada con éxito 🎉");
      setThoughts("");
      setEmotionId("");
      
      // Recargamos para que aparezca la nueva arriba
      cargarEntradas();
      // Reseteamos la vista para ver la nueva arriba de todo
      setVisibleCount(3);

    } catch (err) {
      console.error(err);
      setMensaje("Error al crear entrada");
    }
  };

  // -------------------------------------------------------------------
  // Eliminar entrada
  // -------------------------------------------------------------------
  const eliminarEntrada = async (id) => {
    if (user?.isGuest) return;
    try {
      const resp = await fetch(`${API}/api/diario/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-User-Email": user.email,
        },
      });
      if (!resp.ok) throw new Error();
      cargarEntradas();
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------------------------------------------------
  // LÓGICA DE BOTONES VER MÁS / VER MENOS
  // -------------------------------------------------------------------
  const handleVerMas = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const handleVerMenos = () => {
    setVisibleCount(3); // Vuelve a mostrar solo 3
    // Opcional: Scrollear un poquito hacia arriba si la lista era muy larga
    window.location.href = "#lista-entradas"; 
  };

  return (
    <div className="container mt-4">
      <div className="p-4 rounded shadow-sm bg-white" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>

        <h2 className="mb-4">Mi Diario Personal</h2>

        {mensaje && <p className="alert alert-info">{mensaje}</p>}

        {/* FORMULARIO */}
        <form onSubmit={crearEntrada} className="mb-5">
          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="¿Cómo te sientes hoy? Escribe tus pensamientos..."
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              rows={5}
              style={{ fontSize: "1.05rem", padding: "15px", borderRadius: "12px" }}
            />
          </div>

          <div className="d-flex gap-3 align-items-center">
            <select
              className="form-select w-auto"
              value={emotionId}
              onChange={(e) => setEmotionId(e.target.value)}
              style={{ borderRadius: "10px" }}
            >
              <option value="">Selecciona emoción...</option>
              {emociones.map((emo) => (
                <option key={emo.id} value={emo.id}>
                  {emo.emoji} {emo.nombre}
                </option>
              ))}
            </select>

            <button type="submit" className="btn btn-primary px-4" style={{ borderRadius: "10px" }}>
              Guardar Entrada
            </button>
          </div>
        </form>

        <hr />

        {/* LISTA DE ENTRADAS */}
        {/* Usamos un ID aquí para poder volver arriba al colapsar */}
        <h4 className="mt-4 mb-3" id="lista-entradas">Entradas Anteriores</h4>
        
        <div className="mt-3">
          {entradas.length === 0 && (
            <p className="text-muted">No tienes entradas aún.</p>
          )}

          {/* Mostramos solo hasta 'visibleCount' */}
          {entradas.slice(0, visibleCount).map((e) => (
            <div key={e.id} className="p-3 mb-3 rounded border" style={{ backgroundColor: "#fdfdfd" }}>
              <div className="d-flex justify-content-between align-items-start">
                <h5 className="mb-1">
                  {e.emotion.emoji} {e.emotion.nombre}
                </h5>
                <small className="text-muted">
                  {new Date(e.date).toLocaleDateString()} {new Date(e.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </small>
              </div>

              <p className="mt-2 mb-2" style={{ whiteSpace: "pre-wrap" }}>{e.thoughts}</p>

              {!user?.isGuest && (
                <button
                  className="btn btn-outline-danger btn-sm mt-2"
                  onClick={() => eliminarEntrada(e.id)}
                  style={{ borderRadius: "8px" }}
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>

        {/* BOTONES DE PAGINACIÓN */}
        {/* Solo mostramos la barra de botones si hay más de 3 entradas en total */}
        {entradas.length > 3 && (
            <div className="text-center mt-4 d-flex justify-content-center gap-2">
                
                {/* Botón VER MÁS: Solo si aún quedan entradas ocultas */}
                {visibleCount < entradas.length && (
                <button 
                    className="btn btn-secondary" 
                    onClick={handleVerMas}
                    style={{ borderRadius: "20px", padding: "8px 24px" }}
                >
                    Ver más...
                </button>
                )}

                {/* Botón VER MENOS: Solo si estamos viendo más de 3 */}
                {visibleCount > 3 && (
                <button 
                    className="btn btn-outline-secondary" 
                    onClick={handleVerMenos}
                    style={{ borderRadius: "20px", padding: "8px 24px" }}
                >
                    Ver menos
                </button>
                )}
            </div>
        )}

      </div>
    </div>
  );
}

export default Diario;