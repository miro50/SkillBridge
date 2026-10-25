# SkillBridge — Board Briefing Memo

## The Core Concept
SkillBridge is an operational assessment engine and performance-vetted recruitment wedge focused exclusively on Supply Chain & Operations Specialist roles for industrial manufacturing and distribution companies in Northern Italy.

## Problem Statement & Pain Point
Recruiting operational talent (Production Planners, Supply Chain Specialists, Operations Analysts) suffers from severe information asymmetry:
1. Traditional headhunters charge 15-20% of RAL (€4,500 - €6,000+) but only perform passive keyword filtering on self-reported CVs.
2. In interviews, candidates recite academic theory ("Lean", "Kanban", "EOQ"), but in the plant cannot handle real supply disruptions, calculate lead-time anomalies, or prioritize bottlenecks.
3. Existing assessment tools (TestGorilla, iMocha) rely on generic multiple-choice quizzes that test trivia, not operational trade-off intuition. Take-home case studies take days to evaluate, invite cheating/ghostwriting, and alienate top applicants.
4. An operational wrong-hire halts assembly lines or leads to runaway buffer stock. A production stoppage can cost €1,200/hour or tens of thousands of Euros within days.

## Target Customer & Wedge
- **B2B Buyer:** Plant Director, Operations Director, Supply Chain Manager at structured Italian SMEs and mid-market industrial firms (automotive, machinery, packaging, chemicals, electronics).
- **Candidate Pool:** Final-year master's students and junior graduates (0-2 years experience) in Management Engineering (Ingegneria Gestionale) and Operations from top Italian engineering universities (PoliMi, PoliTo, PoliBa, Bologna) and ITS Logistics institutes.
- **Narrowest Wedge:** Strictly Supply Chain & Operations Specialists. Other roles (consulting, PM, finance) are frozen to maintain domain depth.

## The Product Experience & Simulation Fixture
- **Candidate Assessment:** A frictionless 25-minute continuous in-browser practical scenario (e.g., *"Supply Chain Disruption: Valve V-104 breakdown on Assembly Line 2"*).
- The candidate is given real plant parameters (inventory, run rate, safety stock, expedited supplier costs, €1,200/hr line downtime cost) and must:
  1. Calculate exact stockout timing and downtime cost.
  2. Modify the reorder replenishment plan to mitigate stockout without excessive over-stocking.
  3. Write a concise trade-off justification (150-200 words).
- **Scoring Pipeline:** 70% deterministic code grader on mathematical accuracy + 30% constrained LLM scoring on risk management and analytical reasoning.
- **Client Deliverable:** A 1-page visual candidate scorecard highlighting execution speed, numerical precision, and decision trade-offs sent directly to the Plant Director with 3 interview-ready candidates.

## Business & Monetization Model
- **Model:** Performance-vetted recruitment wedge (boutique specialized placement powered by proprietary assessment simulation, rather than selling self-serve SaaS to HR).
- **Pricing:** 12% - 15% success fee of candidate gross salary (RAL) (~€3,600 to €4,500 per placement based on a €30,000 starting salary).
- **Guarantee:** 100% conditional — invoiced strictly at 90 days post-hire, payable only if the candidate completes and passes their 3-month probation period. Zero upfront cost.

## Founder Background & Execution Constraints
- Founder has academic background in Management Engineering (Ingegneria Gestionale), providing deep domain knowledge of plant dynamics, supply chain calculations, and university student networks.
- Bootstrapped, 3-week engineering build for the simulation engine.
- Validation gate: 5 plant managers contacted via LinkedIn with an offer of 3 pre-vetted candidates at zero upfront cost before writing non-essential code.
