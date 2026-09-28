export interface ISocialIcon {
  networkName: string;
  iconName: string;
  baseHref: string;
  profileId: string;
  /** Accessible name for the link; overrides the list's linkLabelTemplate. */
  label?: string;
}
