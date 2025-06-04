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

test('runScript supports debloat command', async () => {
  await api.runScript('debloat');
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('run-script', 'debloat');
});

test('runScript supports gamebooster command', async () => {
  await api.runScript('gamebooster');
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('run-script', 'gamebooster');
});

test('runScript supports optimize command', async () => {
  await api.runScript('optimize');
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('run-script', 'optimize');
});

test('runScript supports auto-optimize command', async () => {
  await api.runScript('auto-optimize');
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('run-script', 'auto-optimize');
});

test('runScript supports clean command', async () => {
  await api.runScript('clean');
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('run-script', 'clean');
});

test('runScript supports restore command', async () => {
  await api.runScript('restore');
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('run-script', 'restore');
});


test('getUser calls ipcRenderer.invoke', async () => {
  ipcRenderer.invoke.mockClear();
  await api.getUser();
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('get-user');

test('runScript supports restore-point command', async () => {
  await api.runScript('restore-point');
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('run-script', 'restore-point');

});
