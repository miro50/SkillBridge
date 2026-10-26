-- SkillBridge MVP: Database Schema & Migration Setup
-- Scenario: Supply Chain Specialist - Valvola V-104
-- Target: Supabase / PostgreSQL (pgcrypto enabled by default)

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. Tabella Sessioni Candidati (assessment_sessions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS assessment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  candidate_name TEXT NOT NULL,
  candidate_email TEXT NOT NULL,
  scenario_id TEXT NOT NULL DEFAULT 'valvola-v104',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'submitted', 'expired')),
  started_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  telemetry JSONB DEFAULT '{"blur_count": 0, "paste_count": 0, "time_spent_seconds": 0}'::jsonb,
  raw_answers JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indici per lookup rapido via token e stato
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_token ON assessment_sessions(token);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_status ON assessment_sessions(status);

-- ============================================================================
-- 2. Tabella Valutazioni Generate (assessment_evaluations)
-- ============================================================================
-- Nota D2 / Architecture Review: UNIQUE(session_id) garantisce idempotenza assoluta
-- prevenendo sottomissioni doppie o valutazioni duplicate concorrenti.
CREATE TABLE IF NOT EXISTS assessment_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID UNIQUE NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  deterministic_score INT NOT NULL CHECK (deterministic_score BETWEEN 0 AND 70),
  deterministic_breakdown JSONB NOT NULL,
  llm_score INT NOT NULL CHECK (llm_score BETWEEN 0 AND 30),
  llm_breakdown JSONB NOT NULL,
  llm_feedback TEXT NOT NULL,
  total_score INT NOT NULL CHECK (total_score BETWEEN 0 AND 100),
  reviewer_override_score INT CHECK (reviewer_override_score IS NULL OR (reviewer_override_score BETWEEN 0 AND 100)),
  reviewer_notes TEXT,
  recommendation_badge TEXT NOT NULL CHECK (recommendation_badge IN ('consigliato', 'riserva', 'non_idoneo')),
  interview_requested_at TIMESTAMPTZ,
  reviewer_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indice per lookup rapido delle valutazioni per sessione
CREATE INDEX IF NOT EXISTS idx_assessment_evaluations_session ON assessment_evaluations(session_id);

-- ============================================================================
-- 3. Tabella Richieste Aziende B2B / Lead Direttori di Stabilimento (company_leads)
-- ============================================================================
CREATE TABLE IF NOT EXISTS company_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  province TEXT,
  role TEXT,
  role_needed TEXT,
  estimated_ral INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_company_leads_created_at ON company_leads(created_at DESC);

-- ============================================================================
-- 4. Funzioni Atomiche Condizionali (D2 - Atomic Updates & Anti-Double-Submit)
-- ============================================================================

-- Avvio sessione atomico: aggiorna solo se lo stato attuale è 'pending'
-- Se la sessione è già 'in_progress', restituisce i dati esistenti senza sovrascrivere started_at
CREATE OR REPLACE FUNCTION start_assessment_session(p_token TEXT)
RETURNS SETOF assessment_sessions AS $$
BEGIN
  -- Tenta l'aggiornamento atomico condizionale
  UPDATE assessment_sessions
  SET 
    status = 'in_progress',
    started_at = NOW()
  WHERE token = p_token AND status = 'pending';

  -- Ritorna lo stato aggiornato (o lo stato corrente se già in_progress)
  RETURN QUERY
  SELECT * FROM assessment_sessions
  WHERE token = p_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sottomissione sessione atomica: aggiorna solo se lo stato è 'in_progress'
CREATE OR REPLACE FUNCTION submit_assessment_session(
  p_token TEXT,
  p_raw_answers JSONB,
  p_telemetry JSONB
)
RETURNS SETOF assessment_sessions AS $$
BEGIN
  UPDATE assessment_sessions
  SET
    status = 'submitted',
    submitted_at = NOW(),
    raw_answers = p_raw_answers,
    telemetry = p_telemetry
  WHERE token = p_token AND status = 'in_progress';

  RETURN QUERY
  SELECT * FROM assessment_sessions
  WHERE token = p_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 4. Row Level Security (RLS)
-- ============================================================================
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_evaluations ENABLE ROW LEVEL SECURITY;

-- Servizi backend con SERVICE_ROLE_KEY hanno accesso completo senza restrizioni RLS.
-- Policy di sicurezza per letture token da anon (se client-side lookup abilitato in futuro):
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'assessment_sessions' AND policyname = 'Allow public lookup by token'
  ) THEN
    CREATE POLICY "Allow public lookup by token"
    ON assessment_sessions FOR SELECT
    TO anon, authenticated
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'assessment_evaluations' AND policyname = 'Allow public read of scorecard by id'
  ) THEN
    CREATE POLICY "Allow public read of scorecard by id"
    ON assessment_evaluations FOR SELECT
    TO anon, authenticated
    USING (true);
  END IF;
END $$;
