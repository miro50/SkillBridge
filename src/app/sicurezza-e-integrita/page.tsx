'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  ShieldCheck,
  Video,
  Lock,
  Eye,
  Database,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Scale,
  UserCheck,
} from 'lucide-react';

export default function SicurezzaIntegritaPage() {
  return (
    <div className="min-h-screen bg-white text-[#0B1220] flex flex-col font-sans selection:bg-[#1F4FD8] selection:text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-14 pb-16 lg:pt-20 lg:pb-20 border-b border-[#E5E8EE] bg-[#F7F8FA]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-wider text-[#1F4FD8] font-semibold">
            Integrità, Trasparenza &amp; Privacy
          </span>
          <h1 className="h1-hero mt-3">
            Protocollo Anti-Cheat e Tutela della Privacy.
          </h1>
          <p className="body-large mt-4 max-w-2xl mx-auto">
            Progettato per essere rigoroso sul piano tecnico, trasparente per il candidato e conforme ai principi europei di spiegabilità e tutela dei dati personali.
          </p>
        </div>
      </section>

      {/* The 4 Anti-Cheat Pillars */}
      <section className="py-24 border-b border-[#E5E8EE]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-mono uppercase tracking-wider text-[#1F4FD8] font-semibold">
              Sicurezza del Test
            </span>
            <h2 className="h2-section mt-2">
              Come garantiamo l&apos;autenticità della prova.
            </h2>
            <p className="body-large mt-3">
              Misure tecniche attive per escludere l&apos;uso di smartphone, ChatGPT o suggeritori esterni durante la simulazione da 25 minuti.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pillar 1 */}
            <div className="card-frame p-6 sm:p-8 space-y-4">
              <div className="w-10 h-10 rounded-[8px] bg-[#F7F8FA] border border-[#E5E8EE] flex items-center justify-center text-[#1F4FD8]">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0B1220]">
                1. Registrazione Webcam con Indicatore Attivo
              </h3>
              <p className="text-xs sm:text-sm text-[#5B6475] leading-relaxed">
                Prima di accedere alla prova, il candidato attiva la webcam. Durante i 25 minuti l&apos;indicatore `● REC ATTIVO` rimane visibile a schermo. Il video viene acquisito per verificare la presenza e scongiurare l&apos;utilizzo di smartphone o schermi ausiliari.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#12805C] flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Consenso esplicito raccolto prima dell&apos;avvio</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="card-frame p-6 sm:p-8 space-y-4">
              <div className="w-10 h-10 rounded-[8px] bg-[#F7F8FA] border border-[#E5E8EE] flex items-center justify-center text-[#12805C]">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0B1220]">
                2. Seed Matematico Parametrico a 32-Bit
              </h3>
              <p className="text-xs sm:text-sm text-[#5B6475] leading-relaxed">
                Ogni token genera un hash deterministico a 32-bit: giacenze a magazzino, lead time, costi orari di fermo e scorte minime variano matematicamente per ciascun candidato. Condividere risposte o formule pre-compilate è impossibile.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#12805C] flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Oltre 100.000 combinazioni uniche per scenario</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="card-frame p-6 sm:p-8 space-y-4">
              <div className="w-10 h-10 rounded-[8px] bg-[#F7F8FA] border border-[#E5E8EE] flex items-center justify-center text-[#B7791F]">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0B1220]">
                3. Blocco Integrale Clipboard &amp; Scorciatoie
              </h3>
              <p className="text-xs sm:text-sm text-[#5B6475] leading-relaxed">
                La combinazione `Incolla` (`Ctrl+V` / `Cmd+V`), il tasto destro e le combinazioni di ispezione del codice sono disabilitate per le caselle di risposta analitica. Il candidato deve redigere personalmente la memo decisionale.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#12805C] flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Inibito il copia-incolla da modelli linguistici esterni</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="card-frame p-6 sm:p-8 space-y-4">
              <div className="w-10 h-10 rounded-[8px] bg-[#F7F8FA] border border-[#E5E8EE] flex items-center justify-center text-[#0B1220]">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0B1220]">
                4. Telemetria di Cambio Finestra (Defocus)
              </h3>
              <p className="text-xs sm:text-sm text-[#5B6475] leading-relaxed">
                Il sistema traccia ogni perdita di focus del browser (`window.blur`). Se il candidato cambia scheda o apre altre finestre, compare un avviso visivo a tutto schermo e l&apos;anomalia (con durata in secondi) viene registrata nella scorecard.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#12805C] flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Telemetria oraria visibile nella Scorecard A4</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Section: Privacy, Webcam Consent & Data Retention */}
      <section id="privacy" className="py-24 bg-[#F7F8FA] border-b border-[#E5E8EE]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-[#1F4FD8] font-semibold">
              Privacy &amp; Consenso Informato
            </span>
            <h2 className="h2-section mt-2">
              Come gestiamo i flussi video e i dati dei candidati.
            </h2>
            <p className="body-large mt-3">
              Il rispetto della dignità del candidato e della normativa sulla protezione dei dati è un pilastro di fiducia fondamentale per SkillBridge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-frame p-6 space-y-3 bg-white">
              <h4 className="text-sm font-semibold text-[#0B1220] flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-[#1F4FD8]" />
                <span>Consenso Esplicito</span>
              </h4>
              <p className="text-xs text-[#5B6475] leading-relaxed">
                Nessuna registrazione parte a sorpresa. Il candidato accetta l&apos;informativa prima del test ed effettua il test video della fotocamera prima dell&apos;avvio del cronometro.
              </p>
            </div>

            <div className="card-frame p-6 space-y-3 bg-white">
              <h4 className="text-sm font-semibold text-[#0B1220] flex items-center space-x-2">
                <Lock className="w-4 h-4 text-[#12805C]" />
                <span>Conservazione Limitata</span>
              </h4>
              <p className="text-xs text-[#5B6475] leading-relaxed">
                I flussi video e le registrazioni di audit vengono conservati unicamente per il tempo strettamente necessario alla validazione della sessione e non vengono ceduti a terze parti commerciali.
              </p>
            </div>

            <div className="card-frame p-6 space-y-3 bg-white">
              <h4 className="text-sm font-semibold text-[#0B1220] flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#B7791F]" />
                <span>Diritti dell&apos;Interessato</span>
              </h4>
              <p className="text-xs text-[#5B6475] leading-relaxed">
                Ogni candidato può richiedere in qualunque momento la visione dei dati raccolti o la cancellazione dei dati di prova scrivendo al responsabile privacy: <a href="mailto:privacy@skillbridge.it" className="text-[#1F4FD8] underline">privacy@skillbridge.it</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Act & Explainability Section */}
      <section id="ai-act" className="py-24 border-b border-[#E5E8EE]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-[#1F4FD8] font-semibold">
              Conformità Normativa Europea
            </span>
            <h2 className="h2-section mt-2">
              Progettato per essere spiegabile e verificabile.
            </h2>
            <p className="body-large mt-3">
              I sistemi di scoring utilizzati per la selezione del personale rientrano tra gli ambiti ad alta attenzione del quadro normativo europeo (AI Act e GDPR).
            </p>
          </div>

          <div className="card-frame p-6 sm:p-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm">
              <div className="space-y-3">
                <div className="font-semibold text-sm text-[#0B1220] flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-[#1F4FD8]" />
                  <span>Nessuna &quot;Black Box&quot; Decisionale</span>
                </div>
                <p className="text-[#5B6475] leading-relaxed">
                  Il 70% del punteggio (0-70 pt) è basato su formule matematiche di ingegneria industriale (fabbisogni netti, calcolo scorte di sicurezza, lotti minimi). I calcoli sono deterministici, tracciabili e consultabili voce per voce nella Scorecard.
                </p>
              </div>

              <div className="space-y-3">
                <div className="font-semibold text-sm text-[#0B1220] flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#12805C]" />
                  <span>Supervisione Umana Costante</span>
                </div>
                <p className="text-[#5B6475] leading-relaxed">
                  L&apos;intelligenza artificiale non assume né respinge autonomamente. Valuta solo la chiarezza argomentativa della memo (30 pt) con schemi strutturati, e la decisione finale di convocazione e assunzione resta al 100% in capo alla Direzione aziendale.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E5E8EE] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5B6475]">
              <span>
                Hai domande specifiche sui requisiti di compliance o privacy del tuo stabilimento?
              </span>
              <Link
                href="/contatti"
                className="h-10 px-4 rounded-[8px] bg-[#1F4FD8] hover:bg-[#1840B0] text-white font-semibold inline-flex items-center space-x-1.5 transition-colors"
              >
                <span>Contatta il Responsabile Tecnico</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
