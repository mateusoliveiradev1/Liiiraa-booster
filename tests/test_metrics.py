import os
import sys
import logging

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'scripts'))
import metrics


def test_collect_contains_basic_keys(tmp_path):
    data = metrics._collect(str(tmp_path))
    required = {
        'cpu_percent',
        'memory_used', 'memory_total',
        'disk_used', 'disk_total',
        'network_bytes_per_sec', 'net_up', 'net_down'
    }
    assert required.issubset(data.keys())


def test_setup_logger_default_no_file(monkeypatch):
    monkeypatch.delenv('METRICS_LOG', raising=False)
    logger = metrics._setup_logger()
    try:
        assert not any(isinstance(h, logging.FileHandler) for h in logger.handlers)
        assert any(isinstance(h, logging.NullHandler) for h in logger.handlers)
    finally:
        for handler in list(logger.handlers):
            handler.close()
            logger.removeHandler(handler)


def test_setup_logger_env_creates_file(monkeypatch):
    monkeypatch.setenv('METRICS_LOG', '1')
    log_file = os.path.join(os.path.dirname(metrics.__file__), '..', 'logs', 'metrics.log')
    if os.path.exists(log_file):
        os.remove(log_file)

    logger = metrics._setup_logger()
    try:
        assert any(isinstance(h, logging.FileHandler) for h in logger.handlers)
        assert os.path.exists(log_file)
    finally:
        for handler in list(logger.handlers):
            handler.close()
            logger.removeHandler(handler)
        if os.path.exists(log_file):
            os.remove(log_file)
