export interface SelectMenuOption {
  value: string | number
  label: string
  icon?: string
  /** Any CSS colour. Colours the trigger's status dot while this option is selected, and shows a dot beside it in the list. */
  dotColor?: string
}
