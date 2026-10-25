'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import { ScorecardView } from '@/components/scorecard/ScorecardView';
import { AssessmentSession, AssessmentEvaluation } from '@/lib/supabase/client';
import { AlertCircle, FileSearch } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

function ScorecardInner({ params }: PageProps) {
  const { id } = use(params);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [evaluation, setEvaluation] = useState<AssessmentEvaluation | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchScorecard() {
      try {
        setLoading(true);
        const res = await fetch(`/api/scorecard/${id}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Scorecard non reperibile o ID inesistente');
        }

        const data = await res.json();
        if (isMounted) {
          setSession(data.session);
          setEvaluation(data.evaluation);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Errore nel caricamento del report');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchScorecard();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 text-slate-700">
        <div className="w-8 h-8 border-3 border-slate-900 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-slate-900">
          Caricamento Scorecard Esecutiva...
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-mono">
          Recupero metriche e valutazione semantica
        </p>
      </div>
    );
  }

  // Error State / Not Found
  if (error || !session || !evaluation) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-md p-6 shadow-sm text-center">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-md flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <FileSearch className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight mb-2">
            Scorecard Non Disponibile
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            {error || 'Impossibile visualizzare la scorecard per la sessione specificata.'}
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-300 transition-colors"
          >
            Torna alla Home
          </a>
        </div>
      </div>
    );
  }

  return <ScorecardView session={session} evaluation={evaluation} />;
}

export default function ScorecardPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 text-slate-700">
          <div className="w-8 h-8 border-3 border-slate-900 border-t-transparent rounded-full animate-spin mb-4" />
          <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-slate-900">
            Caricamento Scorecard...
          </h2>
        </div>
      }
    >
      <ScorecardInner params={params} />
    </Suspense>
  );
}
