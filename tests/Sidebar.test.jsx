import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from '../src/renderer/components/Sidebar.jsx';

test('calls onSelect when a section is clicked', () => {
  const onSelect = jest.fn();
  render(<Sidebar activeSection="Dashboard" onSelect={onSelect} />);
  fireEvent.click(screen.getByText('Clean'));
  expect(onSelect).toHaveBeenCalledWith('Clean');
});
