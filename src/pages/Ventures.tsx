import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import VentureCard from "@/components/VentureCard";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className={className}>
      {children}
    </motion.section>
  );
}

const ventures = [
  { name: "MoonCollect", url: "https://mooncollect.com", category: "FinTech / Payments", color: "#3B82F6", desc: "Enterprise payment orchestration platform for high-volume merchants. Intelligent PSP routing, real-time transaction screening, and smart risk analysis delivering 85-90% approval rates.", metrics: "€50M+ processed monthly • 30+ countries • 20+ PSPs integrated", features: ["Intelligent PSP routing", "Real-time transaction screening", "Smart risk analysis engine", "Multi-currency support"] },
  { name: "Escudo Fiscal", url: "https://www.escudofiscal.es", category: "Tax Advisory", color: "#F59E0B", desc: "Specialized tax advisory firm in Spain and internationally. Expert fiscal planning for crypto assets, expats/impats, wealth protection, and defense against tax authorities.", metrics: "15+ years experience • Crypto, Gambling & Expat specialists", features: ["Crypto tax advisory", "Expat/Impat fiscal planning", "Wealth protection", "Tax authority defense"] },
  { name: "GPT Hydra", url: "https://gpthydra.com", category: "AI & Consulting", color: "#8B5CF6", desc: "Dubai-based multidisciplinary consultancy providing comprehensive 360° solutions in IT, AI, financial markets, tax optimization, and investment advisory for HNW individuals and institutions.", metrics: "Based in Dubai Silicon Oasis • HNW & Institutional clients", features: ["AI-powered business intelligence", "Financial markets advisory", "Tax optimization strategies", "Investment consulting"] },
  { name: "Taste2Home", url: "https://taste2home.com", category: "Food & Catering", color: "#F97316", desc: "Premium British catering service in London. Locally sourced ingredients, exceptional quality. Weddings, corporate events, private dining, and educational institution catering.", metrics: "London-based • Weddings, Corporate & Private Events", features: ["Wedding catering", "Corporate events", "Private dining", "Educational institutions"] },
  { name: "Britania Books", url: "https://britaniabooks.com", category: "Accounting & Finance", color: "#10B981", desc: "Expert accounting and bookkeeping services for UK businesses. Company formation, tax filing, VAT returns, and ecommerce accounting — all in one plan with dedicated accountants.", metrics: "1,000+ clients • 99% on-time filing • £2M+ tax saved", features: ["Company formation", "Tax filing & VAT returns", "Ecommerce accounting", "Dedicated accountant"] },
  { name: "Sterling Firm", url: "https://sterlingfirm.com", category: "Financial Services", color: "#64748B", desc: "Professional financial services and corporate advisory. Strategic financial planning, investment advisory, and business consulting for growing enterprises.", metrics: "Corporate Advisory • Investment Strategy • Business Consulting", features: ["Corporate advisory", "Investment strategy", "Business consulting", "Financial planning"] },
  { name: "eVisa Apply", url: "https://evisaapply.com", category: "Travel & Visas", color: "#14B8A6", desc: "Online visa and travel document processing platform. Fast, secure, and simplified visa applications for travelers worldwide. 200+ countries covered with 24/7 support.", metrics: "200+ countries • 95%+ approval rate • 24/7 support", features: ["200+ countries covered", "Fast processing times", "Secure document handling", "24/7 customer support"] },
];

const Ventures = () => {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="section-spacing relative overflow-hidden">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="container-grid relative z-10 text-center max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="mb-6">Our <span className="gradient-text">Ventures</span></h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A growing portfolio of digital businesses, each built with the same commitment to excellence, innovation, and user experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ventures Grid */}
      <Section className="pb-20">
        <div className="container-grid">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ventures.map((v) => (
              <motion.div key={v.name} variants={fadeUp}>
                <VentureCard {...v} />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Pitch CTA */}
      <section className="section-spacing relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        <div className="container-grid relative z-10 text-center max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="mb-4">Building the Next Big Thing?</h2>
            <p className="text-muted-foreground mb-8">
              We're always exploring new ventures and partnerships. If you have a bold idea and need a technical co-founder or development partner, we'd love to hear from you.
            </p>
            <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold px-8">
              <Link to="/contact">Pitch Your Idea</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Ventures;
