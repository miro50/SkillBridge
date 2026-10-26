'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  UserPlus,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  ExternalLink,
  Copy,
  Check,
  ShieldAlert,
  ArrowUpDown,
  RefreshCw,
  Edit3,
  MessageSquare,
  Lock,
  ChevronRight,
  Factory
} from 'lucide-react';
import { SessionWithEvaluation } from '@/lib/supabase/client';

export default function AdminPage() {
  const [sessions, setSessions] = useState<SessionWithEvaluation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // New Invite Modal State
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [candidateName, setCandidateName] = useState<string>('');
  const [candidateEmail, setCandidateEmail] = useState<string>('');
  const [customToken, setCustomToken] = useState<string>('');
  const [isCreatingInvite, setIsCreatingInvite] = useState<boolean>(false);
  const [inviteResult, setInviteResult] = useState<{
    invitationUrl: string;
    prewrittenMessage: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedMessage, setCopiedMessage] = useState<boolean>(false);

  // Override Modal State
  const [overrideModalSession, setOverrideModalSession] = useState<SessionWithEvaluation | null>(
    null
  );
  const [overrideScore, setOverrideScore] = useState<string>('');
  const [overrideNotes, setOverrideNotes] = useState<string>('');
  const [isSavingOverride, setIsSavingOverride] = useState<boolean>(false);

  // Fetch all sessions
  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/sessions');
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Errore nel caricamento dei dati');
      }
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (err: any) {
      setError(err.message || 'Impossibile connettersi al server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Handle Create Invite
  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || !candidateEmail.trim()) {
      alert('Inserisci nome ed email del candidato');
      return;
    }

    try {
      setIsCreatingInvite(true);
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_name: candidateName,
          candidate_email: candidateEmail,
          customToken: customToken || undefined,
          scenario_id: 'valvola-v104',
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Errore durante la creazione');
      }

      const data = await res.json();
      setInviteResult({
        invitationUrl: data.invitationUrl,
        prewrittenMessage: data.prewrittenMessage,
      });

      // Refresh table in background
      fetchSessions();
    } catch (err: any) {
      alert(err.message || 'Errore nella generazione dell\'invito');
    } finally {
      setIsCreatingInvite(false);
    }
  };

  // Handle Save Override
  const handleSaveOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideModalSession) return;

    try {
      setIsSavingOverride(true);
      const res = await fetch('/api/admin/override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: overrideModalSession.session.id,
          overrideScore: overrideScore.trim() === '' ? null : Number(overrideScore),
          notes: overrideNotes.trim() === '' ? null : overrideNotes,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Errore durante il salvataggio');
      }

      setOverrideModalSession(null);
      fetchSessions();
    } catch (err: any) {
      alert(err.message || 'Errore nell\'aggiornamento dell\'override');
    } finally {
      setIsSavingOverride(false);
    }
  };

  // KPIs
  const kpis = useMemo(() => {
    const total = sessions.length;
    const pending = sessions.filter((s) => s.session.status === 'pending').length;
    const inProgress = sessions.filter((s) => s.session.status === 'in_progress').length;
    const submitted = sessions.filter((s) => s.session.status === 'submitted').length;
    const interviewRequests = sessions.filter(
      (s) => s.evaluation?.interview_requested_at !== null && s.evaluation?.interview_requested_at !== undefined
    ).length;

    const recommended = sessions.filter(
      (s) => s.evaluation?.recommendation_badge === 'consigliato'
    ).length;

    return { total, pending, inProgress, submitted, interviewRequests, recommended };
  }, [sessions]);

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter((item) => {
      const { session, evaluation } = item;
      const q = searchQuery.toLowerCase();

      const matchesQuery =
        session.candidate_name.toLowerCase().includes(q) ||
        session.candidate_email.toLowerCase().includes(q) ||
        session.token.toLowerCase().includes(q);

      if (!matchesQuery) return false;

      if (statusFilter === 'all') return true;
      if (statusFilter === 'pending') return session.status === 'pending';
      if (statusFilter === 'in_progress') return session.status === 'in_progress';
      if (statusFilter === 'submitted') return session.status === 'submitted';
      if (statusFilter === 'interview') return Boolean(evaluation?.interview_requested_at);
      if (statusFilter === 'recommended') return evaluation?.recommendation_badge === 'consigliato';

      return true;
    });
  }, [sessions, searchQuery, statusFilter]);

  const copyToClipboard = async (text: string, isMessage: boolean) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isMessage) {
        setCopiedMessage(true);
        setTimeout(() => setCopiedMessage(false), 2000);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch {
      alert('Impossibile copiare negli appunti');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center font-mono font-bold text-white text-sm hover:bg-blue-500 transition-colors"
            >
              SB
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base">
                  Founder Operations Cockpit
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700">
                  Admin Panel
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Gestione pipeline candidati & verifiche scorecard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchSessions}
              disabled={loading}
              className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors text-xs flex items-center gap-1.5"
              title="Aggiorna dati"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Aggiorna</span>
            </button>

            <button
              onClick={() => {
                setShowInviteModal(true);
                setInviteResult(null);
                setCandidateName('');
                setCandidateEmail('');
                setCustomToken('');
              }}
              className="px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Nuovo Invito Candidato</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5">
            <div className="text-[11px] font-mono uppercase text-slate-400">Totale Inviti</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">{kpis.total}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5">
            <div className="text-[11px] font-mono uppercase text-slate-400">In Attesa</div>
            <div className="text-2xl font-bold font-mono text-slate-300 mt-1">{kpis.pending}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5">
            <div className="text-[11px] font-mono uppercase text-amber-400">In Corso</div>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{kpis.inProgress}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5">
            <div className="text-[11px] font-mono uppercase text-blue-400">Completati</div>
            <div className="text-2xl font-bold font-mono text-blue-400 mt-1">{kpis.submitted}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5">
            <div className="text-[11px] font-mono uppercase text-emerald-400">Consigliati</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {kpis.recommended}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5">
            <div className="text-[11px] font-mono uppercase text-indigo-400">Colloqui Richiesti</div>
            <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">
              {kpis.interviewRequests}
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca per nome, email o token..."
              className="w-full bg-slate-950 border border-slate-700 rounded-md pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Tutti ({sessions.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              In Attesa
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'in_progress'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              In Corso
            </button>
            <button
              onClick={() => setStatusFilter('submitted')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'submitted'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Completati
            </button>
            <button
              onClick={() => setStatusFilter('interview')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'interview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Colloqui ({kpis.interviewRequests})
            </button>
          </div>
        </div>

        {/* Pipeline Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Candidato</th>
                  <th className="py-3 px-4">Token & Link</th>
                  <th className="py-3 px-4">Stato</th>
                  <th className="py-3 px-4">Punteggio (Det + Sem)</th>
                  <th className="py-3 px-4">Telemetria</th>
                  <th className="py-3 px-4">Colloquio</th>
                  <th className="py-3 px-4 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                        <span>Caricamento sessioni in corso...</span>
                      </div>
                    </td>
                  </tr>
                )}

                {!loading && filteredSessions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500 font-mono text-xs">
                      Nessun candidato trovato con i filtri correnti.
                    </td>
                  </tr>
                )}

                {!loading &&
                  filteredSessions.map(({ session, evaluation }) => {
                    const totalScore =
                      evaluation?.reviewer_override_score !== null &&
                      evaluation?.reviewer_override_score !== undefined
                        ? evaluation.reviewer_override_score
                        : evaluation?.total_score;

                    return (
                      <tr key={session.id} className="hover:bg-slate-800/40 transition-colors">
                        {/* Candidato */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{session.candidate_name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {session.candidate_email}
                          </div>
                          <div className="text-[10px] text-slate-600 mt-0.5">
                            Creato: {new Date(session.created_at).toLocaleDateString('it-IT')}
                          </div>
                        </td>

                        {/* Token & Link */}
                        <td className="py-3.5 px-4 font-mono">
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-blue-400">
                            <span>{session.token}</span>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  `${window.location.origin}/assessment/${session.token}`,
                                  false
                                )
                              }
                              title="Copia Link Assessment"
                              className="text-slate-500 hover:text-white"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        {/* Stato */}
                        <td className="py-3.5 px-4">
                          {session.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                              <Clock className="w-3 h-3" /> In Attesa
                            </span>
                          )}
                          {session.status === 'in_progress' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-amber-950/80 text-amber-400 border border-amber-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                              In Corso
                            </span>
                          )}
                          {session.status === 'submitted' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-blue-950/80 text-blue-400 border border-blue-800">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              Completato
                            </span>
                          )}
                        </td>

                        {/* Punteggio & Badge */}
                        <td className="py-3.5 px-4">
                          {evaluation ? (
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-sm text-white">
                                  {totalScore}/100
                                </span>
                                {evaluation.recommendation_badge === 'consigliato' && (
                                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                                    CONSIGLIATO
                                  </span>
                                )}
                                {evaluation.recommendation_badge === 'riserva' && (
                                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                                    CON RISERVA
                                  </span>
                                )}
                                {evaluation.recommendation_badge === 'non_idoneo' && (
                                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                                    NON IDONEO
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                Det: {evaluation.deterministic_score}/70 • Sem: {evaluation.llm_score}/30
                                {evaluation.reviewer_override_score !== null && (
                                  <span className="text-amber-400 ml-1">(Override)</span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-600 font-mono">-</span>
                          )}
                        </td>

                        {/* Telemetria */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                          {session.telemetry ? (
                            <div>
                              <div>Blur: {session.telemetry.blur_count || 0}</div>
                              <div>Paste: {session.telemetry.paste_count || 0}</div>
                              <div className="text-slate-500">
                                Tempo:{' '}
                                {Math.round((session.telemetry.time_spent_seconds || 0) / 60)}m
                              </div>
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>

                        {/* Colloquio Richiesto */}
                        <td className="py-3.5 px-4">
                          {evaluation?.interview_requested_at ? (
                            <div>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-400 border border-indigo-800">
                                <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                                RICHIESTO
                              </span>
                              <div className="text-[10px] text-slate-500 font-mono mt-1">
                                {new Date(evaluation.interview_requested_at).toLocaleDateString(
                                  'it-IT'
                                )}
                              </div>
                              {evaluation.reviewer_notes && (
                                <div className="text-[10px] text-slate-400 italic max-w-xs truncate">
                                  &quot;{evaluation.reviewer_notes}&quot;
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-600 font-mono">-</span>
                          )}
                        </td>

                        {/* Azioni */}
                        <td className="py-3.5 px-4 text-right space-x-2">
                          {evaluation && (
                            <Link
                              href={`/scorecard/${session.id}`}
                              target="_blank"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 border border-slate-700 text-xs font-medium transition-colors"
                            >
                              <span>Scorecard</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}

                          {evaluation && (
                            <button
                              onClick={() => {
                                setOverrideModalSession({ session, evaluation });
                                setOverrideScore(
                                  evaluation.reviewer_override_score !== null &&
                                    evaluation.reviewer_override_score !== undefined
                                    ? String(evaluation.reviewer_override_score)
                                    : String(evaluation.total_score)
                                );
                                setOverrideNotes(evaluation.reviewer_notes || '');
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors"
                              title="Modifica Override Fondatore"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span className="hidden lg:inline">Override</span>
                            </button>
                          )}

                          {!evaluation && (
                            <Link
                              href={`/assessment/${session.token}`}
                              target="_blank"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors"
                            >
                              <span>Apri Cockpit</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal: Nuovo Invito Candidato */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">Genera Nuovo Invito Candidato</h3>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Chiudi
              </button>
            </div>

            {!inviteResult ? (
              <form onSubmit={handleCreateInvite} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Nome Completo Candidato *
                  </label>
                  <input
                    type="text"
                    required
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Es. Leonardo Da Vinci"
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Email Candidato *
                  </label>
                  <input
                    type="email"
                    required
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    placeholder="Es. leonardo@polimi.it"
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Token Personalizzato (opzionale)
                  </label>
                  <input
                    type="text"
                    value={customToken}
                    onChange={(e) => setCustomToken(e.target.value)}
                    placeholder="Es. cand-polimi-01 (lascia vuoto per auto-generare)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingInvite}
                    className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2"
                  >
                    {isCreatingInvite ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Generazione...</span>
                      </>
                    ) : (
                      <>
                        <span>Genera Token & Link</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded-md text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Invito generato con successo e registrato nella pipeline!</span>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Link Diretto Candidato
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={inviteResult.invitationUrl}
                      className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-blue-400 font-mono outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(inviteResult.invitationUrl, false)}
                      className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium flex items-center gap-1"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copiato' : 'Copia'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Messaggio Pre-composto per WhatsApp / LinkedIn
                  </label>
                  <textarea
                    readOnly
                    rows={6}
                    value={inviteResult.prewrittenMessage}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md p-3 text-xs text-slate-300 font-mono leading-relaxed outline-none"
                  />
                  <div className="mt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(inviteResult.prewrittenMessage, true)}
                      className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      {copiedMessage ? (
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedMessage ? 'Messaggio Copiato!' : 'Copia Testo Invito'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowInviteModal(false);
                      setInviteResult(null);
                    }}
                    className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium"
                  >
                    Chiudi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Founder Override */}
      {overrideModalSession && overrideModalSession.evaluation && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Founder Score Override</h3>
              </div>
              <button
                onClick={() => setOverrideModalSession(null)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Chiudi
              </button>
            </div>

            <form onSubmit={handleSaveOverride} className="space-y-4">
              <div className="text-xs text-slate-300">
                Candidato:{' '}
                <strong className="text-white">
                  {overrideModalSession.session.candidate_name}
                </strong>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Punteggio Algoritmico Attuale:{' '}
                  {overrideModalSession.evaluation.total_score}/100 (Det:{' '}
                  {overrideModalSession.evaluation.deterministic_score}/70, Sem:{' '}
                  {overrideModalSession.evaluation.llm_score}/30)
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Punteggio Totale Finale Override (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={overrideScore}
                  onChange={(e) => setOverrideScore(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Note Operative del Fondatore
                </label>
                <textarea
                  rows={4}
                  value={overrideNotes}
                  onChange={(e) => setOverrideNotes(e.target.value)}
                  placeholder="Es. Verificato in video pre-screen: solida conoscenza distinta base e ottimo inglese tecnico."
                  className="w-full bg-slate-950 border border-slate-700 rounded-md p-3 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOverrideModalSession(null)}
                  className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={isSavingOverride}
                  className="px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-2"
                >
                  {isSavingOverride ? 'Salvataggio...' : 'Salva Override'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
