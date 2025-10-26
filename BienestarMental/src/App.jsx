import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';

// Layout
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Inicio';
import Login from './pages/Login';
import Register from './pages/Register';
import Diario from './pages/Diario';
import Tecnicas from './pages/Tecnicas';
import Chat from './pages/Chat';
import Recursos from './pages/Recursos';
import Emergencia from './pages/Emergencia';
import Perfil from './pages/Perfil';

// Componente Layout que envuelve todas las páginas
function AppLayout() {
    return (
        // Usamos un div para asegurar que el footer quede abajo
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <NavBar />
            {/* El contenido principal ocupa el espacio restante */}
            <main style={{ flex: 1 }}>
                {/* Aquí se renderiza la página actual (Home, Login, etc.) */}
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider> {/* Envuelve todo en el proveedor de autenticación */}
            <Router>
                <Routes>
                    {/* Todas las rutas usan el AppLayout (Navbar + Footer) */}
                    <Route element={<AppLayout />}>

                        {/* Rutas Públicas: Login y Registro */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Rutas Protegidas: Requieren estar logueado */}
                        {/* Usamos el componente ProtectedRoute para envolverlas */}
                        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                        <Route path="/diario" element={<ProtectedRoute><Diario /></ProtectedRoute>} />
                        <Route path="/tecnicas" element={<ProtectedRoute><Tecnicas /></ProtectedRoute>} />
                        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                        <Route path="/recursos" element={<ProtectedRoute><Recursos /></ProtectedRoute>} />
                        <Route path="/emergencia" element={<ProtectedRoute><Emergencia /></ProtectedRoute>} />
                        <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />

                        {/* Ruta comodín: si no coincide ninguna, redirige a Home (si está logueado) */}
                        <Route path="*" element={<ProtectedRoute><Home /></ProtectedRoute>} />

                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}