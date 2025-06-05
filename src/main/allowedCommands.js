const path = require("path");
const electron = require("electron");

const isPackaged = Boolean(electron.app && electron.app.isPackaged);
const scriptsDir = isPackaged
  ? path.join(process.resourcesPath, "scripts")
  : path.resolve(__dirname, "../../scripts");

const ALLOWED_COMMANDS = {
  hello: {
    file: "cmd",
    args: ["/c", "echo", "Hello", "World"],
  },
  optimize: {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "optimize.ps1"),
    ],
  },
  "auto-optimize": {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "hardware-optimize.ps1"),
    ],
  },
  "auto-optimize-restore": {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "hardware-optimize.ps1"),
      "-Restore",
    ],
  },
  clean: {
    file: "cmd",
    args: ["/c", path.join(scriptsDir, "clean.bat")],
  },
  "debloat-full": {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "debloat.ps1"),
      "-Full",
    ],
  },
  "debloat-lite": {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "debloat.ps1"),
      "-Lite",
    ],
  },
  "debloat-restore": {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "debloat.ps1"),
      "-Restore",
    ],
  },
  restore: {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "optimize.ps1"),
      "-Restore",
    ],
  },
  "restore-point": {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "restore-point.ps1"),
    ],
  },
  gamebooster: {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "gamebooster.ps1"),
    ],
  },
  "gamebooster-restore": {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "gamebooster-restore.ps1"),
    ],
  },
  advanced: {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "advanced.ps1"),
    ],
  },
  "cpu-amd": {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "cpu-amd.ps1"),
    ],
  },
  "cpu-amd-restore": {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "cpu-amd.ps1"),
      "-Restore",
    ],
  },
  "cpu-intel": {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "cpu-intel.ps1"),
    ],
  },
  "cpu-intel-restore": {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "cpu-intel.ps1"),
      "-Restore",
    ],
  },
  "gpu-nvidia": {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "gpu-nvidia.ps1"),
    ],
  },
  "gpu-nvidia-restore": {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "gpu-nvidia.ps1"),
      "-Restore",
    ],
  },
  "gpu-intel": {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "gpu-intel.ps1"),
    ],
  },
  "gpu-intel-restore": {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "gpu-intel.ps1"),
      "-Restore",
    ],
  },
  "gpu-amd": {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "gpu-amd.ps1"),
    ],
  },
  "gpu-amd-restore": {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "gpu-amd.ps1"),
      "-Restore",
    ],
  },
  pubg: {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "pubg.ps1"),
    ],
  },
  "pubg-restore": {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "pubg.ps1"),
      "-Restore",
    ],
  },
  cs2: {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "cs2.ps1"),
    ],
  },
  "cs2-restore": {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "cs2.ps1"),
      "-Restore",
    ],
  },
  fortnite: {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "fortnite.ps1"),
    ],
  },
  "fortnite-restore": {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "fortnite.ps1"),
      "-Restore",
    ],
  },
  warzone: {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "warzone.ps1"),
    ],
  },
  "warzone-restore": {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "warzone.ps1"),
      "-Restore",
    ],
  },
  valorant: {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "valorant.ps1"),
    ],
  },
  "valorant-restore": {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "valorant.ps1"),
      "-Restore",
    ],
  },
  "energy-plan": {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "energy-plan.ps1"),
    ],
  },
  "peripheral-energy": {
    file: "powershell",
    args: [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-File",
      path.join(scriptsDir, "peripheral-energy.ps1"),
    ],
  },
  metrics: {
    file: "python",
    args: [path.join(scriptsDir, "metrics.py")],
  },
};

const ALLOWED_COMMAND_NAMES = Object.freeze(Object.keys(ALLOWED_COMMANDS));

module.exports = { ALLOWED_COMMANDS, ALLOWED_COMMAND_NAMES };
