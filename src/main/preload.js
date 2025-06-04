const { contextBridge, ipcRenderer } = require('electron');

const api = {
  runScript: (cmd) => ipcRenderer.invoke('run-script', cmd),
  getLogs: () => ipcRenderer.invoke('get-logs'),
  getUser: () => ipcRenderer.invoke('get-user')
};

contextBridge.exposeInMainWorld('api', api);

module.exports = { api };
