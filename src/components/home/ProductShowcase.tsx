'use client';

import React, { useState } from 'react';
import {
  Terminal,
  ShieldCheck,
  BarChart3,
  Video,
  Clock,
  Lock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import BrowserMockup from '@/components/ui/BrowserMockup';
import ScorecardMockup from '@/components/scorecard/ScorecardMockup';

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState<'cockpit' | 'anticheat' | 'scorecard'>('cockpit');

  return (
    <div className="w-full">
      {/* Tab Selectors */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab('cockpit')}
          className={`h-11 px-5 rounded-[8px] text-xs font-semibold transition-all inline-flex items-center space-x-2 border cursor-pointer ${
            activeTab === 'cockpit'
              ? 'bg-[#0B1220] text-white border-[#0B1220] shadow-[0_1px_2px_rgba(11,18,32,0.06)]'
              : 'bg-white text-[#5B6475] hover:text-[#0B1220] border-[#E5E8EE] hover:bg-[#F7F8FA]'
          }`}
        >
          <Terminal className="w-4 h-4 text-[#1F4FD8]" />
          <span>1. Candidate Cockpit (25 min)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('anticheat')}
          className={`h-11 px-5 rounded-[8px] text-xs font-semibold transition-all inline-flex items-center space-x-2 border cursor-pointer ${
            activeTab === 'anticheat'
              ? 'bg-[#0B1220] text-white border-[#0B1220] shadow-[0_1px_2px_rgba(11,18,32,0.06)]'
              : 'bg-white text-[#5B6475] hover:text-[#0B1220] border-[#E5E8EE] hover:bg-[#F7F8FA]'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#12805C]" />
          <span>2. Scudo Anti-Cheat & Webcam</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('scorecard')}
          className={`h-11 px-5 rounded-[8px] text-xs font-semibold transition-all inline-flex items-center space-x-2 border cursor-pointer ${
            activeTab === 'scorecard'
              ? 'bg-[#0B1220] text-white border-[#0B1220] shadow-[0_1px_2px_rgba(11,18,32,0.06)]'
              : 'bg-white text-[#5B6475] hover:text-[#0B1220] border-[#E5E8EE] hover:bg-[#F7F8FA]'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-[#1F4FD8]" />
          <span>3. Scorecard Esecutiva A4 (88/100)</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'cockpit' && (
        <BrowserMockup
          url="skillbridge.internal/assessment/session-live-v104"
          badgeText="SIMULAZIONE IN CORSO"
        >
          <div className="space-y-5 text-[#0B1220]">
            {/* Simulation Header */}
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#E5E8EE] gap-2">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#F7F8FA] text-[#1F4FD8] border border-[#E5E8EE]">
                  SCENARIO: SKB-V104
                </span>
                <span className="text-xs text-[#5B6475]">Linea 2 Montaggio Valvole</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-red-50 text-red-700 text-xs font-mono font-bold border border-red-200">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  <span>REC ATTIVO</span>
                </div>
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#F7F8FA] text-[#0B1220] text-xs font-mono font-bold border border-[#E5E8EE]">
                  <Clock className="w-3.5 h-3.5 text-[#1F4FD8]" />
                  <span>22:15 / 25:00</span>
                </div>
              </div>
            </div>

            {/* Operational Briefing Box */}
            <div className="p-4 rounded-[8px] bg-[#F7F8FA] border border-[#E5E8EE] text-xs space-y-2">
              <div className="font-semibold text-[#0B1220] flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-[#B7791F]" />
                <span>Anomalia Fornitura: Valvola Oleodinamica V-104</span>
              </div>
              <p className="text-[#5B6475] leading-relaxed">
                Il fornitore storico ha subito un guasto alla linea di trafilatura. Il lead time ordinario di 5 giorni slitta a 14 giorni. La linea consuma 40 unità/giorno con un costo di fermo linea pari a <strong>1.200 € all&apos;ora</strong>. Disponibile fornitore aereo espresso (lead time 3 giorni, lotto minimo 200 pezzi).
              </p>
            </div>

            {/* Interactive Data Table Preview */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#E5E8EE] rounded-[8px]">
                <thead className="bg-[#F7F8FA] text-[#5B6475] font-mono text-[10px] uppercase border-b border-[#E5E8EE]">
                  <tr>
                    <th className="p-2.5">Parametro</th>
                    <th className="p-2.5">Valore Attuale</th>
                    <th className="p-2.5">Fornitore Celere (Opzione B)</th>
                    <th className="p-2.5">Impatto Economico</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E8EE] font-mono text-[11px]">
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-[#0B1220]">Giacenza Magazzino</td>
                    <td className="p-2.5 font-bold text-[#1F4FD8]">360 unità</td>
                    <td className="p-2.5 text-[#5B6475]">-</td>
                    <td className="p-2.5 text-[#5B6475]">Copertura teorica: 9 giorni</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-[#0B1220]">Consumo Linea</td>
                    <td className="p-2.5 text-[#0B1220]">40 unità/giorno</td>
                    <td className="p-2.5 text-[#5B6475]">-</td>
                    <td className="p-2.5 text-red-600 font-bold">Fermo linea: 1.200 € / ora</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-[#0B1220]">Lead Time & Lotto Minimo</td>
                    <td className="p-2.5 text-[#5B6475]">14 giorni (disrupted)</td>
                    <td className="p-2.5 font-bold text-[#12805C]">3 giorni (lotto 200 pz)</td>
                    <td className="p-2.5 text-[#5B6475]">Extracosto: +35 € / pezzo</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Candidate Form Action Mockup */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-[8px] border border-[#E5E8EE] bg-white text-xs">
                <span className="text-[11px] text-[#5B6475] block mb-1">
                  1. Giorno stimato di Stockout Linea:
                </span>
                <span className="font-mono font-bold text-[#0B1220] text-sm">Giorno 9</span>
              </div>
              <div className="p-3 rounded-[8px] border border-[#E5E8EE] bg-white text-xs">
                <span className="text-[11px] text-[#5B6475] block mb-1">
                  2. Quantità da riordinare fornitore celere:
                </span>
                <span className="font-mono font-bold text-[#1F4FD8] text-sm">200 unità (1 lotto)</span>
              </div>
            </div>
          </div>
        </BrowserMockup>
      )}

      {activeTab === 'anticheat' && (
        <BrowserMockup
          url="skillbridge.internal/security/proctoring-telemetry"
          badgeText="AUDIT DI SICUREZZA ATTIVO"
        >
          <div className="space-y-6 text-[#0B1220]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Pillar 1: Webcam */}
              <div className="p-4 rounded-[8px] bg-[#F7F8FA] border border-[#E5E8EE] flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-[6px] bg-white border border-[#E5E8EE] flex items-center justify-center text-[#1F4FD8] mb-3">
                    <Video className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-xs text-[#0B1220] mb-1">
                    Registrazione Webcam Continua
                  </h4>
                  <p className="text-[11px] text-[#5B6475] leading-relaxed">
                    Streaming video continuo verificato all&apos;avvio della sessione con consenso informato. Scongiura l&apos;impiego di secondi schermi o smartphone.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#E5E8EE] text-[10px] font-mono text-[#12805C] font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Stato: Streaming verificato</span>
                </div>
              </div>

              {/* Pillar 2: Focus Telemetry */}
              <div className="p-4 rounded-[8px] bg-[#F7F8FA] border border-[#E5E8EE] flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-[6px] bg-white border border-[#E5E8EE] flex items-center justify-center text-[#12805C] mb-3">
                    <Eye className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-xs text-[#0B1220] mb-1">
                    Telemetria Uscita Schermo
                  </h4>
                  <p className="text-[11px] text-[#5B6475] leading-relaxed">
                    Traccia in tempo reale ogni cambio di scheda o minimizzazione finestra (`window.blur`). Gli scostamenti vengono registrati nella scorecard.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#E5E8EE] text-[10px] font-mono text-[#12805C] font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>0 Defocus registrati</span>
                </div>
              </div>

              {/* Pillar 3: Paste Lock */}
              <div className="p-4 rounded-[8px] bg-[#F7F8FA] border border-[#E5E8EE] flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-[6px] bg-white border border-[#E5E8EE] flex items-center justify-center text-[#B7791F] mb-3">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-xs text-[#0B1220] mb-1">
                    Blocco Incolla & Parametri Unici
                  </h4>
                  <p className="text-[11px] text-[#5B6475] leading-relaxed">
                    Disabilitazione copia-incolla per le risposte analitiche e seed matematico a 32-bit: ogni candidato affronta numeri e formule differenti.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#E5E8EE] text-[10px] font-mono text-[#12805C] font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Clipboard inibita</span>
                </div>
              </div>
            </div>

            {/* Explanatory callout */}
            <div className="p-3.5 rounded-[8px] border border-[#E5E8EE] bg-white flex items-center justify-between text-xs text-[#5B6475]">
              <span>
                Protocollo progettato per garantire <strong>spiegabilità, trasparenza e rispetto della privacy</strong> secondo le direttive europee (GDPR &amp; AI Act).
              </span>
              <span className="font-mono text-[10px] text-[#1F4FD8] font-semibold uppercase">
                Zero Allucinazioni
              </span>
            </div>
          </div>
        </BrowserMockup>
      )}

      {activeTab === 'scorecard' && (
        <BrowserMockup
          url="skillbridge.internal/scorecard/example-marco-bianchi-88"
          badgeText="SCORECARD UFFICIALE (ESEMPIO)"
        >
          <ScorecardMockup interactive={true} />
        </BrowserMockup>
      )}
    </div>
  );
}
