import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Componentes principales
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Ayuda from './components/Ayuda';   // ⬅ NUEVO

// Guardianes de rutas
import { RutasProtegidas, RutasInvitado } from './auth/RutasProtegidas';

// Páginas
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Register from './pages/Register';
import Diario from './pages/Diario';
import Tecnicas from './pages/Tecnicas';
import Chat from './pages/Chat';
import Recursos from './pages/Recursos';
import Emergencia from './pages/Emergencia';
import Perfil from './pages/Perfil';

export default function App() {
    return (
        <>
            <NavBar />

            <main className="pt-5 mt-4"> 
                <Routes>
                    {/* --- Rutas Públicas --- */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* --- Rutas Protegidas (usuario logueado) --- */}
                    <Route element={<RutasProtegidas />}>
                        <Route path="/" element={<Inicio />} />
                        <Route path="/tecnicas" element={<Tecnicas />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/recursos" element={<Recursos />} />
                        <Route path="/emergencia" element={<Emergencia />} />
                    </Route>

                    {/* --- Rutas Súper Protegidas (NO invitados) --- */}
                    <Route element={<RutasInvitado />}>
                        <Route path="/diario" element={<Diario />} />
                        <Route path="/perfil" element={<Perfil />} />
                    </Route>

                    {/* 404 */}
                    <Route
                        path="*"
                        element={
                            <div className="container pt-5">
                                <h1>404: Página no encontrada</h1>
                            </div>
                        }
                    />
                </Routes>
            </main>

            {/* 🔽 Botón flotante + Panel de Ayuda */}
            <Ayuda />

            <Footer />
        </>
    );
}
