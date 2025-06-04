# 🚀 Liiiraa Booster
[English](README.en.md) | [Português](README.md)

This file contains the English instructions for setting up, building and testing the project.

## 🚀 Getting Started

1. Install [Node.js](https://nodejs.org/) (v18 or higher recommended).
2. Clone this repository and open the project folder.
3. Run `npm install` to download the dependencies.
4. For development run `npm run dev`, which uses **concurrently** and **cross-env** to launch `vite` and `electron .` with `NODE_ENV=development` and automatic reload.

## 📦 Builds and Distribution

1. Generate optimized renderer files with `npm run build`.
2. Run `npm run dist` to create installers using **electron-builder**:
   - Windows: `.exe`
   - macOS: `.dmg`
   - Linux: `.AppImage`

## 🧪 Tests

Before running the test suite you **must** install all dependencies:

1. Run `npm install` to download all project requirements. On CI environments prefer `npm ci` to ensure exact versions.
2. Then run `npm test` to start the test suite.

> **Important**: `npm test` will fail if the `node_modules/` directory does not exist.  
> Make sure to run `npm install` at least once before executing tests.

## 🐍 Python Requirements

To run the `metrics.py` script you need **Python 3** installed. Next, install the metrics dependencies with:

```bash
pip install -r requirements.txt
```

The `pynvml` package is optional and enables GPU metrics collection if an NVIDIA card is present.

These scripts are called by Electron through the `run-script` IPC channel.
Both `cpu-amd.ps1` and `cpu-intel.ps1` accept a `-Restore` flag to revert their registry and power plan tweaks.



## Scripts

The `scripts/` folder contains several automation files. They must be run with **Administrator** privileges and can be triggered from the UI:

- **cpu-amd.ps1** — optimizes AMD processors (via *Optimize AMD CPU* in the **CPU** tab).
- **cpu-intel.ps1** — optimizes Intel processors (via *Optimize Intel CPU* in the **CPU** tab).
- **gpu-nvidia.ps1** — tweaks for NVIDIA cards (via *Optimize Nvidia GPU* in the **GPU** tab).
- **gpu-amd.ps1** — tweaks for AMD GPUs (via *Optimize AMD GPU* in the **GPU** tab).
- **energy-plan.ps1** — applies the custom power plan (via *Apply Energy Plan* in **Energy**).
- **peripheral-energy.ps1** — disables USB selective suspend (via *Peripheral Power Tweak* in **Energy**).
- **gamebooster.ps1** — temporary tweaks for gaming sessions (via *Start Game Booster*).
- **gamebooster-restore.ps1** — restores services and Game Bar settings after using Game Booster.
- **restore-point.ps1** — creates a system restore point (via *Create Restore Point* on the dashboard).
- Game scripts avoid duplicate entries by checking configuration files before writing.

