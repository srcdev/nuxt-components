export interface TooltipContentTextItem {
  tag: string
  text: string
}

export interface TooltipContentText {
  tooltipTitle?: TooltipContentTextItem
  tooltipContent?: TooltipContentTextItem
  tooltipAction?: TooltipContentTextItem
}
