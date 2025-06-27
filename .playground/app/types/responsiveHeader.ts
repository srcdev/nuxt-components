export interface ResponsiveHeaderNavItem {
  name: string;
  path?: string;
  iconName?: string;
  imageSrc?: string;
  imageAlt?: string;
  description?: string;
  isActive?: boolean;
  isExternal?: boolean;
  childLinksTitle?: string;
  childLinks?: ResponsiveHeaderNavItem[];
  config?: ResponsiveHeaderItemRects;
}

export interface ResponsiveHeaderProp {
  [key: string]: ResponsiveHeaderNavItem[];
}

export interface IFlooredRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}

export interface ResponsiveHeaderItemRects {
  left: number;
  right: number;
  width?: number;
  visible: boolean;
}

export interface ResponsiveHeaderState {
  hasSecondNav: boolean;
  navListVisibility: Record<string, boolean>;
  clonedNavLinks?: ResponsiveHeaderProp;
}
