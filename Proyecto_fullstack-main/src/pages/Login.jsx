import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      setError(err.message || "Credenciales inválidas");
    }
  };

  const handleGuest = () => {
    loginAsGuest();
    navigate("/");
  };

  return (
    <div className="contenedor-principal">
      <form className="formulario form-login" onSubmit={handleLogin}>
        <h2 className="titulo-login">Iniciar Sesión</h2>

        {error && <p className="error">{error}</p>}

        {/* EMAIL */}
        <div className="form-group">
          <label>Correo electrónico</label>
          <input
            type="email"
            className="input-login"
            placeholder="usuario@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* CONTRASEÑA */}
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            className="input-login"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* BOTÓN INGRESAR */}
        <button type="submit" className="btn-login">
          Ingresar
        </button>

        {/* BOTÓN INVITADO */}
        <button
          type="button"
          onClick={handleGuest}
          className="btn-invitado-login"
        >
          Continuar como invitado
        </button>

        <p className="registrarse-texto">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
