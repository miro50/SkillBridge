# SkillBridge — Architectural Blueprint & Tech Lead Engineering Review

**Data del Documento:** 28 Ottobre 2026  
**Autore:** Head of Engineering / Technical Architect  
**Stato del Sistema:** Live in Produzione (`skillbridge-mocha-three.vercel.app`)  
**Stack Principale:** Next.js 16 (App Router + Turbopack), TypeScript 5 (Strict), Tailwind CSS v4, Supabase (PostgreSQL), Google Gemini 2.5 Flash, Vitest.

---

## 1. Topologia di Sistema & Diagramma Architetturale

L'architettura di SkillBridge è progettata secondo il paradigma **Serverless ad Alto Rendimento** con separazione rigida tra:
- **Presentation Layer:** Componenti React 19 Server e Client Component ottimizzati per Web Vitals e accessibilità.
- **Evaluation & Security Engine:** Pipeline di grading ibrido isolata (deterministico sub-millisecondo + semantico LLM con circuit breaker).
- **Data & Persistence Layer:** Supabase PostgreSQL con fallback automatico su memoria volatile per scenari offline/dev.

```mermaid
flowchart TD
    subgraph ClientLayer["Client Layer (Browser Candidati & Plant Directors)"]
        LP["Landing Page & Portali (/)"]
        Cockpit["Cockpit Candidato (/assessment/[token])<br/>- WebCam Recorder (MediaRecorder API)<br/>- Focus Telemetry (window.blur)<br/>- Clipboard Paste Lock"]
        ScorecardUI["Scorecard Esecutiva (/scorecard/[id])<br/>- Formato A4 Stampa & PDF<br/>- Breakdown Punteggi"]
        AdminUI["Console Amministratore (/admin)<br/>- Live Session Monitor<br/>- Token Generator"]
    end

    subgraph EdgeRouting["Edge & Serverless API Layer (Next.js 16 Turbopack)"]
        APISubmit["POST /api/assessment/submit"]
        APISave["POST /api/assessment/save (Heartbeat 15s)"]
        APILeads["POST /api/leads"]
        APIInvite["POST /api/admin/invite"]
    end

    subgraph EngineLayer["Core Engine (Isolato & Stateless)"]
        PRNG["Motore Parametrico (Seed 32-bit Hash)"]
        CodeGrader["Deterministico (0-70 pt)<br/>- Formule ROP, Stockout, MOQ, Costi"]
        LLMGrader["Grader Semantico (0-30 pt)<br/>- Google Gemini 2.5 Flash (Schema Zod)<br/>- Circuit Breaker 4.0s"]
        HeuristicFallback["Fallback Euristico (<1ms)<br/>- Regex & Keyword Density Scanner"]
        AntiCheatGuard["Audit & Telemetria Anti-Cheat"]
    end

    subgraph DataLayer["Storage & Notifications"]
        Postgres[(Supabase PostgreSQL)]
        MemoryCache[(In-Memory Resilient Store)]
        Webhook["Founder Alert Webhook (Non-blocking)"]
    end

    Cockpit -->|Heartbeat ogni 15s| APISave
    Cockpit -->|Submit Finale| APISubmit
    AdminUI --> APIInvite
    LP --> APILeads

    APISubmit --> PRNG
    APISubmit --> CodeGrader
    APISubmit --> LLMGrader
    LLMGrader -.->|Timeout >4s o Errore| HeuristicFallback
    APISubmit --> AntiCheatGuard

    APISubmit --> Postgres
    APISubmit --> Webhook
    APISave --> Postgres
    APISave -.-> MemoryCache
    ScorecardUI --> Postgres
```

---

## 2. Sequenza di Esecuzione & Pipeline di Valutazione (End-to-End)

```mermaid
sequenceDiagram
    autonumber
    actor C as Candidato (Browser)
    participant API as Next.js API (/submit)
    participant Det as Grader Deterministico (TS)
    participant LLM as Grader Semantico (Gemini 2.5)
    participant DB as Supabase PostgreSQL
    participant WH as Webhook Founder Alert

    C->>API: POST /api/assessment/submit (token, rawAnswers, telemetry)
    activate API
    API->>DB: Verifica token e Idempotency check (alreadySubmitted)
    DB-->>API: Sessione valida e non ancora inviata

    par Valutazione Deterministica
        API->>Det: evaluateDeterministic(rawAnswers, scenarioConfig)
        Det-->>API: 65 / 70 pt (ROP ok, MOQ ok, giorni stockout ok)
    and Valutazione Semantica con Circuit Breaker
        API->>LLM: evaluateSemantic(memoText, scenarioConfig) [Timeout: 4000ms]
        alt Risposta Gemini entro 4.0s
            LLM-->>API: 23 / 30 pt (Zod parse verificato)
        else Timeout o Errore Rete
            API->>API: Esecuzione Fallback Euristico Locale (<1ms)
            API-->>API: 21 / 30 pt (Calcolo regex trade-off)
        end
    end

    API->>API: Calcolo Score Totale (65 + 23 = 88/100) e Badge ('consigliato')
    API->>DB: submitSession() -> status = 'submitted' + log telemetria
    API->>DB: createEvaluation() -> Scorecard persistita
    
    API--)WH: dispatchFounderAlert() (Fire & Forget, catch isolato)
    
    API-->>C: 200 OK { success: true, redirectUrl: "/scorecard/:id" }
    deactivate API
    C->>C: Redirect istantaneo a /scorecard/:id
```

---

## 3. Pattern di Resilienza, Circuit Breakers & Tolleranza ai Guasti

1. **LLM Circuit Breaker (Timeout 4.0s):** Se Gemini 2.5 Flash subisce picchi di latenza o è offline, scatta `evaluateHeuristicFallback()` locale in <1ms. Nessun errore 500 per l'utente finale.
2. **Idempotency Guard & Timer Server-Side:** Submit protetto da doppie invocazioni accidentali; timer calcolato su timestamp di database (tolleranza 60s per ritardi di rete).
3. **Heartbeat Auto-Save (15s):** Sincronizzazione continua su `localStorage` e via API asincrona per evitare perdite dati in caso di crash o refresh.
4. **Webhook Non-Bloccante:** Invio asincrono con `Promise.catch()` isolato senza bloccare il redirect del candidato.

---

## 4. Test Suite & Qualità del Software

- **TypeScript:** 0 errori in Strict Mode (`npx tsc --noEmit`).
- **Vitest:** **56/56 test passati** su 8 suite (determinismo, anti-cheat, webhook, timeout LLM, lead, runner).
- **Build Next.js 16:** 25 rotte prerenderizzate staticamente in 22 secondi.
