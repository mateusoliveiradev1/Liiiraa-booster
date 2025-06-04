import React from 'react';

export default function MetricsCard({ label, value }) {
  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded p-4 bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-2">{label}</h2>
      <p className="text-xl">{value}</p>
    </div>
  );
}
