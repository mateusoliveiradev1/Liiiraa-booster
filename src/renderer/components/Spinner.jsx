import React from 'react';

export default function Spinner() {
  return (
    <div data-testid="spinner" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25">
      <div className="h-12 w-12 border-4 border-primary border-solid border-t-transparent border-r-transparent rounded-full animate-spin" />
    </div>
  );
}
