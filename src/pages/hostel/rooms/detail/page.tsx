import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { usePublicHostelAvailability } from "@/hooks/usePublicHostelAvailability";
import { getRoomImage } from "@/lib/roomImages";

export default function RoomDetailPage() {
  const { id, roomId } = useParams<{ id: string; roomId: string }>();
  const hostelId = id ? Number(id) : 0;
  const roomIdNum = roomId ? Number(roomId) : 0;
  const { data, loading, error, reload } = usePublicHostelAvailability(hostelId);

  const room = useMemo(
    () => data?.rooms.find((r) => r.id === roomIdNum),
    [data?.rooms, roomIdNum],
  );

  if (loading && !data) {
    return (
      <div className="py-20 text-center text-foreground-500">
        <i className="ri-loader-4-line animate-spin text-3xl"></i>
        <p className="mt-3 text-sm">Loading room details…</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="py-20 text-center text-foreground-500">
        <i className="ri-error-warning-line text-4xl block mb-3"></i>
        <p className="text-sm">{error}</p>
        <button
          onClick={reload}
          className="mt-4 px-4 py-2 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold whitespace-nowrap cursor-pointer transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="py-20 text-center text-foreground-500">
        <p className="text-sm">Room not found.</p>
        <Link to={`/hostel/${hostelId}/rooms`} className="text-primary-600 hover:underline text-sm block mt-3">
          Back to rooms
        </Link>
      </div>
    );
  }

  const status = room.available > 0 ? (room.maintenance > 0 ? "maintenance" : "available") : "full";
  const images = [getRoomImage(`${hostelId}-${room.roomNumber}`, room.capacity, room.imageUrl)];

  return (
    <section className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <Link to={`/hostel/${hostelId}/rooms`} className="inline-flex items-center gap-2 text-sm text-foreground-600 hover:text-foreground-900 mb-6">
          <i className="ri-arrow-left-line"></i> Back to rooms
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-background-100 border border-background-200">
              <img src={images[0]} alt={`Room ${room.roomNumber}`} className="w-full h-full object-cover object-bottom" />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {images.slice(1).map((img, idx) => (
                  <div key={idx} className="aspect-video rounded-lg overflow-hidden bg-background-100 border border-background-200">
                    <img src={img} alt={`Room ${room.roomNumber} ${idx + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground-950">Room {room.roomNumber}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-foreground-600">
              <span>Block {room.block}</span>
              <span>•</span>
              <span>Floor {room.floor}</span>
              <span>•</span>
              <span>{room.roomType || "Standard"}</span>
              <span>•</span>
              <span>Capacity {room.capacity}</span>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status === "available" ? "bg-primary-100 text-primary-700" : status === "maintenance" ? "bg-accent-100 text-accent-800" : "bg-background-200 text-foreground-600"}`}>
                {status === "available" ? "Available" : status === "maintenance" ? "Maintenance" : "Full"}
              </span>
              <span className="text-sm text-foreground-600">{room.available} of {room.capacity} beds free</span>
            </div>

            {room.description && (
              <div className="mt-6">
                <h2 className="font-heading text-lg font-bold text-foreground-950">Description</h2>
                <p className="mt-2 text-sm text-foreground-700 whitespace-pre-wrap">{room.description}</p>
              </div>
            )}

            {room.amenities && room.amenities.length > 0 && (
              <div className="mt-6">
                <h2 className="font-heading text-lg font-bold text-foreground-950">Amenities & Features</h2>
                <div className="mt-3 grid sm:grid-cols-2 gap-2">
                  {room.amenities.map((am, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-foreground-700">
                      <i className="ri-checkbox-circle-line text-primary-600"></i>
                      <span>{am}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={`/booking?hostel=${hostelId}`} className="px-6 py-3 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 font-semibold text-sm">
                Book this room
              </Link>
              <Link to={`/hostel/${hostelId}/rooms`} className="px-6 py-3 rounded-md border border-background-300 hover:bg-background-100 text-foreground-900 font-semibold text-sm">
                View all rooms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
