# Project Todos — SkillBridge

## Phase 1.1 / Scaling Backlog

### TODO-001: Automated Transactional Email Service (Resend / Postmark)
* **What:** Integrate Resend or Postmark transactional email provider to automatically email scorecard links and candidate invitations directly to candidates and plant managers.
* **Why:** Eliminates manual forwarding of scorecard links by the founder and enables self-service candidate invitations.
* **Pros:** Full automated distribution pipeline without manual touchpoints; automated delivery status tracking.
* **Cons:** Requires custom domain email verification (SPF, DKIM, DMARC records) and external mail service API keys.
* **Context:** For the first 5-10 pilot candidates, founder-led personal touch via direct message/email creates higher conversion and feedback loops than automated no-reply emails. Once 5 placements are validated, email automation unlocks hands-off distribution.
* **Depends on / blocked by:** Validated client demand, custom domain DNS setup, and completion of MVP Tasks T1-T6.

### TODO-002: Mobile Touch-Optimized Assessment Flow (Post-MVP)
* **What:** Build a dedicated, stepped mobile/tablet wizard for candidates taking the operational assessment on touchscreens.
* **Why:** In MVP, `/assessment/[token]` requires desktop/laptop (>=1024px) for data grid and spreadsheet precision. A mobile wizard would allow candidates to complete calculations using touch-friendly stepper controls and auto-formatting instead of desktop-sized tables.
* **Pros:** Expands candidate accessibility across mobile devices; captures candidates who open assessment invitations while away from a computer.
* **Cons:** Increases frontend maintenance across two distinct interaction paradigms; risks higher error rates in supply chain arithmetic on 6-inch screens.
* **Context:** Identified during `/plan-design-review` (D8/D10). MVP enforces desktop access with an informative device-switch screen to safeguard data accuracy and candidate completion rates.
* **Depends on / blocked by:** Validation of candidate completion rates on desktop and feedback indicating significant mobile bounce rates.
