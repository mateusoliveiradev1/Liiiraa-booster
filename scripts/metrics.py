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
    """Configure a logger. Set ``METRICS_LOG=1`` to write ``logs/metrics.log``."""
    logger = logging.getLogger(__name__)

    if os.environ.get("METRICS_LOG") == "1":
        log_dir = os.path.join(os.path.dirname(__file__), "..", "logs")
        os.makedirs(log_dir, exist_ok=True)
        log_file = os.path.join(log_dir, "metrics.log")
        handler: logging.Handler = logging.FileHandler(log_file)
    else:
        handler = logging.NullHandler()

    handler.setLevel(logging.INFO)
    handler.setFormatter(
        logging.Formatter("%(asctime)s %(levelname)s %(message)s")
    )

    # Avoid adding multiple handlers if called more than once
    if not logger.handlers:
        logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    return logger


def _gpu_metrics() -> dict:
    """Return GPU metrics using ``pynvml`` or ``GPUtil`` if available."""
    try:  # First try Nvidia NVML
        import pynvml  # type: ignore

        pynvml.nvmlInit()
        handle = pynvml.nvmlDeviceGetHandleByIndex(0)
        mem = pynvml.nvmlDeviceGetMemoryInfo(handle)
        util = pynvml.nvmlDeviceGetUtilizationRates(handle)
        try:
            temp = pynvml.nvmlDeviceGetTemperature(
                handle, pynvml.NVML_TEMPERATURE_GPU
            )
        except Exception:
            temp = None
        pynvml.nvmlShutdown()
        metrics = {
            "gpu_util": util.gpu,
            "gpu_mem_used": mem.used,
            "gpu_mem_total": mem.total,
        }
        if temp is not None:
            metrics["gpu_temp"] = temp
        return metrics
    except Exception:
        # Fallback to GPUtil which supports multiple vendors
        try:
            import GPUtil  # type: ignore

            gpus = GPUtil.getGPUs()
            if not gpus:
                return {}
            gpu = gpus[0]
            metrics = {
                "gpu_util": round(gpu.load * 100),
                "gpu_mem_used": int(gpu.memoryUsed * 1024**2),
                "gpu_mem_total": int(gpu.memoryTotal * 1024**2),
            }
            if gpu.temperature is not None:
                metrics["gpu_temp"] = gpu.temperature
            return metrics
        except Exception as exc:  # pragma: no cover - optional dependency
            logging.getLogger(__name__).warning(
                "GPU metrics unavailable: %s", exc
            )
            return {}


def main() -> None:
    """Collect metrics and print them as JSON."""
    if os.name == "nt" and not is_admin():
        sys.exit("This script must be run as Administrator.")

    logger = _setup_logger()
    logger.info("Collecting system metrics")

    net1 = psutil.net_io_counters()
    # Shorter sampling interval avoids blocking the UI for a full second
    cpu_percent = psutil.cpu_percent(interval=0.1)
    net2 = psutil.net_io_counters()
    net_up = net2.bytes_sent - net1.bytes_sent
    net_down = net2.bytes_recv - net1.bytes_recv
    net_bytes = net_up + net_down

    drive_arg = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("METRICS_DRIVE")
    if drive_arg:
        drive = drive_arg
    else:
        drive = os.environ.get('SYSTEMDRIVE', 'C:') + '\\' if os.name == 'nt' else '/'
    logger.info("Using drive: %s", drive)
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
