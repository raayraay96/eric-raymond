import React from 'react';

interface PowerBarProps {
  label: string;
  level: number; // 0 to 10
}

const PowerBar: React.FC<PowerBarProps> = ({ label, level }) => {
  return (
    <div className="mb-2 flex items-center gap-4">
      <span className="min-w-[120px] font-medium">{label}</span>

      {/* This wrapper must be relative for absolute children to work */}
      <div className="relative w-fit">
        {/* Grey background boxes (base layer) */}
        <div className="flex gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`bg-${i}`} className="h-3 w-3 rounded-sm bg-gray-400" />
          ))}
        </div>

        {/* Red overlay boxes (top layer) */}
        <div className="absolute left-0 top-0 flex gap-1">
          {Array.from({ length: level }).map((_, i) => (
            <div key={`fg-${i}`} className="h-3 w-3 rounded-sm bg-red-500" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PowerBar;
