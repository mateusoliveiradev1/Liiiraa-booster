"""Collect basic system metrics.

This script is executed via ``window.api.runScript('metrics')`` from the
renderer process. It prints a JSON string with CPU and memory usage that can be
consumed by the UI.
"""
import json
import os
import sys
import psutil


def is_admin():
    if os.name == 'nt':
        try:
            import ctypes
            return ctypes.windll.shell32.IsUserAnAdmin()
        except Exception:
            return False
    else:
        return os.geteuid() == 0


if os.name == 'nt' and not is_admin():
    sys.exit("This script must be run as Administrator.")

def main():
    metrics = {
        "cpu_percent": psutil.cpu_percent(interval=1),
        "memory_used": psutil.virtual_memory().used,
    }
    print(json.dumps(metrics))

if __name__ == "__main__":
    main()
