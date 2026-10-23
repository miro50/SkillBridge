export interface TestCase {
  id: string;
  name: string;
  description: string;
  weight: number;
  expectedBehavior: string;
  testFnBody: string; // JavaScript code to execute test
}

export interface TestResult {
  testId: string;
  name: string;
  passed: boolean;
  message?: string;
  executionTimeMs: number;
  expected?: string;
  actual?: string;
  logs?: string[];
}

export interface FileItem {
  id: string;
  name: string;
  language: 'typescript' | 'json';
  readOnly: boolean;
  content: string;
}

export interface AssessmentScenario {
  id: string;
  title: string;
  targetRole: string;
  companyName: string;
  companyTier: string;
  difficulty: 'Junior' | 'Mid' | 'Senior' | 'Staff';
  durationMinutes: number;
  category: string;
  tags: string[];
  summary: string;
  briefMarkdown: string;
  acceptanceCriteria: string[];
  evaluationRubric: {
    category: string;
    weightPercentage: number;
    description: string;
  }[];
  files: FileItem[];
  testCases: TestCase[];
}

export interface ProctorLog {
  timestamp: string;
  type: 'blur' | 'focus' | 'paste' | 'fullscreen_exit';
  message: string;
}

export interface SubmissionScorecard {
  submissionId: string;
  candidateName: string;
  scenarioTitle: string;
  submittedAt: string;
  timeSpentSeconds: number;
  totalScore: number; // 0 - 100
  passedCount: number;
  totalTests: number;
  deterministicScore: number; // out of 70
  semanticScore: number; // out of 30
  codeEfficiencyScore: number;
  cleanCodeScore: number;
  badgeLevel: 'Junior Qualified' | 'Mid Engineer' | 'Senior Master' | 'Top 1% Exceptional';
  proctorIntegrity: number; // 0 - 100%
  proctorEventsCount: number;
  aiAssessmentSummary: string;
  competencyBreakdown: {
    skill: string;
    level: number; // 0 - 100
    status: 'Excellent' | 'Good' | 'Needs Improvement';
  }[];
}
