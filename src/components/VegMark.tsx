import React from 'react';

/**
 * Standard FSSAI Indian Veg / Non-Veg mark.
 * Green square with filled circle for Vegetarian.
 * Red square with filled circle/triangle for Non-Vegetarian.
 * (Allowed palette exception per prompt).
 */
export const VegMark: React.FC<{ veg?: boolean; className?: string }> = ({
  veg,
  className = 'w-4 h-4',
}) => {
  if (veg === undefined) {
    return null;
  }

  if (veg) {
    return (
      <span
        className={`inline-flex items-center justify-center p-0.5 border border-emerald-700 rounded-sm bg-white shrink-0 ${className}`}
        title="100% Vegetarian"
        aria-label="Vegetarian"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-700" />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center p-0.5 border border-red-700 rounded-sm bg-white shrink-0 ${className}`}
      title="Non-Vegetarian"
      aria-label="Non-Vegetarian"
    >
      <span className="w-2 h-2 rounded-full bg-red-700" />
    </span>
  );
};
