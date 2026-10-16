import type { VNode } from "vue";

export interface ISocialIcon {
  networkName: string;
  iconName: string;
  baseHref: string;
  profileId: string;
  /** Accessible name for the link; overrides the list's linkLabelTemplate. */
  label?: string;
  /** Brand colour, exposed as --social-icons-list-brand-colour on this item for recipes to use. */
  brandColour?: string;
}

export interface SocialIconsListSlots {
  icon?(props: { item: ISocialIcon }): VNode[];
  label?(props: { item: ISocialIcon }): VNode[];
}
