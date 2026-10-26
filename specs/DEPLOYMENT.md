# SkillBridge — Guida al Deploy in Produzione (Vercel & Supabase Cloud)

Questa guida illustra la procedura per portare la piattaforma SkillBridge in produzione (Next.js 16, Supabase PostgreSQL, Google Gemini 2.5 Flash e notifiche Webhook).

---

## 1. Architettura di Produzione

* **Frontend & Serverless Engine**: Next.js 16 (App Router + Turbopack + Partial Prerendering) ospitato su **Vercel** (Edge/Node Serverless Functions).
* **Database & Storage**: **Supabase** (PostgreSQL gestito con Row-Level Security, indici operativi e stored procedure atomica `submit_assessment_evaluation`).
* **Valutazione Semantica AI**: **Google Gemini 2.5 Flash** (via SDK `@google/genai` con timeout fail-safe a 4.0s e fallback euristico locale a latenza zero).
* **Notifiche Operative Fondatore**: Webhook asincrono non-bloccante verso Discord / Slack / Zapier con timeout a 2.5s.

---

## 2. Configurazione Database Supabase

1. Accedi alla dashboard di [Supabase](https://supabase.com) e crea un nuovo progetto (es. `skillbridge-prod`, regione `eu-central-1` / Francoforte per minima latenza in Italia).
2. Nel menu laterale, seleziona **SQL Editor** -> **New Query**.
3. Incolla ed esegui l'intero script DDL disponibile in [`src/lib/supabase/schema.sql`](file:///c:/Users/leona/Desktop/SkillBridge/src/lib/supabase/schema.sql).
   * Crea le tabelle: `assessment_sessions`, `assessment_evaluations`, `scenarios`.
   * Applica il vincolo univoco `UNIQUE(session_id)` su `assessment_evaluations` per prevenire submission duplicate.
   * Crea gli indici per query rapide su `token`, `status`, `created_at`.
   * Registra la stored procedure atomica `submit_assessment_evaluation`.
   * Configura le policy di Row Level Security (RLS) per proteggere i dati.
4. Vai in **Project Settings** -> **API** e copia:
   * **Project URL**: es. `https://xyzcompany.supabase.co`
   * **`service_role` Secret Key**: la chiave ad alto privilegio da usare esclusivamente lato server.

---

## 3. Variabili d'Ambiente (.env.production)

Configura le seguenti variabili nel pannello **Environment Variables** di Vercel:

| Variabile | Descrizione | Obbligatoria? | Esempio |
| :--- | :--- | :---: | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Endpoint REST del database Supabase | **Sì** | `https://xyz.supabase.co` |
| `SUPABASE_URL` | Endpoint REST (alias server-side) | **Sì** | `https://xyz.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Chiave di servizio server Supabase | **Sì** | `eyJhbGci...` |
| `GEMINI_API_KEY` | API Key Google AI Studio per Gemini 2.5 Flash | Consigliata | `AIzaSy...` *(se omessa usa fallback euristico)* |
| `FOUNDER_ALERT_WEBHOOK_URL` | Webhook Discord / Slack per alert completamento test e richieste colloquio | Consigliata | `https://discord.com/api/webhooks/...` |
| `ADMIN_SECRET` | Chiave di sicurezza per proteggere l'accesso a `/admin` | Consigliata | `sb-admin-secret-2026-prod` |
| `NEXT_PUBLIC_APP_URL` | URL pubblico dell'applicazione in produzione | **Sì** | `https://app.skillbridge.it` |

---

## 4. Deploy su Vercel

### Opzione A: Integrazione Automatica GitHub (Consigliata)
1. Fai il push del branch `master` sul tuo repository GitHub:
   ```bash
   git push origin master
   ```
2. Accedi alla dashboard di [Vercel](https://vercel.com) -> **Add New Project**.
3. Importa il repository `SkillBridge`.
4. Vercel rileverà automaticamente Next.js.
5. Inserisci le variabili d'ambiente descritte nella sezione 3.
6. Clicca su **Deploy**.

### Opzione B: Deploy tramite CLI Vercel
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 5. Seed Iniziale & Verifica Post-Deploy

Una volta completato il deploy:
1. Per caricare i 3 candidati dimostrativi e la scorecard demo di riferimento nel database di produzione:
   ```bash
   SUPABASE_URL="https://xyz.supabase.co" SUPABASE_SERVICE_ROLE_KEY="eyJ..." npm run seed
   ```
2. **Smoke Test di Verifica**:
   * Apri `https://tuo-dominio.vercel.app` -> verifica caricamento landing page e design responsive.
   * Clicca su **"Demo Scorecard"** -> verifica visualizzazione scorecard a punteggio 88/100 con layout di stampa A4.
   * Apri `/admin` -> verifica il riepilogo della pipeline e la generazione di un nuovo token di prova.
   * Apri `/assessment/demo-candidate-1` -> verifica l'accesso alla cockpit da 25 minuti.
