import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Navbar } from "./components/Navbar";
import Index from "./pages/Index";
import Home from "./pages/Home";
import AvatarAuthGuard from "./components/AvatarAuthGuard";
import ChronoSystemsPanel from "./pages/ChronoSystemsPanel";
import RewardsCenter from "./pages/RewardsCenter";
import CommanderCoreNexus from "./pages/CommanderCoreNexus";
import ThemeManager from "./pages/ThemeManager";
import ChronoNav from "./pages/ChronoNav";
import Community from "./pages/Community";
import ChronopolisCore from "./pages/ChronopolisCore";
import ChronopolisSimulation from "./pages/ChronopolisSimulation";
import ChronoRegistry from "./pages/ChronoRegistry";
import VRExperience from "./pages/VRExperience";
import SystemSettings from "./pages/SystemSettings";
import Manifesto from "./pages/Manifesto";
import HexaDomeControl from "./pages/HexaDomeControl";
import ChronoShopping from "./pages/ChronoShopping";
import ChronoCooking from "./pages/ChronoCooking";
import VotingLab from "./pages/VotingLab";
import ARPortal from "./pages/ARPortal";
import SymptomDiagnostic from "./pages/SymptomDiagnostic";
import ResearchPortal from "./pages/ResearchPortal";
import ProtocolLog from "./pages/ProtocolLog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/avatar-profile" element={<AvatarAuthGuard />} />
            <Route path="/chrono-systems" element={<ChronoSystemsPanel />} />
            <Route path="/rewards" element={<RewardsCenter />} />
            <Route path="/commander-core" element={<CommanderCoreNexus />} />
            <Route path="/theme-manager" element={<ThemeManager />} />
            <Route path="/chrono-nav" element={<ChronoNav />} />
            <Route path="/community" element={<Community />} />
            <Route path="/chronopolis-core" element={<ChronopolisCore />} />
            <Route path="/chronopolis-simulation" element={<ChronopolisSimulation />} />
            <Route path="/chrono-registry" element={<ChronoRegistry />} />
            <Route path="/vr-experience" element={<VRExperience />} />
            <Route path="/system-settings" element={<SystemSettings />} />
            <Route path="/manifesto" element={<Manifesto />} />
            <Route path="/hexadome-control" element={<HexaDomeControl />} />
            <Route path="/chrono-shopping" element={<ChronoShopping />} />
            <Route path="/chrono-cooking" element={<ChronoCooking />} />
            <Route path="/voting-lab" element={<VotingLab />} />
            <Route path="/ar-portal" element={<ARPortal />} />
            <Route path="/symptom-diagnostic" element={<SymptomDiagnostic />} />
            <Route path="/research-portal" element={<ResearchPortal />} />
            <Route path="/protocol-log" element={<ProtocolLog />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
