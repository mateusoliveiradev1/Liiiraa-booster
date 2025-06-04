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

test('runScript supports debloat command', async () => {
  await api.runScript('debloat');
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('run-script', 'debloat');
});

test('runScript supports gamebooster command', async () => {
  await api.runScript('gamebooster');
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('run-script', 'gamebooster');
});
