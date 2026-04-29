import { createRoot } from "react-dom/client";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "wagmi";
import App from "./App.tsx";
import "./index.css";
import { PRIVY_APP_ID, privyConfigured } from "./lib/privy";
import { wagmiConfig } from "./lib/wagmi";

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration);
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });
  });
}

const appContent = (
  <WagmiProvider config={wagmiConfig}>
    <App />
  </WagmiProvider>
);

createRoot(document.getElementById("root")!).render(
  privyConfigured && PRIVY_APP_ID ? (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ["email"],
        appearance: {
          theme: "light",
          accentColor: "#2B5BFF",
          logo: "/logo.png",
        },
        embeddedWallets: {
          ethereum: { createOnLogin: "users-without-wallets" },
        },
      }}
    >
      {appContent}
    </PrivyProvider>
  ) : (
    appContent
  ),
);