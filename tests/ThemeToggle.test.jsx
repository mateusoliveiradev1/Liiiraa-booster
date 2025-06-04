import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/renderer/App.jsx';

function mockMetrics() {
  return JSON.stringify({
    cpu_percent: 0,
    memory_used: 0,
    memory_total: 1,
    disk_used: 0,
    disk_total: 1,
    network_bytes_per_sec: 0
  });
}

test('theme toggle switches dark class on html', async () => {
  let send;
  window.api = {
    runScript: jest.fn(() => Promise.resolve()),
    startMetrics: jest.fn(() => Promise.resolve()),
    stopMetrics: jest.fn(() => Promise.resolve()),
    onMetrics: jest.fn((cb) => {
      send = cb;
    }),
    getLogs: jest.fn(),
    getUser: jest.fn(() => Promise.resolve('alice'))
  };
  document.documentElement.classList.remove('dark');
  render(<App />);
  act(() => { send(JSON.parse(mockMetrics())); });
  await screen.findByText('labels.user: alice');
  const toggle = screen.getByTestId('theme-toggle');
  expect(document.documentElement.classList.contains('dark')).toBe(false);
  fireEvent.click(toggle);
  expect(document.documentElement.classList.contains('dark')).toBe(true);
});
