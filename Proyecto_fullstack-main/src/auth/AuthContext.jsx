import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const API_BASE = "http://52.200.198.23:8080";

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("usuario");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // ------------------------------------
  // GUARDAR SESIÓN
  // ------------------------------------
  const saveSession = (token, usuario) => {
    setUser(usuario);
    setToken(token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("token", token);
  };

  // ------------------------------------
  // REFRESCAR USUARIO DESDE BACKEND
  // ------------------------------------
  const refreshUser = async () => {
    if (!token || !user || !user.email) return;

    const resp = await fetch(`${API_BASE}/profile`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "X-User-Email": user.email
      },
    });

    if (resp.ok) {
      const data = await resp.json();
      setUser(data);
      localStorage.setItem("usuario", JSON.stringify(data));
    }
  };

  // ------------------------------------
  // REGISTRO REAL
  // ------------------------------------
  const register = async ({ nombre, email, password }) => {
    const resp = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
    });

    if (!resp.ok) throw new Error(await resp.text());

    const data = await resp.json();
    saveSession(data.token, data.usuario);
    return data.usuario;
  };

  // ------------------------------------
  // LOGIN REAL
  // ------------------------------------
  const login = async ({ email, password }) => {
    const resp = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!resp.ok) throw new Error(await resp.text());

    const data = await resp.json();
    saveSession(data.token, data.usuario);
    return data.usuario;
  };

  // ------------------------------------
  // MODO INVITADO
  // ------------------------------------
  const loginAsGuest = () => {
    const invitado = {
      id: null,
      nombre: "Invitado",
      email: null,
      isGuest: true
    };
    setUser(invitado);
    localStorage.setItem("usuario", JSON.stringify(invitado));
  };

  // ------------------------------------
  // LOGOUT
  // ------------------------------------
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
  };

  // ------------------------------------
  // LOADING INICIAL
  // ------------------------------------
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      loginAsGuest,
      refreshUser,
      isAuthenticated: !!user,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
