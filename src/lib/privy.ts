// Privy App ID is a public client identifier — safe to expose in the browser.
export const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID || '';

export const privyConfigured = !!PRIVY_APP_ID;
