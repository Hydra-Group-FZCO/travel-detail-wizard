export type Language = "en" | "es" | "fr" | "it" | "de";

export interface Translations {
  nav: {
    home: string;
    services: string;
    experiences: string;
    about: string;
    contact: string;
  };
  experiences: {
    heroTitle: string;
    heroSubtitle: string;
    browseButton: string;
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
    companyAddress: string;
    companyDirector: string;
    companyWebsite: string;
    companyEmail: string;
  };
  contact: {
    title: string;
    subtitle: string;
    items: { label: string; value: string }[];
    officeLabel: string;
    officeName: string;
    officeAddress: string;
    officeLocation: string;
    form: {
      title: string;
      name: string;
      email: string;
      subject: string;
      message: string;
      submit: string;
      sending: string;
      success: string;
      error: string;
    };
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
  esims: {
    badge: string;
    heroTitle: string;
    heroSubtitle: string;
    searchPlaceholder: string;
    regionAll: string;
    regionEurope: string;
    regionAsia: string;
    regionAmericas: string;
    regionMiddleEast: string;
    regionGlobal: string;
    compatibleDevices: string;
    compatibleDevicesTitle: string;
    compatibleDevicesDesc: string;
    noPackages: string;
    noPackagesHint: string;
    plans: string;
    plan: string;
    days: string;
    buyNow: string;
    errorLoading: string;
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
