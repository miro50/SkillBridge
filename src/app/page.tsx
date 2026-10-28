'use client';

import React, { useState, useMemo } from 'react';
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
  BadgeAlert,
  Boxes,
  Zap,
  Video,
  Camera,
  Eye,
  Calculator,
  HelpCircle,
  Check,
  X,
  PhoneCall,
  Building2,
  User,
  ChevronDown,
  Monitor,
  ShieldAlert,
} from 'lucide-react';
import { SCENARIO_CATALOG } from '@/lib/assessment/parametric';

export default function HomePage() {
  const router = useRouter();

  // Candidate Access Modal State
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Scenario Catalog Category Filter
  const [selectedCategory, setSelectedCategory] = useState<
    'supply_chain' | 'production_planning' | 'procurement' | 'lean_process'
  >('supply_chain');

  // ROI Calculator Interactive State
  const [calculatorRal, setCalculatorRal] = useState<number>(32000);
  const [internalInterviewHours, setInternalInterviewHours] = useState<number>(24);

  // Dynamic ROI Calculations
  const roiData = useMemo(() => {
    const traditionalRate = 0.18; // 18% fee
    const pilotRate = 0.11; // 11% SkillBridge Pilot
    const engineerHourlyCost = 65; // €65/ora costo orario medio Plant Director/Senior Engineer

    const traditionalAgencyCost = Math.round(calculatorRal * traditionalRate);
    const traditionalInternalTimeCost = internalInterviewHours * engineerHourlyCost;
    const traditionalTotalCost = traditionalAgencyCost + traditionalInternalTimeCost;

    const skillbridgeFee = Math.round(calculatorRal * pilotRate);
    const skillbridgeTotalCost = skillbridgeFee; // zero ore perse (scorecard 3 min)

    const netSavings = traditionalTotalCost - skillbridgeTotalCost;

    return {
      traditionalAgencyCost,
      traditionalInternalTimeCost,
      traditionalTotalCost,
      skillbridgeFee,
      netSavings,
      traditionalRatePct: 18,
      skillbridgeRatePct: 11,
    };
  }, [calculatorRal, internalInterviewHours]);

  // Lead Generation Form State
  const [leadName, setLeadName] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadRoleNeeded, setLeadRoleNeeded] = useState('Supply Chain & Operations Specialist');
  const [leadNotes, setLeadNotes] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Candidate Token Submission Handler
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

  // Lead Form Submission Handler
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLead(true);
    setLeadError(null);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_name: leadName,
          company_name: leadCompany,
          email: leadEmail,
          phone: leadPhone || undefined,
          province: 'Nord Italia',
          role: 'Direzione Operations / HR',
          role_needed: leadRoleNeeded,
          estimated_ral: calculatorRal,
          notes: leadNotes || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Impossibile inviare la richiesta. Riprova tra poco.');
      }

      setLeadSuccess(true);
    } catch (err: any) {
      setLeadError(err.message || 'Errore di connessione.');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const faqs = [
    {
      q: 'Come sono strutturate le simulazioni da 25 minuti?',
      a: 'Ogni candidato viene catapultato in un\'anomalia di stabilimento reale (es. fermo linea per rottura fornitore primario, saturazione MRP, calcolo lotti ROP). Ha 25 minuti per consultare giacenze, costi orari di fermo e lead time, calcolare i valori esatti di riordino e redigere una memo strategica per il Plant Director.',
    },
    {
      q: 'Come garantite che il candidato non bari usando ChatGPT o smartphone?',
      a: 'L\'ambiente di test è blindato dal nostro protocollo anti-cheat: blocco totale di copia, incolla e screenshot, inibizione devtools, allerta a tutto schermo in caso di switch finestra o defocus, e proctoring continuo via webcam con indicatore REC attivo per scongiurare l\'uso di secondi monitor o dispositivi ausiliari.',
    },
    {
      q: 'Cosa riceve il Plant Director o il Responsabile HR?',
      a: 'Una Scorecard Esecutiva di 1 singola pagina A4 (stampabile o condivisibile). Riassume in 3 minuti di lettura: punteggio deterministico sui calcoli matematici (0-70 pt), punteggio semantico AI sulla qualità della decisione (0-30 pt), testo integrale della memo redatta e attestazione di integrità con telemetria anti-cheat.',
    },
    {
      q: 'Come funziona la Garanzia Rischio Zero a 90 Giorni?',
      a: 'Zero costi di attivazione, zero anticipi e zero canoni mensili. Ricevi e incontri i 3 profili pre-selezionati senza impegno. La commissione di successo (11% RAL in fase di lancio) viene fatturata esclusivamente al 90° giorno, dopo la conferma del superamento del periodo di prova. Se il candidato non supera la prova, non devi nulla.',
    },
    {
      q: 'E se il candidato assunto si dimette nei primi mesi?',
      a: 'Offriamo una clausola di sostituzione gratuita a 180 giorni. Se la risorsa lascia l\'azienda entro 6 mesi per qualsiasi motivo, avviamo immediatamente una nuova sessione di pre-valutazione e ti forniamo un candidato alternativo senza costi aggiuntivi.',
    },
    {
      q: 'In quali settori e ruoli industriali siete specializzati?',
      a: 'Copriamo 4 aree cardine della manifattura con 20 simulazioni verticali: Supply Chain Specialist, Pianificatore MRP/MPS, Buyer Tecnico Procurement e Process & Lean Manufacturing Engineer. Operiamo primariamente sui distretti del Nord Italia (Automotive, Packaging, Meccanica di Precisione, Meccatronica).',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* ==================================================================== */}
      {/* 1. TOP INDUSTRIAL NAVIGATION BAR                                     */}
      {/* ==================================================================== */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 bg-slate-900 group-hover:bg-blue-600 rounded-md flex items-center justify-center font-mono font-bold text-white text-sm tracking-wider transition-colors shadow-sm">
                SB
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold tracking-tight text-slate-900 text-base">
                    SkillBridge
                  </span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                    Operations
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono hidden sm:block">
                  Industrial Pre-Employment Testing
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold text-slate-600">
            <a href="#come-funziona" className="hover:text-blue-600 transition-colors">
              Come Funziona
            </a>
            <a href="#scenari" className="hover:text-blue-600 transition-colors">
              I 20 Scenari
            </a>
            <a href="#anti-cheat" className="hover:text-blue-600 transition-colors">
              Anti-Cheat &amp; Video
            </a>
            <a href="#scorecard-demo" className="hover:text-blue-600 transition-colors">
              Scorecard Esempio
            </a>
            <a href="#calcolatore" className="hover:text-blue-600 transition-colors">
              Calcola Risparmio
            </a>
            <a href="#garanzia" className="hover:text-blue-600 transition-colors">
              Garanzia 90gg
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
            {/* Candidate Portal Modal Trigger */}
            <button
              onClick={() => setIsCandidateModalOpen(true)}
              className="px-3 py-1.5 rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 font-semibold font-mono transition-colors cursor-pointer flex items-center space-x-1"
            >
              <Terminal className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Area Candidati</span>
              <span className="sm:hidden">Test</span>
            </button>

            {/* Primary B2B Action Button */}
            <a
              href="#richiedi"
              className="inline-flex items-center px-4 py-2 rounded-md font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all hover:shadow-blue-600/20 active:scale-[0.98] cursor-pointer"
            >
              <span>Richiedi 3 Profili</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </a>
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* 2. HERO SECTION: HIGH-CONVERTING CRO VALUE PROPOSITION                */}
      {/* ==================================================================== */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200 pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Subtle engineering blueprint grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Trust Pill */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs text-slate-700 font-mono shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-900 uppercase tracking-wide">
                20 Simulazioni Attive &bull; Nord Italia
              </span>
              <span className="text-slate-400 hidden sm:inline">&bull;</span>
              <span className="text-slate-600 hidden sm:inline">
                Supply Chain, MRP, Buyer &amp; Lean
              </span>
            </div>
          </div>

          {/* Main Headline & Subheadline */}
          <div className="text-center max-w-4xl mx-auto mb-10">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.1] uppercase">
              Basta CV abbelliti e colloqui a vuoto.{' '}
              <span className="text-blue-600 block mt-1">
                Assumi ingegneri testati su fermi linea reali.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Ricevi entro <strong>7 giorni</strong> 3 profili in Ingegneria Gestionale e Operations,
              già valutati su una simulazione da 25 minuti con <strong>video proctoring anti-cheat</strong> e
              doppio grading matematico. <strong>Fattura emessa solo al 90° giorno</strong> se il candidato supera il periodo di prova.
            </p>
          </div>

          {/* Dual Primary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto mb-12">
            <a
              href="#richiedi"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-md font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-md hover:shadow-blue-600/25 transition-all text-center cursor-pointer"
            >
              <span>Richiedi 3 Profili per il Tuo Stabilimento</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>

            <Link
              href="/scorecard/33333333-3333-4333-8333-333333333333"
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3.5 rounded-md font-bold text-sm text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 transition-colors text-center cursor-pointer shadow-xs"
            >
              <BarChart3 className="w-4 h-4 mr-2 text-blue-600" />
              <span>Scorecard Esempio (88/100)</span>
            </Link>
          </div>

          {/* Value Props Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-6 border-t border-slate-200 text-xs font-mono text-slate-600 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Grading Oggettivo 0-100 pt</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Telemetria &amp; Webcam Anti-Cheat</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Garanzia Totale Rischio Zero 90gg</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. SOCIAL PROOF & INDUSTRIAL CLUSTERS STRIP                          */}
      {/* ==================================================================== */}
      <section className="bg-slate-900 text-white py-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center space-x-2 text-slate-400">
              <Factory className="w-4 h-4 text-blue-400" />
              <span className="uppercase font-semibold tracking-wider text-slate-300">
                Calibrato sui flussi dei distretti manifatturieri:
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-slate-300">
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
                Automotive &bull; Brescia &amp; Modena
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
                Packaging &bull; Bologna
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
                Meccanica di Precisione &bull; Bergamo &amp; Vicenza
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
                Meccatronica &bull; Milano &amp; Torino
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. SHOWCASE TEASER: DUAL VIEW (COCKPIT VS SCORECARD)                 */}
      {/* ==================================================================== */}
      <section id="scorecard-demo" className="py-16 lg:py-24 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-700 bg-blue-100 px-3 py-1 rounded-md border border-blue-200 font-bold">
              LA DOPPIA PROSPETTIVA OPERATIVA
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 uppercase tracking-tight">
              Cosa affronta il candidato &bull; Cosa riceve il Plant Director
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
              Dalla simulazione cronometrata sotto pressione alla scorecard di 1 pagina per decidere in 3 minuti se incontrare il candidato.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* View 1: Candidate Cockpit Teaser */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase text-slate-800">
                      1. Cockpit Candidato (25 Minuti)
                    </span>
                  </div>
                  <span className="text-xs font-mono text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    ● REC Proctoring Attivo
                  </span>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-md font-mono text-xs space-y-3 mb-4">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                    <span>SCENARIO: SKB-V104 (Valvola V-104)</span>
                    <span className="text-amber-400">⏱ TEMPO: 24:18</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans text-xs">
                    <em>&quot;Il fornitore storico ha subito un guasto alla linea di trafilatura. Il lead time ordinario di 6 gg è slittato a 14 gg. La linea di montaggio consuma 40 u/giorno (costo fermo: 1.200 €/ora). Calcola il deficit e decidi il lotto celere.&quot;</em>
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block">Scorte Attuali:</span>
                      <span className="text-white font-bold">360 unità</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block">Costo Fermo Linea:</span>
                      <span className="text-red-400 font-bold">9.600 € / turno</span>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Calcolo deterministico giorno di stockout e giorni di fermo linea.</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Redazione motivazione economica per il Plant Director (&ge; 80 parole).</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Protezione attiva: copia, incolla, tasti ispezione e screenshot bloccati.</span>
                  </li>
                </ul>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => selectPresetToken('demo-candidate-1')}
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-md font-semibold text-xs text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                  <span>Test-Drive Simulazione V-104 (Demo Candidato)</span>
                </button>
              </div>
            </div>

            {/* View 2: Executive Scorecard Teaser */}
            <div className="bg-white border-2 border-blue-600/40 rounded-lg p-6 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono font-bold uppercase text-slate-800">
                      2. Scorecard Esecutiva Ricevuta (1 Pagina A4)
                    </span>
                  </div>
                  <span className="text-xs font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                    88/100 &bull; CONSIGLIATO
                  </span>
                </div>

                {/* Score Breakdown preview */}
                <div className="bg-slate-50 border border-slate-200 rounded-md p-4 space-y-3 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">1. Calcolo Matematico Deterministico:</span>
                    <span className="font-mono font-bold text-blue-700">65 / 70 pt</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '92%' }} />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-semibold text-slate-700">2. Qualità Decisionale &amp; Trade-off (AI):</span>
                    <span className="font-mono font-bold text-indigo-700">23 / 30 pt</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: '76%' }} />
                  </div>

                  {/* Anti-cheat audit mini card */}
                  <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded text-[11px] font-mono text-emerald-900 flex items-center justify-between">
                    <span className="flex items-center">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      Integrità Sessione: 100%
                    </span>
                    <span>Webcam REC &bull; 0 Violazioni</span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Decisione in 3 minuti senza leggere 50 pagine di CV generici.</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Memo integrale del candidato pronta per il confronto tecnico al colloquio.</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Pulsante diretto per richiedere colloquio conoscitivo in 1 clic.</span>
                  </li>
                </ul>
              </div>

              <div>
                <Link
                  href="/scorecard/33333333-3333-4333-8333-333333333333"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-md font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-colors cursor-pointer"
                >
                  <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
                  <span>Apri la Scorecard Dimostrativa Completa (88/100)</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. METHOD COMPARISON: TRADITIONAL AGENCIES VS SKILLBRIDGE            */}
      {/* ==================================================================== */}
      <section id="come-funziona" className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-600 bg-slate-100 px-3 py-1 rounded-md border border-slate-200 font-bold">
              IL CONFRONTO SUL CAMPO
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 uppercase tracking-tight">
              Perché i test tradizionali falliscono in fabbrica
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
              La selezione tecnica tradizionale brucia decine di ore dei tuoi responsabili tecnici senza alcuna certezza sul rendimento pratico del candidato.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* The Old Way */}
            <div className="p-6 sm:p-8 rounded-lg border border-red-200 bg-red-50/40">
              <div className="flex items-center space-x-2 text-red-700 font-bold text-xs uppercase tracking-wider mb-6 pb-3 border-b border-red-200">
                <BadgeAlert className="w-4 h-4" />
                <span>Metodo Tradizionale &bull; Agenzie di Ricerca</span>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start space-x-3">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    ✕
                  </span>
                  <span>
                    <strong>Screening su parole chiave del CV:</strong> Decine di colloqui interni con candidati che sanno citare la teoria ma non hanno mai calcolato un lotto economico d&apos;emergenza.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    ✕
                  </span>
                  <span>
                    <strong>Test a crocette teorici e aggirabili:</strong> Questionari generici compilabili da casa in cui chiunque può usare ChatGPT o farsi aiutare senza controllo visivo.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    ✕
                  </span>
                  <span>
                    <strong>18-20% di RAL fatturata al Giorno 1:</strong> Esborso economico anticipato con l&apos;intero rischio a carico dello stabilimento.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    ✕
                  </span>
                  <span>
                    <strong>20-30 ore perse dal Plant Director:</strong> Interviste lunghe e ripetitive per verificare se il candidato sa fare calcoli elementari.
                  </span>
                </li>
              </ul>
            </div>

            {/* The SkillBridge Way */}
            <div className="p-6 sm:p-8 rounded-lg border-2 border-blue-600/50 bg-blue-50/30 shadow-sm relative">
              <div className="flex items-center space-x-2 text-blue-900 font-bold text-xs uppercase tracking-wider mb-6 pb-3 border-b border-blue-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>SkillBridge &bull; Operations Pre-Employment Engine</span>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-slate-800">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Simulazione di stabilimento di 25 min:</strong> Il candidato deve risolvere un deficit di fornitura con numeri reali, vincoli MOQ e costi orari di fermo.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Doppio Grading Deterministico + AI:</strong> 0-70 pt sui calcoli numerici esatti + 0-30 pt sulla capacità di sintesi per la Direzione.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Fattura solo al Giorno 90:</strong> Zero anticipi. Paghi la commissione agevolata (11% RAL) solo al superamento confermato del periodo di prova.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Decisione in 3 minuti via Scorecard A4:</strong> Incontri solo i candidati con score &ge; 75/100 che hanno dimostrato competenze reali.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 6. THE 20 SCENARIOS MATRIX (THE INDUSTRIAL CATALOG)                  */}
      {/* ==================================================================== */}
      <section id="scenari" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-700 bg-blue-100 px-3 py-1 rounded-md border border-blue-200 font-bold">
              CATALOGO SIMULAZIONI &bull; 20 SCENARI INDUSTRIALI
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 uppercase tracking-tight">
              Test Pratici nei 4 Ruoli Chiave della Fabbrica
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              5 simulazioni operative distinte per ogni ruolo. Parametri matematici dinamici anti-copia, costi orari di fermo linea e grading trasparente.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              type="button"
              onClick={() => setSelectedCategory('supply_chain')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-md text-xs font-mono font-semibold transition-all cursor-pointer ${
                selectedCategory === 'supply_chain'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <Factory className="w-4 h-4 text-blue-500" />
              <span>Supply Chain &amp; Operations (5)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('production_planning')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-md text-xs font-mono font-semibold transition-all cursor-pointer ${
                selectedCategory === 'production_planning'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <Boxes className="w-4 h-4 text-emerald-500" />
              <span>Pianificazione MRP &amp; MPS (5)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('procurement')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-md text-xs font-mono font-semibold transition-all cursor-pointer ${
                selectedCategory === 'procurement'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <Cpu className="w-4 h-4 text-sky-500" />
              <span>Buyer Tecnico &amp; Procurement (5)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('lean_process')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-md text-xs font-mono font-semibold transition-all cursor-pointer ${
                selectedCategory === 'lean_process'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Process &amp; Lean Manufacturing (5)</span>
            </button>
          </div>

          {/* Scenarios Grid for Active Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SCENARIO_CATALOG.filter((sc) => sc.category === selectedCategory).map((sc) => {
              const code = sc.id.split('-')[1]?.toUpperCase() || 'V104';
              return (
                <div
                  key={sc.id}
                  className="bg-white border border-slate-200 hover:border-blue-400 transition-all rounded-lg p-5 flex flex-col justify-between shadow-xs hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        SKB-{code}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {sc.difficulty} &bull; 25 MIN
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                      {sc.title}
                    </h3>
                    <div className="text-[11px] text-blue-600 font-semibold mb-2">
                      {sc.role}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {sc.summary}
                    </p>

                    <div className="space-y-1 py-2.5 border-t border-slate-100 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400">Componente:</span>
                        <span className="font-mono font-semibold text-slate-800">{sc.partNumber}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400">Reparto Linea:</span>
                        <span className="font-mono text-slate-800 truncate max-w-[170px]">
                          {sc.productionLine}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400">Danno Fermo Linea:</span>
                        <span className="font-mono font-bold text-red-600">
                          {sc.downtimeCostPerHour.toLocaleString('it-IT')} € / ora
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-3">
                    <button
                      type="button"
                      onClick={() => selectPresetToken(`demo-${sc.id}`)}
                      className="w-full inline-flex items-center justify-center px-3 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <span>Prova Simulazione ({sc.partNumber})</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 7. ANTI-CHEAT & VIDEO PROCTORING DEEP DIVE (TRUST ENGINE)            */}
      {/* ==================================================================== */}
      <section id="anti-cheat" className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-md border border-emerald-200 font-bold">
              SICUREZZA &bull; AMBIENTE ZERO-CHEAT
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 uppercase tracking-tight">
              Test Blindato: Nessun Aiuto Esterno o ChatGPT
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
              Il protocollo proprietario di SkillBridge garantisce che i punteggi riflettano esclusivamente la preparazione autentica del candidato alla propria postazione.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="p-5 rounded-lg border border-slate-200 bg-slate-50 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase">
                Proctoring Video Continuo
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pre-flight check della webcam prima del test e live PiP stream con registrazione attiva per impedire la consultazione di smartphone, tablet o persone terze.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-5 rounded-lg border border-slate-200 bg-slate-50 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase">
                Blocco Totale Copia &amp; Incolla
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clipboard disabilitata: impossibile incollare testi generati da AI esterne o copiare il problema. La motivazione decisionale dev&apos;essere redatta manualmente.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-5 rounded-lg border border-slate-200 bg-slate-50 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase">
                Scudo Anti-Screenshot &amp; F12
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tasto PrintScreen azzera istantaneamente la memoria e oscura lo schermo con allerta. Shortcut di ispezione browser e scorciatoie sviluppatore intercettate.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-5 rounded-lg border border-slate-200 bg-slate-50 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center">
                <Monitor className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase">
                Rilevamento Defocus &amp; Tab Switch
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Se il candidato abbandona la finestra o apre un&apos;altra applicazione, scatta un overlay a tutto schermo e l&apos;uscita viene registrata nel log d&apos;integrità.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 8. INTERACTIVE ROI & COST SAVINGS CALCULATOR                         */}
      {/* ==================================================================== */}
      <section id="calcolatore" className="py-16 lg:py-24 bg-slate-100 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-700 bg-blue-100 px-3 py-1 rounded-md border border-blue-200 font-bold">
              CALCOLATORE ECONOMICO &bull; ROI DIRETTO
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 uppercase tracking-tight">
              Quanto risparmi rispetto a un cacciatore tradizionale
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Sposta lo slider sulla RAL prevista per confrontare i costi di agenzia e le ore interne risparmiate.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Sliders Input */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      RAL Prevista del Profilo da Assumere:
                    </label>
                    <span className="text-base font-bold font-mono text-blue-600">
                      {calculatorRal.toLocaleString('it-IT')} €
                    </span>
                  </div>
                  <input
                    type="range"
                    min={24000}
                    max={55000}
                    step={1000}
                    value={calculatorRal}
                    onChange={(e) => setCalculatorRal(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
                    <span>24.000 € (Junior)</span>
                    <span>36.000 € (Mid)</span>
                    <span>55.000 € (Senior Lead)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Ore Interne di Colloquio Tecnico Evitate:
                    </label>
                    <span className="text-base font-bold font-mono text-slate-900">
                      {internalInterviewHours} ore
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    step={2}
                    value={internalInterviewHours}
                    onChange={(e) => setInternalInterviewHours(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Tempo risparmiato dal Direttore di Stabilimento e Responsabile Operations (stima: €65/ora).
                  </span>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-900 space-y-1">
                  <span className="font-bold block uppercase text-[11px]">
                    Garanzia Cassa a Rischio Zero:
                  </span>
                  <span>
                    Con le agenzie tradizionali paghi il 18% al Giorno 1. Con SkillBridge paghi l&apos;11% <strong>solo dopo 90 giorni</strong> a conferma del periodo di prova.
                  </span>
                </div>
              </div>

              {/* Live Cost Comparison Matrix */}
              <div className="bg-slate-900 text-white rounded-lg p-6 space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-[11px] font-mono text-slate-400 uppercase block">
                    Confronto Economico Diretto
                  </span>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                    Risparmio Netto: +{roiData.netSavings.toLocaleString('it-IT')} €
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Costo Agenzia Tradizionale (18% RAL):</span>
                    <span className="font-mono text-red-400 font-bold">
                      {roiData.traditionalAgencyCost.toLocaleString('it-IT')} €
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Valore Ore Interne Risparmiate:</span>
                    <span className="font-mono text-slate-300">
                      {roiData.traditionalInternalTimeCost.toLocaleString('it-IT')} €
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800 font-semibold">
                    <span className="text-slate-200">Costo Totale Agenzia Tradizionale:</span>
                    <span className="font-mono text-red-400 font-bold">
                      {roiData.traditionalTotalCost.toLocaleString('it-IT')} €
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1 text-sm font-bold text-white bg-slate-800 p-2.5 rounded">
                    <span className="text-emerald-400">SkillBridge Pilot (11% a 90gg):</span>
                    <span className="font-mono text-emerald-400">
                      {roiData.skillbridgeFee.toLocaleString('it-IT')} €
                    </span>
                  </div>
                </div>

                <a
                  href="#richiedi"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-md font-bold text-xs text-slate-900 bg-white hover:bg-slate-100 transition-colors text-center cursor-pointer shadow-sm"
                >
                  <span>Blocca la Tariffa Pilot (11%) per il Tuo Stabilimento</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 9. GRAND SLAM OFFER & 90-DAY RISK REVERSAL GUARANTEE                 */}
      {/* ==================================================================== */}
      <section id="garanzia" className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 text-white rounded-xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
            <div className="max-w-3xl">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/90 px-3 py-1 rounded-md border border-emerald-800 font-bold">
                PROGRAMMA &quot;LINEA APERTA&quot; &bull; GARANZIA 100% RISCHIO ZERO
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-4 uppercase tracking-tight">
                Paghi solo se il candidato supera i 90 giorni di prova.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
                Abbiamo eliminato qualsiasi rischio economico per l&apos;azienda. Non chiediamo canoni, non vincoliamo ad esclusive e non emettiamo fattura prima del superamento del periodo di prova.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-1.5 flex-shrink-0" />
                    Zero Costi d&apos;Avvio o Canoni
                  </h4>
                  <p className="text-xs text-slate-400">
                    Ricevi 3 candidature pre-valutate con relative Scorecard senza alcun pagamento anticipato.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-1.5 flex-shrink-0" />
                    Fattura Solo al Giorno 90
                  </h4>
                  <p className="text-xs text-slate-400">
                    Se durante i primi 3 mesi di prova il candidato non soddisfa le aspettative, il servizio è gratuito.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-1.5 flex-shrink-0" />
                    Sostituzione Gratuita a 180gg
                  </h4>
                  <p className="text-xs text-slate-400">
                    Se la risorsa si dimette entro 6 mesi, ti forniamo un candidato alternativo senza costi ulteriori.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-1.5 flex-shrink-0" />
                    Tariffa Pilot 11% RAL
                  </h4>
                  <p className="text-xs text-slate-400">
                    Condizione speciale riservata alle aziende che attivano una selezione questo mese (standard di mercato: 18-20%).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 10. DIRECT B2B CONVERSION LEAD FORM ("RICHIEDI 3 PROFILI")           */}
      {/* ==================================================================== */}
      <section id="richiedi" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-700 bg-blue-100 px-3 py-1 rounded-md border border-blue-200 font-bold">
              MODULO DI CONTATTO DIRETTO PER AZIENDE
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 uppercase tracking-tight">
              Richiedi 3 Profili Pre-Valutati Entro 7 Giorni
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Nessun impegno contrattuale. Descrivi la posizione ricercata: il nostro team ti invierà le scorecard dei primi candidati idonei.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
            {leadSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-emerald-950 uppercase">
                  Richiesta Acquisita con Successo
                </h3>
                <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                  Grazie {leadName}! Il nostro team operations ha preso in carico la ricerca per{' '}
                  <strong>{leadCompany}</strong> ({leadRoleNeeded}). Riceverai le prime scorecard entro 48-72 ore.
                </p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Nome &amp; Cognome *
                    </label>
                    <input
                      type="text"
                      required
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="Es. Ing. Marco Rossi"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Azienda Manifatturiera *
                    </label>
                    <input
                      type="text"
                      required
                      value={leadCompany}
                      onChange={(e) => setLeadCompany(e.target.value)}
                      placeholder="Es. Brembo S.p.A. / Barilla / IMA"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Email Aziendale *
                    </label>
                    <input
                      type="email"
                      required
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="m.rossi@azienda.it"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Recapito Telefonico (Opzionale)
                    </label>
                    <input
                      type="tel"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="+39 340 000 0000"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Ruolo Operativo Ricercato *
                  </label>
                  <select
                    value={leadRoleNeeded}
                    onChange={(e) => setLeadRoleNeeded(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-sans"
                  >
                    <option value="Supply Chain & Operations Specialist">
                      Supply Chain &amp; Operations Specialist (Scorte &amp; Fermo Linea)
                    </option>
                    <option value="Pianificatore della Produzione MRP & MPS">
                      Pianificatore della Produzione MRP &amp; MPS (Schedulazione &amp; Capacità)
                    </option>
                    <option value="Buyer Tecnico & Procurement Industriale">
                      Buyer Tecnico &amp; Procurement Industriale (Sourcing &amp; Negoziazione)
                    </option>
                    <option value="Ingegnere di Processo & Lean Manufacturing">
                      Ingegnere di Processo &amp; Lean Manufacturing (OEE, SMED &amp; Tempi/Metodi)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Specifiche dello Stabilimento / Note (Opzionale)
                  </label>
                  <textarea
                    rows={3}
                    value={leadNotes}
                    onChange={(e) => setLeadNotes(e.target.value)}
                    placeholder="Es. Stabilimento di Bergamo. Linee automatiche a turno continuo. Urgenza inserimento entro fine trimestre..."
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans leading-relaxed"
                  />
                </div>

                {leadError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
                    {leadError}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingLead}
                    className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-md font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-md cursor-pointer"
                  >
                    {isSubmittingLead ? (
                      <span className="flex items-center space-x-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Invio Richiesta in Corso...</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1.5">
                        <span>INVIA RICHIESTA &bull; RICEVI I PRIMI 3 PROFILI</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    )}
                  </button>
                  <p className="text-[11px] text-slate-500 text-center mt-2 font-mono">
                    Zero anticipi &bull; Fattura solo al 90° giorno &bull; Privacy GDPR garantita
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 11. FAQ ACCORDION (OBJECTION HANDLING)                               */}
      {/* ==================================================================== */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-600 bg-slate-100 px-3 py-1 rounded-md border border-slate-200 font-bold">
              DOMANDE FREQUENTI
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 uppercase tracking-tight">
              Tutto quello che c&apos;è da sapere su SkillBridge
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transform transition-transform ${
                      openFaq === idx ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 12. INSTITUTIONAL FOOTER                                             */}
      {/* ==================================================================== */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center space-x-2 font-bold text-white text-sm">
                <span className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center font-mono text-xs">
                  SB
                </span>
                <span>SkillBridge Operations Engineering</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Piattaforma di pre-employment testing per l&apos;Ingegneria Gestionale e di Fabbrica.
                Validazione oggettiva delle competenze operative con simulazioni industriali e grading deterministico.
              </p>
              <div className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1.5 pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Piattaforma Attiva &bull; 20 Scenari &bull; Anti-Cheat Certificato</span>
              </div>
            </div>

            <div>
              <div className="font-mono uppercase text-slate-300 font-semibold text-[11px] tracking-wider mb-3">
                Scorciatoie &amp; Demo
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/scorecard/33333333-3333-4333-8333-333333333333" className="hover:text-white transition-colors">
                    Scorecard Dimostrativa (88/100)
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => selectPresetToken('demo-candidate-1')}
                    className="hover:text-white text-left transition-colors cursor-pointer"
                  >
                    Simulazione V-104 (Supply Chain)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => selectPresetToken('demo-candidate-2')}
                    className="hover:text-white text-left transition-colors cursor-pointer"
                  >
                    Simulazione P-200 (MRP Planner)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => selectPresetToken('demo-candidate-4')}
                    className="hover:text-white text-left transition-colors cursor-pointer"
                  >
                    Simulazione E-501 (Buyer Tecnico)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => selectPresetToken('demo-candidate-5')}
                    className="hover:text-white text-left transition-colors cursor-pointer"
                  >
                    Simulazione M-300 (Lean Engineer)
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-mono uppercase text-slate-300 font-semibold text-[11px] tracking-wider mb-3">
                Amministrazione
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/admin" className="hover:text-amber-400 transition-colors">
                    Dashboard Founder &amp; Recruiter
                  </Link>
                </li>
                <li>
                  <a href="#calcolatore" className="hover:text-white transition-colors">
                    Calcolatore ROI &amp; Risparmio
                  </a>
                </li>
                <li>
                  <a href="#garanzia" className="hover:text-white transition-colors">
                    Garanzia &quot;Linea Aperta&quot; 90gg
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
            <div>&copy; 2026 SkillBridge Operations. Tutti i diritti riservati.</div>
            <div>Protocollo Anti-Cheat &bull; Video Proctoring &bull; 0-100 Grading</div>
          </div>
        </div>
      </footer>

      {/* ==================================================================== */}
      {/* 13. CANDIDATE ACCESS MODAL (CLEAN & NON-INTRUSIVE)                   */}
      {/* ==================================================================== */}
      {isCandidateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold uppercase tracking-tight text-slate-900">
                  Accesso Cockpit Candidato
                </h3>
              </div>
              <button
                onClick={() => setIsCandidateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Hai ricevuto un invito da un&apos;azienda partner? Inserisci il tuo token di sessione per accedere alla sala briefing ed effettuare il check della videocamera.
            </p>

            <form onSubmit={handleLaunchAssessment} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-500 mb-1">
                  Token Invito Sessione:
                </label>
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Es. demo-candidate-1"
                  className="w-full px-3 py-2 font-mono text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {tokenError && (
                  <p className="text-xs text-red-600 mt-1 flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{tokenError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-md transition-colors cursor-pointer"
              >
                Accedi al Cockpit di Prova
              </button>
            </form>

            <div className="pt-3 border-t border-slate-200">
              <span className="text-[10px] font-mono text-slate-500 block mb-2 uppercase">
                Oppure prova una sessione benchmark demo:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => selectPresetToken('demo-candidate-1')}
                  className="p-1.5 text-left rounded bg-slate-100 hover:bg-slate-200 text-slate-800 truncate"
                >
                  &bull; V-104 Supply Chain
                </button>
                <button
                  type="button"
                  onClick={() => selectPresetToken('demo-candidate-2')}
                  className="p-1.5 text-left rounded bg-slate-100 hover:bg-slate-200 text-slate-800 truncate"
                >
                  &bull; P-200 MRP Planner
                </button>
                <button
                  type="button"
                  onClick={() => selectPresetToken('demo-candidate-4')}
                  className="p-1.5 text-left rounded bg-slate-100 hover:bg-slate-200 text-slate-800 truncate"
                >
                  &bull; E-501 Buyer Tecnico
                </button>
                <button
                  type="button"
                  onClick={() => selectPresetToken('demo-candidate-5')}
                  className="p-1.5 text-left rounded bg-slate-100 hover:bg-slate-200 text-slate-800 truncate"
                >
                  &bull; M-300 Lean Engineer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
