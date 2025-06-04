import React, { useState, useEffect } from 'react';
import MetricsCard from './components/MetricsCard.jsx';
import Sidebar from './components/Sidebar.jsx';
import History from './components/History.jsx';

const mockMetrics = {
  cpu: '35%',
  gpu: '45%',
  ram: '8 GB / 16 GB',
  disk: '120 GB / 512 GB',
  network: '200 Mbps'
};

export default function App() {
  const [dark, setDark] = useState(false);
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [metrics, setMetrics] = useState({
    cpu: mockMetrics.cpu,
    gpu: 'N/A',
    ram: mockMetrics.ram,
    disk: mockMetrics.disk,
    network: mockMetrics.network
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const output = await window.api.runScript('metrics');
        const data = JSON.parse(output);

        const cpu = `${data.cpu_percent}%`;
        const ram = `${(data.memory_used / (1024 ** 3)).toFixed(1)} GB / ${(data.memory_total / (1024 ** 3)).toFixed(1)} GB`;
        const disk = `${(data.disk_used / (1024 ** 3)).toFixed(1)} GB / ${(data.disk_total / (1024 ** 3)).toFixed(1)} GB`;
        const bytesPerSec =
          data.network_bytes_per_sec !== undefined
            ? data.network_bytes_per_sec
            : (data.net_up + data.net_down);
        const network = `${((bytesPerSec * 8) / 1_000_000).toFixed(1)} Mbps`;

        let gpu = 'N/A';
        if (
          data.gpu_util !== undefined &&
          data.gpu_mem_used !== undefined &&
          data.gpu_mem_total !== undefined
        ) {
          const util = `${data.gpu_util}%`;
          const mem = `${(data.gpu_mem_used / (1024 ** 3)).toFixed(1)} GB / ${(data.gpu_mem_total / (1024 ** 3)).toFixed(1)} GB`;
          gpu = `${util} - ${mem}`;
        }

        setMetrics({ cpu, gpu, ram, disk, network });
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch metrics');
      }
    };

    fetchMetrics();
    const id = setInterval(fetchMetrics, 5000);
    return () => clearInterval(id);
  }, []);

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark', !dark);
    setDark(!dark);
  };

  const runCommand = async (cmd) => {
    try {
      await window.api.runScript(cmd);
      setMessage(`${cmd.charAt(0).toUpperCase() + cmd.slice(1)} completed successfully`);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(`${cmd.charAt(0).toUpperCase() + cmd.slice(1)} failed`);
      setMessage(null);
    }
  };

  const handleOptimize = () => runCommand('optimize');
  const handleClean = () => runCommand('clean');

