// ---------------------------------------------------------------------------
// Central site-wide contact details for Mubarak Group of Hostels.
// Change these in one place and every page stays in sync.
// ---------------------------------------------------------------------------

export const CEO_NAME = "Mubarak Mehdi";
export const CEO_PHONE = "0302 9272481";
export const CEO_WHATSAPP = "923029272481";
export const CEO_EMAIL = "mubarakgroupofhostels@gmail.com";
export const HEAD_OFFICE = "400, 401, 419, D Block, Satellite Town, Rawalpindi, 46300";
export const HEAD_OFFICE_LANDMARK = "D Block, Satellite Town, Rawalpindi, 46300";
export const OFFICE_HOURS = "Daily · 9:00 AM — 9:00 PM";

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hello, I am interested in getting admission at Mubarak Group of Hostels. Please provide me with the available rooms and admission details.";

/** Build a wa.me link for a given phone number, stripping spaces and leading 0. */
export function whatsappLink(phone: string | null | undefined, message?: string): string {
  const digits = String(phone ?? "").replace(/[^0-9]/g, "");
  const number = digits.startsWith("0") ? `92${digits.slice(1)}` : digits;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${number}${text}`;
}

/** Build a tel: link for a given phone number. */
export function telLink(phone: string | null | undefined): string {
  return `tel:${String(phone ?? "").replace(/\s/g, "")}`;
}