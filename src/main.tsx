import { createRoot } from "react-dom/client";
import { PrivyProvider } from "@privy-io/react-auth";
import App from "./App.tsx";
import "./index.css";
import { PRIVY_APP_ID } from "./lib/privy";

createRoot(document.getElementById("root")!).render(
  <PrivyProvider
    appId={PRIVY_APP_ID}
    config={{
      loginMethods: ["email"],
      appearance: {
        theme: "light",
        accentColor: "#2B5BFF",
        logo: undefined,
      },
      embeddedWallets: {
        createOnLogin: "users-without-wallets",
      },
    }}
  >
    <App />
  </PrivyProvider>,
);
