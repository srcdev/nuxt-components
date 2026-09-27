export type SamaritanPromptEffect = "typewriter" | "word-pulse";

export interface SamaritanPromptMessageConfig {
  text: string;
  effect?: SamaritanPromptEffect;
  typeSpeed?: number;
  deleteSpeed?: number;
  holdDuration?: number;
  pauseDuration?: number;
  wordDuration?: number;
  fadeDuration?: number;
  hideCursorInCycle?: boolean;
}
