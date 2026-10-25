# Operations Manual & Standard Operating Procedures (SOPs) — SkillBridge

## 1. Daily Operational Cycle

| Time | Activity | Operational Detail | Client / Candidate Facing? |
| :---: | :--- | :--- | :---: |
| **08:30 – 09:30** | Platform Health & Simulation Queue | Check Supabase logs, token status, verify completed overnight simulations, audit anti-cheat alerts. | Internal |
| **09:30 – 11:30** | Candidate Screening & Video Vetting | Conduct 10-minute structured video pre-interviews with top scorers (scores >80/100). | **Candidate Facing** |
| **11:30 – 13:00** | Scorecard Generation & Packaging | Finalize 1-page executive scorecards, compile candidate dossiers, verify diplomas with university databases. | Internal |
| **14:00 – 16:30** | Client Pipeline & Candidate Presentation | Founder-led outreach on LinkedIn; deliver scorecards of top 3 candidates to interested Plant Directors. | **Client Facing** |
| **16:30 – 17:30** | Interview Coordination | Schedule 20-minute client-candidate introductory calls; send prep brief and NDA/Representation agreement. | **Client & Candidate** |
| **17:30 – 18:30** | Probation Follow-up & Daily Wrap | Check in with placed candidates (Day 15, 45, 75); reconcile candidate tracking sheets; plan next day. | **Client Facing** |

---

## 2. Supplier Stack & Fixed Tooling Costs

| Tool / Supplier | Function | Plan & Tier | Published Cost | Payment Terms |
| :--- | :--- | :--- | :---: | :--- |
| **Vercel** | Next.js Frontend & Edge Hosting | Pro Team Tier | $20/month (~€19) | Monthly credit card |
| **Supabase** | PostgreSQL Database & Auth | Pro Plan (Backup & PITR) | $25/month (~€24) | Monthly credit card |
| **Resend** | Transactional Magic Links & Scorecards | Starter (up to 50k emails/mo) | $20/month (~€19) | Monthly credit card |
| **OpenAI / Anthropic** | Structured LLM Evaluation Grader | API pay-as-you-go | ~$40/month (~€38) | Usage billed monthly |
| **LinkedIn** | Sales Navigator Core | Professional Single Seat | €79.99/mo + VAT | Monthly subscription |
| **Signwell / DocuSign** | Legally Binding E-Signatures | Starter Tier (API / Web) | €15/month | Monthly credit card |
| **Fatture in Cloud** | Italian SDI Electronic Invoicing | Standard Plan | €12/month | Annual / Monthly |
| **Google Workspace** | Professional Domain Email & Docs | Business Starter | €6.90/user/month | Monthly |
| **Total Tooling Overhead:** | — | — | **~€205/month** | *Fits inside €300/mo tech budget* |

---

## 3. Staffing & Weekly Rota

### Phase 1 (Months 1–6: Solo Founder Model)
- **Role:** Managing Founder (Management Engineer).
- **Workload:** 45 hours/week.
  - 15 hours: Candidate sourcing, university campus outreach, and 10-minute video screenings.
  - 15 hours: B2B client outreach, LinkedIn messaging, and candidate presentations.
  - 10 hours: Simulation maintenance, scorecard generation, and customer onboarding.
  - 5 hours: Legal, billing, and accounting administration.
- **Remuneration:** €2,200/month living stipend (modeled in CFO numbers).

### Phase 2 (Months 7–12: Scaling Team upon reaching 3 placements/month)
- Add **Part-Time Junior Talent Sourcer (20 hrs/week)**: €1,000/month stipend to manage university relationships and initial candidate outreach.

---

## 4. Standard Operating Procedures (SOPs)

### SOP-01: Candidate Sourcing & Assessment Invitation
1. Source final-year management engineering students from PoliMi/PoliTo/UNIBO or ITS Logistics via university career groups.
2. Send invitation message: *"Fast-Track Supply Chain: salta i colloqui conoscitivi con HR e accedi direttamente ai Direttori di Stabilimento completando la prova di 25 minuti."*
3. Generate and issue unique single-use magic link (valid for 48 hours).
4. Candidate accepts terms and completes simulation in browser.

