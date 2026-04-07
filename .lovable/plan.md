## Plan: Digital Moonkey Corporate Website Rebuild

### Overview
Complete redesign from travel/visa agency → dark-themed corporate tech website. English only. Framer Motion animations, glassmorphism, futuristic aesthetic.

### Phase 1: Foundation
1. **Install Framer Motion** dependency
2. **Update design system** — dark theme tokens in `index.css` + `tailwind.config.ts` (navy/charcoal backgrounds, electric blue/purple accents, glassmorphism utilities)
3. **New Header** — dark sticky with blur, new nav: About | Services | Ventures | Contact | "Let's Talk" CTA
4. **New Footer** — dark themed, venture links, legal links, company info
5. **Update PageLayout** — remove old WhatsApp widget, adapt to new design

### Phase 2: Pages
6. **Home page** (`Index.tsx`) — Hero with animated gradient, Services cards, Stats counters, Ventures grid, Approach section, Tech stack banner, Testimonials, CTA
7. **About page** (`About.tsx`) — Story, Team profiles (Pedro/Tomás/Gerard), Values, Global presence
8. **Services page** (`Services.tsx`) — 4 detailed service sections with process flows
9. **Ventures page** — New page with 7 venture cards (MoonCollect, Escudo Fiscal, GPT Hydra, Taste2Home, Britania Books, Sterling Firm, eVisa Apply)
10. **Contact page** (`Contact.tsx`) — Form with validation, info cards, map placeholder

### Phase 3: Legal & Polish
11. **Terms of Service** — Full legal text for UK tech company
12. **Privacy Policy** — UK GDPR compliant
13. **Cookie Policy** — Updated for tech company
14. **Routing** — Update App.tsx with all new routes
15. **Remove unused** — old i18n system, visa-related pages/data, eSIM code

### Key Design Tokens
- Background: `#0F172A` / `#020617`
- Card: `rgba(30,41,59,0.8)` + backdrop-blur
- Primary accent: `#3B82F6` (electric blue)
- Secondary accent: `#8B5CF6` (purple)
- Text: `#F8FAFC` / `#94A3B8`

### Components to Create
- `VentureCard`, `ServiceCard`, `TeamCard`, `TestimonialCarousel`, `AnimatedCounter`, `BackToTop`
