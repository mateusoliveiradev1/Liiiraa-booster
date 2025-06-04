import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Logs from '../src/renderer/components/Logs.jsx';

test('renders logs returned by api', async () => {
  window.api = {
    getLogs: jest.fn(() =>
      Promise.resolve([{ file: 'test.log', lines: ['[2024-01-01] Booted'], truncated: false }])
    )
  };

  await act(async () => {
    render(<Logs />);
  });

  expect(await screen.findByText('test.log')).toBeInTheDocument();
  expect(screen.getByText('[2024-01-01] Booted')).toBeInTheDocument();
});

test('clear logs button triggers api', async () => {
  window.api = {
    getLogs: jest.fn(() => Promise.resolve([])),
    clearLogs: jest.fn(() => Promise.resolve())
  };

  await act(async () => {
    render(<Logs />);
  });
  const button = await screen.findByText('buttons.clear_logs');
  await act(async () => {
    fireEvent.click(button);
  });
  expect(window.api.clearLogs).toHaveBeenCalled();
});

test('shows truncated message when logs are large', async () => {
  window.api = {
    getLogs: jest.fn(() =>
      Promise.resolve([
        { file: 'big.log', lines: ['last line'], truncated: true }
      ])
    )
  };

  await act(async () => {
    render(<Logs />);
  });

  expect(await screen.findByText('messages.logs_truncated')).toBeInTheDocument();
});
