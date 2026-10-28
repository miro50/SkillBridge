import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-[#0B1220] flex flex-col font-sans selection:bg-[#1F4FD8] selection:text-white">
      <Navbar />

      <section className="pt-14 pb-16 lg:pt-20 lg:pb-20 border-b border-[#E5E8EE] bg-[#F7F8FA]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-wider text-[#1F4FD8] font-semibold">
              Tutela dei Dati &amp; GDPR
            </span>
            <h1 className="h1-hero mt-3">Informativa sulla Privacy</h1>
            <p className="body-large mt-3">
              Ai sensi del Regolamento UE 2016/679 (GDPR) e delle linee guida europee sull&apos;uso dell&apos;intelligenza artificiale.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-8 text-xs sm:text-sm text-[#5B6475] leading-relaxed">
            <div>
              <h2 className="text-base font-semibold text-[#0B1220] mb-2">1. Titolare del Trattamento</h2>
              <p>
                Il Titolare del trattamento dei dati è SkillBridge Technologies, con sede operativa nei distretti manifatturieri del Nord Italia. Per qualsiasi richiesta relativa alla privacy o per esercitare i propri diritti, è possibile contattare il responsabile della protezione dati all&apos;indirizzo: <a href="mailto:privacy@skillbridge.it" className="text-[#1F4FD8] underline">privacy@skillbridge.it</a>.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#0B1220] mb-2">2. Dati Raccolti e Finalità</h2>
              <p className="mb-2">Raccogliamo e trattiamo esclusivamente i dati strettamente necessari alle finalità di selezione tecnica:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Dati di Contatto Aziendale:</strong> nome, cognome, ragione sociale, email aziendale e numero telefonico del referente per l&apos;erogazione del programma pilota.</li>
                <li><strong>Dati di Svolgimento della Prova:</strong> risposte analitiche allo scenario, calcoli matematici, tempo impiegato e telemetria di permanenza nella finestra (defocus/blur) per attestare l&apos;autenticità della sessione.</li>
                <li><strong>Flussi Video da Webcam (Video Proctoring):</strong> acquisiti unicamente previo consenso espresso del candidato prima dell&apos;avvio della prova, allo scopo esclusivo di verificare la presenza visiva del candidato e scongiurare l&apos;uso di smartphone o aiuti esterni.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#0B1220] mb-2">3. Trasparenza, AI Act e Spiegabilità dell&apos;Algoritmo</h2>
              <p>
                La valutazione tecnica è strutturata per essere trasparente, verificabile e priva di meccanismi opachi (&quot;black box&quot;). Il 70% del punteggio è basato su formule matematiche deterministiche (fabbisogni netti, lotti minimi, stockout). La componente semantica (30%) valuta unicamente la chiarezza argomentativa della memo. Nessun candidato viene escluso o respinto in via puramente automatica: la decisione di convocazione e colloquio resta interamente in capo all&apos;azienda cliente.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#0B1220] mb-2">4. Periodo di Conservazione</h2>
              <p>
                I dati delle sessioni e le registrazioni di verifica vengono conservati per un periodo massimo di 90 giorni dal completamento della selezione, o cancellati anticipatamente su richiesta dell&apos;interessato. Non vendiamo né cediamo dati personali a terze parti commerciali.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#0B1220] mb-2">5. Diritti dell&apos;Interessato</h2>
              <p>
                Ai sensi degli articoli 15-22 del GDPR, il candidato ha diritto di accedere ai propri dati, richiederne la rettifica, la cancellazione o la limitazione del trattamento scrivendo in qualsiasi momento a <a href="mailto:privacy@skillbridge.it" className="text-[#1F4FD8] underline">privacy@skillbridge.it</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
