import React from 'react';

function MetricsCard({ label, value, icon, percentage }) {
  return (
    <div className="card transform hover:scale-105">
      <h2 className="text-lg font-semibold mb-2 flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </h2>
      <p className="text-xl">{value}</p>
      {percentage !== undefined && percentage !== null && (
        <div className="mt-2 h-2 bg-gray-200 dark:bg-white/20 rounded overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary via-accent to-secondary dark:from-primary-dark dark:via-accent-dark dark:to-secondary-dark h-full rounded transition-all duration-500"
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

export default React.memo(MetricsCard);
