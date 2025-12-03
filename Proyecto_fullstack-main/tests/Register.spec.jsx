import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const mockRegister = vi.fn();
const mockNavigate = vi.fn();
vi.mock('../src/auth/AuthContext', () => ({
  useAuth: () => ({ register: mockRegister })
}));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import Register from '../src/pages/Register';

describe('Componente Register', () => {
  beforeEach(() => {
    mockRegister.mockReset();
    mockNavigate.mockReset();
  });

  it('renderiza formulario con campos y botón', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Crear Cuenta/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre Completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^Contraseña$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Repetir Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Registrar/i })).toBeInTheDocument();
  });

  it('muestra error si faltan campos al enviar', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole('button', { name: /Registrar/i });
    const form = submitBtn.closest('form');
    expect(form).toBeTruthy();
    fireEvent.submit(form);

    await waitFor(() => expect(screen.getByText(/Todos los campos deben ser llenados/i)).toBeInTheDocument());
  });

  it('muestra error si las contraseñas no coinciden', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nombre Completo/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/^Contraseña$/i), { target: { value: 'abc' } });
    fireEvent.change(screen.getByLabelText(/Repetir Contraseña/i), { target: { value: 'def' } });

    fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));

    await waitFor(() => expect(screen.getByText(/Las contraseñas no coinciden/i)).toBeInTheDocument());
  });

  it('muestra error si la contraseña es muy corta', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nombre Completo/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/^Contraseña$/i), { target: { value: 'ab' } });
    fireEvent.change(screen.getByLabelText(/Repetir Contraseña/i), { target: { value: 'ab' } });

    fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));

    await waitFor(() => expect(screen.getByText(/La contraseña debe tener al menos 3 caracteres\./i)).toBeInTheDocument());
  });

  it('llama a register y navega al inicio en registro exitoso', async () => {
    mockRegister.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nombre Completo/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/^Contraseña$/i), { target: { value: 'abc' } });
    fireEvent.change(screen.getByLabelText(/Repetir Contraseña/i), { target: { value: 'abc' } });

    fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));

    await waitFor(() => expect(mockRegister).toHaveBeenCalled());
    expect(mockRegister).toHaveBeenCalledWith(expect.objectContaining({ nombreCompleto: 'Test User', correoElectronico: 'test@example.com', password: 'abc' }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('muestra mensaje de error si register falla', async () => {
    mockRegister.mockRejectedValueOnce(new Error('Registro fallido'));

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nombre Completo/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/^Contraseña$/i), { target: { value: 'abc' } });
    fireEvent.change(screen.getByLabelText(/Repetir Contraseña/i), { target: { value: 'abc' } });

    fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));

    await waitFor(() => expect(screen.getByText(/Registro fallido/i)).toBeInTheDocument());
  });
});
