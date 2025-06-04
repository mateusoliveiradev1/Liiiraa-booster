import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/renderer/App.jsx';

/**
 * Ensure spinner is shown while runScript promises are pending.
 */

test('shows spinner during command execution', async () => {
  let resolveFn;
  window.api = {
    runScript: jest.fn(() => new Promise(res => { resolveFn = res; })),
    getLogs: jest.fn(),
    getUser: jest.fn(() => Promise.resolve('alice'))
  };

  render(<App />);
  await screen.findByText('labels.user: alice');

  fireEvent.click(screen.getByRole('button', { name: /sidebar.optimize/ }));
  fireEvent.click(screen.getByText('buttons.run_optimize'));

  // Spinner should be visible while promise is pending
  expect(screen.getByTestId('spinner')).toBeInTheDocument();

  await act(async () => {
    resolveFn('ok');
  });

  await waitFor(() => {
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
  });
});
