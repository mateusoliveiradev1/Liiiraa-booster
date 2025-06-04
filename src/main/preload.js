const { contextBridge, ipcRenderer } = require('electron');

const ALLOWED_COMMANDS = new Set([
  'hello',
  'optimize',
  'auto-optimize',
  'auto-optimize-restore',
  'clean',
  'debloat-full',
  'debloat-lite',
  'debloat-restore',
  'restore',
  'restore-point',
  'gamebooster',
  'gamebooster-restore',
  'advanced',
  'cpu-amd',
  'cpu-amd-restore',
  'cpu-intel',
  'cpu-intel-restore',
  'gpu-nvidia',
  'gpu-intel',
  'gpu-amd',
  'pubg',
  'cs2',
  'fortnite',
  'warzone',
  'valorant',
  'energy-plan',
  'peripheral-energy'
]);

const api = {
  runScript: (cmd) => {
    if (!ALLOWED_COMMANDS.has(cmd)) {
      return Promise.reject(new Error('Command not allowed'));
    }
    return ipcRenderer.invoke('run-script', cmd);
  },
  startMetrics: () => ipcRenderer.invoke('start-metrics'),
  stopMetrics: () => ipcRenderer.invoke('stop-metrics'),
  onMetrics: (callback) => {
    const listener = (_event, data) => callback(data);
    ipcRenderer.on('metrics-data', listener);
    return () => ipcRenderer.removeListener('metrics-data', listener);
  },
  getLogs: () => ipcRenderer.invoke('get-logs'),
  clearLogs: () => ipcRenderer.invoke('clear-logs'),
  getUser: () => ipcRenderer.invoke('get-user')
};

Object.freeze(api);

contextBridge.exposeInMainWorld('api', api);

module.exports = { api };
