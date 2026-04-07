import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import PageLayout from "@/components/PageLayout";
import { Lightbulb, Eye, Award, Globe, Linkedin } from "lucide-react";

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

const team = [
  {
    name: "Pedro",
    role: "Co-Founder & CTO",
    bio: "Lead architect behind our software platforms and AI solutions. With deep expertise in full-stack development, cloud infrastructure, and machine learning, Pedro drives the technical vision across all Digital Moonkey products.",
    specialties: ["Software Architecture", "Cloud Computing", "Machine Learning", "Backend Systems"],
    initials: "P",
  },
  {
    name: "Tomás",
    role: "Co-Founder & CEO",
    bio: "Strategist and entrepreneur with a passion for building scalable digital businesses. Tomás leads business development, partnerships, and the overall growth strategy of Digital Moonkey and its portfolio companies.",
    specialties: ["Business Strategy", "Partnerships", "Product Management", "Growth"],
    initials: "T",
  },
  {
    name: "Gerard",
    role: "Co-Founder & CMO",
    bio: "Creative mind behind our brands and marketing strategies. Gerard combines data-driven marketing with compelling storytelling to build strong brands and drive customer acquisition across all our ventures.",
    specialties: ["Digital Marketing", "Brand Strategy", "SEO/SEM", "Content Marketing", "Analytics"],
    initials: "G",
  },
];

const values = [
  { icon: Lightbulb, title: "Innovation First", desc: "We embrace emerging technologies and push boundaries. Every solution we build leverages the latest advancements in AI, cloud, and security." },
  { icon: Eye, title: "Transparency", desc: "Clear communication, honest timelines, and upfront pricing. No hidden agendas, ever." },
  { icon: Award, title: "Quality Over Quantity", desc: "We'd rather build one exceptional product than ten mediocre ones. Excellence is non-negotiable." },
  { icon: Globe, title: "Global Mindset", desc: "Our team works across borders, cultures, and time zones. We understand global markets because we operate in them." },
];

const locations = [
  { flag: "🇬🇧", city: "London, UK", label: "Headquarters" },
  { flag: "🇪🇸", city: "Spain", label: "Operations" },
  { flag: "🇦🇩", city: "Andorra", label: "Operations" },
  { flag: "🇦🇪", city: "Dubai, UAE", label: "GPT Hydra Office" },
];

const About = () => {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="section-spacing relative overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="container-grid relative z-10 text-center max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="mb-6">Three Founders. <span className="gradient-text">One Mission.</span></h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We started Digital Moonkey with a simple belief: technology should empower businesses, not complicate them.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <Section className="pb-20">
        <div className="container-grid max-w-3xl">
          <motion.div variants={fadeUp} className="space-y-6">
            <p className="text-base text-muted-foreground leading-relaxed">
              Digital Moonkey Ltd was founded in 2024 by Pedro, Tomás, and Gerard — three entrepreneurs with complementary skills and a shared vision for building world-class digital products, with a particular focus on the travel and hospitality industry.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Our domain — <span className="text-primary font-semibold">digitalmoonkey.travel</span> — reflects our core specialisation. While we serve clients across multiple sectors, travel technology is where we started and where we continue to innovate. From visa processing platforms like eVisa Apply to booking engines and AI-powered trip planners, we understand the unique challenges travel businesses face.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Based in London and with operations across Europe and the Middle East, we've rapidly grown from a small development studio into a diversified technology group with seven active ventures spanning fintech, travel, food services, accounting, and advisory.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              We're currently working on one of our most ambitious projects to date: a <strong className="text-foreground">next-generation Property Management System (PMS)</strong> for a major international hotel chain. While we can't reveal the client's identity due to NDA obligations, this project showcases our ability to deliver enterprise-grade hospitality technology at scale.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Our approach is hands-on: we don't just build products for clients — we build, launch, and operate our own companies. This gives us a unique founder's perspective on every project we take on.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Team */}
      <Section className="section-spacing bg-secondary/20">
        <div className="container-grid">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <p className="text-primary font-semibold text-sm mb-2 tracking-widest uppercase">The Team</p>
            <h2>Meet Our Founders</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((m) => (
              <motion.div key={m.name} variants={fadeUp} className="glass-card rounded-2xl p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-5">
                  <span className="text-2xl font-display font-bold text-primary-foreground">{m.initials}</span>
                </div>
                <h3 className="text-lg font-bold mb-1">{m.name}</h3>
                <p className="text-sm text-primary font-semibold mb-4">{m.role}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{m.bio}</p>
                <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                  {m.specialties.map((s) => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-mono">{s}</span>
                  ))}
                </div>
                <button className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin size={18} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section className="section-spacing">
        <div className="container-grid">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2>Our Values</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <motion.div key={v.title} variants={fadeUp} className="glass-card rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-base font-bold mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Global Presence */}
      <Section className="section-spacing bg-secondary/20">
        <div className="container-grid text-center">
          <motion.div variants={fadeUp} className="mb-12">
            <h2>Global Presence</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {locations.map((l) => (
              <motion.div key={l.city} variants={fadeUp} className="glass-card rounded-2xl p-6 text-center">
                <span className="text-4xl mb-3 block">{l.flag}</span>
                <h3 className="text-base font-bold mb-1">{l.city}</h3>
                <p className="text-xs text-muted-foreground">{l.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default About;
