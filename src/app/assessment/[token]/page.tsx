'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { BriefingRoom } from '@/components/assessment/BriefingRoom';
import { RunnerCockpit } from '@/components/assessment/RunnerCockpit';
import { AssessmentSession, CandidateRawAnswers, SessionTelemetry } from '@/lib/supabase/client';
import { PublicScenarioConfig } from '@/lib/assessment/parametric';
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ token: string }>;
}

function AssessmentInner({ params }: PageProps) {
  const { token } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [scenario, setScenario] = useState<PublicScenarioConfig | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(25 * 60);

  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSessionId, setSubmittedSessionId] = useState<string | null>(null);

  // Fetch session data
  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      try {
        setLoading(true);
        const res = await fetch(`/api/assessment/${token}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Link di assessment non valido o scaduto');
        }

        const data = await res.json();
        if (isMounted) {
          let s = data.session as AssessmentSession;

          // Check LocalStorage for recent draft recovery (D3/D4)
          if (typeof window !== 'undefined' && s.status === 'in_progress') {
            try {
              const localSnapshot = localStorage.getItem(`skillbridge_draft_${token}`);
              if (localSnapshot) {
                const parsed = JSON.parse(localSnapshot);
                if (parsed?.answers) {
                  s = {
                    ...s,
                    raw_answers: {
                      ...(s.raw_answers || {}),
                      ...parsed.answers,
                    },
                    telemetry: {
                      ...(s.telemetry || {}),
                      ...(parsed.telemetry || {}),
                    },
                  };
                }
              }
            } catch (storageErr) {
              console.warn('[DraftRecovery] Local snapshot read warning:', storageErr);
            }
          }

          setSession(s);
          setScenario(data.scenario);
          setRemainingSeconds(data.remainingSeconds);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Errore durante il caricamento');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadSession();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Handler: Start assessment from Briefing Room
  const handleStart = async () => {
    setIsStarting(true);
    try {
      const res = await fetch('/api/assessment/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        throw new Error('Errore durante l\'avvio della sessione');
      }

      const data = await res.json();
      setSession(data.session);
      setRemainingSeconds(25 * 60);
    } catch (err: any) {
      alert(err.message || 'Impossibile avviare il test');
    } finally {
      setIsStarting(false);
    }
  };

  // Handler: Periodic Auto-Save
  const handleSaveDraft = async (
    rawAnswers: CandidateRawAnswers,
    telemetry: SessionTelemetry
  ) => {
    try {
      await fetch('/api/assessment/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, rawAnswers, telemetry }),
      });
    } catch (err) {
      console.warn('[SaveDraft] Save failed:', err);
    }
  };

  // Handler: Final Submission
  const handleSubmit = async (
    rawAnswers: CandidateRawAnswers,
    telemetry: SessionTelemetry
  ) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, rawAnswers, telemetry }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Errore durante la sottomissione');
      }

      const data = await res.json();
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`skillbridge_draft_${token}`);
      }

      setSubmittedSessionId(data.sessionId);
      if (data.redirectUrl) {
        router.push(data.redirectUrl);
      }
    } catch (err: any) {
      alert(err.message || 'Errore durante l\'invio');
      setIsSubmitting(false);
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-700">
        <div className="w-8 h-8 border-3 border-slate-900 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-slate-900">
          Caricamento Scenario Industriale...
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-mono">
          Verifica token e calibrazione parametri operativi
        </p>
      </div>
    );
  }

  // 2. Error State / Invalid Token
  if (error || !session || !scenario) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-md p-6 shadow-sm text-center">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-md flex items-center justify-center mx-auto mb-4 border border-red-200">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight mb-2">
            Link Non Valido o Scaduto
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            {error || 'Impossibile reperire i dettagli della sessione richiesta.'} Se ritieni si tratti
            di un errore, contatta il supporto SkillBridge o il recruiter incaricato.
          </p>
          <a
            href="mailto:support@skillbridge.dev"
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-300 transition-colors"
          >
            Contatta il Supporto
          </a>
        </div>
      </div>
    );
  }

  // 3. Already Submitted State
  if (session.status === 'submitted' || submittedSessionId) {
    const targetSessionId = submittedSessionId || session.id;
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-md p-8 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-md flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">
            Assessment Completato con Successo
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            La tua valutazione per lo scenario <strong>{scenario.title}</strong> è stata acquisita e
            registrata nel database. Il motore di grading ha elaborato i punteggi deterministici e la memo semantica.
          </p>
          <div className="pt-2">
            <button
              onClick={() => router.push(`/scorecard/${targetSessionId}`)}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-md text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              <span>Visualizza Scorecard Esecutiva</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Pre-Flight State: Briefing Room
  if (session.status === 'pending') {
    return (
      <BriefingRoom
        session={session}
        scenario={scenario}
        onStart={handleStart}
        isStarting={isStarting}
      />
    );
  }

  // 5. Active State: Dual-Pane Runner Cockpit
  return (
    <RunnerCockpit
      session={session}
      scenario={scenario}
      initialRemainingSeconds={remainingSeconds}
      onSubmit={handleSubmit}
      onSaveDraft={handleSaveDraft}
      isSubmitting={isSubmitting}
    />
  );
}

export default function AssessmentPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
        </div>
      }
    >
      <AssessmentInner params={params} />
    </Suspense>
  );
}
