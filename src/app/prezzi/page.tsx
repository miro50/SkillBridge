'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Calculator,
  AlertCircle,
  HelpCircle,
  Building2,
  FileCheck,
} from 'lucide-react';

export default function PrezziPage() {
  // Calculator States
  const [calculatorRal, setCalculatorRal] = useState<number>(32000);
  const [internalInterviewHours, setInternalInterviewHours] = useState<number>(25);

  // Dynamic calculations
  const calculations = useMemo(() => {
    const traditionalFeeRate = 0.18; // 18% standard headhunter
    const pilotFeeRate = 0.11; // 11% SkillBridge Pilot
    const managerHourlyRate = 65; // €65/hr internal engineering cost

    const traditionalAgencyCost = Math.round(calculatorRal * traditionalFeeRate);
    const traditionalTimeCost = internalInterviewHours * managerHourlyRate;
    const traditionalTotalCost = traditionalAgencyCost + traditionalTimeCost;

    const skillbridgeFee = Math.round(calculatorRal * pilotFeeRate);
    const skillbridgeTimeCost = 0; // Pre-screened with 1-page A4 scorecard
    const skillbridgeTotalCost = skillbridgeFee + skillbridgeTimeCost;

    const netSavings = traditionalTotalCost - skillbridgeTotalCost;

    return {
      traditionalAgencyCost,
      traditionalTimeCost,
      traditionalTotalCost,
      skillbridgeFee,
      skillbridgeTotalCost,
      netSavings,
    };
  }, [calculatorRal, internalInterviewHours]);

  return (
    <div className="min-h-screen bg-white text-[#0B1220] flex flex-col font-sans selection:bg-[#1F4FD8] selection:text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-14 pb-16 lg:pt-20 lg:pb-20 border-b border-[#E5E8EE] bg-[#F7F8FA]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-wider text-[#1F4FD8] font-semibold">
            Trasparenza Economica
          </span>
          <h1 className="h1-hero mt-3">
            Modello 100% a Successo. Zero Anticipi.
          </h1>
          <p className="body-large mt-4 max-w-2xl mx-auto">
            Nessun canone software, nessun anticipo di ricerca. La commissione agevolata dell&apos;11% viene fatturata esclusivamente al 90° giorno, solo se il candidato supera il periodo di prova.
          </p>
        </div>
      </section>

      {/* Pricing Offer Card Grid */}
      <section className="py-20 border-b border-[#E5E8EE]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* The Main Offer Card */}
            <div className="lg:col-span-7 card-frame p-6 sm:p-10 border-2 border-[#1F4FD8]/40 relative">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-[6px] bg-[#F7F8FA] border border-[#E5E8EE] text-[11px] font-mono font-bold text-[#1F4FD8] mb-4">
                <span>OFFERTA PILOTA &bull; LINEA APERTA</span>
              </div>

              <div className="flex flex-wrap items-baseline gap-2 mb-4">
                <span className="font-mono text-5xl sm:text-6xl font-bold text-[#0B1220]">
                  11%
                </span>
                <span className="text-sm font-mono text-[#5B6475]">
                  della RAL annua lorda
                </span>
                <span className="text-xs font-mono text-[#12805C] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold ml-2">
                  Risparmi oltre il 40% vs standard
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#5B6475] leading-relaxed mb-8">
                Riservato alle prime 5 aziende manifatturiere del distretto. Consegna di 3 candidati pre-validati con Scorecard A4 entro 7 giorni.
              </p>

              {/* Guarantees Checklist */}
              <div className="space-y-4 py-6 border-t border-b border-[#E5E8EE] text-xs sm:text-sm">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#12805C] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0B1220] block">0 € di anticipo o retainer</strong>
                    <span className="text-[#5B6475] text-xs">
                      Non sborsi un centesimo al momento della firma del mandato né prima dei colloqui.
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#12805C] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0B1220] block">Fattura al 90° giorno a prova superata</strong>
                    <span className="text-[#5B6475] text-xs">
                      Se il candidato viene interrotto prima del 90° giorno, la fee non è dovuta. Rischio zero.
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#12805C] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0B1220] block">Garanzia di sostituzione a 180 giorni</strong>
                    <span className="text-[#5B6475] text-xs">
                      Se il candidato rassegna le dimissioni volontarie entro 6 mesi, avviamo una nuova selezione gratuita.
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#12805C] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0B1220] block">Nessun vincolo di esclusiva</strong>
                    <span className="text-[#5B6475] text-xs">
                      Mandato di 1 pagina: se trovi un candidato internamente prima della nostra presentazione, paghi 0 €.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href="/contatti"
                  className="w-full sm:w-auto h-12 px-8 rounded-[8px] bg-[#1F4FD8] hover:bg-[#1840B0] text-white text-xs font-semibold inline-flex items-center justify-center space-x-2 transition-all shadow-xs"
                >
                  <span>Blocca l&apos;Offerta Pilota al&apos;11%</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Interactive Calculator Column */}
            <div className="lg:col-span-5 card-frame p-6 sm:p-8 space-y-6 bg-[#F7F8FA]">
              <div className="flex items-center space-x-2 pb-3 border-b border-[#E5E8EE]">
                <Calculator className="w-5 h-5 text-[#1F4FD8]" />
                <h3 className="text-sm font-semibold text-[#0B1220]">
                  Simulatore di Risparmio Aziendale
                </h3>
              </div>

              {/* Slider 1: RAL */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-[#5B6475] font-medium">RAL Prevista:</span>
                  <span className="font-mono font-bold text-[#0B1220] text-sm">
                    {calculatorRal.toLocaleString('it-IT')} €
                  </span>
                </div>
                <input
                  type="range"
                  min="26000"
                  max="45000"
                  step="1000"
                  value={calculatorRal}
                  onChange={(e) => setCalculatorRal(Number(e.target.value))}
                  className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-[#1F4FD8] border border-[#E5E8EE]"
                />
                <div className="flex justify-between text-[10px] text-[#5B6475] font-mono mt-1">
                  <span>26.000 € (Junior Entry)</span>
                  <span>45.000 € (Specialist 2+ anni)</span>
                </div>
              </div>

              {/* Slider 2: Ore interne */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-[#5B6475] font-medium">Ore colloqui interni risparmiate:</span>
                  <span className="font-mono font-bold text-[#0B1220] text-sm">
                    {internalInterviewHours} ore
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="40"
                  step="5"
                  value={internalInterviewHours}
                  onChange={(e) => setInternalInterviewHours(Number(e.target.value))}
                  className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-[#1F4FD8] border border-[#E5E8EE]"
                />
                <div className="flex justify-between text-[10px] text-[#5B6475] font-mono mt-1">
                  <span>10 ore</span>
                  <span>40 ore (Colloqui tecnici HR + Direzione)</span>
                </div>
              </div>

              {/* Economic Comparison Output */}
              <div className="space-y-3 pt-3 border-t border-[#E5E8EE] font-mono text-xs">
                <div className="p-3 bg-white rounded-[8px] border border-[#E5E8EE] flex justify-between items-center">
                  <span className="text-[#5B6475]">Headhunter Tradizionale (18% + ore):</span>
                  <span className="font-bold text-red-600">
                    {calculations.traditionalTotalCost.toLocaleString('it-IT')} €
                  </span>
                </div>

                <div className="p-3 bg-white rounded-[8px] border border-[#1F4FD8]/40 flex justify-between items-center">
                  <span className="text-[#0B1220] font-semibold">SkillBridge Pilota (11% al G90):</span>
                  <span className="font-bold text-[#1F4FD8]">
                    {calculations.skillbridgeFee.toLocaleString('it-IT')} €
                  </span>
                </div>

                <div className="p-3 bg-emerald-50 rounded-[8px] border border-emerald-200 flex justify-between items-center">
                  <span className="text-[#12805C] font-bold">Risparmio Netto Totale:</span>
                  <span className="font-bold text-[#12805C] text-sm">
                    +{calculations.netSavings.toLocaleString('it-IT')} €
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-[#F7F8FA] border-b border-[#E5E8EE]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <h2 className="h2-section">Perché conviene a Plant Manager e CFO.</h2>
            <p className="body-large mt-2">
              Confronto diretto sulle clausole contrattuali più critiche nel recruiting tecnico.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#E5E8EE] rounded-[12px] bg-white overflow-hidden">
              <thead className="bg-[#F7F8FA] text-[#5B6475] font-mono text-[11px] uppercase border-b border-[#E5E8EE]">
                <tr>
                  <th className="p-4">Parametro Contrattuale</th>
                  <th className="p-4 text-[#5B6475]">Headhunter Generalista</th>
                  <th className="p-4 bg-[#1F4FD8]/5 text-[#1F4FD8] font-bold border-l border-r border-[#E5E8EE]">
                    SkillBridge Pilota
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E8EE]">
                <tr>
                  <td className="p-4 font-semibold text-[#0B1220]">Commissione (RAL 32.000 €)</td>
                  <td className="p-4 text-[#5B6475]">5.760 € (18%)</td>
                  <td className="p-4 bg-[#1F4FD8]/5 font-bold text-[#1F4FD8] border-l border-r border-[#E5E8EE]">
                    3.520 € (11%)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#0B1220]">Rischio Cassa al Giorno 1</td>
                  <td className="p-4 text-red-600 font-bold">Fattura immediata a rischio cliente</td>
                  <td className="p-4 bg-[#1F4FD8]/5 font-bold text-[#12805C] border-l border-r border-[#E5E8EE]">
                    0 € a rischio (Fattura a 90 gg)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#0B1220]">Verifica Competenze</td>
                  <td className="p-4 text-[#5B6475]">Filtro parole chiave su CV cartaceo</td>
                  <td className="p-4 bg-[#1F4FD8]/5 font-bold text-[#0B1220] border-l border-r border-[#E5E8EE]">
                    Test 25 min su fermo linea con Scorecard A4
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#0B1220]">Sostituzione Dimissioni</td>
                  <td className="p-4 text-[#5B6475]">30–60 giorni limitata</td>
                  <td className="p-4 bg-[#1F4FD8]/5 font-bold text-[#12805C] border-l border-r border-[#E5E8EE]">
                    180 giorni gratuita
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center max-w-2xl">
          <h2 className="h2-section">Vuoi attivare una ricerca senza anticipi?</h2>
          <p className="body-large mt-3">
            Contatta il nostro team di Ingegneri Gestionali per avviare la selezione sul tuo stabilimento.
          </p>
          <div className="mt-8">
            <Link
              href="/contatti"
              className="h-11 px-6 rounded-[8px] bg-[#1F4FD8] hover:bg-[#1840B0] text-white text-xs font-semibold inline-flex items-center justify-center space-x-2 transition-all shadow-xs"
            >
              <span>Richiedi il pilota a rischio zero</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
