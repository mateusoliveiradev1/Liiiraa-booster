import React from 'react';

export default function Spinner() {
  return (
    <div data-testid="spinner" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25">
      <div className="h-12 w-12 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
