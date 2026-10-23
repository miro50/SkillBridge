import { CandidateTestRunner } from '@/components/CandidateTestRunner';

export const metadata = {
  title: 'SkillBridge | Candidate Test Runner & Proof-of-Skill',
  description: 'Valutazione tecnica pratica interattiva senza CV per ruoli ad alto volume.'
};

export default function Page() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <CandidateTestRunner />
    </main>
  );
}
