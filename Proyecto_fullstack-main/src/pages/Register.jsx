import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");

  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (!nombre || !email || !pass1 || !pass2) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (pass1.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (pass1 !== pass2) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await register({
        nombre: nombre,
        email: email,
        password: pass1,
      });

      alert("Registro exitoso");
      navigate("/");
    } catch (err) {
      setError(err.message || "Error al registrarse.");
    }
  };

  return (
    <div className="contenedor-principal d-flex justify-content-center align-items-center">
      <div className="formulario" style={{ maxWidth: "500px", width: "100%" }}>
        
        <h2 className="text-center mb-4">Crear Cuenta</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleRegister}>
          
          {/* NOMBRE */}
          <div className="mb-3">
            <label className="form-label">Nombre completo</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ej: Juan Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          {/* EMAIL */}
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* CONTRASEÑA */}
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="Mínimo 6 caracteres"
              value={pass1}
              onChange={(e) => setPass1(e.target.value)}
            />
          </div>

          {/* REPETIR CONTRASEÑA */}
          <div className="mb-4">
            <label className="form-label">Repetir contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirma tu contraseña"
              value={pass2}
              onChange={(e) => setPass2(e.target.value)}
            />
          </div>

          {/* BOTÓN */}
          <button type="submit" className="btn btn-primary w-100 py-2">
            Registrarse
          </button>

          {/* LINK LOGIN */}
          <p className="text-center mt-3">
            ¿Ya tienes cuenta? <Link to="/login" className="fw-bold">Inicia sesión aquí</Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Register;