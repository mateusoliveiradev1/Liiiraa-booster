const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');

function createWindow () {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,

    resizable: false,
    minWidth: 1024,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true
    }
  });
  win.removeMenu();

  // Disable the default menu bar to provide a cleaner UI

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

let metricsProcess = null;
const { ALLOWED_COMMANDS } = require("./allowedCommands");

ipcMain.handle('start-metrics', async (event) => {
  if (metricsProcess) return;
  const { spawn } = require('child_process');
  const { file, args } = ALLOWED_COMMANDS.metrics;
  metricsProcess = spawn(file, args, { windowsHide: true });

  metricsProcess.stdout.on('data', (data) => {
    const lines = data.toString().split(/\r?\n/).filter(Boolean);
    for (const line of lines) {
      try {
        const json = JSON.parse(line);
        event.sender.send('metrics-data', json);
      } catch (e) {
        /* ignore */
      }
    }
  });

  metricsProcess.stderr.on('data', () => {});

  metricsProcess.on('close', () => {
    metricsProcess = null;
  });
});

ipcMain.handle('stop-metrics', async () => {
  if (metricsProcess) {
    metricsProcess.kill();
    metricsProcess = null;
  }
});

ipcMain.handle('run-script', async (_event, command) => {
  // whitelist allowed commands for security
  if (!ALLOWED_COMMANDS[command]) {
    throw new Error('Command not allowed');
  }
  return new Promise((resolve, reject) => {
    const { file, args } = ALLOWED_COMMANDS[command];
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
  const MAX_LOG_LINES = 500;
  try {
    const files = (await fs.promises.readdir(logsDir)).filter((f) =>
      f.endsWith('.log')
    );
    const results = [];
    for (const file of files) {
      const content = await fs.promises.readFile(
        path.join(logsDir, file),
        'utf8'
      );
      const lines = content.trim().split(/\r?\n/);
      const truncated = lines.length > MAX_LOG_LINES;
      results.push({
        file,
        lines: lines.slice(-MAX_LOG_LINES),
        truncated
      });
    }
    return results;
  } catch (err) {
    return [];
  }
});

ipcMain.handle('clear-logs', async () => {
  const logsDir = path.resolve(__dirname, '../../logs');
  try {
    const files = (await fs.promises.readdir(logsDir)).filter((f) =>
      f.endsWith('.log')
    );
    for (const file of files) {
      await fs.promises.unlink(path.join(logsDir, file));
    }
    return true;
  } catch (err) {
    throw err;
  }
});

ipcMain.handle('get-user', async () => {
  return require('os').userInfo().username;
});
