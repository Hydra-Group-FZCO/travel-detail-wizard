import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import AnimatedCounter from "@/components/AnimatedCounter";
import VentureCard from "@/components/VentureCard";
import { Code, Brain, Megaphone, Shield, Zap, Users, Globe, Clock, ChevronRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const services = [
  {
    icon: Code,
    title: "Software Development",
    desc: "End-to-end custom software solutions — from web and mobile applications to complex enterprise platforms. We build scalable, secure, and high-performance systems tailored to your business needs.",
    tags: ["React", "Node.js", "Python", "TypeScript", "AWS", "Docker"],
  },
  {
    icon: Brain,
    title: "Artificial Intelligence",
    desc: "We design and deploy AI-powered solutions that transform business operations. From natural language processing to computer vision and predictive analytics, we turn data into actionable intelligence.",
    tags: ["LLM Integration", "NLP", "Computer Vision", "Predictive Analytics"],
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    desc: "Data-driven marketing strategies that deliver measurable results. We combine creative excellence with analytics to build brands, drive traffic, and convert customers at scale.",
    tags: ["SEO/SEM", "Social Media", "Content Strategy", "Performance Marketing"],
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    desc: "Protect your digital assets with enterprise-grade security. We provide comprehensive security audits, penetration testing, vulnerability assessments, and ongoing monitoring.",
    tags: ["Security Audits", "Pen Testing", "Compliance", "Monitoring"],
  },
];

const ventures = [
  { name: "MoonCollect", url: "https://mooncollect.com", category: "FinTech / Payments", color: "#3B82F6", desc: "Enterprise payment orchestration platform for high-volume merchants. Intelligent PSP routing, real-time transaction screening, and smart risk analysis.", metrics: "€50M+ processed monthly • 30+ countries" },
  { name: "Escudo Fiscal", url: "https://www.escudofiscal.es", category: "Tax Advisory", color: "#F59E0B", desc: "Specialized tax advisory firm in Spain and internationally. Expert fiscal planning for crypto assets, expats/impats, wealth protection.", metrics: "15+ years experience • Crypto & Expat specialists" },
  { name: "GPT Hydra", url: "https://gpthydra.com", category: "AI & Consulting", color: "#8B5CF6", desc: "Dubai-based multidisciplinary consultancy providing comprehensive 360° solutions in IT, AI, financial markets, and investment advisory.", metrics: "Dubai Silicon Oasis • HNW clients" },
  { name: "Taste2Home", url: "https://taste2home.com", category: "Food & Catering", color: "#F97316", desc: "Premium British catering service in London. Locally sourced ingredients, exceptional quality for weddings, corporate events, and private dining.", metrics: "London-based • Weddings & Corporate Events" },
  { name: "Britania Books", url: "https://britaniabooks.com", category: "Accounting & Finance", color: "#10B981", desc: "Expert accounting and bookkeeping services for UK businesses. Company formation, tax filing, VAT returns, and ecommerce accounting.", metrics: "1,000+ clients • 99% on-time filing" },
  { name: "Sterling Firm", url: "https://sterlingfirm.com", category: "Financial Services", color: "#64748B", desc: "Professional financial services and corporate advisory. Strategic financial planning, investment advisory, and business consulting.", metrics: "Corporate Advisory • Investment Strategy" },
  { name: "eVisa Apply", url: "https://evisaapply.com", category: "Travel & Visas", color: "#14B8A6", desc: "Online visa and travel document processing platform. Fast, secure, and simplified visa applications for travelers worldwide.", metrics: "200+ countries • 95%+ approval rate" },
];

const testimonials = [
  { quote: "Digital Moonkey transformed our payment infrastructure. Their technical expertise and commitment to excellence are unmatched.", author: "James Mitchell", role: "CEO, HAT Agency" },
  { quote: "Working with the Digital Moonkey team was a game-changer for our business. They delivered a complete solution ahead of schedule.", author: "Emma Rodriguez", role: "CEO, Marketly" },
  { quote: "Their AI solutions helped us automate 60% of our manual processes. The ROI was visible within the first month.", author: "Michael Torres", role: "Founder, CodeClaud" },
];

const techStack = ["React", "Vue.js", "Next.js", "Node.js", "Python", "TypeScript", "PostgreSQL", "MongoDB", "AWS", "Docker", "Kubernetes", "TensorFlow", "OpenAI", "Stripe", "Tailwind CSS"];

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  );
}

