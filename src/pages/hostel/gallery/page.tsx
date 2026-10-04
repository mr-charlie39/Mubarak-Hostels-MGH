import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useHostelFull } from "@/hooks/useHostelFull";
import { getHostelDetail } from "@/lib/hostelContent";

export default function HostelGallery() {
  const { id } = useParams();
  const { hostel, loading } = useHostelFull(id ? Number(id) : null);
  const detail = getHostelDetail(id ? Number(id) : 0, hostel ?? undefined);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-foreground-500">
        <i className="ri-loader-4-line animate-spin text-3xl"></i>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <i className="ri-error-warning-line text-5xl text-accent-500"></i>
        <h1 className="font-heading text-2xl font-bold text-foreground-950 mt-4">House not found</h1>
        <Link
          to="/hostels"
          className="mt-6 px-6 py-3 rounded-md bg-primary-500 text-background-50 font-semibold cursor-pointer"
        >
          View All Houses
        </Link>
      </div>
    );
  }

  const photos = detail.gallery;
  const videos = detail.videos;
  const photoCount = photos.length;
  const labelFor = (i: number) => detail.galleryLabels?.[i] ?? "";

  return (
    <div>
      {/* Page header */}
      <section className="relative pt-32 pb-14 px-4 md:px-8 bg-foreground-950">
        <div className="mx-auto max-w-7xl">
          <Link
            to={`/hostel/${id}`}
            className="inline-flex items-center gap-2 text-background-300 hover:text-accent-300 text-sm cursor-pointer"
          >
            <i className="ri-arrow-left-line"></i>
            Back to {hostel.name}
          </Link>
          <h1 className="mt-4 font-heading text-3xl md:text-4xl font-bold text-background-50">
            Gallery
          </h1>
          <p className="mt-3 text-background-200 max-w-2xl">
            Real photos and room walkthroughs from {hostel.name} &mdash; every room type we offer,
            exactly as it looks today.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-full bg-background-800 text-background-100 font-semibold">
              {photoCount} photos
            </span>
            <span className="px-3 py-1.5 rounded-full bg-background-800 text-background-100 font-semibold">
              {videos.length} videos
            </span>
          </div>
        </div>
      </section>

      {/* Videos */}
      {videos.length > 0 && (
        <section className="pt-16 px-4 md:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-heading text-2xl font-bold text-foreground-950">Room Videos</h2>
            <p className="mt-2 text-foreground-600">
              Walk through each room type. Videos load only when you press play.
            </p>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {videos.map((v) => (
                <figure
                  key={v.src}
                  className="bg-background-50 rounded-2xl overflow-hidden border border-background-200"
                >
                  <video
                    className="w-full h-56 object-cover bg-foreground-950"
                    poster={v.poster}
                    preload="none"
                    controls
                    playsInline
                    onPlay={() => setPlaying(v.src)}
                    onPause={() => setPlaying((cur) => (cur === v.src ? null : cur))}
                    onEnded={() => setPlaying((cur) => (cur === v.src ? null : cur))}
                  >
                    <source src={v.src} type="video/mp4" />
                    Your browser does not support embedded videos.
                  </video>
                  <figcaption className="px-4 py-3 flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground-800">{v.label}</span>
                    {playing === v.src && (
                      <span className="text-[10px] uppercase tracking-widest text-accent-600 font-bold">
                        Playing
                      </span>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Photos */}
      <section className="py-16 px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-heading text-2xl font-bold text-foreground-950">Photos</h2>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {photos.map((img, i) => (
              <button
                key={img}
                onClick={() => setLightbox(i)}
                className="group relative rounded-2xl overflow-hidden border border-background-200 cursor-pointer text-left"
              >
                <img
                  src={img}
                  alt={labelFor(i) ? `${hostel.name} — ${labelFor(i)}` : `${hostel.name} gallery image ${i + 1}`}
                  loading="lazy"
                  className="w-full h-64 object-cover object-top group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground-950/60 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                {labelFor(i) && (
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-background-50/90 text-foreground-900 text-xs font-semibold opacity-0 group-hover:opacity-100 transition">
                    {labelFor(i)}
                  </span>
                )}
                <span className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background-50/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <i className="ri-zoom-in-line text-foreground-900"></i>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[60] bg-foreground-950/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[lightbox]}
              alt={labelFor(lightbox) || `${hostel.name} gallery enlarged`}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-4 -right-4 w-11 h-11 rounded-full bg-background-50 text-foreground-900 flex items-center justify-center cursor-pointer"
              aria-label="Close"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
            <button
              onClick={() => setLightbox((lightbox - 1 + photos.length) % photos.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background-50/90 text-foreground-900 flex items-center justify-center cursor-pointer"
              aria-label="Previous image"
            >
              <i className="ri-arrow-left-line text-xl"></i>
            </button>
            <button
              onClick={() => setLightbox((lightbox + 1) % photos.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background-50/90 text-foreground-900 flex items-center justify-center cursor-pointer"
              aria-label="Next image"
            >
              <i className="ri-arrow-right-line text-xl"></i>
            </button>
            <div className="mt-3 text-center text-background-200 text-sm">
              {labelFor(lightbox) && <>{labelFor(lightbox)} &middot; </>}
              {lightbox + 1} / {photoCount}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}