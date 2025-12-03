import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { Card, Button, Form, Alert, Modal, ListGroup, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
  const { user, token, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  // Estados del formulario de perfil
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Estados de UI
  const [mensaje, setMensaje] = useState("");
  const [variant, setVariant] = useState("info"); // color del mensaje
  const [editando, setEditando] = useState(false);
  const [showModal, setShowModal] = useState(false); // Modal confirmación eliminar

  // Estado para el Diario
  const [ultimasEntradas, setUltimasEntradas] = useState([]);

  const API_BASE = "http://3.239.97.16:8080/api";

  
  // 1. CARGAR DATOS AL INICIAR
  
  useEffect(() => {
    if (user) {
      setNombre(user.nombre || "");
      setEmail(user.email || "");
      cargarDiario();
    }
  }, [user]);

  const cargarDiario = async () => {
    try {
      const resp = await fetch(`${API_BASE}/diario`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-User-Email": user.email,
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        // Tomamos solo las últimas 3 entradas para mostrar en perfil
        // Asumiendo que vienen en orden o las invertimos si es necesario
        // Si vienen antiguas primero, hacemos .reverse()
        setUltimasEntradas(data.reverse().slice(0, 3));
      }
    } catch (error) {
      console.error("Error cargando diario:", error);
    }
  };

  
  // 2. ACTUALIZAR PERFIL
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMensaje("");

    const body = {};
    if (nombre.trim() !== "") body.nombre = nombre.trim();
    if (password.trim() !== "") body.password = password.trim();

    try {
      const resp = await fetch(`${API_BASE}/auth/profile`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-User-Email": email,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (resp.ok) {
        setMensaje("Perfil actualizado correctamente.");
        setVariant("success");
        setPassword(""); // Limpiar campo pass
        await refreshUser(); // Actualizar contexto
        setEditando(false);
      } else {
        setMensaje("Error al actualizar perfil.");
        setVariant("danger");
      }
    } catch (err) {
      setMensaje("Error de conexión.");
      setVariant("danger");
    }
  };

  
  // 3. ELIMINAR CUENTA
  
  const handleDelete = async () => {
    try {
      const resp = await fetch(`${API_BASE}/auth/profile`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-User-Email": email,
        },
      });

      if (resp.ok) {
        setShowModal(false);
        logout();
        navigate("/login");
      } else {
        setMensaje("No se pudo eliminar la cuenta.");
        setVariant("danger");
        setShowModal(false);
      }
    } catch (err) {
      setMensaje("Error al intentar eliminar.");
      setVariant("danger");
    }
  };

  
  // 4. RENDERIZADO
  
  return (
    <div className="container page-container">
      <h2 className="mb-4">Mi Perfil</h2>

      {mensaje && <Alert variant={variant} onClose={() => setMensaje("")} dismissible>{mensaje}</Alert>}

      <div className="row">
        {/* COLUMNA IZQUIERDA: DATOS USUARIO */}
        <div className="col-md-5 mb-4">
          <Card className="shadow-sm">
            <Card.Body>
              <div className="text-center mb-4">
                <div 
                  style={{
                    width: "80px", height: "80px", 
                    background: "var(--primary)", color: "white",
                    borderRadius: "50%", margin: "0 auto",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "2rem", fontWeight: "bold"
                  }}
                >
                  {nombre.charAt(0).toUpperCase()}
                </div>
                <h4 className="mt-3">{user?.nombre}</h4>
                <p className="text-muted small">{user?.email}</p>
              </div>

              {!editando ? (
                // MODO VISTA
                <div className="d-grid gap-2">
                  <Button variant="outline-primary" onClick={() => setEditando(true)}>
                    Editar Datos
                  </Button>
                  <Button variant="outline-danger" onClick={() => setShowModal(true)}>
                    Eliminar Cuenta
                  </Button>
                </div>
              ) : (
                // MODO EDICIÓN
                <Form onSubmit={handleUpdate}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre completo</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={nombre} 
                      onChange={(e) => setNombre(e.target.value)} 
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Nueva Contraseña (opcional)</Form.Label>
                    <Form.Control 
                      type="password" 
                      placeholder="Dejar en blanco para mantener"
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                    />
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button variant="primary" type="submit" className="w-100">
                      Guardar
                    </Button>
                    <Button variant="secondary" onClick={() => setEditando(false)} className="w-100">
                      Cancelar
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </div>

        {/* COLUMNA DERECHA: RESUMEN DEL DIARIO */}
        <div className="col-md-7">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">📓 Mis últimas reflexiones</h5>
            </Card.Header>
            <ListGroup variant="flush">
              {ultimasEntradas.length > 0 ? (
                ultimasEntradas.map((entrada) => (
                  <ListGroup.Item key={entrada.id} className="py-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Badge bg="light" text="dark" className="border">
                        {entrada.emotion.emoji} {entrada.emotion.nombre}
                      </Badge>
                      <small className="text-muted">
                        {/* Formateamos la fecha si viene como string ISO */}
                        {new Date(entrada.date || Date.now()).toLocaleDateString()}
                      </small>
                    </div>
                    <p className="mb-0 text-muted" style={{ fontStyle: "italic" }}>
                      "{entrada.thoughts.length > 80 
                          ? entrada.thoughts.substring(0, 80) + "..." 
                          : entrada.thoughts}"
                    </p>
                  </ListGroup.Item>
                ))
              ) : (
                <div className="p-4 text-center text-muted">
                  <p>Aún no has escrito en tu diario.</p>
                  <Button variant="link" onClick={() => navigate("/diario")}>
                    Ir al Diario
                  </Button>
                </div>
              )}
            </ListGroup>
            {ultimasEntradas.length > 0 && (
              <Card.Footer className="bg-white text-center">
                <Button variant="link" onClick={() => navigate("/diario")}>
                  Ver todas las entradas
                </Button>
              </Card.Footer>
            )}
          </Card>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>¿Eliminar cuenta?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Estás a punto de eliminar tu cuenta permanentemente.</p>
          <p className="text-danger">
            <strong>Se borrarán todas tus entradas del diario y chats. Esta acción no se puede deshacer.</strong>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Sí, eliminar mi cuenta
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}