const Index = () => {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/30" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="container-grid relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <h1 className="mb-6">
              We Build the Future of{" "}
              <span className="gradient-text">Digital Business</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              Digital Moonkey is a technology company creating innovative solutions in software development, artificial intelligence, digital marketing, and cybersecurity.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold text-base px-8">
                <Link to="/ventures">Explore Our Ventures</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full font-semibold text-base px-8 border-border hover:bg-secondary">
                <Link to="/contact">Get In Touch</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <Section className="section-spacing">
        <div className="container-grid">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <p className="text-primary font-semibold text-sm mb-2 tracking-widest uppercase">What We Do</p>
            <h2>Our Core Services</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.title} variants={fadeUp} className="glass-card rounded-2xl p-6 group hover:glow-blue transition-shadow duration-500">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{s.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Stats */}
      <Section className="py-16 border-y border-border/30">
        <div className="container-grid">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: 7, suffix: "+", label: "Products & Ventures" },
              { value: 5, suffix: "", label: "Countries" },
              { value: 3, suffix: "", label: "Co-Founders, One Vision" },
              { value: 24, suffix: "/7", label: "Support & Monitoring" },
            ].map((s) => (
              <motion.div key={s.label} variants={fadeUp}>
                <div className="text-4xl md:text-5xl font-display font-bold text-foreground mb-1">
                  <AnimatedCounter target={s.value} />{s.suffix}
                </div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Ventures */}
      <Section className="section-spacing">
        <div className="container-grid">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <p className="text-primary font-semibold text-sm mb-2 tracking-widest uppercase">Our Ecosystem</p>
            <h2 className="mb-4">A Growing Portfolio of Digital Ventures</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Each brand in our ecosystem is built with the same commitment to excellence, innovation, and user experience.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ventures.map((v) => (
              <motion.div key={v.name} variants={fadeUp}>
                <VentureCard {...v} />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Why Us */}
      <Section className="section-spacing bg-secondary/20">
        <div className="container-grid">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2>Why Companies Choose Digital Moonkey</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Zap, title: "End-to-End Execution", desc: "We don't just consult — we build, launch, and scale. From concept to production, our team handles every stage of the product lifecycle." },
              { icon: Globe, title: "Cross-Industry Expertise", desc: "Our portfolio spans fintech, travel, food, accounting, and advisory services. This diverse experience gives us unique insights that benefit every project." },
              { icon: Shield, title: "Security-First Mindset", desc: "Every product we build is designed with enterprise-grade security from day one. PCI-DSS compliance, penetration testing, and continuous monitoring are standard." },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <motion.div key={p.title} variants={fadeUp} className="glass-card rounded-2xl p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Tech Stack */}
      <Section className="py-16 border-y border-border/30 overflow-hidden">
        <div className="container-grid">
          <motion.div variants={fadeUp} className="text-center mb-10">
            <h2 className="text-xl font-bold">Built With Modern Technology</h2>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((t) => (
              <motion.span key={t} variants={fadeUp} className="px-4 py-2 rounded-full bg-secondary text-sm font-mono text-muted-foreground border border-border/50 hover:border-primary/50 hover:text-primary transition-colors cursor-default">
                {t}
              </motion.span>
            ))}
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="section-spacing">
        <div className="container-grid">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <p className="text-primary font-semibold text-sm mb-2 tracking-widest uppercase">Testimonials</p>
            <h2>What Our Partners Say</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <motion.div key={t.author} variants={fadeUp} className="glass-card rounded-2xl p-6">
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-bold text-foreground">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <section className="section-spacing relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        <div className="container-grid relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="mb-4">Ready to Build Something Great?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">Let's discuss how Digital Moonkey can help bring your vision to life.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold px-8">
                <Link to="/contact">Schedule a Call</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full font-semibold px-8">
                <Link to="/contact">Send Us a Message <ChevronRight className="ml-1 w-4 h-4" /></Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
