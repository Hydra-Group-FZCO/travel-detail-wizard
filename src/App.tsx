import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageContext, getLanguageFromPath } from "@/i18n";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Experiences from "./pages/Experiences";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import MyBookings from "./pages/dashboard/MyBookings";
import MyProfile from "./pages/dashboard/MyProfile";
import MyWishlist from "./pages/dashboard/MyWishlist";
import MyOrders from "./pages/dashboard/MyOrders";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminPackages from "./pages/admin/AdminPackages";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminEsims from "./pages/admin/AdminEsims";
import Esims from "./pages/Esims";
import MyEsims from "./pages/dashboard/MyEsims";
import ItineraryGenerator from "./pages/ItineraryGenerator";
import ItineraryView from "./pages/ItineraryView";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const lang = getLanguageFromPath(location.pathname);

  return (
    <LanguageContext.Provider value={lang}>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Customer dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<MyBookings />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="wishlist" element={<MyWishlist />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="esims" element={<MyEsims />} />
        </Route>

        {/* Admin panel */}
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminPackages />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="esims" element={<AdminEsims />} />
        </Route>

        {/* Public pages */}
        <Route path="/" element={<Index />} />
        <Route path="/services" element={<Services />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/esims" element={<Esims />} />
        <Route path="/itinerary-generator" element={<ItineraryGenerator />} />
        <Route path="/itinerary/:id" element={<ItineraryView />} />

        {/* Localized routes */}
        {["es", "fr", "it", "de"].map((l) => (
          <Route key={l} path={`/${l}`}>
            <Route index element={<Index />} />
            <Route path="services" element={<Services />} />
            <Route path="experiences" element={<Experiences />} />
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
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
