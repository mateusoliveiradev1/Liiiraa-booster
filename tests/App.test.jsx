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
  let send;
  window.api = {
    getUser: jest.fn(() => Promise.resolve('alice')),
    startMetrics: jest.fn(() => Promise.resolve()),
    stopMetrics: jest.fn(() => Promise.resolve()),
    onMetrics: jest.fn((cb) => {
      send = cb;
    }),
    runScript: jest.fn(),
    getLogs: jest.fn()
  };

  render(<App />);
  act(() => {
    send(JSON.parse(mockMetrics()));
  });

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

test('renders gpu temperature when provided', async () => {
  const payload = {
    cpu_percent: 0,
    memory_used: 0,
    memory_total: 1,
    disk_used: 0,
    disk_total: 1,
    network_bytes_per_sec: 0,
    gpu_util: 50,
    gpu_mem_used: 0,
    gpu_mem_total: 1,
    gpu_temp: 65
  };
  let send;
  window.api = {
    getUser: jest.fn(() => Promise.resolve('alice')),
    startMetrics: jest.fn(() => Promise.resolve()),
    stopMetrics: jest.fn(() => Promise.resolve()),
    onMetrics: jest.fn((cb) => {
      send = cb;
    }),
    runScript: jest.fn(),
    getLogs: jest.fn()
  };

  render(<App />);
  act(() => {
    send(payload);
  });

  expect(
    await screen.findByText('labels.temperature: 65°C')
  ).toBeInTheDocument();
});
