const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

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
    win.loadFile(path.join(__dirname, '../../dist/index.html'));
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

  const scriptsDir = path.resolve(__dirname, '../../scripts');
  const allowed = {
    hello: {
      file: 'cmd',
      args: ['/c', 'echo', 'Hello', 'World']
    },
    optimize: {
      file: 'powershell',
      args: [
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        path.join(scriptsDir, 'optimize.ps1')
      ]
    },
    clean: {
      file: 'cmd',
      args: ['/c', path.join(scriptsDir, 'clean.bat')]
    },
    debloat: {
      file: 'powershell',
      args: [
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        path.join(scriptsDir, 'debloat.ps1')
      ]
    },
    restore: {
      file: 'powershell',
      args: [
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        path.join(scriptsDir, 'optimize.ps1'),
        '-Restore'
      ]
    },
    gamebooster: {
      file: 'powershell',
      args: [
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        path.join(scriptsDir, 'gamebooster.ps1')
      ]
    },

    advanced: {

    'cpu-amd': {

      file: 'powershell',
      args: [
        '-ExecutionPolicy',
        'Bypass',
        '-File',

        path.join(scriptsDir, 'advanced.ps1')

        path.join(scriptsDir, 'cpu-amd.ps1')
      ]
    },
    'cpu-intel': {
      file: 'powershell',
      args: [
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        path.join(scriptsDir, 'cpu-intel.ps1')
      ]
    },
    'gpu-nvidia': {
      file: 'powershell',
      args: [
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        path.join(scriptsDir, 'gpu-nvidia.ps1')
      ]
    },
    'gpu-amd': {
      file: 'powershell',
      args: [
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        path.join(scriptsDir, 'gpu-amd.ps1')
      ]
    },
    pubg: {
      file: 'powershell',
      args: [
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        path.join(scriptsDir, 'pubg.ps1')
      ]
    },
    cs2: {
      file: 'powershell',
      args: [
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        path.join(scriptsDir, 'cs2.ps1')
      ]
    },
    fortnite: {
      file: 'powershell',
      args: [
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        path.join(scriptsDir, 'fortnite.ps1')
      ]
    },
    warzone: {
      file: 'powershell',
      args: [
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        path.join(scriptsDir, 'warzone.ps1')
      ]
    },
    valorant: {
      file: 'powershell',
      args: [
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        path.join(scriptsDir, 'valorant.ps1')

      ]
    },
    metrics: {
      file: 'python',
      args: [path.join(scriptsDir, 'metrics.py')]
    }
  };
  if (!allowed[command]) {
    throw new Error('Command not allowed');
  }
  const { execFile } = require('child_process');
  return new Promise((resolve, reject) => {
    const { file, args } = allowed[command];
    const child = execFile(file, args, { windowsHide: true });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data;
    });

    child.stderr.on('data', (data) => {
      stderr += data;
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(stderr || `Process exited with code ${code}`);
      } else {
        resolve(stdout);
      }
    });

    child.on('error', (error) => {
      reject(error.message);
    });
  });
});

ipcMain.handle('get-logs', async () => {
  const logsDir = path.resolve(__dirname, '../../logs');
  try {
    const files = fs
      .readdirSync(logsDir)
      .filter((f) => f.endsWith('.log'));
    return files.map((file) => {
      const content = fs.readFileSync(path.join(logsDir, file), 'utf8');
      const lines = content.trim().split(/\r?\n/);
      return { file, lines };
    });
  } catch (err) {
    return [];
  }
});
