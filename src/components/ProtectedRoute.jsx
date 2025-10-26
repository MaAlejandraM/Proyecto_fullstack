import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Spinner } from 'react-bootstrap';

export default function ProtectedRoute(){
    const { user, loading } = useAuth()

    if (loading) {
        
        return <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}><Spinner animation="border" /></div>;
    }
    
    if(!user){
        return <Navigate to="/login" replace />
    }
    
    
    return <Outlet />
}
