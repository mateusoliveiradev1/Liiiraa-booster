import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/renderer/App.jsx';

const metricsJson = JSON.stringify({
  cpu_percent: 0,
  memory_used: 0,
  memory_total: 1,
  disk_used: 0,
  disk_total: 1,
  network_bytes_per_sec: 0,
  net_up: 0,
  net_down: 0
});

test('renders freed space after clean command', async () => {
  window.api = {
    runScript: jest.fn((cmd) => {
      if (cmd === 'metrics') return Promise.resolve(metricsJson);
      if (cmd === 'clean') return Promise.resolve('Freed 50 MB');
      return Promise.resolve('');
    })
  };

  render(<App />);
  fireEvent.click(screen.getByText('Clean'));
  fireEvent.click(screen.getByText('Run Clean'));
  expect(await screen.findByText(/Freed 50 MB/)).toBeInTheDocument();
});
