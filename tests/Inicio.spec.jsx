import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';


vi.mock('../src/auth/AuthContext', () => ({
  useAuth: () => ({ user: { nombre: 'Juan Pérez', correo: 'juan@ejemplo.com' } })
}));

import Inicio from '../src/pages/Inicio';

describe('Componente Inicio', () => {
  it('renderiza el saludo con el primer nombre del usuario', () => {
    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>
    );

    
    expect(screen.getByText(/Hola, Juan/i)).toBeInTheDocument();
  });

  it('muestra una frase diaria (daily quote)', async () => {
    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>
    );

    
    await waitFor(() => {
      expect(screen.getByText(/Respira\. Estás haciendo lo mejor que puedes\.|Un paso a la vez\.|Sé amable contigo hoy\./i)).toBeInTheDocument();
    });
  });

  it('muestra las tarjetas de navegación con los textos y rutas correctas', () => {
    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>
    );

    const diario = screen.getByText(/Diario emocional/i);
    const tecnicas = screen.getByText(/Técnicas/i);
    const chat = screen.getByText(/Chat de apoyo/i);
    const recursos = screen.getByText(/Recursos/i);

    expect(diario).toBeInTheDocument();
    expect(tecnicas).toBeInTheDocument();
    expect(chat).toBeInTheDocument();
    expect(recursos).toBeInTheDocument();

    
    const diarioLink = diario.closest('a');
    expect(diarioLink).toBeTruthy();
    expect(diarioLink.getAttribute('href')).toBe('/diario');
  });
});
