const { contextBridge, ipcRenderer } = require('electron');

const api = {
  runScript: (cmd) => ipcRenderer.invoke('run-script', cmd)
};

contextBridge.exposeInMainWorld('api', api);

module.exports = { api };
