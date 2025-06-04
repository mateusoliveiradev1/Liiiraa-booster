import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MetricsCard from '../src/renderer/components/MetricsCard.jsx';

test('renders label and value', () => {
  render(<MetricsCard label="CPU" value="20%" />);
  expect(screen.getByText('CPU')).toBeInTheDocument();
  expect(screen.getByText('20%')).toBeInTheDocument();
});
