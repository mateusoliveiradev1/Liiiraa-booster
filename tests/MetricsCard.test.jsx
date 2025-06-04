import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MetricsCard from '../src/renderer/components/MetricsCard.jsx';
import { FaBolt } from 'react-icons/fa';

test('renders label and value', () => {
  render(<MetricsCard label="CPU" value="20%" />);
  expect(screen.getByText('CPU')).toBeInTheDocument();
  expect(screen.getByText('20%')).toBeInTheDocument();
});

test('renders icon when provided', () => {
  render(
    <MetricsCard label="CPU" value="20%" icon={<FaBolt data-testid="icon" />} />
  );
  expect(screen.getByTestId('icon')).toBeInTheDocument();
});

test('renders progress bar with correct value', () => {
  render(<MetricsCard label="CPU" value="20%" percentage={50} />);
  const bar = screen.getByRole('progressbar');
  expect(bar).toHaveAttribute('aria-valuenow', '50');
});

test('renders temperature when provided', () => {
  render(<MetricsCard label="GPU" value="50%" temperature="Temp: 70°C" />);
  expect(screen.getByText('Temp: 70°C')).toBeInTheDocument();
});
