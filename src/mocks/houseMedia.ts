// ---------------------------------------------------------------------------
// Real photo + video media for each house.
//
// Every entry is a real photograph or room walkthrough supplied for the
// property, served straight out of `public/houses/`. Keys are house ids to match
// the `hostels` and `hostelDetails` records below.
//
// House ids: 1 = Jinnah House, 2 = SAMA House, 3 = Dr. Abdul Qadeer Khan House
// ---------------------------------------------------------------------------

export type HousePhoto = {
  src: string;
  label: string;
};

export type HouseVideo = {
  src: string;
  /** Still frame shown before the video is played. */
  poster: string;
  label: string;
};

/** Cover image used on house cards, house headers and booking steps. */
export const houseCardImage: Record<number, string> = {
  1: "/houses/jinnah-house/house-1.jpeg",
  2: "/houses/sama-house/3-seater-3.jpeg",
  3: "/houses/dr-abdul-qadeer-khan/4-seater-2.jpeg",
};

/** Best real photo per room capacity, used by the home Room Categories grid. */
export const roomCategoryImage: Record<number, string> = {
  2: "/houses/dr-abdul-qadeer-khan/2-seater-1.jpeg",
  3: "/houses/jinnah-house/3-seater-1.jpeg",
  4: "/houses/dr-abdul-qadeer-khan/4-seater-1.jpeg",
  5: "/houses/dr-abdul-qadeer-khan/5-seater-1.jpeg",
};

/** Jinnah House — 18 photos. */
export const photos1: HousePhoto[] = [
  { src: "/houses/jinnah-house/house-1.jpeg", label: "Inside the House" },
  { src: "/houses/jinnah-house/house-2.jpeg", label: "Inside the House" },
  { src: "/houses/jinnah-house/house-3.jpeg", label: "Inside the House" },
  { src: "/houses/jinnah-house/2-seater-1.jpeg", label: "2-Seater Room" },
  { src: "/houses/jinnah-house/3-seater-1.jpeg", label: "3-Seater Room" },
  { src: "/houses/jinnah-house/3-seater-2.jpeg", label: "3-Seater Room" },
  { src: "/houses/jinnah-house/3-seater-3.jpeg", label: "3-Seater Room" },
  { src: "/houses/jinnah-house/3-seater-4.jpeg", label: "3-Seater Room" },
  { src: "/houses/jinnah-house/3-seater-5.jpeg", label: "3-Seater Room" },
  { src: "/houses/jinnah-house/3-seater-6.jpeg", label: "3-Seater Room" },
  { src: "/houses/jinnah-house/3-seater-7.jpeg", label: "3-Seater Room" },
  { src: "/houses/jinnah-house/4-seater-1.jpeg", label: "4-Seater Room" },
  { src: "/houses/jinnah-house/4-seater-2.jpeg", label: "4-Seater Room" },
  { src: "/houses/jinnah-house/4-seater-3.jpeg", label: "4-Seater Room" },
  { src: "/houses/jinnah-house/4-seater-4.jpeg", label: "4-Seater Room" },
  { src: "/houses/jinnah-house/4-seater-5.jpeg", label: "4-Seater Room" },
  { src: "/houses/jinnah-house/4-seater-6.jpeg", label: "4-Seater Room" },
  { src: "/houses/jinnah-house/4-seater-7.jpeg", label: "4-Seater Room" },
];

/** Jinnah House — 8 videos. */
export const videos1: HouseVideo[] = [
  { src: "/houses/jinnah-house/videos/3-seater-1.mp4", poster: "/houses/jinnah-house/3-seater-1.jpeg", label: "3-Seater Room Video" },
  { src: "/houses/jinnah-house/videos/3-seater-2.mp4", poster: "/houses/jinnah-house/3-seater-1.jpeg", label: "3-Seater Room Video" },
  { src: "/houses/jinnah-house/videos/3-seater-3.mp4", poster: "/houses/jinnah-house/3-seater-1.jpeg", label: "3-Seater Room Video" },
  { src: "/houses/jinnah-house/videos/3-seater-4.mp4", poster: "/houses/jinnah-house/3-seater-1.jpeg", label: "3-Seater Room Video" },
  { src: "/houses/jinnah-house/videos/3-seater-5.mp4", poster: "/houses/jinnah-house/3-seater-1.jpeg", label: "3-Seater Room Video" },
  { src: "/houses/jinnah-house/videos/4-seater-1.mp4", poster: "/houses/jinnah-house/4-seater-1.jpeg", label: "4-Seater Room Video" },
  { src: "/houses/jinnah-house/videos/4-seater-2.mp4", poster: "/houses/jinnah-house/4-seater-1.jpeg", label: "4-Seater Room Video" },
  { src: "/houses/jinnah-house/videos/4-seater-3.mp4", poster: "/houses/jinnah-house/4-seater-1.jpeg", label: "4-Seater Room Video" },
];

