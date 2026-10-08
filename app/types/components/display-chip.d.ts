export type DisplayChipStatus = "offline" | "online" | "idle" | "dnd"

export interface DisplayChipConfig {
  size?: string
  maskWidth?: string
  offset?: string
  angle?: string
  icon?: string
  label?: string
}

export interface DisplayChipProps {
  tag?: "div" | "span"
  shape?: "circle" | "square"
  status?: DisplayChipStatus
  statusLabel?: string
  config?: DisplayChipConfig
  styleClassPassthrough?: string | string[]
}
