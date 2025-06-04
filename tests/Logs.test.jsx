import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Logs from '../src/renderer/components/Logs.jsx';

test('renders logs returned by api', async () => {
  window.api = {
    getLogs: jest.fn(() =>
      Promise.resolve([{ file: 'test.log', lines: ['[2024-01-01] Booted'] }])
    )
  };

  render(<Logs />);

  expect(await screen.findByText('test.log')).toBeInTheDocument();
  expect(screen.getByText('[2024-01-01] Booted')).toBeInTheDocument();
});
