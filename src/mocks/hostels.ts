import { houseCardImage, photos1, photos2, photos3, roomCategoryImage, videos1, videos2, videos3 } from "@/mocks/houseMedia";

export const hostels = [
  {
    id: 1,
    name: "Jinnah House",
    gender: "boys",
    location: "Satellite Town, Rawalpindi",
    image: "/houses/jinnah-house/house-1.jpeg",
    rooms: 50,
    floors: 5,
    beds: 150,
    available: 22,
    facilities: ["Wi-Fi", "Security", "Mess", "Laundry"],
  },
  {
    id: 2,
    name: "SAMA House",
    gender: "boys",
    location: "Satellite Town, Rawalpindi",
    image: "/houses/sama-house/3-seater-3.jpeg",
    rooms: 50,
    floors: 5,
    beds: 150,
    available: 15,
    facilities: ["Wi-Fi", "Generator", "Mess", "Study Area"],
  },
  {
    id: 3,
    name: "Dr. Abdul Qadeer Khan House",
    gender: "boys",
    location: "Satellite Town, Rawalpindi",
    image: "/houses/dr-abdul-qadeer-khan/4-seater-2.jpeg",
    rooms: 50,
    floors: 5,
    beds: 150,
    available: 8,
    facilities: ["Wi-Fi", "Security", "Parking", "Hot Water"],
  },
];

export const facilities = [
  { icon: "ri-flashlight-line", title: "24/7 Electricity", desc: "Uninterrupted power with backup generators on every floor." },
  { icon: "ri-wifi-line", title: "High-Speed Wi-Fi", desc: "Fiber-optic internet in every room, common area and study lounge." },
  { icon: "ri-camera-lens-line", title: "CCTV Surveillance", desc: "24/7 monitored cameras covering entrances, hallways and lobbies." },
  { icon: "ri-shield-user-line", title: "Security", desc: "Security guard is available 24/7 for the safety and well-being of all residents." },
  { icon: "ri-restaurant-2-line", title: "Fresh Mess Food", desc: "Hygienic breakfast, lunch and dinner curated by our in-house chefs." },
  { icon: "ri-t-shirt-line", title: "Laundry & Housekeeping", desc: "Weekly laundry pickup." },
  { icon: "ri-drop-line", title: "Hot & Cold Water", desc: "Filtered drinking water and instant hot water across all washrooms." },
  { icon: "ri-book-open-line", title: "Study Lounges", desc: "Quiet, well-lit study zones designed for focus and productivity." },
];

/**
 * Monthly room rate per student, in PKR, keyed by house id then room capacity.
 *
 * SAMA House is the premium branch. Jinnah House and Dr. Abdul Qadeer Khan House
 * share the standard pricing tier.
 */
export const roomRates: Record<number, Record<number, number>> = {
  1: { 2: 21000, 3: 19000, 4: 18000, 5: 17000 },
  2: { 2: 25000, 3: 24000, 4: 23000, 5: 21000 },
  3: { 2: 21000, 3: 19000, 4: 18000, 5: 17000 },
};

/** Rates used when a house has no explicit entry for a capacity. */
export const DEFAULT_ROOM_RATES: Record<number, number> = { 2: 21000, 3: 19000, 4: 18000, 5: 17000 };

/** Resolve the monthly rate for a room capacity at a given house. */
export function getRoomRate(capacity: number, hostelId?: number | null): number {
  return roomRates[hostelId ?? 0]?.[capacity] ?? DEFAULT_ROOM_RATES[capacity] ?? 0;
}

export const rooms = [
  {
    type: "2-Seater Deluxe",
    capacity: 2,
    price: 21000,
    image: roomCategoryImage[2],
    features: ["Attached bath", "Study desks", "Wardrobes", "AC"],
  },
  {
    type: "3-Seater Comfort",
    capacity: 3,
    price: 19000,
    image: roomCategoryImage[3],
    features: ["Attached bath", "Individual desks", "Wardrobes", "Fan"],
  },
  {
    type: "4-Seater Standard",
    capacity: 4,
    price: 18000,
    image: roomCategoryImage[4],
    features: ["Shared bath", "Study area", "Wardrobes", "Fan"],
  },
  {
    type: "5-Seater Economy",
    capacity: 5,
    price: 17000,
    image: roomCategoryImage[5],
    features: ["Shared bath", "Lockers", "Common desk", "Fan"],
  },
];

