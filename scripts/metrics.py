"""Collect basic system metrics.

This script is executed via ``window.api.runScript('metrics')`` from the
renderer process. It prints a JSON string with CPU and memory usage that can be
consumed by the UI.
"""
import json
import psutil

def main():
    metrics = {
        "cpu_percent": psutil.cpu_percent(interval=1),
        "memory_used": psutil.virtual_memory().used,
    }
    print(json.dumps(metrics))

if __name__ == "__main__":
    main()
