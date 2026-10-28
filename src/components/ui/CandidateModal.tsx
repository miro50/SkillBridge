'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, KeyRound, ArrowRight, ShieldCheck, Video, AlertCircle } from 'lucide-react';

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CandidateModal({ isOpen, onClose }: CandidateModalProps) {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = token.trim();
    if (!cleanToken) {
      setError('Inserisci il token di invito ricevuto via email');
      return;
    }
    setError(null);
    onClose();
    router.push(`/assessment/${encodeURIComponent(cleanToken)}`);
  };

  const selectPreset = (presetToken: string) => {
    setToken(presetToken);
    setError(null);
    onClose();
    router.push(`/assessment/${encodeURIComponent(presetToken)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1220]/60 backdrop-blur-sm animate-fade-up">
      <div className="w-full max-w-lg bg-white rounded-[12px] border border-[#E5E8EE] p-6 sm:p-8 soft-shadow relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#5B6475] hover:text-[#0B1220] p-1.5 rounded-[8px] hover:bg-[#F7F8FA]"
          aria-label="Chiudi finestra"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-2.5 mb-2">
          <div className="w-8 h-8 rounded-[8px] bg-[#F7F8FA] border border-[#E5E8EE] flex items-center justify-center text-[#1F4FD8]">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#1F4FD8] font-semibold">
              Cockpit Candidato
            </span>
            <h3 className="text-lg font-semibold text-[#0B1220] leading-snug">
              Accesso Sessione di Valutazione
            </h3>
          </div>
        </div>

        <p className="text-xs text-[#5B6475] mb-6 leading-relaxed">
          Inserisci il token monouso fornito dall&apos;azienda o testa una simulazione dimostrativa da 25 minuti.
        </p>

        {/* Token Input Form */}
        <form onSubmit={handleLaunch} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#0B1220] mb-1.5">
              Codice Token Candidato
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Es. demo-candidate-1 oppure token a 32 caratteri"
              className="w-full h-11 px-3.5 rounded-[8px] border border-[#E5E8EE] text-sm text-[#0B1220] placeholder-[#5B6475]/60 focus:outline-none focus:ring-2 focus:ring-[#1F4FD8]/20 focus:border-[#1F4FD8] font-mono"
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-[8px] bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-11 rounded-[8px] bg-[#1F4FD8] hover:bg-[#1840B0] text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <span>Avvia Simulazione (25 Minuti)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Requirements info */}
        <div className="mt-6 pt-5 border-t border-[#E5E8EE] grid grid-cols-2 gap-3 text-[11px] text-[#5B6475]">
          <div className="flex items-center space-x-2">
            <Video className="w-3.5 h-3.5 text-[#1F4FD8]" />
            <span>Webcam richiesta</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#12805C]" />
            <span>Anti-cheat attivo</span>
          </div>
        </div>

        {/* Fast Presets */}
        <div className="mt-5 pt-4 border-t border-[#E5E8EE]/60">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#5B6475] mb-2 font-semibold">
            Oppure prova uno scenario dimostrativo:
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => selectPreset('demo-candidate-1')}
              className="p-2 text-left rounded-[6px] bg-[#F7F8FA] hover:bg-[#E5E8EE]/60 text-[#0B1220] border border-[#E5E8EE] transition-colors truncate"
            >
              • V-104 Supply Chain
            </button>
            <button
              type="button"
              onClick={() => selectPreset('demo-candidate-2')}
              className="p-2 text-left rounded-[6px] bg-[#F7F8FA] hover:bg-[#E5E8EE]/60 text-[#0B1220] border border-[#E5E8EE] transition-colors truncate"
            >
              • P-200 Pianificatore MRP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
