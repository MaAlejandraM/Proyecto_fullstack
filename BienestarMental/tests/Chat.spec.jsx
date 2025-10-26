import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi } from 'vitest';

// Mock useAuth para simular usuario logeado
vi.mock('../src/auth/AuthContext', () => ({
  useAuth: () => ({ user: { nombre: 'Test User', correo: 'test@correo.com' } })
}));

import Chat from '../src/pages/Chat';

const makeKey = (correo) => `mensajesChat_${correo}`;

describe('Componente Chat', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    try { vi.useRealTimers(); } catch (e) {}
  });

  it('renderiza el título y el input', () => {
    render(<Chat />);
    expect(screen.getByText(/Chat de Apoyo/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escribe tu mensaje/i)).toBeInTheDocument();
  });

  it('envía un mensaje y recibe respuesta automática, y persiste en localStorage', async ({ expect }) => {
    vi.useFakeTimers();
    render(<Chat />);

    const input = screen.getByPlaceholderText(/Escribe tu mensaje/i);
    const sendBtn = screen.getByRole('button', { name: /Enviar/i });

    // escribir mensaje
    fireEvent.change(input, { target: { value: 'Hola equipo' } });

    // enviar dentro de act
    act(() => {
      fireEvent.click(sendBtn);
    });
    fireEvent.click(sendBtn);

    // el mensaje propio debe aparecer en el DOM
    await waitFor(() => {
      expect(screen.getByText(/Hola equipo/i)).toBeInTheDocument();
      vi.advanceTimersByTime(1); // Advance timers inside waitFor
    });

    // comprobar que se persistió en localStorage (esperar hasta 2s)
    await waitFor(() => {
      const raw = localStorage.getItem(makeKey('test@correo.com'));
      expect(raw).toBeTruthy();
      const arr = JSON.parse(raw);
      // al menos 1 mensaje (el que enviamos)
      expect(arr.some(m => m.text === 'Hola equipo')).toBe(true);
      vi.advanceTimersByTime(1); // Advance timers inside waitFor
    }, { timeout: 2000 });

    // avanzar timers para la respuesta automática (1200ms)
    act(() => {
      vi.advanceTimersByTime(1200);
    });
    vi.advanceTimersByTime(1200);

    // esperar que aparezca mensaje del voluntario
    await waitFor(() => {
      expect(screen.getByText(/Voluntario:/i)).toBeInTheDocument();
      vi.advanceTimersByTime(1); // Advance timers inside waitFor
    });

    vi.useRealTimers();
  });

  it('limpia el chat y borra localStorage para el usuario', async () => {
    const key = makeKey('test@correo.com');
    localStorage.setItem(key, JSON.stringify([{ sender: 'Tú', text: 'hola' }]));

    // Use rerender to update the component with the new localStorage state
    const { rerender } = render(<Chat />);
    rerender(<Chat />);

    expect(screen.getByText(/hola/i)).toBeInTheDocument();

    // click en limpiar
    const allClearBtns = screen.getAllByRole('button', { name: /Limpiar/i });
    // puede haber múltiples botones si hay múltiples renders previos en watch; usar el primero
    const clearBtn = allClearBtns[0];
    fireEvent.click(clearBtn);

    // chat box vacío y localStorage borrado o vacío (la implementación puede guardar [] después de remover)
    await waitFor(() => {
      const val = localStorage.getItem(key);
      expect(val === null || val === '[]').toBe(true);
      // el texto ya no debe estar en el documento
      expect(screen.queryByText(/hola/i)).toBeNull();
    });
  });
});
