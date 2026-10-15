export interface ProgressTrackerStep {
  title: string;
  body?: string;
}

export type ProgressTrackerStepState = "done" | "current" | "upcoming";
