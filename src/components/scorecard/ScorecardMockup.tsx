import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Video,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

interface ScorecardMockupProps {
  interactive?: boolean;
}

export default function ScorecardMockup({ interactive = true }: ScorecardMockupProps) {
  return (
    <div className="w-full bg-white rounded-[12px] border border-[#E5E8EE] p-5 sm:p-7 soft-shadow text-[#0B1220] font-sans">
      {/* Header Band */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#E5E8EE] gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-[6px] bg-[#0B1220] text-white flex items-center justify-center font-mono font-bold text-xs">
            SB
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm text-[#0B1220]">
                Ing. Marco Bianchi
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded-[4px] bg-[#F7F8FA] text-[#1F4FD8] border border-[#E5E8EE] font-semibold">
                ESEMPIO
              </span>
            </div>
            <p className="text-[11px] text-[#5B6475]">
              Ruolo: Supply Chain & Operations Specialist
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-[10px] font-mono text-[#5B6475] uppercase block">
              Punteggio Globale
            </span>
            <div className="flex items-baseline space-x-1 justify-end">
              <span className="font-mono font-bold text-2xl text-[#12805C]">
                88
              </span>
              <span className="font-mono text-xs text-[#5B6475]">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Meta tags bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3 border-b border-[#E5E8EE] text-[11px] font-mono text-[#5B6475]">
        <div>
          <span className="text-[#5B6475]/70 block">Scenario:</span>
          <span className="font-semibold text-[#0B1220]">SKB-V104 (Valvola V-104)</span>
        </div>
        <div>
          <span className="text-[#5B6475]/70 block">Tempo Svolto:</span>
          <span className="font-semibold text-[#0B1220]">22 min 14 sec</span>
        </div>
        <div>
          <span className="text-[#5B6475]/70 block">Esito Tecnico:</span>
          <span className="font-semibold text-[#12805C]">IDONEO (Top 12%)</span>
        </div>
        <div>
          <span className="text-[#5B6475]/70 block">Webcam Proctoring:</span>
          <span className="font-semibold text-[#12805C] flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#12805C]" />
            <span>VERIFICATO</span>
          </span>
        </div>
      </div>

      {/* Grid: 2 Columns for Evaluation Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-xs">
        {/* Box 1: Deterministico (70 pt) */}
        <div className="p-3.5 rounded-[8px] bg-[#F7F8FA] border border-[#E5E8EE]">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E8EE] font-semibold text-[#0B1220]">
            <span>Calcoli Matematici & ROP</span>
            <span className="font-mono text-[#1F4FD8]">65 / 70 pt</span>
          </div>
          <div className="space-y-2 pt-2.5 text-[11px] text-[#5B6475]">
            <div className="flex justify-between items-center">
              <span>Giorno di Stockout:</span>
              <span className="font-mono font-medium text-[#0B1220]">
                Giorno 9 <CheckCircle2 className="w-3 h-3 text-[#12805C] inline ml-1" />
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Quantità Riprogrammata:</span>
              <span className="font-mono font-medium text-[#0B1220]">
                200 pz (MOQ) <CheckCircle2 className="w-3 h-3 text-[#12805C] inline ml-1" />
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Ore Fermo Evitate:</span>
              <span className="font-mono font-medium text-[#0B1220]">
                40 ore (48.000 €)
              </span>
            </div>
          </div>
        </div>

        {/* Box 2: Qualitativo Semantico (30 pt) */}
        <div className="p-3.5 rounded-[8px] bg-[#F7F8FA] border border-[#E5E8EE]">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E8EE] font-semibold text-[#0B1220]">
            <span>Analisi Decisionale & Trade-off</span>
            <span className="font-mono text-[#1F4FD8]">23 / 30 pt</span>
          </div>
          <div className="space-y-1.5 pt-2 text-[11px] text-[#5B6475]">
            <p className="leading-relaxed">
              <strong className="text-[#0B1220]">Motivazione:</strong> Ha compreso immediatamente che l&apos;extracosto di 7.000 € per spedizione aerea è trascurabile a fronte di 48.000 € di fermo linea montaggio.
            </p>
            <p className="leading-relaxed">
              <strong className="text-[#0B1220]">Azione Fornitore:</strong> Comunicazione rigorosa al fornitore primario con richiesta di addebito spese straordinarie.
            </p>
          </div>
        </div>
      </div>

      {/* Box 3: Anti-cheat Telemetry & Integrity */}
      <div className="p-3 rounded-[8px] border border-[#E5E8EE] bg-white flex flex-wrap items-center justify-between gap-3 text-[11px] mb-4">
        <div className="flex items-center space-x-2 text-[#5B6475]">
          <ShieldCheck className="w-4 h-4 text-[#12805C]" />
          <span>
            <strong className="text-[#0B1220]">Audit Anti-Cheat:</strong> Conforme (0 defocus registrati, 0 eventi incolla)
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[#5B6475] font-mono text-[10px]">
          <Video className="w-3.5 h-3.5 text-[#1F4FD8]" />
          <span>Webcam stream loggato</span>
        </div>
      </div>

      {/* Action Footer */}
      {interactive && (
        <div className="pt-3 border-t border-[#E5E8EE] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-[#5B6475]">
            Report sintetico da 1 pagina A4 generato istantaneamente al termine della prova.
          </span>
          <Link
            href="/scorecard/33333333-3333-4333-8333-333333333333"
            className="w-full sm:w-auto h-9 px-3.5 rounded-[8px] bg-[#1F4FD8] hover:bg-[#1840B0] text-white text-xs font-semibold inline-flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
          >
            <span>Apri Scorecard Reale</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
