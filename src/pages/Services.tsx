import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Code, Brain, Megaphone, Shield, ChevronRight } from "lucide-react";

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

const services = [
  {
    id: "software",
    icon: Code,
    title: "Software Development",
    desc: "End-to-end custom software solutions — from web and mobile applications to complex enterprise platforms. We build scalable, secure, and high-performance systems tailored to your business needs.",
    process: ["Discovery", "Design", "Development", "Testing", "Deployment", "Support"],
    useCases: ["Web Applications", "Mobile Apps", "SaaS Platforms", "E-commerce", "API Development"],
    technologies: ["React", "Vue.js", "Node.js", "Python", "TypeScript", "PostgreSQL", "AWS", "Docker", "Kubernetes"],
    cta: "Start Your Project",
  },
  {
    id: "ai",
    icon: Brain,
    title: "Artificial Intelligence",
    desc: "We design and deploy AI-powered solutions that transform business operations. From natural language processing to computer vision and predictive analytics, we turn data into actionable intelligence.",
    process: ["Data Assessment", "Model Design", "Training", "Integration", "Monitoring", "Optimization"],
    useCases: ["Custom LLM Solutions", "NLP/NLU", "Computer Vision", "Predictive Analytics", "AI Chatbots", "Process Automation"],
    technologies: ["TensorFlow", "PyTorch", "OpenAI", "LangChain", "Hugging Face", "Python", "CUDA"],
    cta: "Explore AI Solutions",
  },
  {
    id: "marketing",
    icon: Megaphone,
    title: "Digital Marketing",
    desc: "Data-driven marketing strategies that deliver measurable results. We combine creative excellence with analytics to build brands, drive traffic, and convert customers at scale.",
    process: ["Audit", "Strategy", "Execution", "Optimization", "Reporting", "Scaling"],
    useCases: ["SEO/SEM", "Social Media Marketing", "Content Marketing", "Email Marketing", "Brand Strategy", "Analytics & Reporting"],
    technologies: ["Google Ads", "Meta Ads", "Semrush", "Google Analytics", "HubSpot", "Mailchimp"],
    cta: "Grow Your Brand",
  },
  {
    id: "security",
    icon: Shield,
    title: "Cybersecurity",
    desc: "Protect your digital assets with enterprise-grade security. We provide comprehensive security audits, penetration testing, vulnerability assessments, and ongoing monitoring to keep your business safe.",
    process: ["Assessment", "Audit", "Remediation", "Testing", "Monitoring", "Compliance"],
    useCases: ["Penetration Testing", "Vulnerability Assessment", "Security Audits", "Compliance (PCI-DSS, GDPR, SOC 2)", "Incident Response", "Continuous Monitoring"],
    technologies: ["Burp Suite", "Metasploit", "Nessus", "Wireshark", "OWASP ZAP", "Splunk"],
    cta: "Secure Your Business",
  },
];

const Services = () => {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="section-spacing relative overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="container-grid relative z-10 text-center max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="mb-6">Our <span className="gradient-text">Services</span></h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From concept to scale, we provide end-to-end technology solutions that drive business growth.
            </p>
          </motion.div>
        </div>
      </section>

      {services.map((s, i) => {
        const Icon = s.icon;
        const isEven = i % 2 === 0;
        return (
          <Section key={s.id} className={`section-spacing ${isEven ? "" : "bg-secondary/20"}`}>
            <div className="container-grid">
              <motion.div variants={fadeUp} className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h2>{s.title}</h2>
                </div>
                <p className="text-base text-muted-foreground leading-relaxed mb-10">{s.desc}</p>

                <div className="mb-10">
                  <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-widest">Our Process</h3>
                  <div className="flex flex-wrap gap-3">
                    {s.process.map((step, idx) => (
                      <div key={step} className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">{idx + 1}</span>
                        <span className="text-sm text-muted-foreground">{step}</span>
                        {idx < s.process.length - 1 && <ChevronRight className="w-4 h-4 text-border" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-10">
                  <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-widest">Capabilities</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {s.useCases.map((uc) => (
                      <div key={uc} className="glass-card rounded-xl px-4 py-3 text-sm text-muted-foreground">{uc}</div>
                    ))}
                  </div>
                </div>

                <div className="mb-10">
                  <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-widest">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {s.technologies.map((t) => (
                      <span key={t} className="px-3 py-1.5 rounded-full bg-secondary text-xs font-mono text-muted-foreground border border-border/50">{t}</span>
                    ))}
                  </div>
                </div>

                <Button asChild className="rounded-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold px-8">
                  <Link to="/contact">{s.cta}</Link>
                </Button>
              </motion.div>
            </div>
          </Section>
        );
      })}
    </PageLayout>
  );
};

export default Services;
