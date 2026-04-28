import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import { AppLayout } from "./components/AppLayout";
import { AuthGate } from "./components/AuthGate";
import Dashboard from "./pages/Dashboard";
import Records from "./pages/Records";
import RecordDetail from "./pages/RecordDetail";
import AddRecord from "./pages/AddRecord";
import Providers from "./pages/Providers";
import Access from "./pages/Access";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            element={
              <AuthGate>
                <AppLayout />
              </AuthGate>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/records" element={<Records />} />
            <Route path="/records/new" element={<AddRecord />} />
            <Route path="/records/:id" element={<RecordDetail />} />
            <Route path="/providers" element={<Providers />} />
            <Route path="/access" element={<Access />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
