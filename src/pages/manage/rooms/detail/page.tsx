import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRooms } from "@/hooks/useRooms";
import type { RoomView } from "@/hooks/useRooms";
import { fetchRoomsData, type DbAllocation } from "@/lib/roomsDb";
import { getRoomImage } from "@/lib/roomImages";

export default function ManageRoomDetail() {
  const { id: roomId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { rooms, loading, error, reload } = useRooms(user?.hostelId || 0);
  const [room, setRoom] = useState<RoomView | null>(null);
  const [allocs, setAllocs] = useState<DbAllocation[]>([]);
  const [loadingExtra, setLoadingExtra] = useState(false);

  useEffect(() => {
    if (!roomId || rooms.length === 0) return;
    const found = rooms.find((r) => String(r.dbId) === String(roomId) || r.number === String(roomId));
    if (found) {
      setRoom(found);
    }
  }, [rooms, roomId]);

  useEffect(() => {
    if (!room) return;
    (async () => {
      try {
        setLoadingExtra(true);
        const data = await fetchRoomsData(user?.hostelId || (room as any));
      } catch (e) {
        // ignore
      } finally {
        setLoadingExtra(false);
      }
    })();
  }, [room, user]);

  if (loading && !room) {
    return <div className="py-10 text-center text-foreground-500">Loading…</div>;
  }
  if (error) {
    return <div className="py-10 text-center text-foreground-500">{error}</div>;
  }
  if (!room) {
    return <div className="py-10 text-center text-foreground-500">Room not found. <Link to="/manage/rooms" className="text-primary-600 hover:underline">Back</Link></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground-950">Room {room.number}</h1>
          <p className="text-sm text-foreground-600 mt-1">Floor {room.floor} • {room.type} • Capacity {room.capacity}</p>
        </div>
        <Link to="/manage/rooms" className="text-sm text-primary-600 hover:underline">Back to rooms</Link>
      </div>
      <div className="bg-background-50 border border-background-200 rounded-xl overflow-hidden">
        <div className="aspect-video w-full bg-background-100">
          <img src={getRoomImage(`${user?.hostelId || 0}-${room.number}`, room.capacity, room.imageUrl)} alt={room.number} className="w-full h-full object-cover object-bottom" />
        </div>
      </div>
      <div className="bg-background-50 border border-background-200 rounded-xl p-6">
        <h2 className="font-heading text-lg font-bold text-foreground-950">Beds</h2>
        <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {room.beds.map((bed) => (
            <div key={bed.id} className={`p-4 rounded-lg border ${bed.status === "occupied" ? "border-primary-200 bg-primary-50" : bed.status === "maintenance" ? "border-accent-200 bg-accent-50" : "border-background-200 bg-background-100"}`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground-900">Bed {bed.number}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-background-200 text-foreground-700">{bed.status}</span>
              </div>
              {bed.studentName && <p className="text-sm text-foreground-600 mt-2">{bed.studentName}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
