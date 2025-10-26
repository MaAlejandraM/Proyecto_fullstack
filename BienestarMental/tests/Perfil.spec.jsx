import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

// preparar mock de updateProfile para poder aserciones
const mockUpdateProfile = vi.fn(() => Promise.resolve({ success: true }));
vi.mock('../src/auth/AuthContext', () => ({
  useAuth: () => ({ user: { nombre: 'María Lopez', correo: 'maria@ejemplo.com' }, updateProfile: mockUpdateProfile })
}));

import Perfil from '../src/pages/Perfil';

describe('Componente Perfil', () => {
  beforeEach(() => {
    localStorage.clear();
    mockUpdateProfile.mockClear();
  });

  it('renderiza el título y el nombre del usuario', () => {
    render(<Perfil />);
    expect(screen.getByText(/Mi Perfil/i)).toBeInTheDocument();
    expect(screen.getByText(/Iniciaste sesión como/i)).toBeInTheDocument();
    expect(screen.getByText(/María Lopez/i)).toBeInTheDocument();
  });

  it('muestra historial tomado desde localStorage', () => {
    // preparar historial en localStorage
    const key = 'historialEmociones_maria@ejemplo.com';
    const sample = [
      { emotion: { emoji: '😊', nombre: 'Alegría', color: '#B8D8C0' }, thoughts: 'Un día feliz', date: 'hoy' },
      { emotion: '😔 Tristeza', thoughts: 'Un mal momento', date: 'ayer' }
    ];
    localStorage.setItem(key, JSON.stringify(sample));

    render(<Perfil />);

    const container = screen.getByText(/Historial de emociones/i).closest('div');
    // comprobar que aparecen los textos de las entradas
    expect(screen.getByText(/Un día feliz/i)).toBeInTheDocument();
    expect(screen.getByText(/Un mal momento/i)).toBeInTheDocument();
  });

  it('permite editar y guardar el perfil llamando a updateProfile', async () => {
    render(<Perfil />);

    // Click en 'Editar Perfil'
    const editBtn = screen.getByRole('button', { name: /Editar Perfil/i });
    fireEvent.click(editBtn);

    // Cambiar el nombre
    const nombreInput = screen.getByLabelText(/Nombre Completo/i);
    fireEvent.change(nombreInput, { target: { value: 'María Actualizada' } });

    // Click en Guardar Cambios
    const saveBtn = screen.getByRole('button', { name: /Guardar Cambios/i });
    fireEvent.click(saveBtn);

    // updateProfile debe haber sido llamada con los campos esperados
    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalled();
    });

    const calledWith = mockUpdateProfile.mock.calls[0][0];
    expect(calledWith).toEqual(expect.objectContaining({ nombreCompleto: 'María Actualizada', correoElectronico: 'maria@ejemplo.com' }));

    // Debe mostrarse el mensaje de éxito
    await waitFor(() => expect(screen.getByText(/Perfil actualizado correctamente/i)).toBeInTheDocument());
  });
});
