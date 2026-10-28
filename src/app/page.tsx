'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScorecardMockup from '@/components/scorecard/ScorecardMockup';
import BrowserMockup from '@/components/ui/BrowserMockup';
import ProductShowcase from '@/components/home/ProductShowcase';
import { SCENARIO_CATALOG } from '@/lib/assessment/parametric';
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Building2,
  FileText,
  Users,
  ChevronDown,
  Factory,
  Boxes,
  Cpu,
  Zap,
  Lock,
  Eye,
  Video,
  Database,
  Sliders,
} from 'lucide-react';

export default function HomePage() {
  // Scenario Catalog Category Filter
  const [selectedCategory, setSelectedCategory] = useState<
    'supply_chain' | 'production_planning' | 'procurement' | 'lean_process'
  >('supply_chain');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Pilot Lead Form State (3 fields in dark CTA section)
  const [leadName, setLeadName] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

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
          province: 'Distretti Nord Italia',
          role: 'Direzione Operations / HR',
          role_needed: 'Ingegnere Gestionale / Operations',
        }),
      });

      if (!res.ok) {
        throw new Error('Impossibile registrare la richiesta. Riprova a breve.');
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
      q: 'Cosa succede se nessuno dei 3 candidati proposti viene assunto?',
      a: 'Non paghi nulla. Non addebitiamo canoni di attivazione, costi di ricerca o rimborsi spese. Il nostro modello opera al 100% a risultato: se decidi di non assumere alcuno dei candidati presentati, il tuo costo complessivo è esattamente pari a zero euro.',
    },
    {
      q: 'Come viene tutelata la privacy del candidato durante il video proctoring?',
      a: 'La registrazione webcam viene avviata unicamente previo consenso informato del candidato al momento dell\'accesso al test. I dati video sono utilizzati esclusivamente dal nostro team per certificare la presenza visiva ed escludere l\'uso di smartphone, nel pieno rispetto del GDPR, senza cessione a terzi e con conservazione limitata.',
    },
    {
      q: 'Come viene calcolato il punteggio nella Scorecard (65/70 + 23/30)?',
      a: 'Adottiamo un sistema di valutazione ibrido progettato per essere spiegabile e trasparente: il 70% del punteggio (0-70 pt) è rigidamente deterministico e misura l\'esattezza matematica dei calcoli (giorni di stockout, ROP, rispetto MOQ), mentre il 30% (0-30 pt) valuta la logica economica e la chiarezza espositiva della memo redatta.',
    },
    {
      q: 'Cosa succede se il candidato assunto si dimette dopo poche settimane?',
      a: 'Includiamo una Garanzia di Sostituzione Gratuita a 180 giorni. Se la risorsa lascia volontariamente l\'azienda entro i primi 6 mesi, avviamo immediatamente una nuova sessione di pre-selezione e ti presentiamo un nuovo profilo qualificato a costo zero.',
    },
    {
      q: 'Siamo vincolati da contratti di esclusiva o accordi pluriennali?',
      a: 'Nessun vincolo di esclusiva. Lavoriamo con un mandato snello di una pagina per singola vacancy. Se durante la nostra selezione trovi un candidato idoneo tramite canali interni prima della nostra presentazione, non ci devi alcun compenso.',
    },
    {
      q: 'Quali sono i tempi tecnici per ricevere la terna di profili?',
      a: 'Dalla definizione della specifica vacancy e dei vincoli di stabilimento, consegniamo i 3 migliori candidati pre-validati con le rispettive Scorecard entro 7 giorni lavorativi.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0B1220] flex flex-col font-sans selection:bg-[#1F4FD8] selection:text-white">
      {/* 1. Sticky Navigation Bar */}
      <Navbar />

      {/* 2. Hero Section (Split 55 / 45) */}
      <section className="pt-14 pb-20 lg:pt-24 lg:pb-28 border-b border-[#E5E8EE]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column (55%) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-[6px] bg-[#F7F8FA] border border-[#E5E8EE] text-xs font-mono text-[#5B6475]">
                <span className="w-2 h-2 rounded-full bg-[#12805C]" />
                <span className="text-[#0B1220] font-semibold">Programma Pilota Linea Aperta</span>
                <span>&bull;</span>
                <span>Fee 11% a 90 Giorni</span>
              </div>

              <h1 className="h1-hero max-w-[65ch]">
                Assumi ingegneri gestionali già testati su fermi linea reali.
              </h1>

              <p className="body-large max-w-[65ch]">
                Ricevi 3 profili junior pre-validati entro 7 giorni. Zero costi di attivazione, colloqui conoscitivi gratuiti e fattura emessa solo al 90° giorno a prova superata.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/contatti"
                  className="h-11 px-6 rounded-[8px] bg-[#1F4FD8] hover:bg-[#1840B0] text-white text-xs font-semibold inline-flex items-center justify-center space-x-2 transition-all shadow-xs active:scale-[0.99]"
                >
                  <span>Richiedi il pilota</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/scorecard/33333333-3333-4333-8333-333333333333"
                  className="h-11 px-5 rounded-[8px] border border-[#E5E8EE] bg-white hover:bg-[#F7F8FA] text-[#0B1220] text-xs font-semibold inline-flex items-center justify-center space-x-2 transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-[#1F4FD8]" />
                  <span>Guarda una scorecard (88/100)</span>
                </Link>
              </div>

              {/* 3 Micro-proofs under CTA */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#5B6475] font-mono">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#12805C]" />
                  <span>0 € di anticipo</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#12805C]" />
                  <span>180 giorni di garanzia</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#12805C]" />
                  <span>25 minuti di simulazione</span>
                </div>
              </div>
            </div>

            {/* Right Column (45%): Real Scorecard UI Mockup */}
            <div className="lg:col-span-5">
              <BrowserMockup
                url="skillbridge.internal/scorecard/marco-bianchi-88"
                badgeText="SCORECARD REALE"
              >
                <ScorecardMockup interactive={false} />
              </BrowserMockup>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Credibility District Bar */}
      <section className="py-8 bg-[#F7F8FA] border-b border-[#E5E8EE]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-xs text-[#5B6475] gap-4">
            <div className="font-mono uppercase tracking-wider font-semibold text-[#0B1220]">
              Presidio Territoriale Manifatturiero:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 font-medium text-[#0B1220]">
              <span className="px-3 py-1 rounded-[6px] bg-white border border-[#E5E8EE]">
                Brescia (Meccanica &amp; Automotive)
              </span>
              <span className="px-3 py-1 rounded-[6px] bg-white border border-[#E5E8EE]">
                Bergamo (Meccatronica)
              </span>
              <span className="px-3 py-1 rounded-[6px] bg-white border border-[#E5E8EE]">
                Modena &amp; Bologna (Packaging &amp; Fonderie)
              </span>
              <span className="px-3 py-1 rounded-[6px] bg-white border border-[#E5E8EE]">
                Vicenza &amp; Treviso (Componentistica)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The Problem: 3 Big Number Cards */}
      <section className="py-24 border-b border-[#E5E8EE]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-mono uppercase tracking-wider text-[#1F4FD8] font-semibold">
              I Costi della Selezione Tradizionale
            </span>
            <h2 className="h2-section mt-2">
              Perché i CV e i colloqui generici falliscono in fabbrica.
            </h2>
            <p className="body-large mt-3">
              Le agenzie tradizionali inviano candidati basandosi su parole chiave teoriche, scaricando tutto il costo delle verifiche sui responsabili operativi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="card-frame p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="font-mono text-4xl sm:text-5xl font-semibold text-[#0B1220] tracking-tight mb-2">
                  25–40h
                </div>
                <h3 className="text-sm font-semibold text-[#0B1220] mb-2">
                  Ore perse in colloqui a vuoto
                </h3>
                <p className="text-xs text-[#5B6475] leading-relaxed">
                  Tempo speso dal Direttore di Stabilimento e dai capi reparto per accertarsi che il candidato sappia calcolare un ROP o gestire un fornitore critico.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E5E8EE] text-[11px] font-mono text-[#5B6475]">
                Costo interno medio stimato: oltre 2.000 € per vacancy
              </div>
            </div>

            {/* Card 2 */}
            <div className="card-frame p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="font-mono text-4xl sm:text-5xl font-semibold text-[#0B1220] tracking-tight mb-2">
                  1.200–3.500 €
                </div>
                <h3 className="text-sm font-semibold text-[#0B1220] mb-2">
                  Costo orario di fermo linea
                </h3>
                <p className="text-xs text-[#5B6475] leading-relaxed">
                  Un errore di pianificazione o un ritardo nell&apos;ordinativo speciale blocca il montaggio. Non puoi permetterti candidati che scoprono i vincoli di stabilimento solo al terzo mese.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E5E8EE] text-[11px] font-mono text-red-600 font-semibold">
                Danno medio fermo linea: fino a 40.000 € a turno
              </div>
            </div>

            {/* Card 3 */}
            <div className="card-frame p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="font-mono text-4xl sm:text-5xl font-semibold text-[#0B1220] tracking-tight mb-2">
                  18–22%
                </div>
                <h3 className="text-sm font-semibold text-[#0B1220] mb-2">
                  Fee tradizionale richiesta al Giorno 1
                </h3>
                <p className="text-xs text-[#5B6475] leading-relaxed">
                  I cacciatori di teste fatturano alla firma del contratto, trasferendo tutto il rischio sul cliente prima ancora che il candidato abbia dimostrato le sue capacità pratiche.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E5E8EE] text-[11px] font-mono text-[#12805C] font-semibold">
                SkillBridge: 11% al Giorno 90 solo a prova superata
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works (4 Horizontal Steps with Mini UI Illustrations) */}
      <section className="py-24 bg-[#F7F8FA] border-b border-[#E5E8EE]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-mono uppercase tracking-wider text-[#1F4FD8] font-semibold">
              Metodo Operativo
            </span>
            <h2 className="h2-section mt-2">
              Come funziona in 4 passaggi lineari.
            </h2>
            <p className="body-large mt-3">
              Dalla condivisione del fabbisogno ai 3 profili pre-selezionati sulla tua scrivania entro 7 giorni.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="card-frame p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-8 h-8 rounded-[8px] bg-[#F7F8FA] border border-[#E5E8EE] text-[#0B1220] font-mono font-bold text-xs flex items-center justify-center">
                    01
                  </span>
                  <span className="text-[10px] font-mono text-[#5B6475] uppercase">Fabbisogno</span>
                </div>
                <h3 className="text-sm font-semibold text-[#0B1220] mb-1.5">
                  Scegli il ruolo tecnico
                </h3>
                <p className="text-xs text-[#5B6475] leading-relaxed mb-4">
                  Definiamo la vacancy tra i 4 ruoli chiave (Supply Chain, MRP, Buyer o Lean) con i vincoli specifici del tuo stabilimento.
                </p>
              </div>
              {/* Mini UI Illustration */}
              <div className="p-2.5 rounded-[6px] bg-[#F7F8FA] border border-[#E5E8EE] text-[10px] font-mono text-[#5B6475] space-y-1">
                <div className="text-[#0B1220] font-semibold">• Supply Chain Specialist</div>
                <div>• Vincolo: fermo linea 1.200 €/h</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="card-frame p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-8 h-8 rounded-[8px] bg-[#F7F8FA] border border-[#E5E8EE] text-[#0B1220] font-mono font-bold text-xs flex items-center justify-center">
                    02
                  </span>
                  <span className="text-[10px] font-mono text-[#5B6475] uppercase">Test 25 Min</span>
                </div>
                <h3 className="text-sm font-semibold text-[#0B1220] mb-1.5">
                  Simulazione operativa
                </h3>
                <p className="text-xs text-[#5B6475] leading-relaxed mb-4">
                  Il candidato affronta una crisi reale da 25 minuti: calcolo del deficit, gestione scorte e memo per il Plant Director.
                </p>
              </div>
              {/* Mini UI Illustration */}
              <div className="p-2.5 rounded-[6px] bg-[#F7F8FA] border border-[#E5E8EE] text-[10px] font-mono text-[#5B6475] flex items-center justify-between">
                <span className="text-[#12805C] font-semibold">● REC WEBCAM</span>
                <span className="text-[#1F4FD8] font-bold">⏱ 25:00</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="card-frame p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-8 h-8 rounded-[8px] bg-[#F7F8FA] border border-[#E5E8EE] text-[#0B1220] font-mono font-bold text-xs flex items-center justify-center">
                    03
                  </span>
                  <span className="text-[10px] font-mono text-[#5B6475] uppercase">Scorecard</span>
                </div>
                <h3 className="text-sm font-semibold text-[#0B1220] mb-1.5">
                  Ricevi la Scorecard A4
                </h3>
                <p className="text-xs text-[#5B6475] leading-relaxed mb-4">
                  Report sintetico da 1 pagina leggibile in 3 minuti con punteggio matematico deterministico (0-70) e audit anti-cheat.
                </p>
              </div>
              {/* Mini UI Illustration */}
              <div className="p-2.5 rounded-[6px] bg-[#F7F8FA] border border-[#E5E8EE] text-[10px] font-mono text-[#5B6475] flex items-center justify-between">
                <span>Score Totale:</span>
                <span className="font-bold text-[#12805C]">88 / 100 pt</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="card-frame p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-8 h-8 rounded-[8px] bg-[#F7F8FA] border border-[#E5E8EE] text-[#0B1220] font-mono font-bold text-xs flex items-center justify-center">
                    04
                  </span>
                  <span className="text-[10px] font-mono text-[#5B6475] uppercase">90 Giorni</span>
                </div>
                <h3 className="text-sm font-semibold text-[#0B1220] mb-1.5">
                  Colloquio &amp; Pagamento
                </h3>
                <p className="text-xs text-[#5B6475] leading-relaxed mb-4">
                  Fai 20 minuti di colloquio solo con i profili idonei. La fee di successo dell&apos;11% si paga solo a 90 giorni se confermato.
                </p>
              </div>
              {/* Mini UI Illustration */}
              <div className="p-2.5 rounded-[6px] bg-[#F7F8FA] border border-[#E5E8EE] text-[10px] font-mono text-[#5B6475] flex items-center justify-between">
                <span>Fattura Giorno 90:</span>
                <span className="text-[#1F4FD8] font-bold">11% RAL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Product Showcase: Real Interactive Tabs */}
      <section className="py-24 border-b border-[#E5E8EE]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-[#1F4FD8] font-semibold">
              Interfaccia Operativa
            </span>
            <h2 className="h2-section mt-2">
              L&apos;ambiente di simulazione in azione.
            </h2>
            <p className="body-large mt-3">
              Tre schermate reali che mostrano il flusso completo: dalla prova del candidato all&apos;audit anti-cheat fino alla scorecard per la Direzione.
            </p>
          </div>

          <ProductShowcase />
        </div>
      </section>

      {/* 7. Catalog of 20 Scenarios */}
      <section id="scenari" className="py-24 bg-[#F7F8FA] border-b border-[#E5E8EE]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#1F4FD8] font-semibold">
                Catalogo Industriale
              </span>
              <h2 className="h2-section mt-2">
                20 Simulazioni Pratiche nei 4 Ruoli Chiave.
              </h2>
              <p className="body-large mt-2">
                5 scenari operativi distinti per ogni posizione con codici parte, vincoli MOQ e costi orari di fermo linea.
              </p>
            </div>

            <Link
              href="/scenari"
              className="text-xs font-semibold text-[#1F4FD8] hover:text-[#1840B0] inline-flex items-center space-x-1"
            >
              <span>Vedi catalogo completo ricercabile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Role Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              type="button"
              onClick={() => setSelectedCategory('supply_chain')}
              className={`h-10 px-4 rounded-[8px] text-xs font-semibold font-mono transition-all inline-flex items-center space-x-2 border cursor-pointer ${
                selectedCategory === 'supply_chain'
                  ? 'bg-[#0B1220] text-white border-[#0B1220]'
                  : 'bg-white text-[#5B6475] border-[#E5E8EE] hover:bg-[#F7F8FA]'
              }`}
            >
              <Factory className="w-3.5 h-3.5 text-[#1F4FD8]" />
              <span>Supply Chain &amp; Operations (5)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('production_planning')}
              className={`h-10 px-4 rounded-[8px] text-xs font-semibold font-mono transition-all inline-flex items-center space-x-2 border cursor-pointer ${
                selectedCategory === 'production_planning'
                  ? 'bg-[#0B1220] text-white border-[#0B1220]'
                  : 'bg-white text-[#5B6475] border-[#E5E8EE] hover:bg-[#F7F8FA]'
              }`}
            >
              <Boxes className="w-3.5 h-3.5 text-[#12805C]" />
              <span>Pianificazione MRP &amp; MPS (5)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('procurement')}
              className={`h-10 px-4 rounded-[8px] text-xs font-semibold font-mono transition-all inline-flex items-center space-x-2 border cursor-pointer ${
                selectedCategory === 'procurement'
                  ? 'bg-[#0B1220] text-white border-[#0B1220]'
                  : 'bg-white text-[#5B6475] border-[#E5E8EE] hover:bg-[#F7F8FA]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-[#1F4FD8]" />
              <span>Buyer Tecnico Procurement (5)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('lean_process')}
              className={`h-10 px-4 rounded-[8px] text-xs font-semibold font-mono transition-all inline-flex items-center space-x-2 border cursor-pointer ${
                selectedCategory === 'lean_process'
                  ? 'bg-[#0B1220] text-white border-[#0B1220]'
                  : 'bg-white text-[#5B6475] border-[#E5E8EE] hover:bg-[#F7F8FA]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#B7791F]" />
              <span>Process &amp; Lean Manufacturing (5)</span>
            </button>
          </div>

          {/* Scenarios Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SCENARIO_CATALOG.filter((sc) => sc.category === selectedCategory).map((sc) => {
              const code = sc.id.split('-')[1]?.toUpperCase() || 'V104';
              return (
                <div
                  key={sc.id}
                  className="card-frame p-5 flex flex-col justify-between hover:border-[#1F4FD8]/50 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="font-mono text-[11px] font-bold text-[#1F4FD8] bg-[#F7F8FA] px-2 py-0.5 rounded border border-[#E5E8EE]">
                        SKB-{code}
                      </span>
                      <span className="text-[10px] font-mono text-[#5B6475] uppercase">
                        25 Minuti
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-[#0B1220] mb-1 leading-snug">
                      {sc.title}
                    </h3>
                    <div className="text-[11px] text-[#1F4FD8] font-medium mb-2.5">
                      {sc.role}
                    </div>
                    <p className="text-xs text-[#5B6475] leading-relaxed mb-4">
                      {sc.summary}
                    </p>

                    <div className="space-y-1.5 py-3 border-t border-[#E5E8EE] text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-[#5B6475]">Componente:</span>
                        <span className="font-semibold text-[#0B1220]">{sc.partNumber}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#5B6475]">Danno Fermo Linea:</span>
                        <span className="font-bold text-red-600">
                          {sc.downtimeCostPerHour.toLocaleString('it-IT')} € / ora
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E5E8EE] mt-3">
                    <Link
                      href={`/assessment/demo-${sc.id}`}
                      className="w-full h-9 rounded-[8px] bg-[#F7F8FA] hover:bg-[#E5E8EE] text-[#0B1220] text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
                    >
                      <span>Prova Simulazione ({sc.partNumber})</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Comparison Table: Headhunter vs SkillBridge */}
      <section className="py-24 border-b border-[#E5E8EE]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-mono uppercase tracking-wider text-[#1F4FD8] font-semibold">
              Trasparenza Contrattuale
            </span>
            <h2 className="h2-section mt-2">
              Confronto con le Agenzie Tradizionali.
            </h2>
            <p className="body-large mt-3">
              Perché il nostro modello operativo a rischio zero elimina ogni attrito con la direzione finanziaria e le risorse umane.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#E5E8EE] rounded-[12px] overflow-hidden">
              <thead className="bg-[#F7F8FA] text-[#5B6475] font-mono text-[11px] uppercase border-b border-[#E5E8EE]">
                <tr>
                  <th className="p-4">Parametro di Confronto</th>
                  <th className="p-4 text-[#5B6475]">Headhunter Tradizionale</th>
                  <th className="p-4 bg-[#1F4FD8]/5 text-[#1F4FD8] font-bold border-l border-r border-[#E5E8EE]">
                    SkillBridge Pilota
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E8EE] text-xs">
                <tr>
                  <td className="p-4 font-semibold text-[#0B1220]">Fee sul primo anno (RAL)</td>
                  <td className="p-4 text-[#5B6475]">18% – 22%</td>
                  <td className="p-4 bg-[#1F4FD8]/5 font-bold text-[#1F4FD8] border-l border-r border-[#E5E8EE]">
                    11% (Tariffa agevolata pilota)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#0B1220]">Anticipo iniziale (Retainer)</td>
                  <td className="p-4 text-[#5B6475]">1.500 € – 3.000 € a inizio mandato</td>
                  <td className="p-4 bg-[#1F4FD8]/5 font-bold text-[#12805C] border-l border-r border-[#E5E8EE]">
                    0 € (Zero anticipi)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#0B1220]">Momento di Fatturazione</td>
                  <td className="p-4 text-[#5B6475]">Giorno 1 (alla firma del contratto)</td>
                  <td className="p-4 bg-[#1F4FD8]/5 font-bold text-[#0B1220] border-l border-r border-[#E5E8EE]">
                    Giorno 90 (solo a superamento prova)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#0B1220]">Garanzia di Sostituzione</td>
                  <td className="p-4 text-[#5B6475]">30–60 giorni (spesso solo buono sconto)</td>
                  <td className="p-4 bg-[#1F4FD8]/5 font-bold text-[#12805C] border-l border-r border-[#E5E8EE]">
                    180 giorni (Sostituzione gratuita)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#0B1220]">Vincolo di Esclusiva</td>
                  <td className="p-4 text-[#5B6475]">Spesso obbligatorio (3–6 mesi)</td>
                  <td className="p-4 bg-[#1F4FD8]/5 font-bold text-[#0B1220] border-l border-r border-[#E5E8EE]">
                    Nessuna esclusiva (Mandato snello)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#0B1220]">Tempi Consegna Primi Profili</td>
                  <td className="p-4 text-[#5B6475]">4 – 8 settimane</td>
                  <td className="p-4 bg-[#1F4FD8]/5 font-bold text-[#1F4FD8] border-l border-r border-[#E5E8EE]">
                    7 giorni lavorativi (3 candidati con Scorecard)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 9. Integrity & Compliance: 4 Anti-Cheat Pillars */}
      <section className="py-24 bg-[#F7F8FA] border-b border-[#E5E8EE]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-mono uppercase tracking-wider text-[#1F4FD8] font-semibold">
              Sicurezza &amp; Integrità
            </span>
            <h2 className="h2-section mt-2">
              I 4 Pilastri del Protocollo Anti-Cheat.
            </h2>
            <p className="body-large mt-3">
              Misure tecniche rigorose per impedire l&apos;uso di smartphone, ChatGPT o aiuti esterni, progettate nel pieno rispetto delle normative sulla privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="card-frame p-6 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-[8px] bg-[#F7F8FA] border border-[#E5E8EE] text-[#1F4FD8] flex items-center justify-center mb-4">
                  <Video className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-[#0B1220] mb-2">
                  1. Registrazione Webcam Continua
                </h3>
                <p className="text-xs text-[#5B6475] leading-relaxed">
                  Streaming video attivo durante l&apos;intera prova per accertare la presenza visiva ed escludere l&apos;impiego di altri dispositivi.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="card-frame p-6 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-[8px] bg-[#F7F8FA] border border-[#E5E8EE] text-[#12805C] flex items-center justify-center mb-4">
                  <Database className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-[#0B1220] mb-2">
                  2. Seed Matematico a 32-Bit
                </h3>
                <p className="text-xs text-[#5B6475] leading-relaxed">
                  Giacenze, consumi e lead time generati dinamicamente: due candidati non riceveranno mai gli stessi valori numerici.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="card-frame p-6 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-[8px] bg-[#F7F8FA] border border-[#E5E8EE] text-[#B7791F] flex items-center justify-center mb-4">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-[#0B1220] mb-2">
                  3. Blocco Incolla &amp; Shortcut
                </h3>
                <p className="text-xs text-[#5B6475] leading-relaxed">
                  Inibizione integrale del copia-incolla e delle scorciatoie da tastiera per impedire l&apos;inserimento di risposte esterne.
                </p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="card-frame p-6 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-[8px] bg-[#F7F8FA] border border-[#E5E8EE] text-[#0B1220] flex items-center justify-center mb-4">
                  <Eye className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-[#0B1220] mb-2">
                  4. Telemetria Focus Schermo
                </h3>
                <p className="text-xs text-[#5B6475] leading-relaxed">
                  Rilevamento immediato di cambi scheda o finestre terze (`window.blur`) registrato nella scorecard esecutiva.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ Accordion */}
      <section className="py-24 border-b border-[#E5E8EE]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-mono uppercase tracking-wider text-[#1F4FD8] font-semibold">
              Domande Frequenti
            </span>
            <h2 className="h2-section mt-2">
              Risposte chiare per Direttori di Stabilimento e HR.
            </h2>
          </div>

          <div className="max-w-3xl divide-y divide-[#E5E8EE] border-t border-b border-[#E5E8EE]">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-5">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-sm font-semibold text-[#0B1220] hover:text-[#1F4FD8] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#5B6475] transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#1F4FD8]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="mt-3 text-xs sm:text-sm text-[#5B6475] leading-relaxed pr-6">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. Final CTA on Dark Background (#0B1220) with 3-field Pilot Form */}
      <section id="richiedi" className="py-24 bg-[#0B1220] text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-[#1F4FD8] bg-white/10 px-3 py-1 rounded-[6px] font-semibold">
              Accesso Programma Pilota
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mt-4">
              Ricevi 3 profili pre-testati per il tuo stabilimento.
            </h2>
            <p className="text-sm sm:text-base text-[#5B6475] mt-3 max-w-xl mx-auto leading-relaxed">
              Invia i tuoi dati per richiedere 3 candidati entro 7 giorni. Fee agevolata all&apos;11% e fattura solo al 90° giorno a prova superata.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-white rounded-[12px] p-6 sm:p-8 text-[#0B1220] soft-shadow">
            {leadSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#12805C] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-[#0B1220]">
                  Richiesta Ricevuta con Successo
                </h3>
                <p className="text-xs text-[#5B6475] leading-relaxed">
                  Grazie, ti ricontatteremo entro 4 ore lavorative per calibrare i requisiti specifici di stabilimento.
                </p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#0B1220] mb-1">
                    Nome e Cognome *
                  </label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="Es. Ing. Mario Rossi"
                    className="w-full h-10 px-3 rounded-[8px] border border-[#E5E8EE] text-xs text-[#0B1220] placeholder-[#5B6475]/60 focus:outline-none focus:ring-2 focus:ring-[#1F4FD8]/20 focus:border-[#1F4FD8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#0B1220] mb-1">
                    Ragione Sociale Azienda *
                  </label>
                  <input
                    type="text"
                    required
                    value={leadCompany}
                    onChange={(e) => setLeadCompany(e.target.value)}
                    placeholder="Es. Meccanica Lombarda S.p.A."
                    className="w-full h-10 px-3 rounded-[8px] border border-[#E5E8EE] text-xs text-[#0B1220] placeholder-[#5B6475]/60 focus:outline-none focus:ring-2 focus:ring-[#1F4FD8]/20 focus:border-[#1F4FD8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#0B1220] mb-1">
                    Email Lavorativa *
                  </label>
                  <input
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="Es. m.rossi@azienda.it"
                    className="w-full h-10 px-3 rounded-[8px] border border-[#E5E8EE] text-xs text-[#0B1220] placeholder-[#5B6475]/60 focus:outline-none focus:ring-2 focus:ring-[#1F4FD8]/20 focus:border-[#1F4FD8]"
                  />
                </div>

                {leadError && (
                  <div className="p-2.5 rounded-[8px] bg-red-50 text-red-700 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{leadError}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingLead}
                    className="w-full h-11 rounded-[8px] bg-[#1F4FD8] hover:bg-[#1840B0] text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
                  >
                    <span>{isSubmittingLead ? 'Invio in corso...' : 'Richiedi i 3 profili pilota'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[10px] text-[#5B6475] text-center pt-2">
                  Zero costi di attivazione &bull; Nessun vincolo di esclusiva
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 12. Shared Technical Footer */}
      <Footer />
    </div>
  );
}
