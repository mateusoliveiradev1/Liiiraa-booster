/** @jest-environment node */

jest.mock('electron', () => {
  const removeMenu = jest.fn();
  const BrowserWindow = jest.fn(function (opts) {
    this.loadURL = jest.fn();
    this.loadFile = jest.fn();
    this.removeMenu = removeMenu;
    this.opts = opts;
  });

  return {
    __removeMenu: removeMenu,
    app: { whenReady: jest.fn(() => Promise.resolve()), on: jest.fn() },
    BrowserWindow,
    ipcMain: { handle: jest.fn() },
    Menu: { setApplicationMenu: jest.fn() }
  };
});

require('@testing-library/jest-dom');

require('../src/main/index.js');

const { __removeMenu } = require('electron');
const { BrowserWindow } = require('electron');

test('removeMenu called on BrowserWindow', async () => {
  await Promise.resolve();
  expect(__removeMenu).toHaveBeenCalled();
});

test('BrowserWindow called with sandbox true', async () => {
  await Promise.resolve();
  expect(BrowserWindow).toHaveBeenCalledWith(
    expect.objectContaining({
      webPreferences: expect.objectContaining({ sandbox: true })
    })
  );
});
