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

test('runScript supports debloat-full command', async () => {
  await api.runScript('debloat-full');
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('run-script', 'debloat-full');
});

test('runScript supports debloat-lite command', async () => {
  await api.runScript('debloat-lite');
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('run-script', 'debloat-lite');
});

test('runScript supports debloat-restore command', async () => {
  await api.runScript('debloat-restore');
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('run-script', 'debloat-restore');
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

test('runScript supports restore-point command', async () => {
  await api.runScript('restore-point');
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('run-script', 'restore-point');
});

test('runScript supports energy-plan command', async () => {
  await api.runScript('energy-plan');
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('run-script', 'energy-plan');
});

test('runScript supports peripheral-energy command', async () => {
  await api.runScript('peripheral-energy');
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('run-script', 'peripheral-energy');
});

test('getUser calls ipcRenderer.invoke', async () => {
  ipcRenderer.invoke.mockClear();
  await api.getUser();
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('get-user');


});

