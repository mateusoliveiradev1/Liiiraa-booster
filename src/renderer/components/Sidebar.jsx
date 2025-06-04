import React from 'react';

export default function Sidebar({ activeSection, onSelect }) {
  const sections = [
    { label: 'Dashboard', icon: '📊' },
    { label: 'Optimize', icon: '⚡' },
    { label: 'Clean', icon: '🧹' },
    { label: 'Debloat', icon: '🚮' },
    { label: 'Game Booster', icon: '🎮' },
    { label: 'CPU AMD', icon: '🖥️' },
    { label: 'CPU Intel', icon: '🖥️' },
    { label: 'GPU Nvidia', icon: '🎮' },
    { label: 'GPU AMD', icon: '🎮' },
    { label: 'PUBG', icon: '🎯' },
    { label: 'CS2', icon: '🔫' },
    { label: 'Fortnite', icon: '🛡️' },
    { label: 'Warzone', icon: '💣' },
    { label: 'Valorant', icon: '🎯' },
    { label: 'Advanced Tweaks', icon: '⚙️' },
    { label: 'History', icon: '📜' },
    { label: 'Settings', icon: '🔧' }
  ];

  return (
    <div className="w-48 border-r border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-4 space-y-2">
      {sections.map(({ label, icon }) => (
        <button
          key={label}
          onClick={() => onSelect(label)}
          className={`block w-full text-left px-3 py-2 rounded ${activeSection === label ? 'bg-primary text-white' : 'hover:bg-muted dark:hover:bg-muted-dark'}`}
        >
          <span className="mr-2">{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
}