const handleDebloat = () => runCommand('debloat');
const handleGameBoost = () => runCommand('gamebooster');
const handleRestore = () => runCommand('restore');
const handleAdvanced = () => runCommand('advanced');

  const handleDebloat = () => runCommand('debloat');
  const handleGameBoost = () => runCommand('gamebooster');
  const handleRestore = () => runCommand('restore');
  const handleCpuAmd = () => runCommand('cpu-amd');
  const handleCpuIntel = () => runCommand('cpu-intel');
  const handleGpuNvidia = () => runCommand('gpu-nvidia');
  const handleGpuAmd = () => runCommand('gpu-amd');
  const handlePubg = () => runCommand('pubg');
  const handleCs2 = () => runCommand('cs2');
  const handleFortnite = () => runCommand('fortnite');
  const handleWarzone = () => runCommand('warzone');
  const handleValorant = () => runCommand('valorant');


  const renderPlaceholder = (text) => (
    <div>
      <p className="mb-2">{text}</p>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'Dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricsCard label="CPU" value={metrics.cpu} />
            <MetricsCard label="GPU" value={metrics.gpu} />
            <MetricsCard label="RAM" value={metrics.ram} />
            <MetricsCard label="Disk" value={metrics.disk} />
            <MetricsCard label="Network" value={metrics.network} />
          </div>
        );
      case 'Optimize':
        return (
          <div>
            <p className="mb-2">Apply recommended optimization tweaks.</p>
            <button
              className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark"
              onClick={handleOptimize}
            >
              Run Optimize
            </button>
          </div>
        );
      case 'Clean':
        return (
          <div>
            <p className="mb-2">Remove temporary files and free disk space.</p>
            <button
              className="px-4 py-2 rounded bg-success text-white hover:bg-success-dark"
              onClick={handleClean}
            >
              Run Clean
            </button>
          </div>
        );
      case 'Debloat':
        return (
          <div>
            <p className="mb-2">Remove pre-installed Windows apps.</p>
            <button
              className="px-4 py-2 rounded bg-warning text-white hover:bg-warning-dark"
              onClick={handleDebloat}
            >
              Run Debloat
            </button>
          </div>
        );
      case 'Game Booster':
        return (
          <div>
            <p className="mb-2">Temporarily disable services and free memory for gaming.</p>
            <button
              className="px-4 py-2 rounded bg-accent text-white hover:bg-accent-dark"
              onClick={handleGameBoost}
            >
              Start Game Booster
            </button>
          </div>
        );
      case 'CPU AMD':
        return (
          <div>
            <p className="mb-2">Apply AMD CPU specific optimizations.</p>
            <button
              className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark"
              onClick={handleCpuAmd}
            >
              Optimize AMD CPU
            </button>
          </div>
        );
      case 'CPU Intel':
        return (
          <div>
            <p className="mb-2">Apply Intel CPU specific optimizations.</p>
            <button
              className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark"
              onClick={handleCpuIntel}
            >
              Optimize Intel CPU
            </button>
          </div>
        );
      case 'GPU Nvidia':
        return (
          <div>
            <p className="mb-2">Apply Nvidia GPU specific optimizations.</p>
            <button
              className="px-4 py-2 rounded bg-success text-white hover:bg-success-dark"
              onClick={handleGpuNvidia}
            >
              Optimize Nvidia GPU
            </button>
          </div>
        );
      case 'GPU AMD':
        return (
          <div>
            <p className="mb-2">Apply AMD GPU specific optimizations.</p>
            <button
              className="px-4 py-2 rounded bg-success text-white hover:bg-success-dark"
              onClick={handleGpuAmd}
            >
              Optimize AMD GPU
            </button>
          </div>
        );
      case 'PUBG':
        return (
          <div>
            <p className="mb-2">Optimize system for PUBG.</p>
            <button
              className="px-4 py-2 rounded bg-accent text-white hover:bg-accent-dark"
              onClick={handlePubg}
            >
              Optimize PUBG
            </button>
          </div>
        );
      case 'CS2':
        return (
          <div>
            <p className="mb-2">Optimize system for CS2.</p>
            <button
              className="px-4 py-2 rounded bg-accent text-white hover:bg-accent-dark"
              onClick={handleCs2}
            >
              Optimize CS2
            </button>
          </div>
        );
      case 'Fortnite':
        return (
          <div>
            <p className="mb-2">Optimize system for Fortnite.</p>
            <button
              className="px-4 py-2 rounded bg-accent text-white hover:bg-accent-dark"
              onClick={handleFortnite}
            >
              Optimize Fortnite
            </button>
          </div>
        );
      case 'Warzone':
        return (
          <div>
            <p className="mb-2">Optimize system for Warzone.</p>
            <button
              className="px-4 py-2 rounded bg-accent text-white hover:bg-accent-dark"
              onClick={handleWarzone}
            >
              Optimize Warzone
            </button>
          </div>
        );
      case 'Valorant':
        return (
          <div>
            <p className="mb-2">Optimize system for Valorant.</p>
            <button
              className="px-4 py-2 rounded bg-accent text-white hover:bg-accent-dark"
              onClick={handleValorant}
            >
              Optimize Valorant
            </button>
          </div>
        );
      case 'Advanced Tweaks':
        return (
          <div>
            <p className="mb-2">Apply risky tweaks like disabling UAC, Defender and Windows Update.</p>
            <div className="space-x-2">
              <button
                className="px-4 py-2 rounded bg-danger text-white hover:bg-danger-dark"
                onClick={handleAdvanced}
              >
                Run Advanced Tweaks
              </button>
              <button
                className="px-4 py-2 rounded bg-border text-white hover:bg-border-dark"
                onClick={handleRestore}
              >
                Restore Tweaks
              </button>
            </div>
          </div>
        );
      case 'History':
        return <History />;
      case 'Settings':
        return (
          <div>
            <p className="mb-2">Toggle application appearance.</p>
            <button
              className="px-3 py-1 rounded bg-muted dark:bg-muted-dark"
              onClick={toggleDark}
            >
              {dark ? 'Light' : 'Dark'} Mode
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (

    <div className="flex h-screen">
      <Sidebar activeSection={activeSection} onSelect={setActiveSection} />
      <div className="flex-1 p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Liiiraa Booster</h1>
        </div>
        {renderSection()}
        {message && <p className="text-green-600 mt-2">{message}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