### SOP-02: Grading & Scorecard Verification
1. Automatic deterministic grader scores the numerical formulas (lead time delta, stockout day, expedited freight cost).
2. Constrained LLM grades the written trade-off argument against the rubric (1 to 5 points on clarity, operational logic, risk prioritization).
3. If aggregate score is $\ge 80/100$, conduct a 10-minute video pre-screen checking communication skills and English proficiency.
4. Export finalized 1-page PDF scorecard.

### SOP-03: Client Intake & Candidate Reveal
1. Plant Director confirms interest in reviewing candidates for an open Supply Chain vacancy.
2. Send the 1-page Client Representation Agreement via Signwell (covers 12-month candidate protection and 14% success fee at 90 days).
3. Upon electronic signature, reveal full candidate CVs and detailed scorecards for 3 candidates.
4. Facilitate 20-minute introductory call within 3 business days.

### SOP-04: The 90-Day Probation & Invoicing Routine
1. On **Day 1**: Confirm employment start date, sign-off on probation date (Day 90).
2. On **Day 30**: Check-in email with both candidate and Plant Director.
3. On **Day 60**: Formal alignment call with Plant Director to review integration and performance.
4. On **Day 85**: Issue formal notice of probation completion.
5. On **Day 90**: Issue electronic SDI invoice for €4,200 (or €3,300 pilot fee), with 30-day payment terms.

### SOP-05: Probation Failure / Warranty Execution (Complaint Handling)
1. If client reports candidate underperformance prior to Day 90:
   - Schedule immediate debrief with Plant Director.
   - If contract terminated, cancel the invoice immediately in writing (zero charge).
   - Initiate immediate priority search for replacement candidate under the 180-day warranty policy.

---

## 5. Licences, Legal Compliance & Insurance (Italy)

- **Corporate Structure:** Italian sole-proprietorship (*Ditta Individuale / Regime Forfettario* in early phase if within €85,000 threshold) or specialized *s.r.l. semplificata* (recommended for recruitment liability shielding).
- **Regulatory Framework:** Compliance with **D.Lgs 276/2003 (Legge Biagi)** regarding *Ricerca e Selezione del Personale*. In Italy, full recruitment agencies require Ministry of Labor (ANPAL) authorization; for pre-employment technical assessment and introductory executive search, SkillBridge operates as an *Operational Evaluation & Assessment Advisory Consultancy* partnered with an authorized agency of record if temporary staffing is requested.
- **GDPR Compliance:** Explicit candidate consent checkbox on simulation entry for storage of assessment telemetry and transmission of scorecards to vetted third-party employers.
- **Professional Liability Insurance (RC Professionale):** Standard consulting errors & omissions insurance (€350/year, covering up to €500,000 in liability).

---

## 6. Risk Register (Top 10 Operational Risks)

| # | Risk Event | Likelihood | Impact | Preventative / Contingency Plan |
| :-: | :--- | :---: | :---: | :--- |
| **1** | **Client circumvents fee (direct hire)** | Medium | High | Require signed 1-page Representation Agreement with 12-month liquidated damages clause before revealing candidate contact details. |
| **2** | **Candidate drops out mid-simulation** | High | Low | Auto-save state every 15s in `localStorage`; timer resume with single-use magic link. |
| **3** | **Candidate uses LLM / ChatGPT** | High | Medium | Randomize numeric parameters per session; disable clipboard paste; assess reasoning speed and internal consistency. |
| **4** | **Delayed payment on Day 90** | High | High | Explicit late-fee interest clause; maintain €10,000 working capital buffer; offer 5% prompt-payment cash discount. |
| **5** | **Low student test participation** | Medium | Medium | Co-brand with university student associations (JEME, BEST); position as exclusive VIP pass skipping HR queues. |
| **6** | **Candidate resigns after 4 months** | Medium | Medium | Covered by 180-day free replacement guarantee backed by existing active candidate pool. |
| **7** | **LLM API downtime / outage** | Low | Low | Deterministic code grader executes independently; LLM qualitative scoring queues asynchronously. |
| **8** | **Dispute over probation outcome** | Low | Medium | Clear objective criteria in Representation Agreement: written confirmation of employee contract continuation. |
| **9** | **Founder illness / capacity squeeze** | Low | High | Standardized SOP checklists; candidate data fully centralized in Supabase CRM dashboard. |
| **10** | **Client requests multi-role expansion** | High | Low | Strictly enforce MVP boundary: decline non-operations roles until 15 supply chain placements are completed. |
