import React from 'react';

export default function Sidebar({ activeSection, onSelect }) {
  const sections = ['Dashboard', 'Optimize', 'Clean', 'Advanced Tweaks', 'Settings'];

  return (
    <div className="w-48 border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-2">
      {sections.map((section) => (
        <button
          key={section}
          onClick={() => onSelect(section)}
          className={`block w-full text-left px-3 py-2 rounded ${activeSection === section ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
          {section}
        </button>
      ))}
    </div>
  );
}
