'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Factory,
  ShieldCheck,
  Cpu,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  BarChart3,
  Award,
  Lock,
  ChevronRight,
  Terminal,
  Activity,
  Layers,
  FileText,
  BadgeAlert
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [tokenInput, setTokenInput] = useState<string>('');
  const [tokenError, setTokenError] = useState<string | null>(null);

  const handleLaunchAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = tokenInput.trim();
    if (!trimmed) {
      setTokenError('Inserisci un codice invito token valido');
      return;
    }
    setTokenError(null);
    router.push(`/assessment/${encodeURIComponent(trimmed)}`);
  };

  const selectPresetToken = (token: string) => {
    setTokenInput(token);
    setTokenError(null);
    router.push(`/assessment/${encodeURIComponent(token)}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Industrial Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-md flex items-center justify-center font-mono font-black text-white text-base shadow-sm">
              SB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-lg">SkillBridge</span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700">
                  v1.0-mvp
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Industrial Pre-Employment Assessment Cockpit
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-2 sm:gap-4 text-xs font-medium">
            <Link
              href="/aziende"
              className="text-blue-400 hover:text-white font-semibold transition-colors px-2 py-1 border border-blue-900/60 rounded bg-blue-950/40"
            >
              Per Aziende & ROI
            </Link>
            <a
              href="#metodo"
              className="text-slate-400 hover:text-white transition-colors hidden md:inline-block px-2 py-1"
            >
              Come Funziona
            </a>
            <a
              href="#scenari"
              className="text-slate-400 hover:text-white transition-colors hidden md:inline-block px-2 py-1"
            >
              Scenari Industriali
            </a>
            <a
              href="#garanzia"
              className="text-slate-400 hover:text-white transition-colors hidden lg:inline-block px-2 py-1"
            >
              Garanzia 90 Giorni
            </a>
            <Link
              href="/scorecard/33333333-3333-4333-8333-333333333333"
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 border border-slate-700 flex items-center gap-1.5 transition-all text-xs font-semibold"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Demo Scorecard</span>
            </Link>
            <Link
              href="/admin"
              className="px-2.5 py-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs font-mono"
              title="Accesso Founder Cockpit"
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-slate-800 pt-12 pb-20 lg:pt-20 lg:pb-28 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top Pill Alert */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-slate-400 uppercase tracking-wider text-[11px]">
                  Scenari Attivi:
                </span>
                <span className="font-semibold text-slate-200">
                  Supply Chain (V-104) • MRP Planning (P-200) • Buyer Tecnico (E-501) • Lean Process (M-300)
                </span>
              </div>
            </div>

            {/* Headline */}
            <div className="text-center max-w-4xl mx-auto mb-12">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase font-sans leading-tight">
                Zero ore perse a filtrare CV.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 mt-1">
                  Solo candidati testati sul campo.
                </span>
              </h1>
              <p className="mt-5 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Ricevi 3 profili in Ingegneria Gestionale entro 7 giorni, già valutati su una
                simulazione di fermo linea da 25 minuti con grading deterministico e telemetria
                anti-cheat. Paghi solo se superano i 90 giorni di prova.
              </p>
            </div>

            {/* Dual Interactive Portal Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {/* Left Card: Recruiter & Plant Director Demo */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Factory className="w-24 h-24 text-blue-400" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-950/80 text-blue-400 text-xs font-mono font-semibold border border-blue-800/60">
                      <BarChart3 className="w-3.5 h-3.5" />
                      AREA DIRETTORE STABILIMENTO / HR
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      SCORECARD 88/100
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    Esplora la Scorecard Esecutiva
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    Guarda come un Plant Director valuta in 3 minuti un candidato reale (Marco
                    Bianchi): calcolo matematico ROP, analisi negoziale con il fornitore, log
                    anti-cheat e workflow &quot;Richiedi Colloquio&quot; in 1 clic.
                  </p>

                  {/* Scorecard quick stats preview */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-md border border-slate-800 font-mono mb-6 text-center">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Deterministico</div>
                      <div className="text-sm font-bold text-blue-400">62/70</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Semantico</div>
                      <div className="text-sm font-bold text-indigo-400">26/30</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Decisione</div>
                      <div className="text-xs font-bold text-emerald-400 mt-0.5">RACCOMANDATO</div>
                    </div>
                  </div>
                </div>

                <div>
                  <Link
                    href="/scorecard/33333333-3333-4333-8333-333333333333"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-md hover:shadow-blue-600/20 active:scale-[0.99]"
                  >
                    <span>Apri Scorecard Dimostrativa Completa</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <div className="mt-2 text-center">
                    <Link
                      href="/aziende"
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Sei un&apos;azienda? Calcola il ROI & Richiedi Candidati</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <p className="text-[11px] text-slate-500 text-center mt-2">
                    Nessuna registrazione richiesta • Report stampabile 1-page A4
                  </p>
                </div>
              </div>

              {/* Right Card: Candidate Runner Access */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Terminal className="w-24 h-24 text-sky-400" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-mono font-semibold border border-slate-700">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      PORTALE CANDIDATO (25 MIN)
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      SIMULAZIONE ATTIVA
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    Accesso Cockpit di Valutazione
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    Sei un candidato con un codice invito? Accedi alla sala briefing per esaminare
                    il dossier di stabilimento e avviare il test cronometrato.
                  </p>

                  {/* Token Form */}
                  <form onSubmit={handleLaunchAssessment} className="space-y-3 mb-4">
                    <div>
                      <label
                        htmlFor="tokenInput"
                        className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1"
                      >
                        Token Sessione Personale
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="tokenInput"
                          type="text"
                          value={tokenInput}
                          onChange={(e) => setTokenInput(e.target.value)}
                          placeholder="Es. demo-candidate-1"
                          className="flex-1 bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md px-3.5 py-2.5 text-sm text-white placeholder-slate-600 font-mono outline-none transition-all"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-md font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-1"
                        >
                          <span>Entra</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {tokenError && (
                        <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {tokenError}
                        </p>
                      )}
                    </div>
                  </form>

                  {/* Demo Tokens Pills */}
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 block mb-1.5">
                      Sessioni demo pre-generate nei 4 domini operativi:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => selectPresetToken('demo-candidate-1')}
                        className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-blue-900/60 text-[11px] font-mono text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        demo-candidate-1 (V-104 Supply Chain)
                      </button>
                      <button
                        type="button"
                        onClick={() => selectPresetToken('demo-candidate-2')}
                        className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-emerald-900/60 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        demo-candidate-2 (P-200 Production Planner)
                      </button>
                      <button
                        type="button"
                        onClick={() => selectPresetToken('demo-candidate-4')}
                        className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-sky-900/60 text-[11px] font-mono text-sky-400 hover:text-sky-300 transition-colors"
                      >
                        demo-candidate-4 (E-501 Buyer Tecnico)
                      </button>
                      <button
                        type="button"
                        onClick={() => selectPresetToken('demo-candidate-5')}
                        className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-amber-900/60 text-[11px] font-mono text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        demo-candidate-5 (M-300 Process Lean)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Anti-Cheat Attivo (Anti-Paste & Defocus)
                  </span>
                  <span>Richiede desktop &ge; 1024px</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section: Traditional Recruiting vs SkillBridge */}
        <section id="metodo" className="py-20 border-b border-slate-800 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded border border-blue-900">
                IL METODO SKILLBRIDGE
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight uppercase">
                Perché i test tradizionali falliscono in fabbrica
              </h2>
              <p className="text-sm sm:text-base text-slate-400 mt-3">
                Un confronto trasparente tra agenzie di selezione tradizionali e il modello di
                simulazione pratica pre-colloquio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Traditional recruiting */}
              <div className="bg-slate-900/60 border border-rose-950/60 rounded-lg p-6 sm:p-8">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase tracking-wider mb-6 pb-3 border-b border-rose-950/80">
                  <BadgeAlert className="w-4 h-4" />
                  <span>Agenzie & Cacciatori Tradizionali</span>
                </div>

                <ul className="space-y-4 text-xs sm:text-sm text-slate-400">
                  <li className="flex items-start gap-3">
                    <span className="text-rose-400 font-bold font-mono">✕</span>
                    <span>
                      <strong className="text-slate-200">Screening su CV abbelliti:</strong>{' '}
                      decine di colloqui con candidati teorici che non hanno mai visto una distinta base.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rose-400 font-bold font-mono">✕</span>
                    <span>
                      <strong className="text-slate-200">Test a risposta multipla banali:</strong>{' '}
                      quiz teorici facilmente raggirabili con AI o suggerimenti da casa.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rose-400 font-bold font-mono">✕</span>
                    <span>
                      <strong className="text-slate-200">15-20% RAL anticipata:</strong>{' '}
                      fattura emessa al giorno 1 con garanzie minime e note di credito inutilizzabili.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rose-400 font-bold font-mono">✕</span>
                    <span>
                      <strong className="text-slate-200">Frizioni e vincoli d&apos;esclusiva:</strong> contratti
                      lunghi e recruiter che non distinguono un ROP da un lotto Min/Max.
                    </span>
                  </li>
                </ul>
              </div>

              {/* SkillBridge Model */}
              <div className="bg-slate-900 border border-blue-900/60 rounded-lg p-6 sm:p-8 relative shadow-lg">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm uppercase tracking-wider mb-6 pb-3 border-b border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>SkillBridge Operations Engine</span>
                </div>

                <ul className="space-y-4 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Simulazione reale di 25 min:</strong>{' '}
                      il candidato deve gestire un fermo linea improvviso calcolando deficit e lotti ROP.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Doppia Valutazione Matematica + LLM:</strong>{' '}
                      0-70 pt di calcolo deterministico + 0-30 pt di sintesi comunicativa via Gemini.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Garanzia 100% a 90 Giorni:</strong>{' '}
                      nessun costo di avvio. Fattura emessa solo a conferma superata del periodo di prova.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Decisione in 3 minuti:</strong>{' '}
                      Scorecard esecutiva 1-page A4 con telemetria anti-cheat e link rapido di colloquio.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Deep Dive: Multi-Scenario Industrial Showcase */}
        <section id="scenari" className="py-20 border-b border-slate-800 bg-slate-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-mono uppercase tracking-widest text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded border border-blue-900">
                CATALOGO TEST MULTI-RUOLO • SPEC-002
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 uppercase tracking-tight">
                4 Simulazioni Tecniche per le Figure Chiave di Fabbrica
              </h2>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Ogni modulo mette il candidato davanti a un caso reale con dati numerici generati
                deterministicamente anti-copia, vincoli stringenti di MOQ/Lead Time e grading trasparente 0-100.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Scenario 1: Valvola V-104 */}
              <div className="bg-slate-900 border border-slate-800 hover:border-blue-700/60 transition-all rounded-lg p-6 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[11px] font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-900">
                      MODULO SKB-V104
                    </span>
                    <span className="text-[10px] font-mono uppercase text-slate-500">25 MIN CRONOMETRATI</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Fermo Linea Valvola V-104
                  </h3>
                  <div className="text-xs text-blue-400 font-semibold mb-3">
                    Supply Chain & Operations Specialist
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Rottura improvvisa della fornitura di O-Ring NBR-70 su Linea 2 Montaggio con ritardo di 12 giorni.
                    Il candidato deve calcolare lo stockout day esatto, le ore di fermo impianto e il lotto di reintegro MOQ.
                  </p>

                  <div className="space-y-2 py-3 border-t border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500">Dossier:</span>
                      <span className="font-mono text-[11px]">BOM, ERP Stock, Ritardo Fornitore</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500">Benchmark:</span>
                      <span className="font-mono text-[11px] text-blue-400">70 pt Det. + 30 pt Sem.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 mt-4">
                  <button
                    type="button"
                    onClick={() => selectPresetToken('demo-candidate-1')}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded bg-blue-950/80 hover:bg-blue-900/80 text-blue-300 border border-blue-800/80 text-xs font-semibold transition-colors"
                  >
                    <span>Lancia Test Valvola V-104</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Scenario 2: Packaging P-200 */}
              <div className="bg-slate-900 border border-slate-800 hover:border-emerald-700/60 transition-all rounded-lg p-6 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900">
                      MODULO SKB-P200
                    </span>
                    <span className="text-[10px] font-mono uppercase text-slate-500">25 MIN CRONOMETRATI</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Riprogrammazione MRP Packaging P-200
                  </h3>
                  <div className="text-xs text-emerald-400 font-semibold mb-3">
                    Production Planner & MRP Specialist
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Slittamento consegna bobine alluminio per camera bianca packaging. Il candidato deve riprogrammare
                    il piano di produzione, calcolare il buffer ore perse e valutare il batching pallet da 500 unità.
                  </p>

                  <div className="space-y-2 py-3 border-t border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500">Dossier:</span>
                      <span className="font-mono text-[11px]">MPS, Lotto Pallet, Fabbisogno Netto</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500">Benchmark:</span>
                      <span className="font-mono text-[11px] text-emerald-400">70 pt Det. + 30 pt Sem.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 mt-4">
                  <button
                    type="button"
                    onClick={() => selectPresetToken('demo-candidate-2')}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/80 text-xs font-semibold transition-colors"
                  >
                    <span>Lancia Test Packaging P-200</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Scenario 3: Scheda E-501 */}
              <div className="bg-slate-900 border border-slate-800 hover:border-sky-700/60 transition-all rounded-lg p-6 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[11px] font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-900">
                      MODULO SKB-E501
                    </span>
                    <span className="text-[10px] font-mono uppercase text-slate-500">25 MIN CRONOMETRATI</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Allocazione Globale MCU E-501
                  </h3>
                  <div className="text-xs text-sky-400 font-semibold mb-3">
                    Buyer Tecnico & Procurement Specialist
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Allocazione semiconduttori MCU su scheda automotive e offerta urgente spot broker. Il candidato
                    calcola il trade-off economico tra extra-costo e fermo collaudo, gestendo conformità e tracciabilità.
                  </p>

                  <div className="space-y-2 py-3 border-t border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500">Dossier:</span>
                      <span className="font-mono text-[11px]">Broker Spot, Certificati RoHS, Tracciabilità</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500">Benchmark:</span>
                      <span className="font-mono text-[11px] text-sky-400">70 pt Det. + 30 pt Sem.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 mt-4">
                  <button
                    type="button"
                    onClick={() => selectPresetToken('demo-candidate-4')}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded bg-sky-950/80 hover:bg-sky-900/80 text-sky-300 border border-sky-800/80 text-xs font-semibold transition-colors"
                  >
                    <span>Lancia Test Scheda E-501</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Scenario 4: Process M-300 */}
              <div className="bg-slate-900 border border-slate-800 hover:border-amber-700/60 transition-all rounded-lg p-6 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[11px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-900">
                      MODULO SKB-M300
                    </span>
                    <span className="text-[10px] font-mono uppercase text-slate-500">25 MIN CRONOMETRATI</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Bilanciamento Linea Motore M-300
                  </h3>
                  <div className="text-xs text-amber-400 font-semibold mb-3">
                    Junior Process & Lean Engineer
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Guasto rettificatrice albero rotore M-300 con 18 giorni di ritardo fornitore. Il candidato
                    calcola il trade-off fermo isola robotizzata da 2.100 €/h, lotto rapido CNC e piano SMED/kaizen.
                  </p>

                  <div className="space-y-2 py-3 border-t border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500">Dossier:</span>
                      <span className="font-mono text-[11px]">OEE, Isola Robotizzata 4, Rapid CNC</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500">Benchmark:</span>
                      <span className="font-mono text-[11px] text-amber-400">70 pt Det. + 30 pt Sem.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 mt-4">
                  <button
                    type="button"
                    onClick={() => selectPresetToken('demo-candidate-5')}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded bg-amber-950/80 hover:bg-amber-900/80 text-amber-300 border border-amber-800/80 text-xs font-semibold transition-colors"
                  >
                    <span>Lancia Test Motore M-300</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Grand Slam Offer & Guarantee Section */}
        <section id="garanzia" className="py-20 border-b border-slate-800 bg-slate-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-blue-600/60 rounded-xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="max-w-3xl">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800">
                  GARANZIA TOTALE A RISCHIO ZERO
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-4 uppercase">
                  Programma &quot;Linea Aperta&quot;: Paghi Solo Se Funziona
                </h2>
                <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
                  Eliminiamo qualsiasi incertezza economica. Valuti i candidati pre-testati
                  senza alcun vincolo di esclusiva.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  <div className="bg-slate-950/80 p-4 rounded-lg border border-slate-800 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase">
                        Zero Costi d&apos;Avvio o Canoni
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Incontri i 3 candidati migliori in colloqui conoscitivi di 20 minuti senza
                        alcun anticipo né impegno.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 p-4 rounded-lg border border-slate-800 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase">
                        Fattura solo al Giorno 90
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        La commissione di successo si attiva unicamente al superamento con successo
                        del periodo di prova dei primi 3 mesi.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 p-4 rounded-lg border border-slate-800 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase">
                        Sostituzione Gratuita a 180 Giorni
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Se il candidato assunto decide di dimettersi entro 6 mesi, ti forniamo un
                        nuovo candidato qualificato a costo zero.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 p-4 rounded-lg border border-slate-800 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase">
                        Pilot Limitato: 11% RAL
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Tariffa agevolata di lancio (3.300 €) riservata alle prime 5 aziende partner
                        manifatturiere del trimestre (poi 14%).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-400 text-center sm:text-left">
                    Vuoi attivare la selezione per il tuo stabilimento?
                  </div>
                  <Link
                    href="/scorecard/33333333-3333-4333-8333-333333333333"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-md font-semibold text-xs transition-colors flex items-center gap-2 shadow-md"
                  >
                    <span>Vedi Scorecard & Richiedi Candidati</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Industrial Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 font-bold text-white text-sm mb-2">
                <span className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center font-mono text-xs">
                  SB
                </span>
                <span>SkillBridge Engineering</span>
              </div>
              <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
                Piattaforma di validazione delle competenze pratiche per Operations, Supply Chain e
                Ingegneria Gestionale. Simulazioni realistiche senza frizioni burocratiche.
              </p>
              <div className="flex items-center gap-2 mt-4 text-[11px] font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Engine Operativo • Versione 1.0.0-mvp</span>
              </div>
            </div>

            <div>
              <div className="font-mono uppercase text-slate-300 font-semibold text-[11px] tracking-wider mb-3">
                Scorciatoie Demo
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    href="/aziende"
                    className="hover:text-blue-400 transition-colors text-blue-400 font-medium"
                  >
                    Portale Aziende & Calcolatore ROI
                  </Link>
                </li>
                <li>
                  <Link
                    href="/scorecard/33333333-3333-4333-8333-333333333333"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Scorecard Marco Bianchi (88/100)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/assessment/demo-candidate-1"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Test V-104: Supply Chain Specialist
                  </Link>
                </li>
                <li>
                  <Link
                    href="/assessment/demo-candidate-2"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Test P-200: Production Planner MRP
                  </Link>
                </li>
                <li>
                  <Link
                    href="/assessment/demo-candidate-4"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Test E-501: Buyer Tecnico & Sourcing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/assessment/demo-candidate-5"
                    className="hover:text-amber-400 transition-colors"
                  >
                    Test M-300: Process & Lean Engineer
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin"
                    className="hover:text-amber-400 transition-colors text-slate-400"
                  >
                    Founder Operations Cockpit
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-mono uppercase text-slate-300 font-semibold text-[11px] tracking-wider mb-3">
                Specifiche Tecniche
              </div>
              <ul className="space-y-1.5 text-[11px] font-mono text-slate-400">
                <li>Anti-Cheat: Defocus + Paste Telemetry</li>
                <li>Grader: 0-70 Det. + 0-30 Sem.</li>
                <li>Timeout Fail-Safe: 4.0s AbortSignal</li>
                <li>Report: Executive 1-Page A4 Printable</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <div>&copy; 2026 SkillBridge Operations Assessment. Tutti i diritti riservati.</div>
            <div className="font-mono text-slate-600">
              SPEC-001 • Deterministic + Semantic Engine
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
