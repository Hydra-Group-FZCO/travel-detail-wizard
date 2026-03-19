import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageContext, getLanguageFromPath } from "@/i18n";
import Index from "./pages/Index";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Experiences from "./pages/Experiences";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const lang = getLanguageFromPath(location.pathname);

  return (
    <LanguageContext.Provider value={lang}>
      <Routes>
        {/* English (default — no prefix) */}
        <Route path="/" element={<Index />} />
        <Route path="/services" element={<Services />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/legal" element={<Legal />} />

        {/* Localized routes: /es, /fr, /it, /de */}
        {["es", "fr", "it", "de"].map((l) => (
          <Route key={l} path={`/${l}`}>
            <Route index element={<Index />} />
            <Route path="services" element={<Services />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="legal" element={<Legal />} />
          </Route>
        ))}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </LanguageContext.Provider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
