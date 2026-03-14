export interface NavItem {
  text: string;
  href?: string;
  isExternal?: boolean;
  iconName?: string;
  cssName?: string;
}

export interface NavItemData {
  [key: string]: NavItem[];
}
