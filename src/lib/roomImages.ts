// ---------------------------------------------------------------------------
// Room images.
//
// Every room has its own unique key (e.g. "1-A1", "2-B3", "3-101"). The image
// for a room is either:
//   1. a custom image uploaded from the Admin/Manager panel, or
//   2. a real photograph from `public/houses/`, chosen to match the room's
//      house and capacity (a 2-bed room shows a 2-bed photo).
//
// Architecture note: admin overrides are kept in localStorage for the frontend
// demo and behind small functions so the storage can later be swapped for a real
// backend (REST API + secure file storage) without changing any UI component.
// ---------------------------------------------------------------------------

import { bestRoomPhoto, roomPhotosByHouse } from "@/mocks/houseMedia";
import { resolveImageUrl } from "@/lib/api";

const IMAGES_KEY = "mubarak_room_images_v1";
const CHANGE_EVENT = "mubarak-room-images-changed";

function hashKey(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0;
  }
  return h;
}

/**
 * Resolve the real photo for a room.
 *
 * Keys are built as `${hostelId}-${roomLabel}`, so the house id is recoverable
 * from the key. When the caller knows the room capacity we pick from that
 * capacity's photos for this house; otherwise we fall back to the best photo
 * for any of the room's capacities.
 */
export function defaultRoomImage(key: string, capacity?: number | null): string {
  const houseId = Number(key.split("-")[0]);
  const housePools = roomPhotosByHouse[houseId] ?? {};

  if (capacity) {
    const sameHouse = housePools[capacity];
    if (sameHouse?.length) return sameHouse[hashKey(key) % sameHouse.length];
    const anywhere = bestRoomPhoto[capacity];
    if (anywhere) return anywhere;
  }

  // No capacity given: walk the capacities in order until a photo is found.
  for (const cap of [2, 3, 4, 5]) {
    const pool = housePools[cap];
    if (pool?.length) return pool[hashKey(key + cap) % pool.length];
  }
  return bestRoomPhoto[2] ?? bestRoomPhoto[3] ?? "";
}

type Overrides = Record<string, string>;

function readOverrides(): Overrides {
  try {
    return JSON.parse(localStorage.getItem(IMAGES_KEY) || "") as Overrides;
  } catch {
    return {};
  }
}

function writeOverrides(value: Overrides): void {
  try {
    localStorage.setItem(IMAGES_KEY, JSON.stringify(value));
  } catch {
    // ignore storage failures
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function setRoomImage(key: string, dataUrl: string): void {
  const next = readOverrides();
  next[key] = dataUrl;
  writeOverrides(next);
}

export function getRoomImage(key: string, capacity?: number | null, imageUrl?: string | null): string {
  const overrides = readOverrides();
  // 1. An image uploaded for this specific room wins.
  if (imageUrl) {
    const resolved = resolveImageUrl(imageUrl);
    if (resolved) return resolved;
  }
  // 2. A locally-set override (admin panel, stored in the browser).
  if (overrides[key]) return overrides[key];
  // 3. A real photo matched to the room's house + capacity.
  return defaultRoomImage(key, capacity);
}

export function subscribeRoomImages(cb: () => void): () => void {
  const handler = () => cb();
  window.addEventListener(CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}