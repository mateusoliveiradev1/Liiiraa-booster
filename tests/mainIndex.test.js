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
  const BrowserWindow = jest.fn(function (opts) {
    this.loadURL = jest.fn();
    this.loadFile = jest.fn();
    this.removeMenu = removeMenu;
    this.opts = opts;
  });

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

const { __removeMenu } = require('electron');
const { BrowserWindow } = require('electron');


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

test('BrowserWindow called with sandbox true', async () => {
  await Promise.resolve();
  expect(BrowserWindow).toHaveBeenCalledWith(
    expect.objectContaining({
      webPreferences: expect.objectContaining({ sandbox: true })
    })
  );

});
