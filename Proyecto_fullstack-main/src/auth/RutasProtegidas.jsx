import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

// Este guardián protege rutas que requieren CUALQUIER sesión (invitado o registrado)
export function RutasProtegidas() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>; // O un spinner de carga
    }

    // Si no hay usuario, lo mandamos a la página de login
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Si hay usuario, le permitimos ver la página
    return <Outlet />;
}

// Este guardián protege rutas que son EXCLUSIVAS para usuarios registrados
export function RutasInvitado() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>;
    }

    // Si el usuario es un invitado, no le permitimos el acceso y lo redirigimos al inicio.
    if (user?.isGuest) {
        return <Navigate to="/" />;
    }

    // Si no es invitado (es decir, es un usuario registrado), le permitimos ver la página
    return <Outlet />;
}