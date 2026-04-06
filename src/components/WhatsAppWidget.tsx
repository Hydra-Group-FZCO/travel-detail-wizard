import { MessageCircle } from "lucide-react";

const WhatsAppWidget = () => {
  return (
    <a
      href="https://wa.me/376338383"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[90] w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-elevated hover:scale-110 transition-transform duration-200"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" fill="white" />
    </a>
  );
};

export default WhatsAppWidget;
