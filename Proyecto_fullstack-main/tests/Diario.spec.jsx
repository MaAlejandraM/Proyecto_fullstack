import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';


vi.mock('../src/auth/AuthContext', () => ({
  useAuth: () => ({ user: { correo: 'test@correo.com', nombre: 'Tester' } })
}));

import Diario from '../src/pages/Diario';

describe('Componente Diario', () => {
  beforeEach(() => {
    
    localStorage.clear();
  });

  it('renderiza el título correctamente', () => {
    render(<Diario />);
    expect(screen.getByText(/Diario Emocional/i)).toBeInTheDocument();
  });

  it('muestra las emociones disponibles', () => {
    render(<Diario />);
    
    expect(screen.getByText('Alegría')).toBeInTheDocument();
    expect(screen.getByText('Tristeza')).toBeInTheDocument();
    expect(screen.getByText('Rabia')).toBeInTheDocument();
    expect(screen.getByText('Ansiedad')).toBeInTheDocument();
    expect(screen.getByText('Calma')).toBeInTheDocument();
  });

  it('botón Guardar Entrada está deshabilitado cuando no hay emoji ni texto', () => {
    render(<Diario />);
    const btn = screen.getByRole('button', { name: /guardar entrada/i });
    expect(btn).toBeDisabled();
  });

  it('botón Guardar Entrada se habilita si hay texto (aunque no haya emoji) y guarda en localStorage', async () => {
    render(<Diario />);
    const textarea = screen.getByPlaceholderText(/¿Qué pasó hoy\? ¿Por qué te sientes así\?/i);
    const btn = screen.getByRole('button', { name: /guardar entrada/i });

    
    fireEvent.change(textarea, { target: { value: 'Hoy fue un buen día' } });
    expect(btn).not.toBeDisabled();

    
    fireEvent.click(btn);

   
    const raw = localStorage.getItem('historialEmociones_test@correo.com');
    expect(raw).toBeTruthy();
    const arr = JSON.parse(raw);
    expect(arr.length).toBe(1);
    expect(arr[0].thoughts).toBe('Hoy fue un buen día');

    
    await waitFor(() => expect(screen.getByText('Hoy fue un buen día')).toBeInTheDocument());
  });

  it('guardar sin texto pero con emoji seleccionado funciona (según comportamiento actual)', async () => {
    render(<Diario />);
    const btn = screen.getByRole('button', { name: /guardar entrada/i });

    
    fireEvent.click(screen.getByText('Alegría'));
    expect(btn).not.toBeDisabled();

    
    fireEvent.click(btn);

    const raw = localStorage.getItem('historialEmociones_test@correo.com');
    expect(raw).toBeTruthy();
    const arr = JSON.parse(raw);
    expect(arr.length).toBe(1);
    expect(arr[0].emotion.nombre).toBe('Alegría');

    await waitFor(() => {
      const entriesContainer = document.getElementById('entriesList');
      expect(entriesContainer).toBeTruthy();
      expect(within(entriesContainer).getByText(/Alegría/)).toBeInTheDocument();
    });
  });
});
