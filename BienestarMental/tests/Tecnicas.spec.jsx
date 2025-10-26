import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { act } from 'react-dom/test-utils';

import Tecnicas from '../src/pages/Tecnicas';

describe('Componente Tecnicas', () => {
  afterEach(() => {
    // restaurar timers reales por si algún test los alteró
    try { vi.useRealTimers(); } catch (e) {}
  });

  it('renderiza los títulos y botones principales', () => {
    render(<Tecnicas />);
    expect(screen.getByText(/Técnicas de Bienestar/i)).toBeInTheDocument();
    expect(screen.getByText(/Respiración guiada/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Iniciar respiración/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Detener/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Iniciar Grounding/i })).toBeInTheDocument();
  });

  it('flujo de respiración: iniciar, avanzar estados con timer, detener', async () => {
    vi.useFakeTimers();
    render(<Tecnicas />);

    // estado inicial
    expect(screen.getByText(/Presiona iniciar para comenzar/i)).toBeInTheDocument();

    const startBtn = screen.getByRole('button', { name: /Iniciar respiración/i });
    const stopBtn = screen.getByRole('button', { name: /Detener/i });

    // iniciar respiración -> estado inhale inmediato
    act(() => {
    fireEvent.click(startBtn);
    });
    expect(screen.getByText(/Inhala\.\.\./i)).toBeInTheDocument();

    // avanzar 4s -> hold
    act(() => {
    vi.advanceTimersByTime(4000);
    });
    await waitFor(() => expect(screen.getByText(/Mantén\.\.\./i)).toBeInTheDocument());

    // avanzar 4s -> exhale
    act(() => {
    vi.advanceTimersByTime(4000);
    });
    await waitFor(() => expect(screen.getByText(/Exhala\.\.\./i)).toBeInTheDocument());

    // detener -> volver a idle
    act(() => {
    fireEvent.click(stopBtn);
    });
    expect(screen.getByText(/Presiona iniciar para comenzar/i)).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('flujo grounding: avanza pasos y completa ejercicio', async () => {
    vi.useFakeTimers();
    render(<Tecnicas />);

    const startGroundBtn = screen.getByRole('button', { name: /Iniciar Grounding/i });
    act(() => {
    fireEvent.click(startGroundBtn);
    });

    // inmediatamente debe mostrar Paso 1 con el texto del primer paso
    await waitFor(() => expect(screen.getByText(/Paso 1:/i)).toBeInTheDocument());
    expect(screen.getByText(/Nombra 5 cosas que puedas ver/i)).toBeInTheDocument();

    // avanzar 6s -> Paso 2
    act(() => {
    vi.advanceTimersByTime(6000);
    });
    await waitFor(() => expect(screen.getByText(/Paso 2:/i)).toBeInTheDocument());

    // avanzar hasta completar (5 pasos -> 5 intervalos)
    act(() => {
    vi.advanceTimersByTime(6000 * 4); // avanzar 4 pasos más
    });
    await waitFor(() => expect(screen.getByText(/Ejercicio completado/i)).toBeInTheDocument());

    vi.useRealTimers();
  });
});