/** SAMA House — 4 photos. */
export const photos2: HousePhoto[] = [
  { src: "/houses/sama-house/2-seater-1.jpeg", label: "2-Seater Room" },
  { src: "/houses/sama-house/3-seater-1.jpeg", label: "3-Seater Room" },
  { src: "/houses/sama-house/3-seater-2.jpeg", label: "3-Seater Room" },
  { src: "/houses/sama-house/3-seater-3.jpeg", label: "3-Seater Room" },
];

/** SAMA House — 1 videos. */
export const videos2: HouseVideo[] = [
  { src: "/houses/sama-house/videos/3-seater-1.mp4", poster: "/houses/sama-house/3-seater-1.jpeg", label: "3-Seater Room Video" },
];

/** Dr. Abdul Qadeer Khan House — 15 photos. */
export const photos3: HousePhoto[] = [
  { src: "/houses/dr-abdul-qadeer-khan/2-seater-1.jpeg", label: "2-Seater Room" },
  { src: "/houses/dr-abdul-qadeer-khan/2-seater-2.jpeg", label: "2-Seater Room" },
  { src: "/houses/dr-abdul-qadeer-khan/3-seater-1.jpeg", label: "3-Seater Room" },
  { src: "/houses/dr-abdul-qadeer-khan/3-seater-2.jpeg", label: "3-Seater Room" },
  { src: "/houses/dr-abdul-qadeer-khan/4-seater-1.jpeg", label: "4-Seater Room" },
  { src: "/houses/dr-abdul-qadeer-khan/4-seater-2.jpeg", label: "4-Seater Room" },
  { src: "/houses/dr-abdul-qadeer-khan/4-seater-3.jpeg", label: "4-Seater Room" },
  { src: "/houses/dr-abdul-qadeer-khan/4-seater-4.jpeg", label: "4-Seater Room" },
  { src: "/houses/dr-abdul-qadeer-khan/4-seater-5.jpeg", label: "4-Seater Room" },
  { src: "/houses/dr-abdul-qadeer-khan/4-seater-6.jpeg", label: "4-Seater Room" },
  { src: "/houses/dr-abdul-qadeer-khan/4-seater-7.jpeg", label: "4-Seater Room" },
  { src: "/houses/dr-abdul-qadeer-khan/4-seater-8.jpeg", label: "4-Seater Room" },
  { src: "/houses/dr-abdul-qadeer-khan/4-seater-9.jpeg", label: "4-Seater Room" },
  { src: "/houses/dr-abdul-qadeer-khan/5-seater-1.jpeg", label: "5-Seater Room" },
  { src: "/houses/dr-abdul-qadeer-khan/5-seater-2.jpeg", label: "5-Seater Room" },
];

/** Dr. Abdul Qadeer Khan House — 9 videos. */
export const videos3: HouseVideo[] = [
  { src: "/houses/dr-abdul-qadeer-khan/videos/2-seater-1.mp4", poster: "/houses/dr-abdul-qadeer-khan/2-seater-1.jpeg", label: "2-Seater Room Video" },
  { src: "/houses/dr-abdul-qadeer-khan/videos/2-seater-2.mp4", poster: "/houses/dr-abdul-qadeer-khan/2-seater-1.jpeg", label: "2-Seater Room Video" },
  { src: "/houses/dr-abdul-qadeer-khan/videos/3-seater-1.mp4", poster: "/houses/dr-abdul-qadeer-khan/3-seater-1.jpeg", label: "3-Seater Room Video" },
  { src: "/houses/dr-abdul-qadeer-khan/videos/4-seater-1.mp4", poster: "/houses/dr-abdul-qadeer-khan/4-seater-1.jpeg", label: "4-Seater Room Video" },
  { src: "/houses/dr-abdul-qadeer-khan/videos/4-seater-2.mp4", poster: "/houses/dr-abdul-qadeer-khan/4-seater-1.jpeg", label: "4-Seater Room Video" },
  { src: "/houses/dr-abdul-qadeer-khan/videos/4-seater-3.mp4", poster: "/houses/dr-abdul-qadeer-khan/4-seater-1.jpeg", label: "4-Seater Room Video" },
  { src: "/houses/dr-abdul-qadeer-khan/videos/4-seater-4.mp4", poster: "/houses/dr-abdul-qadeer-khan/4-seater-1.jpeg", label: "4-Seater Room Video" },
  { src: "/houses/dr-abdul-qadeer-khan/videos/4-seater-5.mp4", poster: "/houses/dr-abdul-qadeer-khan/4-seater-1.jpeg", label: "4-Seater Room Video" },
  { src: "/houses/dr-abdul-qadeer-khan/videos/4-seater-6.mp4", poster: "/houses/dr-abdul-qadeer-khan/4-seater-1.jpeg", label: "4-Seater Room Video" },
];

