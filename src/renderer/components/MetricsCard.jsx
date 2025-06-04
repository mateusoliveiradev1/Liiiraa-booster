import React from 'react';

export default function MetricsCard({ label, value, icon, percentage }) {
  return (
    <div className="card transform hover:scale-105">
      <h2 className="text-lg font-semibold mb-2 flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </h2>
      <p className="text-xl">{value}</p>
      {percentage !== undefined && percentage !== null && (
        <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded">
          <div
            className="bg-gradient-to-r from-primary to-secondary h-full rounded"
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
      )}
    </div>
  );
}
