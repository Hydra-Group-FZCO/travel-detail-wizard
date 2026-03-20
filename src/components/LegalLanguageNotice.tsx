import { useLanguage } from "@/i18n";

const notices: Record<string, string> = {
  es: "Este documento está redactado en inglés, que es la versión legalmente vinculante. Se presenta en inglés de acuerdo con la legislación de Inglaterra y Gales.",
  fr: "Ce document est rédigé en anglais, qui constitue la version juridiquement contraignante. Il est présenté en anglais conformément à la législation de l'Angleterre et du Pays de Galles.",
  it: "Questo documento è redatto in inglese, che è la versione legalmente vincolante. È presentato in inglese ai sensi della legislazione di Inghilterra e Galles.",
  de: "Dieses Dokument ist in englischer Sprache verfasst, die die rechtsverbindliche Fassung darstellt. Es wird gemäß dem Recht von England und Wales in englischer Sprache bereitgestellt.",
};

const LegalLanguageNotice = () => {
  const lang = useLanguage();
  const notice = notices[lang];

  if (!notice) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-900">
      <p className="font-medium">⚠ {notice}</p>
    </div>
  );
};

export default LegalLanguageNotice;
