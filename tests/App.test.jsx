import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/renderer/App.jsx';

jest.useFakeTimers();

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

test('displays username and updates time', async () => {
  window.api = {
    getUser: jest.fn(() => Promise.resolve('alice')),
    runScript: jest.fn(() => Promise.resolve(mockMetrics())),
    getLogs: jest.fn()
  };

  render(<App />);

  expect(await screen.findByText('labels.user: alice')).toBeInTheDocument();
  expect(screen.getByText(/^labels.date/)).toBeInTheDocument();
  expect(window.api.getUser).toHaveBeenCalled();

  const first = screen.getByText(/^labels.time/).textContent;
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  const second = screen.getByText(/^labels.time/).textContent;
  expect(second).not.toBe(first);
});
