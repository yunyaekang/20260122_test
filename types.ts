
export interface Task {
  id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  hoursPerWeek: number;
  repetitionLevel: number; // 1 to 5
  dataDigitalized: boolean;
}

export interface DiagnosisResult {
  overallScore: number;
  taskEvaluations: {
    taskId: string;
    automationPotential: number; // 0-100
    complexity: number; // 0-100
    suggestedTools: string[];
    benefitDescription: string;
    actionPriority: string;
  }[];
  summary: string;
  recommendedWorkflow: string;
  estimatedTimeSavedMonthly: number;
}

export interface SavedDiagnosis {
  id: string;
  date: string;
  tasks: Task[];
  result: DiagnosisResult;
}

export enum AppStep {
  INTRO = 'INTRO',
  DIAGNOSIS = 'DIAGNOSIS',
  LOADING = 'LOADING',
  RESULTS = 'RESULTS'
}
