/** @jest-environment node */

jest.mock('electron', () => {
  const removeMenu = jest.fn();
  function BrowserWindow() {}
  BrowserWindow.prototype.loadURL = jest.fn();
  BrowserWindow.prototype.loadFile = jest.fn();
  BrowserWindow.prototype.removeMenu = removeMenu;

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

 test('removeMenu called on BrowserWindow', async () => {
  await Promise.resolve();
  expect(__removeMenu).toHaveBeenCalled();
});
