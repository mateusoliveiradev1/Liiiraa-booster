"""Collect basic system metrics.

This script is executed via ``window.api.runScript('metrics')`` from the
renderer process. It prints a JSON string with CPU, memory, disk and network
usage that can be consumed by the UI.
"""
import json
import psutil
import time

def main():
    cpu = psutil.cpu_percent(interval=1)
    mem = psutil.virtual_memory()
    disk = psutil.disk_usage("/")
    net1 = psutil.net_io_counters()
    time.sleep(1)
    net2 = psutil.net_io_counters()

    metrics = {
        "cpu_percent": cpu,
        "memory_used": mem.used,
        "memory_total": mem.total,
        "disk_used": disk.used,
        "disk_total": disk.total,
        "net_up": net2.bytes_sent - net1.bytes_sent,
        "net_down": net2.bytes_recv - net1.bytes_recv,
    }

    print(json.dumps(metrics))

if __name__ == "__main__":
    main()
