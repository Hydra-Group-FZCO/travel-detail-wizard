import Header from "./Header";
import Footer from "./Footer";
import CookieConsent from "./CookieConsent";
import BackToTop from "./BackToTop";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
      <Footer />
      <CookieConsent />
      <BackToTop />
    </div>
  );
};

export default PageLayout;
