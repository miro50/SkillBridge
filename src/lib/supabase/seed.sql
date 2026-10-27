-- ============================================================================
-- SkillBridge Seed Data for Production / Staging Supabase
-- ============================================================================

-- 1. Assessment Sessions (Demo Candidates)
INSERT INTO assessment_sessions (id, token, candidate_name, candidate_email, scenario_id, status, started_at, submitted_at, telemetry, raw_answers)
VALUES 
  (
    '11111111-1111-4111-8111-111111111111',
    'demo-candidate-1',
    'Marco Rossi',
    'marco.rossi@polimi.it',
    'valvola-v104',
    'pending',
    NULL,
    NULL,
    '{"blur_count": 0, "paste_count": 0, "time_spent_seconds": 0, "webcam_verified": true}'::jsonb,
    NULL
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'demo-candidate-2',
    'Giulia Bianchi',
    'giulia.bianchi@unibo.it',
    'packaging-p200',
    'in_progress',
    NOW() - INTERVAL '12 minutes',
    NULL,
    '{"blur_count": 1, "paste_count": 0, "time_spent_seconds": 720, "webcam_verified": true}'::jsonb,
    '{"stockoutDay": 8, "downtimeDays": 7, "expeditedOrderQty": 250, "decisionMemo": "Analisi iniziale completata. Si valuta lotto di emergenza astucci su blisteratrice..."}'::jsonb
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'demo-candidate-3',
    'Alessandro Ferrari',
    'a.ferrari@polito.it',
    'valvola-v104',
    'submitted',
    NOW() - INTERVAL '35 minutes',
    NOW() - INTERVAL '10 minutes',
    '{"blur_count": 0, "paste_count": 0, "copy_count": 0, "screenshot_count": 0, "time_spent_seconds": 1320, "webcam_verified": true, "proctoring_active": true}'::jsonb,
    '{"stockoutDay": 9, "downtimeDays": 5, "expeditedOrderQty": 200, "calculatedExtraCost": 7000, "calculatedDowntimeCost": 48000, "decisionMemo": "Priorità assoluta alla continuità operativa della Linea Montaggio 2: extra-costo di 7.000 € copre interamente il fabbisogno azzerando il rischio di 5 giorni di fermo linea da 48.000 €."}'::jsonb
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    'demo-candidate-4',
    'Luca Moretti',
    'luca.moretti@polimi.it',
    'scheda-e501',
    'pending',
    NULL,
    NULL,
    '{"blur_count": 0, "paste_count": 0, "time_spent_seconds": 0, "webcam_verified": true}'::jsonb,
    NULL
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    'demo-candidate-5',
    'Matteo Rinaldi',
    'm.rinaldi@polimi.it',
    'process-m300',
    'pending',
    NULL,
    NULL,
    '{"blur_count": 0, "paste_count": 0, "time_spent_seconds": 0, "webcam_verified": true}'::jsonb,
    NULL
  )
ON CONFLICT (token) DO NOTHING;

-- 2. Assessment Evaluations (Benchmark Scorecard)
INSERT INTO assessment_evaluations (
  id,
  session_id,
  deterministic_score,
  deterministic_breakdown,
  llm_score,
  llm_breakdown,
  llm_feedback,
  total_score,
  reviewer_override_score,
  reviewer_notes,
  recommendation_badge,
  interview_requested_at,
  reviewer_feedback
)
VALUES (
  'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
  '33333333-3333-4333-8333-333333333333',
  65,
  '{"stockoutDayScore": 15, "stockoutDayMax": 15, "downtimeDaysScore": 10, "downtimeDaysMax": 10, "downtimeCostScore": 10, "downtimeCostMax": 10, "reorderQtyScore": 20, "reorderQtyMax": 20, "extraCostScore": 10, "extraCostMax": 15, "details": {"note": "Tutti i calcoli principali accurati; extra-costo coerente con lotto minimo."}}'::jsonb,
  23,
  '{"costTradeoffScore": 5, "riskAwarenessScore": 4, "clarityAndSynthesis": 4, "normalizedScore": 23, "details": {"summary": "Eccellente analisi del trade-off tra extra-costo ed ore di fermo."}}'::jsonb,
  'Decisione rapida e solida. Ha coperto il deficit azzerando il rischio fermo linea con rigorosa attenzione ai costi operativi di stabilimento.',
  88,
  NULL,
  NULL,
  'consigliato',
  NULL,
  NULL
)
ON CONFLICT (session_id) DO NOTHING;

-- 3. Company Leads (Sample B2B Demand)
INSERT INTO company_leads (
  contact_name,
  company_name,
  email,
  phone,
  province,
  role,
  role_needed,
  estimated_ral,
  notes
)
VALUES 
  (
    'Ing. Roberto Fontana',
    'Brembo S.p.A.',
    'r.fontana@brembo.it',
    '+39 035 605 2111',
    'Bergamo',
    'Direttore Operations',
    'Supply Chain & Operations Specialist',
    38000,
    'Ricerca urgente per stabilimento Stezzano. Necessario profilo pronto su rotte celeri e gestione fornitori critici.'
  ),
  (
    'Dott.ssa Elena Galli',
    'IMA Group',
    'e.galli@ima.it',
    '+39 051 698 4111',
    'Bologna',
    'HR Plant Lead',
    'Ingegnere Meccanico & Packaging',
    42000,
    'Valutazione candidati con padronanza calcoli OEE e manutenzione linee automatiche ad alta cadenza.'
  )
ON CONFLICT DO NOTHING;
