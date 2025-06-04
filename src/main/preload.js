const { contextBridge, ipcRenderer } = require('electron');

const api = {
  runScript: (cmd) => ipcRenderer.invoke('run-script', cmd),
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
