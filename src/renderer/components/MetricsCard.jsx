import React from 'react';

export default function MetricsCard({ label, value }) {
  return (
    <div className="border border-border dark:border-border-dark rounded p-4 bg-surface dark:bg-surface-dark">
      <h2 className="text-lg font-semibold mb-2">{label}</h2>
      <p className="text-xl">{value}</p>
    </div>
  );
}