export const hostelDetails = [
  {
    id: 1,
    description:
      "Our flagship residence in Satellite Town, Rawalpindi — minutes from the Islamabad border. Close to Ayub National Park, Jinnah Park and the commercial heart of Saddar, it keeps students connected to both Rawalpindi and the capital while offering a calm, secure retreat indoors.",
    security:
      "24/7 CCTV coverage on every floor, biometric entry at the main gate, trained security guards stationed at the entrance, and strict visitor management with a digital register.",
    food:
      "Three freshly prepared meals a day — breakfast, lunch and dinner — cooked in our in-house kitchen. A weekly menu keeps things varied, with special Friday barbecue dinners.",
    wifi:
      "Dedicated fiber-optic line with 100 Mbps symmetrical speeds, individual access points on every floor and a backup connection to keep study time uninterrupted.",
    gallery: photos1.map((p) => p.src),
    galleryLabels: photos1.map((p) => p.label),
    videos: videos1,
  },
  {
    id: 2,
    description:
      "Nestled in D Block, Satellite Town, Rawalpindi, this branch offers a peaceful study-first environment. A short drive from Fatima Jinnah Women University and major banks, it's a favourite among students who prefer a quieter, well-connected setting near Islamabad.",
    security:
      "Round-the-clock guarded gate, CCTV on all floors and stairwells, and a biometric access system so only registered residents can enter the building.",
    food:
      "Home-style Pakistani meals served three times a day, with a rotating menu, hygienic kitchen and optional tuck shop for late-night snacks.",
    wifi:
      "High-speed fiber Wi-Fi available in every room, common areas and the rooftop study deck, with 24/7 technical support.",
    gallery: photos2.map((p) => p.src),
    galleryLabels: photos2.map((p) => p.label),
    videos: videos2,
  },
  {
    id: 3,
    description:
      "Located in D Block, Satellite Town, Rawalpindi — the academic gateway to the twin cities. Minutes from Arid Agriculture University, Bahria University and top coaching centres, it's designed for busy students who want study, food and entertainment all within reach of Islamabad.",
    security:
      "24/7 CCTV monitoring, secure boundary walls, night guards on patrol and a digital visitor logbook with photo capture.",
    food:
      "Balanced daily menu with breakfast, lunch and dinner, plus a hydration station with filtered cold and hot water on every floor.",
    wifi:
      "Dual fiber connections for redundancy, mesh Wi-Fi across all floors and gigabit-capable routers for seamless video calls and streaming.",
    gallery: photos3.map((p) => p.src),
    galleryLabels: photos3.map((p) => p.label),
    videos: videos3,
  },
];

export const hostelLocations = [
  {
    id: 1,
    name: "Jinnah House",
    address: "400, 401, 419, D Block, Satellite Town, Rawalpindi, 46300",
    phone: "0341 9715017",
    managerPhone: "03419715017",
    whatsapp: "923419715017",
    email: "jinnah@mubarakhostels.pk",
    mapEmbed:
      "https://maps.google.com/maps?q=J3RC%2BJR8%20D%20Block%20Satellite%20Town%20Rawalpindi%2046300&t=&z=16&ie=UTF8&iwloc=&output=embed",
    nearbyUniversities: [
      "Fatima Jinnah Women University",
      "Arid Agriculture University Rawalpindi",
      "Bahria University Islamabad",
    ],
    nearbyLandmarks: ["Ayub National Park", "Jinnah Park", "Saddar Bazaar"],
    warden: "Yousaf Mehsood",
  },
  {
    id: 2,
    name: "SAMA House",
    address: "400, 401, 419, D Block, Satellite Town, Rawalpindi, 46300",
    phone: "0310 5948138",
    managerPhone: "03105948138",
    whatsapp: "923105948138",
    email: "sama@mubarakhostels.pk",
    mapEmbed:
      "https://maps.google.com/maps?q=J3RC%2BJR8%20D%20Block%20Satellite%20Town%20Rawalpindi%2046300&t=&z=16&ie=UTF8&iwloc=&output=embed",
    nearbyUniversities: [
      "Arid Agriculture University Rawalpindi",
      "Bahria University Islamabad",
      "National University of Sciences & Technology (NUST)",
    ],
    nearbyLandmarks: ["Committee Chowk", "Rawalpindi Cricket Stadium", "Murree Road"],
    warden: "Abdullah",
  },
  {
    id: 3,
    name: "Dr. Abdul Qadeer Khan House",
    address: "400, 401, 419, D Block, Satellite Town, Rawalpindi, 46300",
    phone: "0304 5889984",
    managerPhone: "03045889984",
    whatsapp: "923045889984",
    email: "abdulqadeer@mubarakhostels.pk",
    mapEmbed:
      "https://maps.google.com/maps?q=J3RC%2BJR8%20D%20Block%20Satellite%20Town%20Rawalpindi%2046300&t=&z=16&ie=UTF8&iwloc=&output=embed",
    nearbyUniversities: [
      "Bahria University Islamabad",
      "International Islamic University Islamabad",
      "COMSATS University Islamabad",
    ],
    nearbyLandmarks: ["Ayub National Park", "Raja Bazaar", "Centaurus Mall Islamabad"],
    warden: "Bilah Ahmed",
  },
];
