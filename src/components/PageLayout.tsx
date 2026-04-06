import Header from "./Header";
import Footer from "./Footer";
import CookieConsent from "./CookieConsent";
import WhatsAppWidget from "./WhatsAppWidget";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieConsent />
      <WhatsAppWidget />
    </div>
  );
};

export default PageLayout;
