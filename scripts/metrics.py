"""Collect system metrics.

This script is executed via ``window.api.runScript('metrics')`` from the
renderer process. It prints a JSON string with CPU, memory and other usage
information that can be consumed by the UI.
"""

from __future__ import annotations

import json
import logging
import os
import time

import psutil


def _setup_logger() -> logging.Logger:
    """Configure a logger writing to ``logs/metrics.log``."""
    log_dir = os.path.join(os.path.dirname(__file__), "..", "logs")
    os.makedirs(log_dir, exist_ok=True)
    log_file = os.path.join(log_dir, "metrics.log")
    logging.basicConfig(
        filename=log_file,
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
    )
    return logging.getLogger(__name__)


def _gpu_metrics() -> dict:
    """Return GPU metrics if ``pynvml`` is available."""
    try:
        import pynvml

        pynvml.nvmlInit()
        handle = pynvml.nvmlDeviceGetHandleByIndex(0)
        mem = pynvml.nvmlDeviceGetMemoryInfo(handle)
        util = pynvml.nvmlDeviceGetUtilizationRates(handle)
        pynvml.nvmlShutdown()
        return {
            "gpu_util": util.gpu,
            "gpu_mem_used": mem.used,
            "gpu_mem_total": mem.total,
        }
    except Exception as exc:  # pragma: no cover - optional dependency
        logger = logging.getLogger(__name__)
        logger.warning("GPU metrics unavailable: %s", exc)
        return {}


def main() -> None:
    """Collect metrics and print them as JSON."""

    logger = _setup_logger()
    logger.info("Collecting system metrics")

    net1 = psutil.net_io_counters()
    cpu_percent = psutil.cpu_percent(interval=1)
    net2 = psutil.net_io_counters()

    net_bytes = (net2.bytes_sent + net2.bytes_recv) - (
        net1.bytes_sent + net1.bytes_recv
    )

    disk = psutil.disk_usage("/")

    metrics = {
        "cpu_percent": cpu_percent,
        "memory_used": psutil.virtual_memory().used,
        "disk_used": disk.used,
        "disk_total": disk.total,
        "network_bytes_per_sec": net_bytes,
    }

    metrics.update(_gpu_metrics())

    logger.info("Metrics collected: %s", metrics)
    print(json.dumps(metrics))


if __name__ == "__main__":
    main()
