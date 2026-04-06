export type Language = "en" | "es" | "fr" | "it" | "de";

export interface Translations {
  nav: {
    home: string;
    visas: string;
    about: string;
    contact: string;
    login: string;
    applyVisa: string;
    myAccount: string;
    admin: string;
  };
  home: {
    heroBadge: string;
    heroTitle: string;
    heroAccent: string;
    heroSub: string;
    passportLabel: string;
    passportPh: string;
    destLabel: string;
    destPh: string;
    checkVisa: string;
    trustItems: string[];
    stats: { value: string; label: string }[];
    whyTitle: string;
    withoutTitle: string;
    withoutItems: string[];
    withTitle: string;
    withItems: string[];
    howTitle: string;
    howSub: string;
    steps: { title: string; desc: string }[];
    popularTitle: string;
    popularSub: string;
    from: string;
    reviewsTitle: string;
    reviewsSub: string;
    reviews: { name: string; country: string; text: string }[];
    nlTitle: string;
    nlSub: string;
    nlPh: string;
    nlBtn: string;
    ctaTitle: string;
    ctaSub: string;
    ctaBtn: string;
  };
  about: {
    title: string;
    p1: string;
    p2: string;
    highlights: { title: string; desc: string }[];
    officeTitle: string;
  };
  contact: {
    title: string;
    subtitle: string;
    chatTitle: string;
    chatTime: string;
    chatDesc: string;
    chatBtn: string;
    toolsTitle: string;
    toolNewApp: string;
    toolCheckOrder: string;
    toolMyAccount: string;
    toolHelp: string;
    emailTitle: string;
    emailTime: string;
    emailNote: string;
    formTitle: string;
    formName: string;
    formEmail: string;
    formSubject: string;
    formMessage: string;
    formSend: string;
    formSending: string;
    toastRequired: string;
    toastSuccess: string;
    toastError: string;
  };
  footer: {
    desc: string;
    reg: string;
    addr: string;
    companyTitle: string;
    aboutUs: string;
    contactUs: string;
    helpCenter: string;
    servicesTitle: string;
    eVisas: string;
    eta: string;
    photos: string;
    legalTitle: string;
    terms: string;
    privacy: string;
    cookies: string;
    refund: string;
    copyright: string;
  };
  cookie: {
    title: string;
    desc: string;
    acceptAll: string;
    manage: string;
    reject: string;
    prefsTitle: string;
    essential: string;
    essentialDesc: string;
    analytics: string;
    analyticsDesc: string;
    marketing: string;
    marketingDesc: string;
    save: string;
    back: string;
  };
  help: {
    title: string;
    subtitle: string;
    categories: { title: string; items: { q: string; a: string }[] }[];
    notFoundTitle: string;
    notFoundDesc: string;
    contactBtn: string;
    whatsappBtn: string;
  };
  visa: {
    notFound: string;
    notFoundBack: string;
    entry: string;
    validityBadge: string;
    approvalBadge: string;
    priceFrom: string;
    usd: string;
    standard: string;
    standardTime: string;
    urgent: string;
    urgentTime: string;
    superUrgent: string;
    superUrgentTime: string;
    applyNow: string;
    tabSummary: string;
    tabReqs: string;
    tabProcess: string;
    tabFaq: string;
    tabReviews: string;
    docType: string;
    validityField: string;
    validityValue: string;
    entriesField: string;
    entriesValue: string;
    processingField: string;
    processingValue: string;
    descTemplate: string;
    reqsTitle: string;
    reqs: string[];
    steps: { title: string; desc: string }[];
    faq: { q: string; a: string }[];
    reviewItems: { name: string; country: string; stars: number; text: string; date: string }[];
  };
  legal: {
    notice: string;
    noticeLabel: string;
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
