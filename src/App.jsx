import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';


import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';


import Home from './pages/Inicio';
import Login from './pages/Login';
import Register from './pages/Register';
import Diario from './pages/Diario';
import Tecnicas from './pages/Tecnicas';
import Chat from './pages/Chat';
import Recursos from './pages/Recursos';
import Emergencia from './pages/Emergencia';
import Perfil from './pages/Perfil';


function AppLayout() {
    return (
        <div className="app-layout">
            <NavBar />
            <main className="app-main"><Outlet /></main>
            <Footer />
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider> 
            <Router>
                <Routes>
                    
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<AppLayout />}>
                        <Route element={<ProtectedRoute />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/diario" element={<Diario />} />
                            <Route path="/tecnicas" element={<Tecnicas />} />
                            <Route path="/chat" element={<Chat />} />
                            <Route path="/recursos" element={<Recursos />} />
                            <Route path="/emergencia" element={<Emergencia />} />
                            <Route path="/perfil" element={<Perfil />} />
                            <Route path="*" element={<Home />} />
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}