import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from '../src/renderer/components/Sidebar.jsx';

test('calls onSelect when a section is clicked', () => {
  const onSelect = jest.fn();
  render(<Sidebar activeSection="Dashboard" onSelect={onSelect} />);
  fireEvent.click(screen.getByText('sidebar.clean'));
  expect(onSelect).toHaveBeenCalledWith('Clean');
});

test('clicks on Debloat tab', () => {
  const onSelect = jest.fn();
  render(<Sidebar activeSection="Debloat" onSelect={onSelect} />);
  const debloat = screen.getByText('sidebar.debloat');
  expect(debloat).toHaveClass('bg-primary');
  fireEvent.click(debloat);
  expect(onSelect).toHaveBeenCalledWith('Debloat');
});

test('clicks on Game Booster tab', () => {
  const onSelect = jest.fn();
  render(<Sidebar activeSection="Game Booster" onSelect={onSelect} />);
  const booster = screen.getByText('sidebar.game_booster');
  expect(booster).toHaveClass('bg-primary');
  fireEvent.click(booster);
  expect(onSelect).toHaveBeenCalledWith('Game Booster');
});

test('clicks on Optimize tab', () => {
  const onSelect = jest.fn();
  render(<Sidebar activeSection="Optimize" onSelect={onSelect} />);
  const optimize = screen.getByText('sidebar.optimize');
  expect(optimize).toHaveClass('bg-primary');
  fireEvent.click(optimize);
  expect(onSelect).toHaveBeenCalledWith('Optimize');
});

test('clicks on Advanced Tweaks tab', () => {
  const onSelect = jest.fn();
  render(<Sidebar activeSection="Advanced Tweaks" onSelect={onSelect} />);
  const advanced = screen.getByText('sidebar.advanced');
  expect(advanced).toHaveClass('bg-primary');
  fireEvent.click(advanced);
  expect(onSelect).toHaveBeenCalledWith('Advanced Tweaks');
});

test('clicks on Settings tab', () => {
  const onSelect = jest.fn();
  render(<Sidebar activeSection="Settings" onSelect={onSelect} />);
  const settings = screen.getByText('sidebar.settings');
  expect(settings).toHaveClass('bg-primary');
  fireEvent.click(settings);
  expect(onSelect).toHaveBeenCalledWith('Settings');
});
