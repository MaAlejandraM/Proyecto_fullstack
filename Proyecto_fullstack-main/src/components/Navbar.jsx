import React from 'react';
import { Navbar, Container, Nav, Image } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function NavBar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); 
        navigate('/login');
    };

    return (
        /* 1. QUITAMOS bg="light" para que no sea blanco sólido.
           2. DEJAMOS variant="light" para que las letras sean oscuras.
           3. AÑADIMOS la clase "navbar-glass" (opcional, o usamos la genérica).
        */
        <Navbar fixed="top" variant="light" expand="lg" className="px-3">
            <Container fluid>
                
                <Navbar.Brand as={Link} to={user ? "/" : "/login"} className="brand">
                    <Image
                        src="https://images.ctfassets.net/denf86kkcx7r/4IPlg4Qazd4sFRuCUHIJ1T/f6c71da7eec727babcd554d843a528b8/gatocomuneuropeo-97?fm=webp&w=612"
                        alt="Logo Bienestar" width="32" height="32" className="rounded-circle me-2"
                    />
                    <span>Bienestar</span>
                </Navbar.Brand>

                {user && (
                    <>
                        <Navbar.Toggle aria-controls="navbarNav" />
                        <Navbar.Collapse id="navbarNav">
                            <Nav className="ms-auto navlinks">
                                <Nav.Link as={NavLink} to="/" end>Inicio</Nav.Link>
                                {!user.isGuest && <Nav.Link as={NavLink} to="/diario">Diario</Nav.Link>}
                                <Nav.Link as={NavLink} to="/tecnicas">Técnicas</Nav.Link>
                                <Nav.Link as={NavLink} to="/chat">Chat</Nav.Link>
                                <Nav.Link as={NavLink} to="/recursos">Recursos</Nav.Link>
                                <Nav.Link as={NavLink} to="/emergencia">Emergencia</Nav.Link>
                                {!user.isGuest && <Nav.Link as={NavLink} to="/perfil">Perfil</Nav.Link>}
                                <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>Salir</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </>
                )}
            </Container>
        </Navbar>
    );
}