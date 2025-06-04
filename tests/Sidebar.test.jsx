import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from '../src/renderer/components/Sidebar.jsx';

test('toggle button collapses the sidebar', () => {
  render(<Sidebar activeSection="Dashboard" onSelect={() => {}} />);
  const toggle = screen.getByLabelText(/toggle sidebar/i);
  const sidebar = screen.getByTestId('sidebar');
  expect(sidebar.className).toContain('w-48');
  fireEvent.click(toggle);
  expect(sidebar.className).toContain('w-12');
});

test('renders group headings', () => {
  render(<Sidebar activeSection="Dashboard" onSelect={() => {}} />);
  expect(screen.getByText('sidebar.group_system')).toBeInTheDocument();
  expect(screen.getByText('sidebar.group_hardware')).toBeInTheDocument();
  expect(screen.getByText('sidebar.group_games')).toBeInTheDocument();
  expect(screen.getByText('sidebar.group_other')).toBeInTheDocument();
});

test('calls onSelect when a section is clicked', () => {
  const onSelect = jest.fn();
  render(<Sidebar activeSection="Dashboard" onSelect={onSelect} />);
  fireEvent.click(screen.getByRole('button', { name: /sidebar.clean/ }));
  expect(onSelect).toHaveBeenCalledWith('Clean');
});

test('clicks on Debloat tab', () => {
  const onSelect = jest.fn();
  render(<Sidebar activeSection="Debloat" onSelect={onSelect} />);
  const debloat = screen.getByRole('button', { name: /sidebar.debloat/ });
  expect(debloat).toHaveClass('bg-primary');
  fireEvent.click(debloat);
  expect(onSelect).toHaveBeenCalledWith('Debloat');
});

test('clicks on Game Booster tab', () => {
  const onSelect = jest.fn();
  render(<Sidebar activeSection="Game Booster" onSelect={onSelect} />);
  const booster = screen.getByRole('button', { name: /sidebar.game_booster/ });
  expect(booster).toHaveClass('bg-primary');
  fireEvent.click(booster);
  expect(onSelect).toHaveBeenCalledWith('Game Booster');
});

test('clicks on Optimize tab', () => {
  const onSelect = jest.fn();
  render(<Sidebar activeSection="Optimize" onSelect={onSelect} />);
  const optimize = screen.getByRole('button', { name: /sidebar.optimize/ });
  expect(optimize).toHaveClass('bg-primary');
  fireEvent.click(optimize);
  expect(onSelect).toHaveBeenCalledWith('Optimize');
});

test('clicks on Advanced Tweaks tab', () => {
  const onSelect = jest.fn();
  render(<Sidebar activeSection="Advanced Tweaks" onSelect={onSelect} />);
  const advanced = screen.getByRole('button', { name: /sidebar.advanced/ });
  expect(advanced).toHaveClass('bg-primary');
  fireEvent.click(advanced);
  expect(onSelect).toHaveBeenCalledWith('Advanced Tweaks');
});

test('clicks on Settings tab', () => {
  const onSelect = jest.fn();
  render(<Sidebar activeSection="Settings" onSelect={onSelect} />);
  const settings = screen.getByRole('button', { name: /sidebar.settings/ });
  expect(settings).toHaveClass('bg-primary');
  fireEvent.click(settings);
  expect(onSelect).toHaveBeenCalledWith('Settings');
});
