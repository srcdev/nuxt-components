export interface ResponsiveHeaderNavItem {
  name: string
  path?: string
  isExternal?: boolean
  childLinks?: ResponsiveHeaderNavItem[]
  childLinksTitle?: string
  iconName?: string
  config?: ResponsiveHeaderItemRects
}

export interface ResponsiveHeaderProp {
  [key: string]: ResponsiveHeaderNavItem[]
}

export interface IFlooredRect {
  left: number
  right: number
  top: number
  bottom: number
  width: number
  height: number
}

export interface ResponsiveHeaderItemRects {
  left: number
  right: number
  width?: number
  visible: boolean
}

export interface ResponsiveHeaderState {
  hasSecondNav: boolean
  navListVisibility: Record<string, boolean>
  clonedNavLinks?: ResponsiveHeaderProp
}
