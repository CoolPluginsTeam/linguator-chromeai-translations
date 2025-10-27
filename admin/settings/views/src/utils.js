import { __ } from '@wordpress/i18n';

// Get synchronization options from localized data
export const synchronizations = window.ewt_settings?.sync_options || [];

// Get language switcher options from localized data
export const languageSwitcherOptions = window.ewt_settings?.language_switcher_options || [];

  // Get nonce from localized script data
export const getNonce = () => {
  return window.ewt_settings?.nonce || '';
}