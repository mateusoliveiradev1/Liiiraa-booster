const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Basic secure IPC example
ipcMain.handle('run-script', async (_event, command) => {
  // whitelist allowed commands for security
  const allowed = {
    'hello': 'echo Hello World',
    'optimize': 'powershell -ExecutionPolicy Bypass -File scripts/optimize.ps1',
    'clean': 'cmd /c scripts/clean.bat',
    'metrics': 'python scripts/metrics.py'
  };
  if (!allowed[command]) {
    throw new Error('Command not allowed');
  }
  const exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
    exec(allowed[command], (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout);
      }
    });
  });
});
