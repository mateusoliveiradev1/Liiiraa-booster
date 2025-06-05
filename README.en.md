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

> During installation, NSIS displays the license terms from `installer-license.txt`.

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
`cpu-amd.ps1`, `cpu-intel.ps1` and the GPU scripts all accept a `-Restore` flag to revert the registry or driver tweaks applied during optimization.



## Scripts

The `scripts/` folder contains several automation files. They must be run with **Administrator** privileges and can be triggered from the UI:

 - **cpu-amd.ps1** — optimizes AMD processors and disables Windows Power Throttling (via *Optimize AMD CPU* in the **CPU** tab).
 - **cpu-intel.ps1** — optimizes Intel processors and disables Windows Power Throttling (via *Optimize Intel CPU* in the **CPU** tab).

 - **gpu-nvidia.ps1** — tweaks for NVIDIA cards (via *Optimize Nvidia GPU* in the **GPU** tab). Use `-MaxPower` to apply the maximum power limit and `-LockMaxClock` to hold peak clocks for higher performance; `-Restore` reverts.
 - **gpu-amd.ps1** — tweaks for AMD GPUs (via *Optimize AMD GPU* in the **GPU** tab, use `-Restore` to revert).
 - **gpu-intel.ps1** — tweaks for Intel GPUs (via *Optimize Intel GPU* in the **GPU** tab).

- **energy-plan.ps1** — applies the custom power plan (via *Apply Energy Plan* in **Energy**).
- **peripheral-energy.ps1** — disables USB selective suspend (via *Peripheral Power Tweak* in **Energy** or **System**).
- **gamebooster.ps1** — temporary tweaks for gaming sessions (via *Start Game Booster*).
- **gamebooster-restore.ps1** — restores services and Game Bar settings after using Game Booster.
- **restore-point.ps1** — creates a system restore point (via *Create Restore Point* on the dashboard).
- **clean.bat** — quick cleanup of temporary files and caches with freed space feedback. Calculation now relies on PowerShell so it works on any Windows locale.
- **metrics.py** — gathers basic system metrics using Python and psutil.
- Game scripts avoid duplicate entries by checking configuration files before writing.
- The log viewer shows only the last 500 lines of each file.

## Debloat Modes

The `debloat.ps1` script now supports **Full** and **Lite** modes with an
expanded list of removable apps (Zune, News, Solitaire, YourPhone, GetHelp and
additional Xbox, People and Skype packages). It also disables the optional
**XPS Viewer** feature by default. Removing built-in apps can break some Windows
features. Run with `-Restore` to reinstall any removed packages if you encounter
issues.

## New Optimization Tweaks

`optimize.ps1` includes TCP latency tweaks (`TCPAckFrequency` and
`TcpDelAckTicks`) and both CPU scripts turn off Windows Power Throttling for
better boost behavior.

