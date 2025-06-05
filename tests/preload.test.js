jest.mock('electron', () => ({
  contextBridge: { exposeInMainWorld: jest.fn() },
  ipcRenderer: { invoke: jest.fn(() => Promise.resolve('ok')), on: jest.fn(), removeListener: jest.fn() }
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

test('clearLogs calls ipcRenderer.invoke', async () => {
  ipcRenderer.invoke.mockClear();
  await api.clearLogs();
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('clear-logs');
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

test('runScript supports auto-optimize-restore command', async () => {
  await api.runScript('auto-optimize-restore');
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('run-script', 'auto-optimize-restore');
});

test('runScript supports clean command', async () => {
  await api.runScript('clean');
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('run-script', 'clean');
});

test('runScript supports cpu-amd-restore command', async () => {
  await api.runScript('cpu-amd-restore');
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('run-script', 'cpu-amd-restore');
});

test('runScript supports cpu-intel-restore command', async () => {
  await api.runScript('cpu-intel-restore');
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('run-script', 'cpu-intel-restore');
});

test('runScript supports gpu-nvidia-restore command', async () => {
  await api.runScript('gpu-nvidia-restore');
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('run-script', 'gpu-nvidia-restore');
});

test('runScript supports gpu-intel-restore command', async () => {
  await api.runScript('gpu-intel-restore');
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('run-script', 'gpu-intel-restore');
});

test('runScript supports gpu-amd-restore command', async () => {
  await api.runScript('gpu-amd-restore');
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('run-script', 'gpu-amd-restore');
});

test('runScript supports restore command', async () => {
  await api.runScript('restore');
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('run-script', 'restore');
});

test('runScript supports restore command after optimization', async () => {
  ipcRenderer.invoke.mockClear();
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

test('startMetrics calls ipcRenderer.invoke', async () => {
  ipcRenderer.invoke.mockClear();
  await api.startMetrics();
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('start-metrics');
});

test('stopMetrics calls ipcRenderer.invoke', async () => {
  ipcRenderer.invoke.mockClear();
  await api.stopMetrics();
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('stop-metrics');
});

test('onMetrics registers and removes listener', () => {
  const cb = jest.fn();
  const off = api.onMetrics(cb);
  expect(ipcRenderer.on).toHaveBeenCalledWith('metrics-data', expect.any(Function));
  const handler = ipcRenderer.on.mock.calls[0][1];
  handler({}, 'x');
  expect(cb).toHaveBeenCalledWith('x');
  off();
  expect(ipcRenderer.removeListener).toHaveBeenCalledWith('metrics-data', handler);
});

test('getUser calls ipcRenderer.invoke', async () => {
  ipcRenderer.invoke.mockClear();
  await api.getUser();
  expect(ipcRenderer.invoke).toHaveBeenCalledWith('get-user');
});

test('runScript rejects unknown command', async () => {
  ipcRenderer.invoke.mockClear();
  await expect(api.runScript('invalid')).rejects.toThrow('Command not allowed');
  expect(ipcRenderer.invoke).not.toHaveBeenCalled();
});

test('runScript does not invoke ipcRenderer on invalid command', async () => {
  ipcRenderer.invoke.mockClear();
  await expect(api.runScript('invalid')).rejects.toThrow();
  expect(ipcRenderer.invoke).not.toHaveBeenCalled();
});


