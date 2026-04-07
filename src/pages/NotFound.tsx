import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <PageLayout>
      <section className="section-spacing">
        <div className="container-grid text-center">
          <h1 className="text-8xl font-display font-bold gradient-text mb-4">404</h1>
          <h2 className="mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">The page you are looking for does not exist or has been moved.</p>
          <Button asChild className="rounded-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold px-8">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default NotFound;
