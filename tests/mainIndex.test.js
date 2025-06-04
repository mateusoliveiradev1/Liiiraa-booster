/** @jest-environment node */

jest.mock('electron', () => {
  const removeMenu = jest.fn();
  let lastOptions;
  function BrowserWindow(options) {
    lastOptions = options;
  }
  BrowserWindow.prototype.loadURL = jest.fn();
  BrowserWindow.prototype.loadFile = jest.fn();
  BrowserWindow.prototype.removeMenu = removeMenu;

  return {
    __removeMenu: removeMenu,
    __browserWindowOptions: () => lastOptions,
    app: { whenReady: jest.fn(() => Promise.resolve()), on: jest.fn() },
    BrowserWindow,
    ipcMain: { handle: jest.fn() },
    Menu: { setApplicationMenu: jest.fn() }
  };
});

require('@testing-library/jest-dom');

require('../src/main/index.js');

const { __removeMenu, __browserWindowOptions } = require('electron');

test('removeMenu called on BrowserWindow', async () => {
  await Promise.resolve();
  expect(__removeMenu).toHaveBeenCalled();
});

test('BrowserWindow created with secure preferences', async () => {
  await Promise.resolve();
  const opts = __browserWindowOptions();
  expect(opts.webPreferences).toMatchObject({
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    sandbox: true
  });
});
