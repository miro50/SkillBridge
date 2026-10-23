'use client';

import React, { useRef, useEffect } from 'react';
import { FileCode2, Lock, Sparkles, Check, Copy } from 'lucide-react';
import { FileItem } from '@/types/runner';

interface EditorPanelProps {
  files: FileItem[];
  activeFileId: string;
  onSelectFile: (id: string) => void;
  onCodeChange: (fileId: string, newContent: string) => void;
  onRunTests: () => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  files,
  activeFileId,
  onSelectFile,
  onCodeChange,
  onRunTests
}) => {
  const activeFile = files.find(f => f.id === activeFileId) || files[0];
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = React.useState(false);

  // Line numbers calculation
  const linesCount = (activeFile?.content || '').split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(linesCount, 25) }, (_, i) => i + 1);

  // Handle Tab key inside textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter to trigger test execution
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRunTests();
      return;
    }

    if (e.key === 'Tab' && !activeFile.readOnly) {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;

      const updated = val.substring(0, start) + '  ' + val.substring(end);
      onCodeChange(activeFile.id, updated);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const copyCode = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 overflow-hidden font-mono text-xs">
      {/* File Tabs Strip */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-2">
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
          {files.map(file => {
            const isActive = file.id === activeFileId;
            return (
              <button
                key={file.id}
                onClick={() => onSelectFile(file.id)}
                className={`flex items-center space-x-2 px-3 py-2 border-b-2 text-xs transition-colors select-none ${
                  isActive
                    ? 'border-indigo-500 bg-zinc-950 text-zinc-100 font-semibold'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                <FileCode2
                  className={`h-3.5 w-3.5 ${
                    file.name.endsWith('.ts') ? 'text-sky-400' : 'text-amber-400'
                  }`}
                />
                <span>{file.name}</span>
                {file.readOnly && (
                  <span title="Sola lettura">
                    <Lock className="h-3 w-3 text-zinc-500 ml-1" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Toolbar actions */}
        <div className="flex items-center space-x-1 pr-2">
          {activeFile.readOnly && (
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
              Read-Only
            </span>
          )}
          <button
            onClick={copyCode}
            title="Copia codice"
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="flex-1 flex overflow-hidden relative bg-[#090d16]">
        {/* Line Numbers Column */}
        <div className="w-12 py-3 bg-[#070a10] border-r border-zinc-800/60 select-none text-right pr-3 font-mono text-zinc-600 text-[11px] leading-[22px] overflow-hidden">
          {lineNumbers.map(n => (
            <div key={n}>{n}</div>
          ))}
        </div>

        {/* Code Content Area */}
        <div className="flex-1 relative overflow-auto">
          <textarea
            ref={textareaRef}
            value={activeFile?.content || ''}
            readOnly={activeFile?.readOnly}
            onChange={e => onCodeChange(activeFile.id, e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className={`w-full h-full p-3 font-mono text-[12px] leading-[22px] bg-transparent text-zinc-100 resize-none outline-none selection:bg-indigo-600/30 whitespace-pre ${
              activeFile?.readOnly ? 'cursor-default text-zinc-300' : ''
            }`}
            placeholder="Scrivi qui la tua implementazione..."
          />
        </div>
      </div>
    </div>
  );
};
