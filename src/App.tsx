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
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import Refunds from "./pages/Refunds";
import Pricing from "./pages/Pricing";
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
import MyItineraries from "./pages/dashboard/MyItineraries";
import MyGuides from "./pages/dashboard/MyGuides";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminEsims from "./pages/admin/AdminEsims";
import AdminItineraries from "./pages/admin/AdminItineraries";
import AdminGuides from "./pages/admin/AdminGuides";
import AdminExperiences from "./pages/admin/AdminExperiences";
import AdminEvisas from "./pages/admin/AdminEvisas";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminPackages from "./pages/admin/AdminPackages";
import Esims from "./pages/Esims";
import MyEsims from "./pages/dashboard/MyEsims";
import ItineraryGenerator from "./pages/ItineraryGenerator";
import ItineraryView from "./pages/ItineraryView";
import TravelGuides from "./pages/TravelGuides";
import GuideView from "./pages/GuideView";
import PaymentSuccess from "./pages/PaymentSuccess";
import GuidePayment from "./pages/GuidePayment";
import EsimPayment from "./pages/EsimPayment";
import ItineraryPayment from "./pages/ItineraryPayment";

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
          <Route path="itineraries" element={<MyItineraries />} />
          <Route path="guides" element={<MyGuides />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="wishlist" element={<MyWishlist />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="esims" element={<MyEsims />} />
        </Route>

        {/* Admin panel */}
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="esims" element={<AdminEsims />} />
          <Route path="itineraries" element={<AdminItineraries />} />
          <Route path="guides" element={<AdminGuides />} />
          <Route path="experiences" element={<AdminExperiences />} />
          <Route path="evisas" element={<AdminEvisas />} />
          <Route path="packages" element={<AdminPackages />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="notifications" element={<AdminNotifications />} />
        </Route>

        {/* Public pages */}
        <Route path="/" element={<Index />} />
        <Route path="/services" element={<Services />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
         <Route path="/refunds" element={<Refunds />} />
         <Route path="/cookies" element={<Cookies />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/esims" element={<Esims />} />
        <Route path="/itinerary-generator" element={<ItineraryGenerator />} />
        <Route path="/itinerary/:id" element={<ItineraryView />} />
        <Route path="/travel-guides" element={<TravelGuides />} />
        <Route path="/travel-guides/view/:id" element={<GuideView />} />
        <Route path="/guide-payment" element={<ProtectedRoute><GuidePayment /></ProtectedRoute>} />
        <Route path="/esim-payment" element={<ProtectedRoute><EsimPayment /></ProtectedRoute>} />
        <Route path="/itinerary-payment" element={<ProtectedRoute><ItineraryPayment /></ProtectedRoute>} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* Localized routes */}
        {["es", "fr", "it", "de"].map((l) => (
          <Route key={l} path={`/${l}`}>
            <Route index element={<Index />} />
            <Route path="services" element={<Services />} />
            <Route path="experiences" element={<Experiences />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="legal" element={<Legal />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="refunds" element={<Refunds />} />
            <Route path="cookies" element={<Cookies />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="esims" element={<Esims />} />
            <Route path="itinerary-generator" element={<ItineraryGenerator />} />
            <Route path="itinerary/:id" element={<ItineraryView />} />
            <Route path="travel-guides" element={<TravelGuides />} />
            <Route path="travel-guides/view/:id" element={<GuideView />} />
            <Route path="guide-payment" element={<ProtectedRoute><GuidePayment /></ProtectedRoute>} />
            <Route path="esim-payment" element={<ProtectedRoute><EsimPayment /></ProtectedRoute>} />
            <Route path="itinerary-payment" element={<ProtectedRoute><ItineraryPayment /></ProtectedRoute>} />
            <Route path="payment-success" element={<PaymentSuccess />} />
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
