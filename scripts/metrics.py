from __future__ import annotations

import json
import logging
import os
import sys

try:
    import psutil
except ImportError:
    sys.exit(
        "Missing required dependency 'psutil'. Install it with 'pip install psutil'"
    )


def is_admin() -> bool:
    """Return ``True`` if the script is running with administrative privileges."""
    if os.name == "nt":
        try:
            import ctypes  # type: ignore

            return bool(ctypes.windll.shell32.IsUserAnAdmin())
        except Exception:
            return False
    return os.geteuid() == 0


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
        import pynvml  # type: ignore
    except ImportError:  # pragma: no cover - optional dependency
        logging.getLogger(__name__).warning(
            "pynvml not installed; GPU metrics will be skipped"
        )
        return {}
    try:
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
        logging.getLogger(__name__).warning("GPU metrics unavailable: %s", exc)
        return {}


def main() -> None:
    """Collect metrics and print them as JSON."""
    if os.name == "nt" and not is_admin():
        sys.exit("This script must be run as Administrator.")

    logger = _setup_logger()
    logger.info("Collecting system metrics")

    net1 = psutil.net_io_counters()
    cpu_percent = psutil.cpu_percent(interval=1)
    net2 = psutil.net_io_counters()
    net_up = net2.bytes_sent - net1.bytes_sent
    net_down = net2.bytes_recv - net1.bytes_recv
    net_bytes = net_up + net_down

    drive = os.environ.get('SYSTEMDRIVE', 'C:') + '\\'
    disk = psutil.disk_usage(drive)
    mem = psutil.virtual_memory()
    temps = psutil.sensors_temperatures() if hasattr(psutil, 'sensors_temperatures') else {}
    cpu_temp = None
    if 'coretemp' in temps:
        readings = [t.current for t in temps['coretemp'] if t.current is not None]
        if readings:
            cpu_temp = sum(readings) / len(readings)

    metrics = {
        "cpu_percent": cpu_percent,
        "memory_used": mem.used,
        "memory_total": mem.total,
        "disk_used": disk.used,
        "disk_total": disk.total,
        "network_bytes_per_sec": net_bytes,
        "net_up": net_up,
        "net_down": net_down,
    }
    metrics.update(_gpu_metrics())
    if cpu_temp is not None:
        metrics["cpu_temp"] = cpu_temp

    logger.info("Metrics collected: %s", metrics)
    print(json.dumps(metrics))


if __name__ == "__main__":
    main()
