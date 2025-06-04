import React, { useState } from 'react';
import MetricsCard from './components/MetricsCard.jsx';

const mockMetrics = {
  cpu: '35%',
  gpu: '45%',
  ram: '8 GB / 16 GB',
  disk: '120 GB / 512 GB',
  network: '200 Mbps'
};

export default function App() {
  const [dark, setDark] = useState(false);

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark', !dark);
    setDark(!dark);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Liiiraa Booster</h1>
        <button
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
          onClick={toggleDark}
        >
          {dark ? 'Light' : 'Dark'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricsCard label="CPU" value={mockMetrics.cpu} />
        <MetricsCard label="GPU" value={mockMetrics.gpu} />
        <MetricsCard label="RAM" value={mockMetrics.ram} />
        <MetricsCard label="Disk" value={mockMetrics.disk} />
        <MetricsCard label="Network" value={mockMetrics.network} />
      </div>
    </div>
  );
}
