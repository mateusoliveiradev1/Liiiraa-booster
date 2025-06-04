import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
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
  let send;
  window.api = {
    runScript: jest.fn((cmd) => {
      if (cmd === 'clean') return Promise.resolve('Freed 50 MB');
      return Promise.resolve('');
    }),
    startMetrics: jest.fn(() => Promise.resolve()),
    stopMetrics: jest.fn(() => Promise.resolve()),
    onMetrics: jest.fn((cb) => {
      send = cb;
    })
  };

  render(<App />);
  act(() => {
    send(JSON.parse(metricsJson));
  });
  fireEvent.click(screen.getByText('sidebar.system'));
  fireEvent.click(screen.getByText('sidebar.clean'));
  fireEvent.click(screen.getByText('buttons.run_clean'));
  expect(await screen.findByText('messages.clean_result')).toBeInTheDocument();
});
