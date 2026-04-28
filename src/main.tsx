import { createRoot } from "react-dom/client";
import { PrivyProvider } from "@privy-io/react-auth";
import App from "./App.tsx";
import "./index.css";
import { PRIVY_APP_ID, privyConfigured } from "./lib/privy";

const appContent = <App />;

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
