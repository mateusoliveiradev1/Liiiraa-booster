import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'scripts'))
import metrics
import logging


def test_collect_contains_basic_keys():
    data = metrics._collect('/')
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
    assert not any(isinstance(h, logging.FileHandler) for h in logger.handlers)