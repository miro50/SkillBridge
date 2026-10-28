'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  KeyRound,
  ArrowRight,
  Clock,
  Video,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  HelpCircle,
  AlertCircle,
  FileText,
} from 'lucide-react';

export default function PerICandidatiPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [tokenError, setTokenError] = useState<string | null>(null);

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = token.trim();
    if (!cleanToken) {
      setTokenError('Inserisci il token di invito ricevuto');
      return;
    }
    setTokenError(null);
    router.push(`/assessment/${encodeURIComponent(cleanToken)}`);
  };

  const selectPreset = (presetToken: string) => {
    setToken(presetToken);
    setTokenError(null);
    router.push(`/assessment/${encodeURIComponent(presetToken)}`);
  };

  const candidateFaqs = [
    {
      q: 'Come devo prepararmi alla simulazione da 25 minuti?',
      a: 'Non servono formule a memoria né libri di testo universitari. Avrai a disposizione una calcolatrice o un foglio di calcolo personale. Ti verrà presentata una situazione di fabbrica reale (es. ritardo fornitore, stockout magazzino): leggi attentamente i dati di giacenza, calcola i fabbisogni e proponi una soluzione motivata.',
    },
    {
      q: 'La webcam è obbligatoria durante l\'intera prova?',
      a: 'Sì. La registrazione video certifica la tua presenza visiva ed esclude l\'uso di smartphone o aiuti esterni. Questo garantisce alle aziende che il punteggio ottenuto riflette il tuo reale valore professionale.',
    },
    {
      q: 'Cosa succede se perdo la connessione a internet durante la prova?',
      a: 'La piattaforma salva lo stato delle tue risposte ogni 15 secondi in memoria locale. Se la pagina si ricarica o perdi la connessione temporaneamente, riprenderai esattamente da dove eri rimasto entro i 25 minuti stabiliti.',
    },
    {
      q: 'Posso sostenere il test da smartphone o tablet?',
      a: 'No. La simulazione richiede l\'utilizzo di un computer fisso o portatile (Windows, macOS o Linux) con browser aggiornato (Chrome, Edge, Firefox, Safari) per garantire la corretta visualizzazione delle tabelle dati e l\'attivazione della webcam.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0B1220] flex flex-col font-sans selection:bg-[#1F4FD8] selection:text-white">
      <Navbar />

      {/* Hero Section with Token Launcher */}
      <section className="pt-14 pb-20 lg:pt-20 lg:pb-24 border-b border-[#E5E8EE] bg-[#F7F8FA]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Instructions */}
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-mono uppercase tracking-wider text-[#1F4FD8] font-semibold">
                Portale Candidati &bull; Ingegneria Gestionale
              </span>
              <h1 className="h1-hero">
                Dimostra le tue competenze pratiche sul campo, non su un foglio di carta.
              </h1>
              <p className="body-large">
                Niente colloqui generici con selezionatori che non sanno cos&apos;è un lotto economico. Mettiti alla prova su uno scenario operativo da 25 minuti e fatti notare dai Direttori di Stabilimento per la qualità delle tue decisioni.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs font-mono text-[#5B6475]">
                <div className="p-3 bg-white rounded-[8px] border border-[#E5E8EE]">
                  <Clock className="w-4 h-4 text-[#1F4FD8] mb-1.5" />
                  <span className="font-semibold text-[#0B1220] block">25 Minuti</span>
                  <span>Tempo massimo continuo</span>
                </div>
                <div className="p-3 bg-white rounded-[8px] border border-[#E5E8EE]">
                  <Video className="w-4 h-4 text-[#12805C] mb-1.5" />
                  <span className="font-semibold text-[#0B1220] block">Webcam Attiva</span>
                  <span>Verifica proctoring video</span>
                </div>
                <div className="p-3 bg-white rounded-[8px] border border-[#E5E8EE]">
                  <FileText className="w-4 h-4 text-[#B7791F] mb-1.5" />
                  <span className="font-semibold text-[#0B1220] block">Scorecard A4</span>
                  <span>Valutazione in 1 pagina</span>
                </div>
              </div>
            </div>

            {/* Right Column: Launch Card */}
            <div className="lg:col-span-5">
              <div className="card-frame p-6 sm:p-8 bg-white border border-[#E5E8EE] space-y-5">
                <div className="flex items-center space-x-2 pb-3 border-b border-[#E5E8EE]">
                  <KeyRound className="w-5 h-5 text-[#1F4FD8]" />
                  <h3 className="text-sm font-semibold text-[#0B1220]">
                    Hai ricevuto un invito aziendale?
                  </h3>
                </div>

                <form onSubmit={handleLaunch} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#0B1220] mb-1.5">
                      Inserisci il tuo codice token
                    </label>
                    <input
                      type="text"
                      value={token}
                      onChange={(e) => {
                        setToken(e.target.value);
                        if (tokenError) setTokenError(null);
                      }}
                      placeholder="Es. demo-candidate-1"
                      className="w-full h-11 px-3.5 rounded-[8px] border border-[#E5E8EE] text-sm text-[#0B1220] font-mono placeholder-[#5B6475]/60 focus:outline-none focus:ring-2 focus:ring-[#1F4FD8]/20 focus:border-[#1F4FD8]"
                    />
                  </div>

                  {tokenError && (
                    <div className="p-2.5 rounded-[8px] bg-red-50 text-red-700 text-xs flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{tokenError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full h-11 rounded-[8px] bg-[#1F4FD8] hover:bg-[#1840B0] text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
                  >
                    <span>Entra nella Cockpit di Prova</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="pt-4 border-t border-[#E5E8EE]">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#5B6475] block mb-2 font-semibold">
                    Oppure prova una simulazione aperta:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => selectPreset('demo-candidate-1')}
                      className="p-2 text-left rounded-[6px] bg-[#F7F8FA] hover:bg-[#E5E8EE] text-[#0B1220] border border-[#E5E8EE] transition-colors truncate"
                    >
                      • Demo V-104 Supply
                    </button>
                    <button
                      type="button"
                      onClick={() => selectPreset('demo-candidate-2')}
                      className="p-2 text-left rounded-[6px] bg-[#F7F8FA] hover:bg-[#E5E8EE] text-[#0B1220] border border-[#E5E8EE] transition-colors truncate"
                    >
                      • Demo P-200 MRP
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Evaluated Section */}
      <section className="py-24 border-b border-[#E5E8EE]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-[#1F4FD8] font-semibold">
              Criteri di Valutazione
            </span>
            <h2 className="h2-section mt-2">Cosa misuriamo nella tua prova.</h2>
            <p className="body-large mt-3">
              Un modello trasparente basato al 70% su calcoli deterministici e al 30% sulla capacità di sintesi per la Direzione.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-frame p-6 space-y-3">
              <span className="font-mono text-2xl font-bold text-[#1F4FD8]">70 pt</span>
              <h3 className="text-sm font-semibold text-[#0B1220]">Calcolo Matematico Esatto</h3>
              <p className="text-xs text-[#5B6475] leading-relaxed">
                Capacità di determinare il momento di rottura scorte (giorno di stockout), calcolare il lotto di riordino rispettando i vincoli MOQ e quantificare l&apos;extracosto versus il danno orario di fermo linea.
              </p>
            </div>

            <div className="card-frame p-6 space-y-3">
              <span className="font-mono text-2xl font-bold text-[#12805C]">30 pt</span>
              <h3 className="text-sm font-semibold text-[#0B1220]">Executive Memo Decisionale</h3>
              <p className="text-xs text-[#5B6475] leading-relaxed">
                Sintesi scritta in 150-200 parole per il Direttore di Stabilimento: motivazione economica della scelta, valutazione del rischio fornitore e chiarezza espositiva.
              </p>
            </div>

            <div className="card-frame p-6 space-y-3">
              <span className="font-mono text-2xl font-bold text-[#0B1220]">Audit</span>
              <h3 className="text-sm font-semibold text-[#0B1220]">Integrità &amp; Focus</h3>
              <p className="text-xs text-[#5B6475] leading-relaxed">
                Rilevamento del tempo di permanenza nella finestra del test e proctoring video per attestare che la prova sia stata svolta in autonomia senza ausili esterni.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Candidate FAQ */}
      <section className="py-24 bg-[#F7F8FA]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <h2 className="h2-section">Domande Frequenti dei Candidati</h2>
          </div>

          <div className="max-w-3xl divide-y divide-[#E5E8EE] border-t border-b border-[#E5E8EE]">
            {candidateFaqs.map((faq, idx) => (
              <div key={idx} className="py-5">
                <h4 className="text-sm font-semibold text-[#0B1220] mb-2">{faq.q}</h4>
                <p className="text-xs sm:text-sm text-[#5B6475] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
