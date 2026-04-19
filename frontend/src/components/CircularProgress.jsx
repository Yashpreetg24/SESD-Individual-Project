import React from 'react';

const CircularProgress = ({ value, max, label, color = "#4ade80" }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90">
          {/* Background Circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-800"
          />
          {/* Progress Circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex-center flex-col">
          <span className="text-lg font-bold leading-none">{Math.round(value)}</span>
          <span className="text-[10px] text-text-muted mt-1 uppercase">/ {Math.round(max)}</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-text-muted uppercase tracking-wider">{label}</span>
    </div>
  );
};

export default CircularProgress;
