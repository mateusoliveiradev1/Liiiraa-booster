/** @jest-environment node */

const handlers = {};

// Define a dummy resources path so path.join works when isPackaged is true
process.resourcesPath = '/resources';

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
  const BrowserWindow = jest.fn(function (opts) {
    lastOptions = opts;
    this.loadURL = jest.fn();
    this.loadFile = jest.fn();
    this.removeMenu = removeMenu;
  });

  return {
    __removeMenu: removeMenu,
    __browserWindowOptions: () => lastOptions,
    __handlers: handlers,
    app: {
      whenReady: jest.fn(() => Promise.resolve()),
      on: jest.fn(),
      isPackaged: true
    },
    BrowserWindow,
    ipcMain: { handle: jest.fn((channel, fn) => { handlers[channel] = fn; }) },
    Menu: { setApplicationMenu: jest.fn() }
  };
});

require('@testing-library/jest-dom');
require('../src/main/index.js');

const { __removeMenu, __browserWindowOptions } = require('electron');

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
});

test('run-script passes -NoProfile in args', async () => {
  const handler = handlers['run-script'];
  await handler({}, 'optimize');
  const args = execFile.mock.calls[0][1];
  expect(args).toContain('-NoProfile');
});

test('execFile uses unpacked scripts path when packaged', async () => {
  const handler = handlers['run-script'];
  await handler({}, 'optimize');
  const args = execFile.mock.calls[0][1];
  const idx = args.indexOf('-File');
  const scriptPath = args[idx + 1];
  const expected = require('path').join(
    process.resourcesPath,
    'app.asar.unpacked',
    'scripts',
    'optimize.ps1'
  );
  expect(scriptPath).toBe(expected);
});

test('BrowserWindow called with sandbox true', async () => {
  await Promise.resolve();
  expect(BrowserWindow).toHaveBeenCalledWith(
    expect.objectContaining({
      webPreferences: expect.objectContaining({ sandbox: true })
    })
  );
});
