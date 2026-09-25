import { CEO_WHATSAPP, DEFAULT_WHATSAPP_MESSAGE, whatsappLink } from "@/lib/siteConfig";

export default function WhatsAppFab({ message }: { message?: string }) {
  const text = message ?? DEFAULT_WHATSAPP_MESSAGE;
  return (
    <a
      href={whatsappLink(CEO_WHATSAPP, text)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-3"
    >
      <span className="hidden md:inline-block px-4 py-2 rounded-full bg-foreground-950 text-background-50 text-sm font-medium opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
        Chat with us
      </span>
      <span className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center cursor-pointer hover:scale-105 transition">
        <i className="ri-whatsapp-line text-3xl"></i>
      </span>
    </a>
  );
}