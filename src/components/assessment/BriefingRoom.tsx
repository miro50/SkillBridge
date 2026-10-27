'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Factory,
  Clock,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  Camera,
  Video,
  MonitorOff,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { AssessmentSession } from '@/lib/supabase/client';
import { PublicScenarioConfig } from '@/lib/assessment/parametric';

interface BriefingRoomProps {
  session: AssessmentSession;
  scenario: PublicScenarioConfig;
  onStart: () => void;
  isStarting: boolean;
}

export function BriefingRoom({
  session,
  scenario,
  onStart,
  isStarting,
}: BriefingRoomProps) {
  const [webcamState, setWebcamState] = useState<
    'idle' | 'requesting' | 'active' | 'denied' | 'simulated'
  >('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [consentRules, setConsentRules] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Request webcam stream
  const requestWebcam = async () => {
    setWebcamState('requesting');
    setErrorMessage(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Il browser in uso non supporta l\'accesso video HTML5 MediaDevices.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;
      setWebcamState('active');

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('[BriefingRoom] Webcam access failed or denied:', err);
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'Accesso alla webcam negato dal candidato o dalle impostazioni del browser.'
          : err.name === 'NotFoundError'
          ? 'Nessun dispositivo webcam/fotocamera rilevato su questo computer.'
          : err.message || 'Impossibile inizializzare il feed video.'
      );
      setWebcamState('denied');
    }
  };

  // Allow sandbox simulated mode (for CI, test environments or devices without webcam)
  const enableSimulatedProctoring = () => {
    setWebcamState('simulated');
    setErrorMessage(null);
  };

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Update video element when stream is ready
  useEffect(() => {
    if (webcamState === 'active' && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [webcamState]);

  const isReadyToStart = (webcamState === 'active' || webcamState === 'simulated') && consentRules;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between p-4 md:p-8">
      {/* Header Bar */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center text-white font-bold text-sm tracking-wider">
            SB
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-900 uppercase tracking-tight">
              SkillBridge Assessment Cockpit
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              Modulo: {scenario.role || 'Supply Chain & Operations Specialist'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 font-mono">
            SESSIONE: {session.token.slice(0, 14)}...
          </span>
        </div>
      </header>

      {/* Main Briefing Container */}
      <main className="max-w-4xl mx-auto w-full bg-white border border-slate-200 rounded-md shadow-sm p-6 md:p-8">
        {/* Incident Pre-Flight Banner */}
        <div className="mb-6 p-4 rounded-md bg-amber-50 border border-amber-200 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <span className="font-semibold block uppercase tracking-wider text-xs text-amber-800 mb-1">
              Briefing Operativo Pre-Flight &bull; {scenario.title}
            </span>
            Questa simulazione riproduce un&apos;anomalia reale di stabilimento. Il timer da 25:00
            partirà <strong>esclusivamente</strong> dopo aver verificato la postazione video anti-cheat e cliccato sul pulsante in basso.
          </div>
        </div>

        {/* Candidate & Scenario Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-slate-200 mb-6">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-slate-500 block">Candidato Valutato</span>
            <p className="text-lg font-semibold text-slate-900">{session.candidate_name}</p>
            <p className="text-xs text-slate-600 font-mono">{session.candidate_email}</p>
          </div>
          <div className="space-y-1 md:text-right">
            <span className="text-xs font-mono uppercase text-slate-500 block">Scenario Industriale</span>
            <p className="text-lg font-semibold text-slate-900">{scenario.title}</p>
            <p className="text-xs text-slate-600 font-mono">
              Codice Componente: <span className="font-semibold">{scenario.partNumber}</span> | {scenario.productionLine}
            </p>
          </div>
        </div>

        {/* Operational Context & Mission */}
        <div className="space-y-4 mb-8">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Factory className="w-4 h-4 text-slate-700" />
            <span>Situazione di Stabilimento</span>
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Il fornitore primario storico (<em>{scenario.primarySupplier.name}</em>) ha segnalato un&apos;improvvisa
            interruzione logistica. Il lead time ordinario di <strong>{scenario.primarySupplier.standardLeadTimeDays} giorni</strong> è
            slittato a <strong>{scenario.primarySupplier.disruptedLeadTimeDays} giorni</strong>.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            La <strong>{scenario.productionLine}</strong> opera a ritmo continuo su un turno da {scenario.shiftHoursPerDay} ore,
            con un tasso di consumo giornaliero di <strong>{scenario.dailyConsumption} unità</strong>.
            Ciascuna ora di fermo linea comporta un danno economico stimato in <strong>{scenario.downtimeCostPerHour.toLocaleString('it-IT')} €/ora</strong>.
          </p>
        </div>

        {/* Test Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 border border-slate-200 rounded-md bg-slate-50">
            <div className="flex items-center space-x-2 text-slate-900 font-medium text-sm mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Tempo: 25 Minuti</span>
            </div>
            <p className="text-xs text-slate-600 leading-normal">
              Tempo continuo sincronizzato server-side. Submit automatico al raggiungimento del limite massimo di tolleranza (26 min).
            </p>
          </div>

          <div className="p-4 border border-slate-200 rounded-md bg-slate-50">
            <div className="flex items-center space-x-2 text-slate-900 font-medium text-sm mb-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Calcoli & Decisione</span>
            </div>
            <p className="text-xs text-slate-600 leading-normal">
              Determina data di stockout, giorni di fermo linea, lotto fornitore celere e redigi la memo per il Plant Director.
            </p>
          </div>

          <div className="p-4 border border-slate-200 rounded-md bg-slate-50">
            <div className="flex items-center space-x-2 text-slate-900 font-medium text-sm mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Telemetria & Integrità</span>
            </div>
            <p className="text-xs text-slate-600 leading-normal">
              Protezione attiva anti-copia, anti-incolla e anti-screenshot con monitoraggio continuo per la certificazione del test.
            </p>
          </div>
        </div>

        {/* ================================================================== */}
        {/* VIDEO PROCTORING & ANTI-CHEAT PRE-FLIGHT CHECK                      */}
        {/* ================================================================== */}
        <div className="mb-8 p-5 rounded-md bg-slate-900 text-white border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Verifica Postazione & Protocollo Anti-Cheat Obbligatorio
              </h3>
            </div>
            {webcamState === 'active' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
                ● WEBCAM ATTIVA
              </span>
            )}
            {webcamState === 'simulated' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-blue-950 text-blue-300 border border-blue-800">
                MODALITÀ AUDIT SANDBOX
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Live Camera Preview Box */}
            <div className="relative aspect-video bg-slate-950 rounded border border-slate-800 overflow-hidden flex items-center justify-center">
              {webcamState === 'active' ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                  <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs px-2 py-1 rounded text-[10px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                    <Video className="w-3 h-3 text-emerald-400" />
                    <span>FEED LIVE &bull; VISIBILITÀ OK</span>
                  </div>
                </>
              ) : webcamState === 'simulated' ? (
                <div className="text-center p-4">
                  <ShieldCheck className="w-10 h-10 text-blue-400 mx-auto mb-2 opacity-80" />
                  <p className="text-xs font-mono text-blue-300">
                    Audit Video Simulato Abilitato
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Ambiente di test locale / sandbox per valutazione tecnica
                  </p>
                </div>
              ) : webcamState === 'requesting' ? (
                <div className="text-center p-4">
                  <RefreshCw className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-2" />
                  <p className="text-xs font-mono text-slate-300">
                    Richiesta permessi webcam al browser...
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Fai clic su &quot;Consenti&quot; nella notifica del browser
                  </p>
                </div>
              ) : (
                <div className="text-center p-4">
                  <MonitorOff className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-xs font-mono text-slate-300">
                    Videocamera Non Connessa
                  </p>
                  <button
                    onClick={requestWebcam}
                    type="button"
                    className="mt-3 inline-flex items-center px-3 py-1.5 rounded text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 mr-1.5" />
                    Attiva Videocamera di Controllo
                  </button>
                </div>
              )}
            </div>

            {/* Anti-Cheat Rules & Consent Checklist */}
            <div className="space-y-3 text-xs">
              <div className="space-y-2">
                <div className="flex items-start space-x-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Monitoraggio Video Continuo:</strong> La videocamera registrerà la presenza costante del candidato per prevenire l&apos;uso di dispositivi ausiliari (smartphone, tablet).
                  </span>
                </div>
                <div className="flex items-start space-x-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Blocco Copia, Incolla e Screenshot:</strong> Qualsiasi tentativo di copia testo, incolla da fonti esterne, tasti di sviluppo o screenshot verrà bloccato e inserito nel log d&apos;integrità.
                  </span>
                </div>
                <div className="flex items-start space-x-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Schermo Singolo Obbligatorio:</strong> È vietato l&apos;uso di monitor secondari o switch di finestra durante i 25 minuti di test.
                  </span>
                </div>
              </div>

              {/* Error / Fallback Banner if camera denied */}
              {errorMessage && (
                <div className="p-2.5 rounded bg-amber-950/70 border border-amber-800 text-amber-200 text-[11px] space-y-1.5">
                  <p className="font-semibold">{errorMessage}</p>
                  <p className="text-slate-300 text-[10px]">
                    Per proseguire in ambiente locale o se non disponi di webcam fisica:
                  </p>
                  <button
                    type="button"
                    onClick={enableSimulatedProctoring}
                    className="inline-flex items-center px-2 py-1 rounded bg-amber-700 hover:bg-amber-600 text-white text-[10px] font-mono transition-colors cursor-pointer"
                  >
                    Abilita Proctoring Simulato (Modalità Test)
                  </button>
                </div>
              )}

              {/* Mandatory Candidate Declaration */}
              <div className="pt-2 border-t border-slate-800">
                <label className="flex items-start space-x-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consentRules}
                    onChange={(e) => setConsentRules(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-800"
                  />
                  <span className="text-[11px] text-slate-200 leading-snug">
                    Dichiaro di essere solo/a alla postazione, di non impiegare smartphone o altri dispositivi, e accetto la registrazione del test e il protocollo anti-cheat.
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-200 gap-3">
          <div className="text-xs text-slate-500 font-mono">
            {!isReadyToStart && (
              <span className="text-amber-700 font-sans">
                &bull; Attiva la videocamera e spunta la dichiarazione anti-cheat per sbloccare l&apos;assessment.
              </span>
            )}
          </div>

          <button
            onClick={onStart}
            disabled={!isReadyToStart || isStarting}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
          >
            {isStarting ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Inizializzazione Cockpit...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <span>Accetta Incarico e Avvia Timer (25:00)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            )}
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center text-xs text-slate-400 py-4 font-mono">
        SkillBridge Industrial Assessment Protocol &copy; 2026. Powered by deterministic & AI grading engine with video proctoring.
      </footer>
    </div>
  );
}
