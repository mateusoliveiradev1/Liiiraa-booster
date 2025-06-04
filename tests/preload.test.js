jest.mock('electron', () => ({
  contextBridge: { exposeInMainWorld: jest.fn() },
  ipcRenderer: { invoke: jest.fn(() => Promise.resolve('ok')) }
}));

require('@testing-library/jest-dom');

const { api } = require('../src/main/preload.js');
const { ipcRenderer } = require('electron');

test('runScript calls ipcRenderer.invoke', async () => {
  await api.runScript('hello');
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('run-script', 'hello');
});

test('getLogs calls ipcRenderer.invoke', async () => {
  ipcRenderer.invoke.mockClear();
  await api.getLogs();
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('get-logs');
});
