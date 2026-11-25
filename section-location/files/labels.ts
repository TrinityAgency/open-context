export type LocationLabels = {
  /** The heading over the postal address. */
  address: string;
  /** The heading over the opening hours. */
  hours: string;
  /** The heading over the phone number. */
  phone: string;
  /** The heading over the email address. */
  email: string;
  /** The link to the map on the provider's own site, always shown where the map would be. */
  openInMaps: string;
  /** The button that opens the consent settings, so the visitor can allow the map. */
  showMap: string;
  /** The notice in place of the map until the visitor allows external media. */
  mapNotice: string;
};

export const LOCATION_LABELS: LocationLabels = {
  address: 'Address',
  hours: 'Opening hours',
  phone: 'Phone',
  email: 'Email',
  openInMaps: 'Open in maps',
  showMap: 'Show the map',
  mapNotice: 'The map is loaded from another provider once you allow external media.',
};
