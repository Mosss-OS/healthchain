// Privy App ID is a public client identifier — safe to expose in the browser.
// Set VITE_PRIVY_APP_ID in your project .env, or paste the ID below as a fallback.
export const PRIVY_APP_ID =
  import.meta.env.VITE_PRIVY_APP_ID || "YOUR_PRIVY_APP_ID";

export const privyConfigured =
  PRIVY_APP_ID && PRIVY_APP_ID !== "YOUR_PRIVY_APP_ID";
