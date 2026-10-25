# Launch Plan & Countdown Run Sheet — SkillBridge

**Target Public Launch Date:** **Monday, 16 November 2026** (3-week countdown from 25 October 2026)

---

## 1. The Real-World Smoke Test (Before Spending Cash)

Before committing funds for full corporate incorporation or paid outreach tools, the founder must execute the **Live 5-Client Validation Test** (defined in `DESIGN.md`):

- **The Test Pitch:** *"Ho 3 neolaureati magistrali in Ingegneria Gestionale che hanno già superato una prova pratica sulla gestione delle scorte e dei colli di bottiglia su linea di montaggio: volete fare loro un colloquio conoscitivo di 20 minuti a costo zero, pagando solo se li assumete e superano i 3 mesi di prova?"*
- **Target Audience:** 5 Plant Directors / Operations Managers in Lombardy & Emilia-Romagna contacted directly via LinkedIn or alumni network.
- **Success Criteria:** At least **2 confirmed commitments** to interview candidates under these terms within 7 days.
- **Result Benchmark:** If 2 commitments are secured, demand is verified and the technical build proceeds. If 0 commitments are obtained, iterate the offer messaging before touching any software code.

---

## 2. The 3-Week Launch Countdown

```
[Oct 26 - Nov 1] W1: Smoke Test & Sourcing   ===>  2 Client Commitments + 25 Student Tests
[Nov 2 - Nov 8]  W2: Legal & MVP Assembly    ===>  1-Page Agmt + Simulation Engine Hardened
[Nov 9 - Nov 15] W3: Pilot Soft Launch       ===>  Scorecards Generated + 5 Pilot Meetings
[Nov 16, 2026]   LAUNCH DAY                  ===>  Public Announcement & 30-Day Cohort Kickoff
```

### Week 1: Validation & Initial Candidate Pipeline (26 Oct – 1 Nov 2026)
- **Mon 26 Oct:** Contact 5 Plant Directors for the smoke test validation gate.
- **Tue 27 Oct:** Partner with PoliMi / PoliTo Management Engineering student associations (JEME / JEToP) to announce the *"Plant Fast-Track Pass"*.
- **Wed 28 Oct:** Deploy static V-104 case fixture; invite first cohort of 25 student applicants.
- **Thu 29 Oct:** Smoke test review: verify if 2 Plant Directors agreed to interviews.
- **Fri 30 Oct:** Review initial 15 completed candidate test submissions; run automated grading tests.

### Week 2: Legal Hardening & Platform Finalization (2 Nov – 8 Nov 2026)
- **Mon 2 Nov:** Have commercial lawyer finalize the 1-page Client Representation & Fee Agreement with 12-month circumvention protection.
- **Tue 3 Nov:** Connect PostgreSQL / Supabase authentication, single-use magic link generator, and automatic 15-second state auto-save.
- **Wed 4 Nov:** Finalize anti-cheat protections (parameter randomization, copy-paste block, blur event telemetry).
- **Thu 5 Nov:** Conduct 10-minute video screenings with the top 6 scoring candidates.
- **Fri 6 Nov:** Assemble first batch of three 1-page executive scorecards.
- **Sat 7 Nov:** Set up domain email (`founder@skillbridge.it`) on Google Workspace with SPF/DKIM verification.

### Week 3: Soft Open & Pilot Client Onboarding (9 Nov – 15 Nov 2026)
- **Mon 9 Nov:** Send personalized candidate scorecards to the 2 validated smoke-test Plant Directors.
- **Tue 10 Nov:** Schedule the first 20-minute client-candidate video interviews.
- **Wed 11 Nov:** Send 1-page Representation Agreement via Signwell for electronic signature.
- **Thu 12 Nov:** Debrief with Plant Directors following first interviews; collect qualitative feedback on scorecard usefulness.
- **Fri 13 Nov:** Conduct dry-run simulation of electronic billing, CRM records, and automated scorecard generation.
- **Sun 15 Nov:** Finalize public launch assets and LinkedIn announcement copy.

---

## 3. Launch Day Run Sheet (Monday, 16 November 2026)

| Time | Channel / System | Action Item & Owner | Contingency If It Breaks |
| :---: | :--- | :--- | :--- |
| **08:00** | Infrastructure | Founder audits Supabase database, Vercel endpoints, and Resend email quota. | Fall back to manual email scorecard delivery if API latency spikes. |
| **09:00** | LinkedIn Post | Publish official launch announcement: *"Perché il 50% delle assunzioni in supply chain fallisce (e come abbiamo risolto il problema con una prova pratica di 25 minuti)"*. | Founder actively replies to all comments within 15 minutes. |
| **10:00** | University Outbound | Release second batch of 50 Fast-Track simulation invites to student Telegram/WhatsApp channels. | Monitor student onboarding funnel; assist directly via live chat. |
| **11:30** | Outbound Batch 1 | Send direct LinkedIn InMails to 25 target Plant Directors in Brescia, Bergamo, and Modena announcing the **5 Pilot Cohort Slots at 11% RAL**. | Switch to Hook #1 (Downtime cost) if response rate <15% after 4 hours. |
| **14:30** | Candidate Ops | Grade morning test submissions; trigger automated scorecards for candidates scoring >80%. | Manual review of any edge cases where LLM score diverged from code grader. |
| **16:00** | Client Calls | Conduct follow-up calls with Plant Directors who viewed scorecards or expressed interest. | Send sample anonymized scorecard PDF directly via email. |
| **18:00** | Day 1 Debrief | Reconcile pilot pipeline: count InMails sent, replies, scorecards reviewed, and interview dates booked. | Target Day 1: At least 3 positive client replies and 10 completed candidate tests. |

---

## 4. The First 30 Days Execution & Review Framework

### Weekly KPI Milestones:
- **Week 1 (16–22 Nov):** 50 candidates tested; 5 pilot client meetings held; 2 client representation agreements signed.
- **Week 2 (23–29 Nov):** 6 client-candidate interviews completed; 1st formal job offer extended.
- **Week 3 (30 Nov – 6 Dec):** 1st employment contract signed (Placement #1 confirmed); pilot rate window capped at 5 slots.
- **Week 4 (7–13 Dec):** Placement #2 confirmed; transition to standard 14% rate (€4,200); candidate pool scaled to 100 tested engineers.

### Milestone Reviews:
- **Day 7 Review (23 Nov):** *Are Plant Directors opening and reading the scorecards?* If conversion from InMail to interview is <15%, revise scorecard layout to emphasize bottom-line savings and lead-time accuracy.
- **Day 14 Review (30 Nov):** *Are candidates passing client interviews?* If candidates score high on the simulation but get rejected in interviews, increase the rigor of the founder's 10-minute video pre-screen.
- **Day 30 Review (16 Dec):** *Are placed candidates succeeding in week 1-2 on the plant floor?* Check in with Plant Directors to confirm candidates are managing MRP tables and lead-time alerts effectively. Reconcile cash runway for the 90-day realization cycle.
