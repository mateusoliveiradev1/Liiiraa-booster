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

test('clicks on Debloat tab', () => {
  const onSelect = jest.fn();
  render(<Sidebar activeSection="Debloat" onSelect={onSelect} />);
  const debloat = screen.getByText('Debloat');
  expect(debloat).toHaveClass('bg-blue-600');
  fireEvent.click(debloat);
  expect(onSelect).toHaveBeenCalledWith('Debloat');
});

test('clicks on Game Booster tab', () => {
  const onSelect = jest.fn();
  render(<Sidebar activeSection="Game Booster" onSelect={onSelect} />);
  const booster = screen.getByText('Game Booster');
  expect(booster).toHaveClass('bg-blue-600');
  fireEvent.click(booster);
  expect(onSelect).toHaveBeenCalledWith('Game Booster');
});

test('clicks on Optimize tab', () => {
  const onSelect = jest.fn();
  render(<Sidebar activeSection="Optimize" onSelect={onSelect} />);
  const optimize = screen.getByText('Optimize');
  expect(optimize).toHaveClass('bg-blue-600');
  fireEvent.click(optimize);
  expect(onSelect).toHaveBeenCalledWith('Optimize');
});

test('clicks on Advanced Tweaks tab', () => {
  const onSelect = jest.fn();
  render(<Sidebar activeSection="Advanced Tweaks" onSelect={onSelect} />);
  const advanced = screen.getByText('Advanced Tweaks');
  expect(advanced).toHaveClass('bg-blue-600');
  fireEvent.click(advanced);
  expect(onSelect).toHaveBeenCalledWith('Advanced Tweaks');
});

test('clicks on Settings tab', () => {
  const onSelect = jest.fn();
  render(<Sidebar activeSection="Settings" onSelect={onSelect} />);
  const settings = screen.getByText('Settings');
  expect(settings).toHaveClass('bg-blue-600');
  fireEvent.click(settings);
  expect(onSelect).toHaveBeenCalledWith('Settings');
});
