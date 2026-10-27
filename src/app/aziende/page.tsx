'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Factory,
  ShieldCheck,
  Calculator,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ChevronDown,
  Building2,
  PhoneCall,
  Lock,
  BadgePercent,
  Check,
  AlertTriangle,
  Zap,
  BarChart3,
  HelpCircle
} from 'lucide-react';

export default function AziendeLandingPage() {
  // Calculator States
  const [ral, setRal] = useState<number>(30000);
  const [internalHours, setInternalHours] = useState<number>(25);
  const [downtimeCost, setDowntimeCost] = useState<number>(1200);

  // Form States
  const [contactName, setContactName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [province, setProvince] = useState<string>('Brescia');
  const [role, setRole] = useState<string>('Direttore di Stabilimento');
  const [roleNeeded, setRoleNeeded] = useState<string>('Pianificatore della Produzione / Supply Chain');
  const [notes, setNotes] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Dynamic Calculations for ROI
  const calculations = useMemo(() => {
    const traditionalFeeRate = 0.18; // 18% standard headhunter
    const pilotFeeRate = 0.11; // 11% SkillBridge Pilot
    const internalHourlyRate = 60; // €60/hr cost of plant manager/HR time

    const traditionalAgencyCost = Math.round(ral * traditionalFeeRate);
    const traditionalTimeCost = internalHours * internalHourlyRate;
    const traditionalTotalCost = traditionalAgencyCost + traditionalTimeCost;

    const skillbridgeFee = Math.round(ral * pilotFeeRate);
    const skillbridgeTimeCost = 0; // Pre-vetted profiles + 3-min scorecard
    const skillbridgeTotalCost = skillbridgeFee + skillbridgeTimeCost;

    const netSavings = traditionalTotalCost - skillbridgeTotalCost;
    const cashAtRiskDay1 = traditionalAgencyCost; // Traditional requires upfront invoicing

    return {
      traditionalAgencyCost,
      traditionalTimeCost,
      traditionalTotalCost,
      skillbridgeFee,
      skillbridgeTotalCost,
      netSavings,
      cashAtRiskDay1,
    };
  }, [ral, internalHours]);

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_name: contactName,
          company_name: companyName,
          email,
          phone: phone || undefined,
          province,
          role,
          role_needed: roleNeeded,
          estimated_ral: ral,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Errore durante l\'invio della richiesta');
      }

      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Si è verificato un errore imprevisto. Riprova più tardi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'Come funziona la Garanzia 100% a 90 Giorni?',
      a: 'Nessun costo di attivazione o canone iniziale. Fai il colloquio conoscitivo con i candidati, decidi se assumere e la fattura di selezione viene emessa unicamente al 90° giorno, dopo che il candidato ha superato con successo il periodo di prova. Se il candidato non funziona o viene interrotto prima, paghi esattamente zero.',
    },
    {
      q: 'Cosa succede se il candidato assunto si dimette dopo il periodo di prova?',
      a: 'Includiamo la Garanzia Estesa di Sostituzione Gratuita a 180 giorni. Se il candidato assunto rassegna le dimissioni volontarie entro i primi 6 mesi, SkillBridge avvia immediatamente la selezione e ti fornisce un nuovo candidato qualificato senza alcun costo aggiuntivo.',
    },
    {
      q: 'Siamo vincolati da contratti di esclusiva o accordi quadro pluriennali?',
      a: 'Assolutamente no. Operiamo con un mandato snello di 1 pagina per singola vacancy. Non hai vincoli di esclusiva: se trovi un candidato idoneo per conto tuo o tramite altri canali interni prima della nostra presentazione, non ci devi nulla.',
    },
    {
      q: 'Come prevenite che i candidati usino ChatGPT o si facciano aiutare da casa?',
      a: 'La nostra cockpit proprietaria integra un triplo livello di protezione anti-cheat: parametri numerici generati dinamicamente per singolo candidato con seed matematico, blocco dell\'incolla per le risposte analitiche e telemetria continua sul cambio finestra (defocus/blur tracking) visibile direttamente nella scorecard.',
    },
    {
      q: 'Da dove provengono i vostri candidati in Ingegneria Gestionale?',
      a: 'Abbiamo partnership di sourcing diretto con le associazioni studentesche e i dipartimenti di Ingegneria Gestionale del Politecnico di Milano (PoliMi), Politecnico di Torino (PoliTo), Università di Bologna (UNIBO) e ITS Meccatronica/Logistica del Nord Italia.',
    },
    {
      q: 'Quali sono le tempistiche tipiche per ricevere i primi profili?',
      a: 'Dal momento in cui confermiamo la vacancy e i vincoli di stabilimento, consegniamo i primi 3 candidati pre-validati con scorecard tecnica completa entro 7 giorni lavorativi.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Industrial Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-9 h-9 bg-blue-600 rounded-md flex items-center justify-center font-mono font-black text-white text-base shadow-sm hover:bg-blue-500 transition-colors"
            >
              SB
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-lg">SkillBridge</span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                  Per Aziende & Plant Directors
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Recruiting Tecnico Pre-Validato per Supply Chain & Operations
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-2 sm:gap-4 text-xs font-medium">
            <a href="#calcolatore" className="text-slate-400 hover:text-white transition-colors hidden md:inline-block px-2 py-1">
              Calcolatore ROI
            </a>
            <a href="#metodo" className="text-slate-400 hover:text-white transition-colors hidden md:inline-block px-2 py-1">
              Come Funziona
            </a>
            <a href="#faq" className="text-slate-400 hover:text-white transition-colors hidden lg:inline-block px-2 py-1">
              FAQ
            </a>
            <Link
              href="/scorecard/33333333-3333-4333-8333-333333333333"
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 border border-slate-700 flex items-center gap-1.5 transition-all text-xs font-semibold"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Scorecard Demo</span>
            </Link>
            <a
              href="#richiedi"
              className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              Richiedi Candidati
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800 pt-12 pb-20 lg:pt-20 lg:pb-28 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Overline Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-blue-400 uppercase tracking-wider text-[11px] font-bold">
                Programma Pilota &quot;Linea Aperta&quot;
              </span>
              <span className="text-slate-400 hidden sm:inline">•</span>
              <span className="text-slate-300 hidden sm:inline">
                Distretti Meccatronici Lombardia & Emilia-Romagna
              </span>
            </div>
          </div>

          {/* Headline & Subheadline */}
          <div className="text-center max-w-4xl mx-auto mb-10">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase font-sans leading-tight">
              Una linea ferma costa 1.200 € all&apos;ora.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 mt-2">
                Assumi solo ingegneri testati sul campo.
              </span>
            </h1>
            <p className="mt-6 text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Ricevi 3 profili junior in Ingegneria Gestionale entro 7 giorni, già valutati su una
              simulazione di fermo linea da 25 minuti con grading matematico deterministico.
              Zero costi d&apos;avvio, colloqui conoscitivi gratuiti e fattura a 90 giorni solo se confermati.
            </p>
          </div>

          {/* Value Highlights Pill Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10 text-center font-mono text-xs">
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg">
              <div className="text-emerald-400 font-bold">GARANZIA 90 GG</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Fattura solo a prova superata</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg">
              <div className="text-blue-400 font-bold">180 GG SOSTITUZIONE</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Copertura dimissioni estesa</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg">
              <div className="text-sky-400 font-bold">FEE PILOT 11%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Prime 5 aziende manifatturiere</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg">
              <div className="text-amber-400 font-bold">TEST ANTI-CHEAT</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Telemetria & seed parametrici</div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <a
              href="#richiedi"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg hover:shadow-blue-600/25 active:scale-[0.99]"
            >
              <span>Richiedi 3 Candidati a Rischio Zero</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/scorecard/33333333-3333-4333-8333-333333333333"
              target="_blank"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
            >
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span>Esplora Scorecard Reale</span>
            </Link>
          </div>

          <p className="text-[11px] text-slate-500 text-center mt-4">
            Nessun impegno contrattuale né vincolo di esclusiva • 20 minuti di colloquio gratuito
          </p>
        </div>
      </section>

      {/* Interactive Plant Director ROI Calculator */}
      <section id="calcolatore" className="py-20 border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800">
              SIMULATORE DI RISPARMIO ECONOMICO
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-4 uppercase tracking-tight">
              Calcola il Costo Reale della Selezione
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2">
              Confronta il costo certo e il rischio immediato delle agenzie tradizionali con il
              modello di successo a 90 giorni di SkillBridge.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
            {/* Sliders Input Panel */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-lg p-6 sm:p-8 space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span>Parametri Posizione Aziendale</span>
              </h3>

              {/* Slider 1: RAL */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-300 font-medium">RAL Annua Prevista</span>
                  <span className="font-mono font-bold text-blue-400 text-sm">
                    {ral.toLocaleString('it-IT')} €
                  </span>
                </div>
                <input
                  type="range"
                  min="26000"
                  max="42000"
                  step="1000"
                  value={ral}
                  onChange={(e) => setRal(Number(e.target.value))}
                  className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>26.000 € (Junior Entry)</span>
                  <span>42.000 € (Specialist 2+ anni)</span>
                </div>
              </div>

              {/* Slider 2: Internal hours wasted */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-300 font-medium">Ore Interne Perse a Filtrare CV & Colloqui a Vuoto</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    {internalHours} ore
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="45"
                  step="5"
                  value={internalHours}
                  onChange={(e) => setInternalHours(Number(e.target.value))}
                  className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>10 ore (Minimo)</span>
                  <span>45 ore (3 turni con HR e Direzione)</span>
                </div>
              </div>

              {/* Slider 3: Downtime cost per hour */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-300 font-medium">Costo Orario Medio di Fermo Linea / Disruption</span>
                  <span className="font-mono font-bold text-rose-400 text-sm">
                    {downtimeCost.toLocaleString('it-IT')} €/ora
                  </span>
                </div>
                <input
                  type="range"
                  min="800"
                  max="2500"
                  step="100"
                  value={downtimeCost}
                  onChange={(e) => setDowntimeCost(Number(e.target.value))}
                  className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>800 €/ora</span>
                  <span>2.500 €/ora (Packaging/Automotive)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded border border-slate-800 text-[11px] text-slate-400 leading-relaxed font-mono">
                Stima basata su costo orario interno medio del Direttore di Stabilimento/HR (€60/h)
                e tariffe standard di settore pubblicate.
              </div>
            </div>

            {/* Comparison Output Cards */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
              {/* Traditional Headhunter Card */}
              <div className="bg-slate-900/60 border border-rose-950/80 rounded-lg p-5">
                <div className="flex items-center justify-between text-xs pb-3 border-b border-rose-950 text-rose-400 font-mono font-bold">
                  <span>AGENZIA TRADIZIONALE (18% RAL)</span>
                  <span>RISCHIO AL GIORNO 1</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-slate-400">Fee Agenzia (Giorno 1):</div>
                    <div className="text-base font-bold text-white font-mono mt-0.5">
                      {calculations.traditionalAgencyCost.toLocaleString('it-IT')} €
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Ore Interne Perse:</div>
                    <div className="text-base font-bold text-rose-300 font-mono mt-0.5">
                      {calculations.traditionalTimeCost.toLocaleString('it-IT')} €
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-rose-950/60 flex justify-between items-center text-xs">
                  <span className="text-slate-300">Cassa Bloccata Subito:</span>
                  <span className="text-rose-400 font-bold font-mono text-sm">
                    {calculations.traditionalTotalCost.toLocaleString('it-IT')} € a rischio
                  </span>
                </div>
              </div>

              {/* SkillBridge Model Card */}
              <div className="bg-slate-900 border-2 border-emerald-600/70 rounded-lg p-5 relative shadow-xl">
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-800">
                  PILOT -38% FEE
                </div>
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800 text-emerald-400 font-mono font-bold">
                  <span>SKILLBRIDGE LINEA APERTA (11% RAL)</span>
                  <span>RISCHIO GIORNO 1: 0 €</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-slate-400">Fee Successo (Giorno 90):</div>
                    <div className="text-base font-bold text-white font-mono mt-0.5">
                      {calculations.skillbridgeFee.toLocaleString('it-IT')} €
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Anticipo / Canone Iniziale:</div>
                    <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                      0 € (Zero)
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-emerald-950/40 rounded border border-emerald-800/80 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-300 font-mono">Risparmio Diretto Immediato:</div>
                    <div className="text-lg font-black text-emerald-400 font-mono">
                      +{calculations.netSavings.toLocaleString('it-IT')} €
                    </div>
                  </div>
                  <a
                    href="#richiedi"
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold transition-colors"
                  >
                    Blocca Offerta Pilot
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 3-Step Practical Method */}
      <section id="metodo" className="py-20 border-b border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded border border-blue-800">
              IL METODO OPERATIVO
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-4 uppercase tracking-tight">
              Come Funziona per il Tuo Stabilimento
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2">
              Dalla condivisione della vacancy ai 3 candidati pre-validati sulla tua scrivania
              in meno di 7 giorni.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 relative">
              <div className="w-10 h-10 rounded-md bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center font-mono font-bold text-base mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Simulazione Pratica sul Fermo Linea
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                I candidati affrontano lo Scenario Valvola V-104: ritardo critico di 12 giorni di un
                componente chiave, magazzino in esaurimento, vincolo di lotti minimi a 200 pezzi e
                costo di fermo linea da 1.200 €/ora.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 relative">
              <div className="w-10 h-10 rounded-md bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center font-mono font-bold text-base mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Scorecard Matematica & Telemetria
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Ricevi un report sintetico di 1 pagina A4: punteggio deterministico sul calcolo del
                punto di riordino (0-70 pt), valutazione semantica sulla gestione fornitori (0-30 pt)
                e audit anti-cheat su tempo e tentativi di copia.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 relative">
              <div className="w-10 h-10 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center font-mono font-bold text-base mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                20 Minuti di Colloquio & Zero Anticipi
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Incontri solo i 3 migliori candidati (punteggio $\ge 80/100$) in colloqui conoscitivi
                snelli. Se nessuno ti convince, non paghi nulla. Se assumi, la fattura viene emessa
                solo dopo 90 giorni di prova superata.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Objection Handling Grid */}
      <section className="py-20 border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-sky-400 bg-sky-950/80 px-2.5 py-1 rounded border border-sky-800">
              TRATTIAMO LE VOSTRE OBIEZIONI
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-4 uppercase">
              Perché i Direttori di Stabilimento Scelgono SkillBridge
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
              <div className="text-xs font-mono uppercase text-rose-400 font-bold mb-2">
                &quot;Non abbiamo tempo da perdere con un&apos;altra agenzia generalista&quot;
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Non siamo cacciatori di teste con laureati in lettere che cercano &quot;Lean&quot; su Word.
                SkillBridge è fondato da Ingegneri Gestionali: scremiamo noi decine di profili e ti
                consegniamo solo 3 persone capaci di calcolare un fabbisogno netto al primo giorno di lavoro.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
              <div className="text-xs font-mono uppercase text-rose-400 font-bold mb-2">
                &quot;I neolaureati sanno la teoria universitaria ma non la vita di fabbrica&quot;
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Proprio per questo il nostro test non contiene domande da esame. Misura decisioni pratiche
                sotto pressione: cosa dici al caporeparto montaggio quando mancano i pezzi? Come rinegozi
                con un fornitore critico?
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
              <div className="text-xs font-mono uppercase text-rose-400 font-bold mb-2">
                &quot;Come sappiamo che non hanno barato con ChatGPT da casa?&quot;
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                I parametri di consumo e i lead time cambiano per ogni singolo candidato tramite seed
                matematico. Il sistema monitora e segnala nella scorecard ogni tentativo di copia o
                abbandono della scheda del browser.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
              <div className="text-xs font-mono uppercase text-rose-400 font-bold mb-2">
                &quot;E se il candidato dopo 4 mesi si dimette per andare in consulenza?&quot;
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Le agenzie tradizionali offrono solo sconti parziali non rimborsabili. SkillBridge
                garantisce la sostituzione gratuita completa fino a 180 giorni dalle dimissioni volontarie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & Quotes */}
      <section className="py-20 border-b border-slate-800 bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800">
              VOICE OF CUSTOMER • FEEDBACK DISTRETTI INDUSTRIALI
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 relative">
              <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed mb-4">
                &quot;Finalmente qualcuno che mi fa vedere i numeri del test prima di farmi perdere
                tempo con candidati che non sanno distinguere un ROP da un lotto Min/Max. La scorecard
                di 1 pagina si legge in 3 minuti durante il caffè.&quot;
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <div className="w-8 h-8 rounded-full bg-blue-900 text-blue-300 font-bold font-mono text-xs flex items-center justify-center">
                  DG
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Direttore Generale</div>
                  <div className="text-[11px] text-slate-400">Azienda Meccatronica (120 dipendenti) • Brescia</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 relative">
              <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed mb-4">
                &quot;Poter fare 20 minuti di colloquio conoscitivo sapendo che la fattura si paga solo
                al superamento del periodo di prova azzera ogni attrito con l&apos;amministrazione e con la proprietà.&quot;
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <div className="w-8 h-8 rounded-full bg-indigo-900 text-indigo-300 font-bold font-mono text-xs flex items-center justify-center">
                  OP
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Operations Director</div>
                  <div className="text-[11px] text-slate-400">Costruzione Macchine Packaging • Bologna</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Section */}
      <section id="richiedi" className="py-20 border-b border-slate-800 bg-slate-900/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 border-2 border-blue-600/70 rounded-xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800">
                  ACCESSO PROGRAMMA PILOTA (FEE 11%)
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 uppercase">
                  Richiedi 3 Profili Pre-Testati a Rischio Zero
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2">
                  Riservato alle prime 5 aziende manifatturiere del trimestre. Ricevi i candidati
                  con scorecard entro 7 giorni. Fattura emessa solo al 90° giorno se assunto.
                </p>
              </div>

              {submitSuccess ? (
                <div className="p-6 bg-emerald-950/50 border border-emerald-700 rounded-lg text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-900 text-emerald-300 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase">
                    Richiesta Registrata con Successo
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                    Grazie, <strong className="text-white">{contactName}</strong>. L&apos;Ingegnere Gestionale
                    fondatore di SkillBridge ti contatterà telefonicamente entro 4 ore lavorative per
                    tarare i requisiti specifici di stabilimento.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/scorecard/33333333-3333-4333-8333-333333333333"
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-mono rounded border border-slate-700"
                    >
                      <span>Nel frattempo, visualizza la scorecard demo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitLead} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                        Nome & Cognome Referente *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Es. Ing. Mario Rossi"
                        className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                        Ruolo in Azienda *
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="Direttore di Stabilimento">Direttore di Stabilimento / Plant Manager</option>
                        <option value="Operations Manager">Operations / Production Manager</option>
                        <option value="Supply Chain Director">Supply Chain / Logistics Director</option>
                        <option value="HR / Talent Acquisition">Responsabile Risorse Umane / HR</option>
                        <option value="Titolare / Amministratore Delegato">Titolare / Amministratore Delegato</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                        Ragione Sociale / Azienda *
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Es. Meccanica Lombarda S.p.A."
                        className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                        Provincia Stabilimento *
                      </label>
                      <input
                        type="text"
                        required
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        placeholder="Es. Brescia, Bergamo, Modena..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                        Email Aziendale *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Es. m.rossi@azienda.it"
                        className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                        Telefono Diretto / Cellulare
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Es. +39 335 1234567"
                        className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                      Profilo Ricercato *
                    </label>
                    <select
                      value={roleNeeded}
                      onChange={(e) => setRoleNeeded(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Supply Chain & Operations Specialist (Modulo V-104)">
                        Supply Chain & Operations Specialist (Modulo V-104)
                      </option>
                      <option value="Pianificatore della Produzione & MRP Specialist (Modulo P-200)">
                        Pianificatore della Produzione & MRP Specialist (Modulo P-200)
                      </option>
                      <option value="Buyer Tecnico & Procurement Specialist (Modulo E-501)">
                        Buyer Tecnico & Procurement Specialist (Modulo E-501)
                      </option>
                      <option value="Junior Process & Continuous Improvement Engineer">
                        Junior Process & Continuous Improvement Engineer
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                      Eventuali Note o Vincoli di Stabilimento
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Es. Urgenza per incremento volumi commessa terzo trimestre; disponibilità a brevi trasferte..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-md p-3 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {submitError && (
                    <div className="p-3 bg-rose-950/60 border border-rose-800 rounded text-xs text-rose-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-md transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-600/30 active:scale-[0.99]"
                    >
                      {isSubmitting ? (
                        <span>Elaborazione richiesta in corso...</span>
                      ) : (
                        <>
                          <span>Invia Richiesta e Blocca Tariffa Pilot (11%)</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-slate-500 text-center mt-2">
                      Nessun anticipo richiesto • Riservatezza garantita • Risposta entro 4 ore
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 border-b border-slate-800 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
              DOMANDE FREQUENTI
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-4 uppercase">
              Tutto Quello che Devi Sapere sul Modello SkillBridge
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-blue-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-blue-400' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <span className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center font-mono text-xs">
                SB
              </span>
              <span>SkillBridge Engineering</span>
            </div>
            <div className="flex gap-4 text-slate-400 text-xs">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/scorecard/33333333-3333-4333-8333-333333333333" className="hover:text-white transition-colors">
                Scorecard Demo
              </Link>
              <Link href="/admin" className="hover:text-white transition-colors">
                Admin
              </Link>
            </div>
            <div className="text-[11px] text-slate-600 font-mono">
              &copy; 2026 SkillBridge Operations Assessment. Distretto Meccatronico Nord Italia.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
