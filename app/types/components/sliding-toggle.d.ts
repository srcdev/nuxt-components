export interface SlidingToggleOption<T extends string | number = string> {
  value: T;
  label: string;
  disabled?: boolean;
}