/**
 * Real room photos keyed by house id and room capacity.
 *
 * Powers the per-house Rooms & Beds grid and the booking room picker so a
 * 2-bed room shows a 2-bed photo instead of a generic placeholder. When a house
 * has no photo of a given capacity the best photo from any house is used.
 */
export const roomPhotosByHouse: Record<number, Record<number, string[]>> = {
  1: {
    2: [
      "/houses/jinnah-house/2-seater-1.jpeg",
    ],
    3: [
      "/houses/jinnah-house/3-seater-1.jpeg",
      "/houses/jinnah-house/3-seater-2.jpeg",
      "/houses/jinnah-house/3-seater-3.jpeg",
      "/houses/jinnah-house/3-seater-4.jpeg",
      "/houses/jinnah-house/3-seater-5.jpeg",
      "/houses/jinnah-house/3-seater-6.jpeg",
      "/houses/jinnah-house/3-seater-7.jpeg",
    ],
    4: [
      "/houses/jinnah-house/4-seater-1.jpeg",
      "/houses/jinnah-house/4-seater-2.jpeg",
      "/houses/jinnah-house/4-seater-3.jpeg",
      "/houses/jinnah-house/4-seater-4.jpeg",
      "/houses/jinnah-house/4-seater-5.jpeg",
      "/houses/jinnah-house/4-seater-6.jpeg",
      "/houses/jinnah-house/4-seater-7.jpeg",
    ],
  },
  2: {
    2: [
      "/houses/sama-house/2-seater-1.jpeg",
    ],
    3: [
      "/houses/sama-house/3-seater-1.jpeg",
      "/houses/sama-house/3-seater-2.jpeg",
      "/houses/sama-house/3-seater-3.jpeg",
    ],
  },
  3: {
    2: [
      "/houses/dr-abdul-qadeer-khan/2-seater-1.jpeg",
      "/houses/dr-abdul-qadeer-khan/2-seater-2.jpeg",
    ],
    3: [
      "/houses/dr-abdul-qadeer-khan/3-seater-1.jpeg",
      "/houses/dr-abdul-qadeer-khan/3-seater-2.jpeg",
    ],
    4: [
      "/houses/dr-abdul-qadeer-khan/4-seater-1.jpeg",
      "/houses/dr-abdul-qadeer-khan/4-seater-2.jpeg",
      "/houses/dr-abdul-qadeer-khan/4-seater-3.jpeg",
      "/houses/dr-abdul-qadeer-khan/4-seater-4.jpeg",
      "/houses/dr-abdul-qadeer-khan/4-seater-5.jpeg",
      "/houses/dr-abdul-qadeer-khan/4-seater-6.jpeg",
      "/houses/dr-abdul-qadeer-khan/4-seater-7.jpeg",
      "/houses/dr-abdul-qadeer-khan/4-seater-8.jpeg",
      "/houses/dr-abdul-qadeer-khan/4-seater-9.jpeg",
    ],
    5: [
      "/houses/dr-abdul-qadeer-khan/5-seater-1.jpeg",
      "/houses/dr-abdul-qadeer-khan/5-seater-2.jpeg",
    ],
  },
};

/** Best available real photo for a capacity, ignoring which house it came from. */
export const bestRoomPhoto: Record<number, string> = {
  2: "/houses/jinnah-house/2-seater-1.jpeg",
  3: "/houses/jinnah-house/3-seater-1.jpeg",
  4: "/houses/jinnah-house/4-seater-1.jpeg",
  5: "/houses/dr-abdul-qadeer-khan/5-seater-1.jpeg",
};