import { useState } from "react";
import { Link } from "react-router-dom";
import { getRoomRate, hostels, rooms } from "@/mocks/hostels";

export default function Rooms() {
  const [activeHouseId, setActiveHouseId] = useState(hostels[0]?.id ?? 1);
  const activeHouse = hostels.find((h) => h.id === activeHouseId);

  return (
    <section id="rooms" className="py-24 px-4 md:px-8 bg-background-100">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.3em] uppercase text-primary-600 font-semibold">
            Room Categories
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground-950 mt-3">
            Pick the room that fits your rhythm.
          </h2>
          <p className="mt-4 text-foreground-600">
            From private 2-seaters to budget-friendly shared rooms — every option is clean, secure
            and study-ready.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {hostels.map((h) => {
            const isActive = h.id === activeHouseId;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => setActiveHouseId(h.id)}
                aria-pressed={isActive}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap cursor-pointer transition ${
                  isActive
                    ? "bg-primary-500 text-background-50"
                    : "bg-background-50 text-foreground-700 border border-background-200 hover:border-primary-300"
                }`}
              >
                {h.name}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-center text-sm text-foreground-500">
          Showing monthly rates for{" "}
          <span className="font-semibold text-foreground-700">{activeHouse?.name}</span>
        </p>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rooms.map((r, i) => (
            <div
              key={r.type}
              className="bg-background-50 rounded-2xl overflow-hidden border border-background-200 hover:border-primary-300 transition group"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={r.image}
                  alt={r.type}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                {i === 0 && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-accent-500 text-foreground-950 text-[10px] font-bold uppercase tracking-widest">
                    Most Loved
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-bold text-foreground-950">{r.type}</h3>
                  <span className="text-xs text-foreground-500">
                    <i className="ri-user-line mr-1"></i>
                    {r.capacity}
                  </span>
                </div>
                <ul className="mt-4 space-y-2">
                  {r.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground-700">
                      <i className="ri-check-line text-primary-600"></i>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 pt-5 border-t border-background-200 flex items-end justify-between">
                  <div>
                    <div className="font-heading text-2xl font-bold text-primary-600">
                      Rs {getRoomRate(r.capacity, activeHouseId).toLocaleString()}
                    </div>
                    <div className="text-xs text-foreground-500">per month / student</div>
                  </div>
                  <Link
                    to={`/booking?hostel=${activeHouseId}`}
                    className="px-3 py-2 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-xs font-semibold whitespace-nowrap cursor-pointer transition"
                  >
                    Book
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}