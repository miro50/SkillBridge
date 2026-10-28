import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function TerminiPage() {
  return (
    <div className="min-h-screen bg-white text-[#0B1220] flex flex-col font-sans selection:bg-[#1F4FD8] selection:text-white">
      <Navbar />

      <section className="pt-14 pb-16 lg:pt-20 lg:pb-20 border-b border-[#E5E8EE] bg-[#F7F8FA]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-wider text-[#1F4FD8] font-semibold">
              Condizioni Contrattuali
            </span>
            <h1 className="h1-hero mt-3">Termini di Servizio</h1>
            <p className="body-large mt-3">
              Condizioni del programma pilota &quot;Linea Aperta&quot; per aziende manifatturiere e candidati.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-8 text-xs sm:text-sm text-[#5B6475] leading-relaxed">
            <div>
              <h2 className="text-base font-semibold text-[#0B1220] mb-2">1. Oggetto del Servizio</h2>
              <p>
                SkillBridge fornisce servizi di recruiting tecnico e pre-validazione delle competenze per figure operative in ambito Ingegneria Gestionale, Supply Chain e Manifattura, mediante simulazioni pratiche da 25 minuti e rilascio di Scorecard Esecutive.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#0B1220] mb-2">2. Condizioni Economiche e Success Fee</h2>
              <p>
                L&apos;attivazione della ricerca è priva di costi fissi, anticipi o canoni di abbonamento. La commissione di successo per il programma pilota (pari all&apos;11% della Retribuzione Annua Lorda concordata) viene fatturata esclusivamente al 90° giorno dalla data di assunzione, a condizione che il periodo di prova sia stato superato con successo.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#0B1220] mb-2">3. Clausola di Garanzia a 180 Giorni</h2>
              <p>
                Qualora il candidato assunto rassegni le proprie dimissioni volontarie entro 180 giorni dalla data di inserimento, SkillBridge si impegna ad avviare senza indugio e senza alcun costo aggiuntivo una nuova sessione di selezione per la medesima posizione.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#0B1220] mb-2">4. Regolamento Prove Candidati</h2>
              <p>
                Il candidato si impegna a svolgere la prova in autonomia, mantenendo la fotocamera attiva per tutta la durata dei 25 minuti ed evitando l&apos;impiego di ausili o secondi monitor non autorizzati. Eventuali violazioni registrate dai sistemi di telemetria comportano l&apos;invalidazione della sessione.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
