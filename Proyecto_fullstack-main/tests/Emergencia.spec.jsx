import React from 'react';
import { render, screen } from '@testing-library/react';
import Emergencia from '../src/pages/Emergencia';

describe('Componente Emergencia', () => {
  it('renderiza título, subtítulo y mensaje de apoyo', () => {
    render(<Emergencia />);
    expect(screen.getByText(/Ayuda Inmediata/i)).toBeInTheDocument();
    expect(screen.getByText(/Si estás en una crisis/i)).toBeInTheDocument();
    expect(screen.getByText(/No estás solo\/a\./i)).toBeInTheDocument();
  });

  it('contiene los enlaces telefónicos correctos', () => {
    render(<Emergencia />);
    const samu = screen.getByText(/SAMU \(Emergencias Médicas\)/i);
    const samulink = samu.closest('a');
    expect(samulink).toBeTruthy();
    expect(samulink.getAttribute('href')).toBe('tel:131');

    const salud = screen.getByText(/Salud Responde/i);
    const saludlink = salud.closest('a');
    expect(saludlink).toBeTruthy();
    expect(saludlink.getAttribute('href')).toBe('tel:6003607777');

    const carab = screen.getByText(/Carabineros \(Emergencia Policial\)/i);
    const carablink = carab.closest('a');
    expect(carablink).toBeTruthy();
    expect(carablink.getAttribute('href')).toBe('tel:133');
  });
});
