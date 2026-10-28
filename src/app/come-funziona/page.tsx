'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScorecardMockup from '@/components/scorecard/ScorecardMockup';
import BrowserMockup from '@/components/ui/BrowserMockup';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Terminal,
  BarChart3,
  Building2,
  Users,
  AlertTriangle,
  Lock,
  Eye,
  Video,
  FileText,
} from 'lucide-react';

export default function ComeFunzionaPage() {
  return (
    <div className="min-h-screen bg-white text-[#0B1220] flex flex-col font-sans selection:bg-[#1F4FD8] selection:text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-14 pb-16 lg:pt-20 lg:pb-24 border-b border-[#E5E8EE] bg-[#F7F8FA]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-wider text-[#1F4FD8] font-semibold">
            Il Metodo Operativo
          </span>
          <h1 className="h1-hero mt-3">
            Come selezioniamo e testiamo i migliori ingegneri di stabilimento.
          </h1>
          <p className="body-large mt-4 max-w-2xl mx-auto">
            Dalla definizione dei vincoli di fabbrica alla consegna dei 3 candidati pre-validati con Scorecard A4 entro 7 giorni lavorativi. Zero anticipi e fattura al 90° giorno.
          </p>
        </div>
      </section>

      {/* Deep-Dive 4-Step Pipeline */}
      <section className="py-24 border-b border-[#E5E8EE]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-24">
          {/* Step 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#1F4FD8] font-bold">
                <span className="w-6 h-6 rounded-[6px] bg-[#F7F8FA] border border-[#E5E8EE] flex items-center justify-center">
                  01
                </span>
                <span>FASE 1 &bull; DEFINIZIONE VACANCY</span>
              </div>
              <h2 className="h2-section">
                Mappatura dei vincoli di impianto e della posizione.
              </h2>
              <p className="body-large">
                Non raccogliamo generiche job description da 5 pagine. Un nostro Ingegnere Gestionale concorda con la tua Direzione di Stabilimento o con le Risorse Umane i 3 vincoli cardine:
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#5B6475]">
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#12805C] flex-shrink-0 mt-0.5" />
                  <span><strong>Ruolo Specialistico:</strong> Supply Chain, MRP/MPS, Buyer Tecnico o Process &amp; Lean.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#12805C] flex-shrink-0 mt-0.5" />
                  <span><strong>Criticità di Stabilimento:</strong> Costo medio orario di fermo linea e orizzonti dei lead time dei fornitori.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#12805C] flex-shrink-0 mt-0.5" />
                  <span><strong>Mandato Snello di 1 Pagina:</strong> Nessun costo iniziale, nessun vincolo di esclusiva.</span>
                </li>
              </ul>
            </div>
            <div className="lg:col-span-6">
              <div className="card-frame p-6 sm:p-8 space-y-3 font-mono text-xs text-[#5B6475]">
                <div className="text-[11px] uppercase tracking-wider text-[#0B1220] font-bold pb-2 border-b border-[#E5E8EE]">
                  Scheda di Calibrazione Stabilimento
                </div>
                <div className="flex justify-between py-1">
                  <span>Ruolo Target:</span>
                  <span className="font-semibold text-[#0B1220]">Pianificatore della Produzione MRP</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Danno Fermo Linea:</span>
                  <span className="font-semibold text-red-600">2.800 € / ora</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Sourcing Canale:</span>
                  <span className="font-semibold text-[#1F4FD8]">ITS &amp; PoliMi / PoliTo Gestionale</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Consegna Target:</span>
                  <span className="font-semibold text-[#12805C]">7 Giorni Lavorativi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 lg:order-2 space-y-4">
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#1F4FD8] font-bold">
                <span className="w-6 h-6 rounded-[6px] bg-[#F7F8FA] border border-[#E5E8EE] flex items-center justify-center">
                  02
                </span>
                <span>FASE 2 &bull; SIMULAZIONE DA 25 MINUTI</span>
              </div>
              <h2 className="h2-section">
                Stress-test pratico su anomalia operativa reale.
              </h2>
              <p className="body-large">
                I candidati affrontano una prova in browser a tempo rigoroso (25 minuti). Niente quiz teorici a crocette: devono analizzare una rottura di fornitura o un collo di bottiglia reale.
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#5B6475]">
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#12805C] flex-shrink-0 mt-0.5" />
                  <span><strong>Parametri Dinamici a 32-bit:</strong> Giacenze e lead time cambiano per ogni candidato per impedire la condivisione delle soluzioni.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#12805C] flex-shrink-0 mt-0.5" />
                  <span><strong>Webcam Proctoring Attivo:</strong> Registrazione video continua per verificare la presenza ed escludere l&apos;uso di secondi monitor.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#12805C] flex-shrink-0 mt-0.5" />
                  <span><strong>Memo per la Direzione:</strong> Il candidato deve motivare in 150-200 parole il trade-off tra extracosti e rischio fermo linea.</span>
                </li>
              </ul>
            </div>
            <div className="lg:col-span-6 lg:order-1">
              <BrowserMockup url="skillbridge.internal/assessment/test-v104">
                <div className="p-4 bg-[#F7F8FA] rounded-[8px] border border-[#E5E8EE] text-xs space-y-3 font-mono">
                  <div className="flex justify-between items-center text-red-600 font-bold">
                    <span>● REC WEBCAM ATTIVO</span>
                    <span>⏱ 22:15 / 25:00</span>
                  </div>
                  <div className="text-[#0B1220] font-sans">
                    Scenario: Rottura O-Ring Linea Montaggio. Lead time da 5 a 14 gg.
                  </div>
                  <div className="p-2 bg-white rounded border border-[#E5E8EE] text-[11px] text-[#5B6475]">
                    [Giacenza: 360 pz] &bull; [Consumo: 40 pz/gg] &bull; [Fermo: 1.200 €/h]
                  </div>
                </div>
              </BrowserMockup>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#1F4FD8] font-bold">
                <span className="w-6 h-6 rounded-[6px] bg-[#F7F8FA] border border-[#E5E8EE] flex items-center justify-center">
                  03
                </span>
                <span>FASE 3 &bull; PIPELINE DI GRADING IBRIDO (70/30)</span>
              </div>
              <h2 className="h2-section">
                Scorecard Esecutiva da 1 pagina in 3 minuti di lettura.
              </h2>
              <p className="body-large">
                Il sistema aggrega il risultato secondo un modello trasparente, progettato per essere verificabile e conforme all&apos;AI Act:
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#5B6475]">
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#12805C] flex-shrink-0 mt-0.5" />
                  <span><strong>70% Deterministico (0-70 pt):</strong> Calcolo esatto del punto di stockout, rispetto del lotto minimo di riordino e quantificazione economica.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#12805C] flex-shrink-0 mt-0.5" />
                  <span><strong>30% Semantico Qualitativo (0-30 pt):</strong> Valutazione della capacità di sintesi per la Direzione e della gestione del rischio fornitori.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#12805C] flex-shrink-0 mt-0.5" />
                  <span><strong>Audit di Integrità:</strong> Conteggio dei secondi fuori finestra (defocus) e verifica del proctoring video.</span>
                </li>
              </ul>
            </div>
            <div className="lg:col-span-6">
              <ScorecardMockup interactive={false} />
            </div>
          </div>

          {/* Step 4 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 lg:order-2 space-y-4">
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#1F4FD8] font-bold">
                <span className="w-6 h-6 rounded-[6px] bg-[#F7F8FA] border border-[#E5E8EE] flex items-center justify-center">
                  04
                </span>
                <span>FASE 4 &bull; COLLOQUIO &amp; ASSUNZIONE A RISCHIO ZERO</span>
              </div>
              <h2 className="h2-section">
                Colloquio mirato e fattura solo al 90° giorno.
              </h2>
              <p className="body-large">
                Ricevi la terna dei 3 migliori candidati (punteggio $\ge 75/100$). Fai un colloquio conoscitivo di soli 20 minuti incentrato sulla cultura aziendale, poiché le competenze analitiche sono già state provate.
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#5B6475]">
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#12805C] flex-shrink-0 mt-0.5" />
                  <span><strong>Zero Anticipi:</strong> Nessun costo prima dell&apos;assunzione. Se decidi di non procedere, non paghi nulla.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#12805C] flex-shrink-0 mt-0.5" />
                  <span><strong>Fatturazione a 90 Giorni:</strong> La commissione agevolata (11% RAL) viene emessa solo al completamento con successo dei 3 mesi di prova.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#12805C] flex-shrink-0 mt-0.5" />
                  <span><strong>180 Giorni di Garanzia:</strong> Sostituzione gratuita se la risorsa si dimette entro 6 mesi.</span>
                </li>
              </ul>
            </div>
            <div className="lg:col-span-6 lg:order-1">
              <div className="card-frame p-6 sm:p-8 space-y-4 text-xs font-mono">
                <div className="text-[11px] uppercase tracking-wider text-[#12805C] font-bold pb-2 border-b border-[#E5E8EE]">
                  Riepilogo Garanzia &quot;Linea Aperta&quot;
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#5B6475]">Cassa a Rischio Giorno 1:</span>
                  <span className="font-bold text-[#12805C] text-sm">0 € (Zero)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#5B6475]">Colloqui Interni Risparmiati:</span>
                  <span className="font-bold text-[#0B1220]">25–35 Ore</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#5B6475]">Sostituzione Gratuita:</span>
                  <span className="font-bold text-[#1F4FD8]">Fino a 180 Giorni</span>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E5E8EE]">
                  <Link
                    href="/contatti"
                    className="w-full h-10 rounded-[8px] bg-[#1F4FD8] hover:bg-[#1840B0] text-white font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <span>Attiva un Pilota su una Posizione Aperta</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#F7F8FA]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center max-w-2xl">
          <h2 className="h2-section">Pronto a testare il metodo sul tuo stabilimento?</h2>
          <p className="body-large mt-3">
            Richiedi 3 profili pre-selezionati per la tua prossima assunzione in Ingegneria Gestionale o Operations.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contatti"
              className="h-11 px-6 rounded-[8px] bg-[#1F4FD8] hover:bg-[#1840B0] text-white text-xs font-semibold inline-flex items-center justify-center space-x-2 transition-all shadow-xs"
            >
              <span>Richiedi il pilota aziendale</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/scenari"
              className="h-11 px-5 rounded-[8px] border border-[#E5E8EE] bg-white hover:bg-[#F7F8FA] text-[#0B1220] text-xs font-semibold inline-flex items-center justify-center space-x-2 transition-colors"
            >
              <span>Esplora i 20 Scenari Industriali</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
