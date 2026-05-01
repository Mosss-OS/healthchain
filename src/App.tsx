import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
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
import Vitals from "./pages/Vitals";
import AddVitals from "./pages/AddVitals";
import Appointments from "./pages/Appointments";
import AddAppointment from "./pages/AddAppointment";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              element={
                <AuthGate>
                  <AppLayout />
                </AuthGate>
              }
            >
              <Route path="/dashboard" element={
                <ErrorBoundary name="Dashboard">
                  <Dashboard />
                </ErrorBoundary>
              } />
              <Route path="/records" element={
                <ErrorBoundary name="Records">
                  <Records />
                </ErrorBoundary>
              } />
              <Route path="/records/new" element={
                <ErrorBoundary name="AddRecord">
                  <AddRecord />
                </ErrorBoundary>
              } />
              <Route path="/records/:id" element={
                <ErrorBoundary name="RecordDetail">
                  <RecordDetail />
                </ErrorBoundary>
              } />
              <Route path="/providers" element={
                <ErrorBoundary name="Providers">
                  <Providers />
                </ErrorBoundary>
              } />
              <Route path="/access" element={
                <ErrorBoundary name="Access">
                  <Access />
                </ErrorBoundary>
              } />
              <Route path="/wallet" element={
                <ErrorBoundary name="Wallet">
                  <Wallet />
                </ErrorBoundary>
              } />
              <Route path="/profile" element={
                <ErrorBoundary name="Profile">
                  <Profile />
                </ErrorBoundary>
              } />
              <Route path="/notifications" element={
                <ErrorBoundary name="Notifications">
                  <Notifications />
                </ErrorBoundary>
              } />
              <Route path="/vitals" element={
                <ErrorBoundary name="Vitals">
                  <Vitals />
                </ErrorBoundary>
              } />
              <Route path="/vitals/new" element={
                <ErrorBoundary name="AddVitals">
                  <AddVitals />
                </ErrorBoundary>
              } />
              <Route path="/appointments" element={
                <ErrorBoundary name="Appointments">
                  <Appointments />
                </ErrorBoundary>
              } />
              <Route path="/appointments/new" element={
                <ErrorBoundary name="AddAppointment">
                  <AddAppointment />
                </ErrorBoundary>
              } />
            </Route>
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
