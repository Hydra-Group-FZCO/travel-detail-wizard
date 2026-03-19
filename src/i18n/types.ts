export type Language = "en" | "es" | "fr" | "it" | "de";

export interface Translations {
  nav: {
    home: string;
    services: string;
    about: string;
    contact: string;
  };
  hero: {
    badge: string;
    headline: string;
    headlineAccent: string;
    subheadline: string;
    cta: string;
    ctaSecondary: string;
  };
  trust: {
    verified: string;
    response: string;
    pricing: string;
    languages: string;
  };
  intro: {
    title: string;
    text: string;
  };
  services: {
    pageTitle: string;
    pageIntro: string;
    cards: {
      title: string;
      description: string;
    }[];
    sections: {
      id: string;
      title: string;
      badge?: string;
      intro: string;
      subtitle?: string;
      items?: string[];
      subsections?: {
        heading: string;
        items: string[];
      }[];
      closing?: string;
      note?: string;
    }[];
    cta: {
      title: string;
      text: string;
      button: string;
    };
    disclaimer: string;
  };
  trustSection: {
    title: string;
    items: { title: string; desc: string }[];
  };
  cta: {
    title: string;
    text: string;
    button: string;
  };
  about: {
    title: string;
    subtitle: string;
    introText: string;
    whatWeDoTitle: string;
    whatWeDoText: string;
    howWeWorkTitle: string;
    howWeWorkItems: string[];
    companyTitle: string;
    companyName: string;
    companyRegistered: string;
    companyDirector: string;
    companyWebsite: string;
  };
  contact: {
    title: string;
    subtitle: string;
    items: { label: string; value: string }[];
    officeLabel: string;
    officeName: string;
    officeLocation: string;
  };
  legal: {
    title: string;
    paragraphs: string[];
    companyTitle: string;
    companyName: string;
    companyRegistered: string;
    companyDirector: string;
  };
  footer: {
    disclaimer: string;
    description: string;
    servicesTitle: string;
    serviceLinks: { label: string; hash: string }[];
    companyTitle: string;
    companyLinks: { label: string; to: string }[];
    copyright: string;
    bottomLinks: { label: string; to: string }[];
    bottomNote: string;
  };
}

export const languageNames: Record<Language, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  de: "Deutsch",
};

export const languageFlags: Record<Language, string> = {
  en: "🇬🇧",
  es: "🇪🇸",
  fr: "🇫🇷",
  it: "🇮🇹",
  de: "🇩🇪",
};
