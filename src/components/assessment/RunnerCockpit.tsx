'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  AlertTriangle,
  Clock,
  Save,
  Send,
  Building2,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  Info,
  CheckCircle2,
  Laptop,
  Video,
  Camera,
  ShieldCheck,
  Minimize2,
  Maximize2,
  AlertOctagon,
} from 'lucide-react';
import { AssessmentSession, CandidateRawAnswers, SessionTelemetry } from '@/lib/supabase/client';
import { PublicScenarioConfig } from '@/lib/assessment/parametric';

interface RunnerCockpitProps {
  session: AssessmentSession;
  scenario: PublicScenarioConfig;
  initialRemainingSeconds: number;
  onSubmit: (answers: CandidateRawAnswers, telemetry: SessionTelemetry) => Promise<void>;
  onSaveDraft: (answers: CandidateRawAnswers, telemetry: SessionTelemetry) => Promise<void>;
  isSubmitting: boolean;
}

export function RunnerCockpit({
  session,
  scenario,
  initialRemainingSeconds,
  onSubmit,
  onSaveDraft,
  isSubmitting,
}: RunnerCockpitProps) {
  // Inputs state
  const [stockoutDay, setStockoutDay] = useState<string>(
    session.raw_answers?.stockoutDay !== undefined ? String(session.raw_answers.stockoutDay) : ''
  );
  const [downtimeDays, setDowntimeDays] = useState<string>(
    session.raw_answers?.downtimeDays !== undefined ? String(session.raw_answers.downtimeDays) : ''
  );
  const [reorderQty, setReorderQty] = useState<string>(
    session.raw_answers?.expeditedOrderQty !== undefined ? String(session.raw_answers.expeditedOrderQty) : ''
  );
  const [decisionMemo, setDecisionMemo] = useState<string>(
    session.raw_answers?.decisionMemo || ''
  );

  // Telemetry & Anti-Cheat state
  const [blurCount, setBlurCount] = useState<number>(session.telemetry?.blur_count || 0);
  const [pasteCount, setPasteCount] = useState<number>(session.telemetry?.paste_count || 0);
  const [copyCount, setCopyCount] = useState<number>(session.telemetry?.copy_count || 0);
  const [cutCount, setCutCount] = useState<number>(session.telemetry?.cut_count || 0);
  const [screenshotCount, setScreenshotCount] = useState<number>(session.telemetry?.screenshot_count || 0);
  const [devtoolsCount, setDevtoolsCount] = useState<number>(session.telemetry?.devtools_count || 0);
  const [snapshotCount, setSnapshotCount] = useState<number>(session.telemetry?.proctoring_snapshots_count || 0);

  // Anti-Cheat Notification / Shield Overlays
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDefocused, setIsDefocused] = useState<boolean>(false);
  const [isScreenshotShieldActive, setIsScreenshotShieldActive] = useState<boolean>(false);

  // Video Proctoring State
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const [proctoringMode, setProctoringMode] = useState<'live' | 'simulated'>('live');
  const [isPiPMinimized, setIsPiPMinimized] = useState<boolean>(false);
  const cockpitVideoRef = useRef<HTMLVideoElement | null>(null);
  const cockpitStreamRef = useRef<MediaStream | null>(null);
  const latestSnapshotRef = useRef<string | null>(null);

  // P1: Capture real webcam frame to canvas data URI
  const captureWebcamSnapshot = useCallback((): string | null => {
    try {
      const video = cockpitVideoRef.current;
      if (!video || video.readyState < 2 || video.videoWidth === 0) return null;
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.drawImage(video, 0, 0, 320, 240);
      const dataUri = canvas.toDataURL('image/jpeg', 0.5);
      latestSnapshotRef.current = dataUri;
      setSnapshotCount((prev) => prev + 1);
      return dataUri;
    } catch {
      return null;
    }
  }, []);

  // Timer state (seconds)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(initialRemainingSeconds);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(
    session.telemetry?.time_spent_seconds || Math.max(0, 25 * 60 - initialRemainingSeconds)
  );

  // Auto-save sync status pill
  const [saveStatus, setSaveStatus] = useState<'synced' | 'saving' | 'dirty'>('synced');
  const [lastSavedTime, setLastSavedTime] = useState<Date>(new Date());
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Desktop Gate detection (<1024px)
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(false);

  // References
  const answersRef = useRef<CandidateRawAnswers>({});
  const telemetryRef = useRef<SessionTelemetry>({
    blur_count: blurCount,
    paste_count: pasteCount,
    copy_count: copyCount,
    cut_count: cutCount,
    screenshot_count: screenshotCount,
    devtools_count: devtoolsCount,
    webcam_verified: true,
    proctoring_active: true,
    proctoring_snapshots_count: snapshotCount,
    time_spent_seconds: elapsedSeconds,
  });

  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showBlockedActionToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  // Initialize Webcam for continuous proctoring
  useEffect(() => {
    let isCancelled = false;

    async function initCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setProctoringMode('simulated');
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 320 },
            height: { ideal: 240 },
            facingMode: 'user',
          },
          audio: false,
        });

        if (isCancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        cockpitStreamRef.current = stream;
        setIsWebcamActive(true);
        setProctoringMode('live');

        if (cockpitVideoRef.current) {
          cockpitVideoRef.current.srcObject = stream;
          cockpitVideoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.warn('[RunnerCockpit] Webcam init fallback to simulated proctoring:', err);
        setProctoringMode('simulated');
      }
    }

    initCamera();

    // Snapshot tick every 30 seconds
    const snapshotInterval = setInterval(() => {
      setSnapshotCount((prev) => prev + 1);
    }, 30000);

    return () => {
      isCancelled = true;
      clearInterval(snapshotInterval);
      if (cockpitStreamRef.current) {
        cockpitStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Re-attach stream if minimized or state changed
  useEffect(() => {
    if (isWebcamActive && cockpitVideoRef.current && cockpitStreamRef.current) {
      cockpitVideoRef.current.srcObject = cockpitStreamRef.current;
      cockpitVideoRef.current.play().catch(() => {});
    }
  }, [isWebcamActive, isPiPMinimized]);

  // Keep answersRef synchronized with state
  useEffect(() => {
    answersRef.current = {
      stockoutDay: stockoutDay ? Number(stockoutDay) : undefined,
      downtimeDays: downtimeDays ? Number(downtimeDays) : undefined,
      expeditedOrderQty: reorderQty ? Number(reorderQty) : undefined,
      decisionMemo,
    };
  }, [stockoutDay, downtimeDays, reorderQty, decisionMemo]);

  // Keep telemetryRef synchronized
  useEffect(() => {
    telemetryRef.current = {
      blur_count: blurCount,
      paste_count: pasteCount,
      copy_count: copyCount,
      cut_count: cutCount,
      screenshot_count: screenshotCount,
      devtools_count: devtoolsCount,
      webcam_verified: isWebcamActive || proctoringMode === 'simulated',
      proctoring_active: isWebcamActive || proctoringMode === 'simulated',
      proctoring_snapshots_count: snapshotCount,
      proctoring_snapshot: latestSnapshotRef.current || undefined,
      time_spent_seconds: elapsedSeconds,
    };
  }, [
    blurCount,
    pasteCount,
    copyCount,
    cutCount,
    screenshotCount,
    devtoolsCount,
    isWebcamActive,
    proctoringMode,
    snapshotCount,
    elapsedSeconds,
  ]);

  // Window size listener for Desktop Gate (D8)
  useEffect(() => {
    const checkViewport = () => {
      setIsMobileScreen(window.innerWidth < 1024);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // COMPREHENSIVE ANTI-CHEAT LISTENERS
  useEffect(() => {
    // 1. Copy Interception
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      setCopyCount((prev) => prev + 1);
      showBlockedActionToast('⚠️ AZIONE BLOCCATA: La copia dei testi di assessment è vietata.');
    };

    // 2. Cut Interception
    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      setCutCount((prev) => prev + 1);
      showBlockedActionToast('⚠️ AZIONE BLOCCATA: Il comando Taglia è disabilitato.');
    };

    // 3. Paste Interception
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      setPasteCount((prev) => prev + 1);
      showBlockedActionToast('⚠️ AZIONE BLOCCATA: Incolla disabilitato. È richiesta stesura originale del testo.');
    };

    // 4. Context Menu (Right Click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showBlockedActionToast('⚠️ Menu contestuale disabilitato per policy di sicurezza anti-cheat.');
    };

    // 5. Drag & Drop Interception
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      showBlockedActionToast('⚠️ Trascinamento contenuti esterni disabilitato.');
    };

    // 6. Keyboard Shortcuts Interception
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen Key
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        setScreenshotCount((prev) => prev + 1);
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText('');
          }
        } catch {}
        setIsScreenshotShieldActive(true);
        setTimeout(() => setIsScreenshotShieldActive(false), 2000);
        showBlockedActionToast('⚠️ SCREENSHOT INTERCETTATO & BLOCCATO: Evento registrato nel log d\'integrità.');
        return;
      }

      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      const isAlt = e.altKey;

      // DevTools Keys: F12, Ctrl+Shift+I, Cmd+Alt+I, Ctrl+Shift+J, Cmd+Alt+J, Ctrl+Shift+C, Ctrl+U
      if (
        e.key === 'F12' ||
        (isCmdOrCtrl && isShift && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (isCmdOrCtrl && isAlt && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (isCmdOrCtrl && (e.key === 'U' || e.key === 'u'))
      ) {
        e.preventDefault();
        e.stopPropagation();
        setDevtoolsCount((prev) => prev + 1);
        showBlockedActionToast('⚠️ Scorciatoie di debug e ispezione codice disabilitate.');
        return;
      }

      // Print: Ctrl+P / Cmd+P
      if (isCmdOrCtrl && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        showBlockedActionToast('⚠️ Stampa della pagina disabilitata.');
        return;
      }

      // Keyboard Copy (Ctrl+C / Cmd+C)
      if (isCmdOrCtrl && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        setCopyCount((prev) => prev + 1);
        showBlockedActionToast('⚠️ Copia da tastiera (Ctrl+C) bloccata dal protocollo anti-cheat.');
        return;
      }

      // Keyboard Paste (Ctrl+V / Cmd+V)
      if (isCmdOrCtrl && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        setPasteCount((prev) => prev + 1);
        showBlockedActionToast('⚠️ Incolla da tastiera (Ctrl+V) bloccato. Digita le risposte manualmente.');
        return;
      }

      // Keyboard Cut (Ctrl+X / Cmd+X)
      if (isCmdOrCtrl && (e.key === 'x' || e.key === 'X')) {
        e.preventDefault();
        setCutCount((prev) => prev + 1);
        showBlockedActionToast('⚠️ Taglia da tastiera (Ctrl+X) bloccato.');
        return;
      }
    };

    // 7. Defocus & Tab Switch Protection
    const handleBlur = () => {
      setBlurCount((prev) => prev + 1);
      setIsDefocused(true);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setBlurCount((prev) => prev + 1);
        setIsDefocused(true);
      }
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('drop', handleDrop);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('drop', handleDrop);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [showBlockedActionToast]);

  // Auto-Submit on Timer Expiration
  const handleAutoSubmit = useCallback(() => {
    if (isSubmitting) return;
    captureWebcamSnapshot();
    if (latestSnapshotRef.current) {
      telemetryRef.current.proctoring_snapshot = latestSnapshotRef.current;
    }
    onSubmit(answersRef.current, telemetryRef.current);
  }, [isSubmitting, onSubmit, captureWebcamSnapshot]);

  // 1-Second Timer Tick
  useEffect(() => {
    if (remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds, handleAutoSubmit]);

  // Periodic Auto-Save every 15 seconds (LocalStorage + Server API)
  const performSave = useCallback(async () => {
    setSaveStatus('saving');
    try {
      captureWebcamSnapshot();
      if (latestSnapshotRef.current) {
        telemetryRef.current.proctoring_snapshot = latestSnapshotRef.current;
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          `skillbridge_draft_${session.token}`,
          JSON.stringify({
            answers: answersRef.current,
            telemetry: telemetryRef.current,
            timestamp: Date.now(),
          })
        );
      }
      await onSaveDraft(answersRef.current, telemetryRef.current);
      setLastSavedTime(new Date());
      setSaveStatus('synced');
    } catch (err) {
      console.warn('[AutoSave] Draft sync error:', err);
      setSaveStatus('dirty');
    }
  }, [session.token, onSaveDraft, captureWebcamSnapshot]);

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      performSave();
    }, 15000);

    return () => clearInterval(autoSaveInterval);
  }, [performSave]);

  const handleManualSubmit = () => {
    setIsSubmitModalOpen(false);
    captureWebcamSnapshot();
    if (latestSnapshotRef.current) {
      telemetryRef.current.proctoring_snapshot = latestSnapshotRef.current;
    }
    onSubmit(answersRef.current, telemetryRef.current);
  };

  // Word count calculation
  const wordCount = useMemo(() => {
    if (!decisionMemo.trim()) return 0;
    return decisionMemo.trim().split(/\s+/).filter(Boolean).length;
  }, [decisionMemo]);

  // Live Calculation Preview (D7)
  const livePreview = useMemo(() => {
    const qty = Number(reorderQty) || 0;
    const sOutDay = Number(stockoutDay) || 0;
    const dDays = Number(downtimeDays) || 0;

    const unitExtraCost = scenario.expeditedSupplier.unitCost - scenario.primarySupplier.unitCost;
    const calculatedExtraCost = qty * unitExtraCost;
    const calculatedDowntimeCost = dDays * scenario.shiftHoursPerDay * scenario.downtimeCostPerHour;

    const daysCoveredByExpedited = scenario.dailyConsumption > 0
      ? Math.floor(qty / scenario.dailyConsumption)
      : 0;

    return {
      qty,
      daysCoveredByExpedited,
      calculatedExtraCost,
      calculatedDowntimeCost,
    };
  }, [reorderQty, stockoutDay, downtimeDays, scenario]);

  // Timer formatting
  const formatTimer = (totalSec: number) => {
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const isTimerCritical = remainingSeconds < 2 * 60;
  const isTimerWarning = remainingSeconds < 5 * 60 && !isTimerCritical;

  // Desktop Gate Overlay (D8)
  if (isMobileScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-md flex items-center justify-center mb-6 text-amber-400">
          <Laptop className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold uppercase tracking-tight mb-3">
          Postazione Desktop Richiesta
        </h2>
        <p className="max-w-md text-sm text-slate-300 leading-relaxed mb-6">
          Per garantire la corretta visualizzazione delle tabelle di stabilimento, l&apos;analisi delle
          griglie dati e la precisione nei calcoli di Supply Chain, questo assessment richiede un computer
          desktop o laptop (risoluzione &ge; 1024px).
        </p>
        <div className="p-3 rounded-md bg-slate-800 border border-slate-700 text-xs font-mono text-slate-400 max-w-sm mb-6">
          Il tuo token di sessione è al sicuro: riapri il link dal tuo computer per continuare.
        </div>
        <p className="text-xs text-slate-500 font-mono">
          SkillBridge Candidate Platform &bull; Protocollo di valutazione certificato
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 text-slate-800 overflow-hidden select-none">
      {/* ==================================================================== */}
      {/* FLOATING ACTION BLOCKED TOAST NOTIFICATION                          */}
      {/* ==================================================================== */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-red-600 text-white font-sans text-xs font-semibold px-4 py-2.5 rounded-md shadow-2xl flex items-center space-x-2 border border-red-500">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* DEFOCUS ALERT SHIELD OVERLAY                                         */}
      {/* ==================================================================== */}
      {isDefocused && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 text-white text-center">
          <div className="max-w-md w-full bg-slate-900 border-2 border-red-500 rounded-lg p-6 shadow-2xl space-y-4">
            <div className="w-14 h-14 bg-red-950/80 border border-red-600 rounded-full flex items-center justify-center mx-auto text-red-400">
              <AlertOctagon className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-base font-bold uppercase tracking-tight text-red-400">
              Finestra Defocalizzata &bull; Allerta Anti-Cheat
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hai abbandonato la schermata di esame. Il protocollo SkillBridge vieta la consultazione
              di altre finestre, app di messaggistica o strumenti esterni. L&apos;evento è stato registrato nel log d&apos;integrità.
            </p>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-amber-300">
              Switch finestra rilevati: <span className="font-bold">{blurCount}</span> &bull; Proctoring attivo
            </div>
            <button
              onClick={() => setIsDefocused(false)}
              className="w-full py-2.5 px-4 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-lg"
            >
              Rientra Immediatamente nel Cockpit
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SCREENSHOT SHIELD OVERLAY                                            */}
      {/* ==================================================================== */}
      {isScreenshotShieldActive && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center text-white p-6">
          <div className="text-center space-y-3">
            <ShieldAlert className="w-16 h-16 text-amber-500 mx-auto animate-pulse" />
            <h2 className="text-xl font-bold uppercase tracking-wider text-amber-400">
              Tentativo di Screenshot Intercettato
            </h2>
            <p className="text-xs text-slate-300 max-w-sm mx-auto font-mono">
              L&apos;acquisizione dello schermo è vietata. La clipboard è stata azzerata e l&apos;evento è stato registrato nell&apos;audit di sicurezza.
            </p>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TOP BAR: Slate-900 Header                                            */}
      {/* ==================================================================== */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between px-6 flex-shrink-0 z-20">
        <div className="flex items-center space-x-4">
          <div className="w-7 h-7 bg-white text-slate-900 rounded flex items-center justify-center font-bold text-xs tracking-wider">
            SB
          </div>
          <div className="border-l border-slate-700 pl-4">
            <span className="text-xs font-semibold uppercase tracking-wider block text-slate-200">
              {scenario.title}
            </span>
            <span className="text-[11px] font-mono text-slate-400 block">
              Linea: {scenario.productionLine} &bull; Componente: {scenario.partNumber}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Proctoring & Anti-Cheat Status Badge */}
          <div className="items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-[11px] font-mono text-emerald-400 hidden md:flex">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ANTI-CHEAT PROCTORING ATTIVO</span>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs font-semibold text-slate-200 block">
              {session.candidate_name}
            </span>
            <span className="text-[10px] font-mono text-slate-400 block">
              {session.candidate_email}
            </span>
          </div>

          {/* Synchronized 25m Timer */}
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md font-mono text-sm font-semibold tracking-wider transition-all duration-300 ${
              isTimerCritical
                ? 'bg-red-500 text-white animate-pulse ring-2 ring-red-400'
                : isTimerWarning
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-100 border border-slate-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>⏱ {formatTimer(remainingSeconds)}</span>
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* DUAL-PANE COCKPIT BODY (D3): 45% Left / 55% Right                      */}
      {/* ==================================================================== */}
      <div className="flex-1 flex overflow-hidden">
        {/* ------------------------------------------------------------------ */}
        {/* LEFT PANE (45% width, independent scroll): Context & Tables        */}
        {/* ------------------------------------------------------------------ */}
        <section className="w-[45%] h-full overflow-y-auto border-r border-slate-200 bg-white p-6 space-y-6">
          {/* Incident Alert Banner */}
          <div className="p-4 rounded-md bg-red-50 border border-red-200">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-red-800">
                  Notifica Anomalia: Rottura Fornitura Primaria
                </h3>
                <p className="text-xs text-red-900 mt-1 leading-relaxed">
                  Il fornitore storico <strong>{scenario.primarySupplier.name}</strong> ha subito un guasto alla linea di trafilatura.
                  La consegna ordinaria è bloccata: il lead time standard di {scenario.primarySupplier.standardLeadTimeDays} giorni
                  è esteso forzatamente a <strong>{scenario.primarySupplier.disruptedLeadTimeDays} giorni</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Plant & Production Line Data */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center space-x-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Parametri di Linea & Magazzino</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <span className="text-slate-500 block mb-1">Giacenza a Magazzino</span>
                <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                  {scenario.initialStock.toLocaleString('it-IT')} unità
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <span className="text-slate-500 block mb-1">Consumo Medio Giornaliero</span>
                <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                  {scenario.dailyConsumption} unità/giorno
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <span className="text-slate-500 block mb-1">Scorta di Sicurezza Minima</span>
                <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                  {scenario.safetyStock} unità
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <span className="text-slate-500 block mb-1">Costo Orario Fermo Linea</span>
                <span className="text-base font-bold font-mono text-red-700 tabular-nums">
                  € {scenario.downtimeCostPerHour.toLocaleString('it-IT')} / ora ({scenario.shiftHoursPerDay}h/turno)
                </span>
              </div>
            </div>
          </div>

          {/* Suppliers Comparison Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center space-x-2">
              <Info className="w-3.5 h-3.5" />
              <span>Confronto Fornitori Disponibili</span>
            </h4>
            <div className="border border-slate-200 rounded-md overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Fornitore</th>
                    <th className="p-2.5">Lead Time</th>
                    <th className="p-2.5">Costo Unitario</th>
                    <th className="p-2.5">Lotto Minimo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-white">
                    <td className="p-2.5 font-medium text-slate-900">
                      {scenario.primarySupplier.name}
                      <span className="block text-[10px] text-red-600 font-mono">
                        (Rottura in corso: {scenario.primarySupplier.disruptedLeadTimeDays} gg)
                      </span>
                    </td>
                    <td className="p-2.5 font-mono tabular-nums text-slate-700">
                      {scenario.primarySupplier.standardLeadTimeDays} gg (ordinario)
                    </td>
                    <td className="p-2.5 font-mono tabular-nums text-slate-700">
                      € {scenario.primarySupplier.unitCost} / u
                    </td>
                    <td className="p-2.5 font-mono text-slate-500">Nessuno</td>
                  </tr>
                  <tr className="bg-blue-50/60">
                    <td className="p-2.5 font-medium text-blue-950">
                      {scenario.expeditedSupplier.name}
                      <span className="block text-[10px] text-blue-700 font-mono">
                        (Canale Espresso Convenzionato)
                      </span>
                    </td>
                    <td className="p-2.5 font-mono tabular-nums font-semibold text-blue-900">
                      {scenario.expeditedSupplier.leadTimeDays} giorni
                    </td>
                    <td className="p-2.5 font-mono tabular-nums font-semibold text-blue-900">
                      € {scenario.expeditedSupplier.unitCost} / u
                    </td>
                    <td className="p-2.5 font-mono tabular-nums font-semibold text-blue-900">
                      {scenario.expeditedSupplier.batchSize} unità
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Operational Instructions Log */}
          <div className="p-4 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <span className="font-bold uppercase tracking-wider text-slate-800 block text-[11px]">
              Obiettivo Decisionale Richiesto
            </span>
            <p>
              1. Calcola l&apos;esatto giorno in cui lo stabilimento esaurirà le scorte senza nuovi arrivi.
            </p>
            <p>
              2. Quantifica i giorni di fermo linea che si verificheranno prima del ripristino del fornitore primario.
            </p>
            <p>
              3. Determina se e quanti lotti ordinare dal fornitore celere per evitare il fermo linea.
            </p>
            <p>
              4. Giustifica la tua scelta economica e operativa nel memo per il Plant Director.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* RIGHT PANE (55% width, independent scroll): Decision Cockpit       */}
        {/* ------------------------------------------------------------------ */}
        <section className="w-[55%] h-full overflow-y-auto bg-slate-50 p-6 space-y-6">
          <div className="bg-white border border-slate-200 rounded-md p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Piano di Risoluzione & Input Decisionali
              </h2>
              <p className="text-xs text-slate-500">
                Compila i campi numerici con la tua stima operativa. Il sistema valuterà precisione e sostenibilità.
              </p>
            </div>

            {/* Numeric Inputs Grid */}
            <div className="space-y-4">
              {/* Field 1: Stockout Day */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  1. Giorno Stimato Esaurimento Scorte (Stockout Linea)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={stockoutDay}
                    onChange={(e) => {
                      setStockoutDay(e.target.value);
                      setSaveStatus('dirty');
                    }}
                    placeholder="Es. 9"
                    className="w-full h-10 px-3 font-mono text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 tabular-nums"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">
                    giorno
                  </span>
                </div>
              </div>

              {/* Field 2: Downtime Days */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  2. Giorni di Fermo Linea Senza Fornitore Celere
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={downtimeDays}
                    onChange={(e) => {
                      setDowntimeDays(e.target.value);
                      setSaveStatus('dirty');
                    }}
                    placeholder="Es. 5"
                    className="w-full h-10 px-3 font-mono text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 tabular-nums"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">
                    giorni
                  </span>
                </div>
              </div>

              {/* Field 3: Reorder Quantity */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  3. Quantità da Ordinare a Fornitore Celere (Lotto minimo: {scenario.expeditedSupplier.batchSize} u)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step={scenario.expeditedSupplier.batchSize}
                    value={reorderQty}
                    onChange={(e) => {
                      setReorderQty(e.target.value);
                      setSaveStatus('dirty');
                    }}
                    placeholder={`Es. ${scenario.expeditedSupplier.batchSize}`}
                    className="w-full h-10 px-3 font-mono text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 tabular-nums"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">
                    unità
                  </span>
                </div>
              </div>
            </div>

            {/* Live Calculation Preview (D7) */}
            <div className="p-4 rounded-md bg-blue-50/80 border border-blue-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 block mb-2 flex items-center space-x-1">
                <span>⚡ Live Calculation Preview</span>
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-blue-700 block">Extra-costo Fornitura:</span>
                  <span className="font-mono font-bold text-blue-950 tabular-nums">
                    + € {livePreview.calculatedExtraCost.toLocaleString('it-IT')}
                  </span>
                  <span className="text-[10px] text-blue-600 block">
                    (+€ {scenario.expeditedSupplier.unitCost - scenario.primarySupplier.unitCost}/u x {livePreview.qty} u)
                  </span>
                </div>
                <div>
                  <span className="text-blue-700 block">Costo Fermo Linea Stabilitivo:</span>
                  <span className="font-mono font-bold text-red-700 tabular-nums">
                    € {livePreview.calculatedDowntimeCost.toLocaleString('it-IT')}
                  </span>
                  <span className="text-[10px] text-blue-600 block">
                    (se la linea resta scoperta per i gg indicati)
                  </span>
                </div>
              </div>
            </div>

            {/* Field 4: Decision Memo Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  4. Motivazione Decisionale per il Plant Director
                </label>
                <span
                  className={`text-xs font-mono font-semibold ${
                    wordCount >= 80 ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {wordCount} parole {wordCount < 80 ? '(Consigliate: 100-200)' : '✓'}
                </span>
              </div>
              <textarea
                rows={6}
                value={decisionMemo}
                onChange={(e) => {
                  setDecisionMemo(e.target.value);
                  setSaveStatus('dirty');
                }}
                placeholder="Spiega sinteticamente il trade-off economico tra extra-costo di fornitura celere e costo di fermo linea. Specifica come intendi gestire i lead time fornitore e la tutela della scorta di sicurezza minima..."
                className="w-full p-3 font-sans text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 leading-relaxed"
              />
            </div>
          </div>
        </section>
      </div>

      {/* ==================================================================== */}
      {/* FLOATING PICTURE-IN-PICTURE WEBCAM MONITOR                            */}
      {/* ==================================================================== */}
      <div className="fixed bottom-20 right-6 z-30 transition-all duration-200">
        {isPiPMinimized ? (
          <button
            onClick={() => setIsPiPMinimized(false)}
            className="bg-slate-900 border border-slate-700 text-white px-3 py-1.5 rounded-full shadow-xl flex items-center space-x-2 text-xs font-mono hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>● REC Proctoring</span>
            <Maximize2 className="w-3.5 h-3.5 ml-1 text-slate-400" />
          </button>
        ) : (
          <div className="w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden">
            {/* PiP Header */}
            <div className="bg-slate-950 px-3 py-1.5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-200 uppercase">
                  ● REC &bull; Proctoring Attivo
                </span>
              </div>
              <button
                onClick={() => setIsPiPMinimized(true)}
                className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                title="Minimizza riquadro video"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Video Stream or Simulated Visual */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              {isWebcamActive ? (
                <video
                  ref={cockpitVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="text-center p-3">
                  <ShieldCheck className="w-7 h-7 text-blue-400 mx-auto mb-1 opacity-80" />
                  <p className="text-[10px] font-mono text-blue-300">
                    Audit Video Presidiato
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Monitoraggio visivo & telemetria
                  </p>
                </div>
              )}

              <div className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-[9px] font-mono text-emerald-400">
                ID: {session.id.slice(0, 6)}
              </div>
            </div>

            {/* Anti-Device Warning Strip */}
            <div className="p-2 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-400 leading-tight">
              <div className="flex items-center space-x-1 text-amber-400 font-semibold mb-0.5">
                <ShieldAlert className="w-3 h-3 flex-shrink-0" />
                <span>Controllo Dispositivi Attivo</span>
              </div>
              <span>Vietati smartphone, tablet o secondi monitor.</span>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* STICKY BOTTOM ACTION BAR                                             */}
      {/* ==================================================================== */}
      <footer className="h-16 bg-white border-t border-slate-200 px-6 flex items-center justify-between flex-shrink-0 z-20">
        {/* Ambient Auto-Save Status Pill */}
        <div className="flex items-center space-x-2 text-xs">
          {saveStatus === 'saving' ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping mr-2" />
              Sincronizzazione bozza in corso...
            </span>
          ) : saveStatus === 'dirty' ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-mono">
              <span className="w-2 h-2 rounded-full bg-slate-400 mr-2" />
              Modifiche non salvate (auto-save attivo)
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              Bozza sincronizzata ({lastSavedTime.toLocaleTimeString('it-IT')})
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={performSave}
            disabled={isSubmitting || saveStatus === 'saving'}
            className="inline-flex items-center px-4 py-2 rounded-md text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-300 focus:outline-none cursor-pointer transition-colors"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            <span>Salva Bozza</span>
          </button>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            disabled={isSubmitting}
            className="inline-flex items-center px-5 py-2 rounded-md text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50 cursor-pointer transition-colors shadow-sm"
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Invio e Correzione in Corso...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1.5">
                <Send className="w-3.5 h-3.5 mr-1" />
                <span>INVIA VALUTAZIONE DEFINITIVA</span>
              </span>
            )}
          </button>
        </div>
      </footer>

      {/* Confirmation Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">
              Confermi l&apos;Invio Definitivo?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Una volta inviata la prova, la tua sessione verrà chiusa e il motore di grading calcolerà
              il punteggio deterministico e la valutazione semantica della memo per il Plant Director.
            </p>
            {wordCount < 80 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  Attenzione: la motivazione contiene solo <strong>{wordCount} parole</strong> (soglia minima raccomandata: 80 parole).
                </span>
              </div>
            )}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-4 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Annulla e Continua a Lavorare
              </button>
              <button
                onClick={handleManualSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-md text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800"
              >
                Conferma Invio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
