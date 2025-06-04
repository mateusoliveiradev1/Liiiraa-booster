import React from 'react';

export default function Sidebar({ activeSection, onSelect }) {
  const sections = [
    { label: 'Dashboard', icon: '📊' },
    { label: 'Optimize', icon: '⚡' },
    { label: 'Clean', icon: '🧹' },
    { label: 'Debloat', icon: '🚮' },
    { label: 'Game Booster', icon: '🎮' },
    { label: 'Advanced Tweaks', icon: '⚙️' },
    { label: 'History', icon: '📜' },
    { label: 'Settings', icon: '🔧' }
  ];

  return (
    <div className="w-48 border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-2">
      {sections.map(({ label, icon }) => (
        <button
          key={label}
          onClick={() => onSelect(label)}
          className={`block w-full text-left px-3 py-2 rounded ${activeSection === label ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
          <span className="mr-2">{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
}
