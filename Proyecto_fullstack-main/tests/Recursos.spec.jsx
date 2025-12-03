import React from 'react';
import { render, screen } from '@testing-library/react';
import Recursos from '../src/pages/Recursos';

describe('Componente Recursos', () => {
  it('renderiza título y descripción', () => {
    render(<Recursos />);
    
    expect(screen.getByRole('heading', { name: /Recursos/i })).toBeInTheDocument();
    expect(screen.getByText(/Artículos y ejercicios para tu bienestar./i)).toBeInTheDocument();
  });

  it('muestra los elementos de la lista con sus textos', () => {
    render(<Recursos />);
    expect(screen.getByText(/Entendiendo la Ansiedad/i)).toBeInTheDocument();
    expect(screen.getByText(/Meditación guiada de 5 minutos/i)).toBeInTheDocument();
    expect(screen.getByText(/rutina de sueño/i)).toBeInTheDocument();
    expect(screen.getByText(/Recursos de Salud Mental MINSAL/i)).toBeInTheDocument();
  });
});
