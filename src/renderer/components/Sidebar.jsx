import React from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function Sidebar({ activeSection, onSelect }) {
  const { t } = useTranslation();
  const sections = [
    { key: 'Dashboard', icon: '📊', tKey: 'sidebar.dashboard' },
    { key: 'Optimize', icon: '⚡', tKey: 'sidebar.optimize' },
    { key: 'Clean', icon: '🧹', tKey: 'sidebar.clean' },
    { key: 'Debloat', icon: '🚮', tKey: 'sidebar.debloat' },
    { key: 'Game Booster', icon: '🎮', tKey: 'sidebar.game_booster' },
    { key: 'CPU AMD', icon: '🖥️', tKey: 'sidebar.cpu_amd' },
    { key: 'CPU Intel', icon: '🖥️', tKey: 'sidebar.cpu_intel' },
    { key: 'GPU Nvidia', icon: '🎮', tKey: 'sidebar.gpu_nvidia' },
    { key: 'GPU AMD', icon: '🎮', tKey: 'sidebar.gpu_amd' },
    { key: 'PUBG', icon: '🎯', tKey: 'sidebar.pubg' },
    { key: 'CS2', icon: '🔫', tKey: 'sidebar.cs2' },
    { key: 'Fortnite', icon: '🛡️', tKey: 'sidebar.fortnite' },
    { key: 'Warzone', icon: '💣', tKey: 'sidebar.warzone' },
    { key: 'Valorant', icon: '🎯', tKey: 'sidebar.valorant' },
    { key: 'Energy', icon: '🔌', tKey: 'sidebar.energy' },
    { key: 'Advanced Tweaks', icon: '⚙️', tKey: 'sidebar.advanced' },
    { key: 'Logs', icon: '📜', tKey: 'sidebar.logs' },
    { key: 'Settings', icon: '🔧', tKey: 'sidebar.settings' }
  ];

  return (
    <div className="w-48 border-r border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-4 space-y-2">
      {sections.map(({ key, icon, tKey }) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={`block w-full text-left px-3 py-2 rounded ${
            activeSection === key ? 'bg-primary text-white' : 'hover:bg-muted dark:hover:bg-muted-dark'
          }`}
        >
          <span className="mr-2">{icon}</span>
          {t(tKey)}
        </button>
      ))}
    </div>
  );
}
