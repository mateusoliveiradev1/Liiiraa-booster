/** @jest-environment node */

const handlers = {};
jest.mock('child_process', () => {
  const execFile = jest.fn(() => ({
    stdout: { on: jest.fn() },
    stderr: { on: jest.fn() },
    on: jest.fn((event, cb) => {
      if (event === 'close') cb(0);
    })
  }));
  return { execFile };
});
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
    __handlers: handlers,
    app: { whenReady: jest.fn(() => Promise.resolve()), on: jest.fn() },
    BrowserWindow,
    ipcMain: { handle: jest.fn((channel, fn) => { handlers[channel] = fn; }) },
    Menu: { setApplicationMenu: jest.fn() }
  };
});

require('@testing-library/jest-dom');

require('../src/main/index.js');

const { __removeMenu, __browserWindowOptions } = require('electron');

const { __removeMenu } = require('electron');
const { execFile } = require('child_process');
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

test('run-script passes -NoProfile in args', async () => {
  const handler = handlers['run-script'];
  await handler({}, 'optimize');
  const args = execFile.mock.calls[0][1];
  expect(args).toContain('-NoProfile');
});
test('BrowserWindow called with sandbox true', async () => {
  await Promise.resolve();
  expect(BrowserWindow).toHaveBeenCalledWith(
    expect.objectContaining({
      webPreferences: expect.objectContaining({ sandbox: true })
    })
  );

});
