import React from 'react';

interface BrowserMockupProps {
  url?: string;
  badgeText?: string;
  children: React.ReactNode;
  className?: string;
}

export default function BrowserMockup({
  url = 'skillbridge.internal/cockpit/session-active',
  badgeText,
  children,
  className = '',
}: BrowserMockupProps) {
  return (
    <div
      className={`rounded-[12px] border border-[#E5E8EE] bg-white soft-shadow overflow-hidden flex flex-col ${className}`}
    >
      {/* Top Browser Bar */}
      <div className="h-10 px-4 bg-[#F7F8FA] border-b border-[#E5E8EE] flex items-center justify-between select-none">
        {/* Window Controls */}
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E5E8EE]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#E5E8EE]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#E5E8EE]" />
        </div>

        {/* Address Bar */}
        <div className="max-w-[320px] w-full mx-2 h-6 px-3 rounded-[6px] bg-white border border-[#E5E8EE] text-[11px] font-mono text-[#5B6475] flex items-center justify-center truncate">
          <span className="text-[#5B6475]/60 mr-1">https://</span>
          <span className="truncate">{url}</span>
        </div>

        {/* Optional Status Badge */}
        <div>
          {badgeText ? (
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-[4px] bg-white border border-[#E5E8EE] text-[#1F4FD8]">
              {badgeText}
            </span>
          ) : (
            <div className="w-10" />
          )}
        </div>
      </div>

      {/* Content Canvas */}
      <div className="p-4 sm:p-6 bg-white overflow-x-auto">{children}</div>
    </div>
  );
}
