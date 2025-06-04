const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  runScript: (cmd) => ipcRenderer.invoke('run-script', cmd)
});
