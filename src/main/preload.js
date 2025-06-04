const { contextBridge, ipcRenderer } = require('electron');
const { ALLOWED_COMMAND_NAMES } = require('./allowedCommands');

const ALLOWED_COMMANDS = new Set(ALLOWED_COMMAND_NAMES);

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
