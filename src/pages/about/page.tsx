import { Link } from "react-router-dom";
import SiteNavbar from "@/components/feature/SiteNavbar";
import SiteFooter from "@/components/feature/SiteFooter";
import WhatsAppFab from "@/pages/home/components/WhatsAppFab";
import TeamSection from "@/components/feature/TeamSection";
import { ceo } from "@/mocks/team";
import { whatsappLink } from "@/lib/siteConfig";
import { useWardens } from "@/hooks/useWardens";
import { useHostelsFull } from "@/hooks/useHostelsFull";

const values = [
  {
    icon: "ri-shield-check-line",
    title: "Our Mission",
    text: "To provide safe, affordable and dignified student accommodation where every resident can focus on their education without worry.",
  },
  {
    icon: "ri-eye-line",
    title: "Our Vision",
    text: "To become Pakistan's most trusted student-living brand — a true second home for students from every corner of the country.",
  },
  {
    icon: "ri-heart-3-line",
    title: "Student-First",
    text: "Every decision — from room design to food menus — is made with the student's comfort, safety and productivity in mind.",
  },
  {
    icon: "ri-award-line",
    title: "Quality Standards",
    text: "Consistent cleanliness, maintenance and service standards audited monthly across all of our houses.",
  },
];

export default function About() {
  const { wardens } = useWardens();
  const { hostels } = useHostelsFull();

  return (
    <div className="min-h-screen bg-background-50">
      <SiteNavbar />

      {/* Hero */}
      <section className="relative h-[420px] md:h-[520px] overflow-hidden">
        <img
          src="https://storage.helloreaddy.io/project_files/9cdb5fa8-b5b4-4047-a387-50ae18ce3247/3a908a7d-8858-4a4c-b0d4-219122009883_compressed_unnamed.webp"
          alt="Mubarak Group of Hostels"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground-950/80 via-foreground-950/40 to-foreground-950/20"></div>
        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pb-14">
            <div className="flex items-center gap-3 mb-3">
              <img
                src="https://static.readdy.ai/image/773d73dcd4bfe3b3ab546a821d990052/7b72bbd942d6c3a71db63e797abcba69.png"
                alt="Mubarak Group of Hostels"
                className="h-12 w-auto rounded-lg bg-background-50/90 px-3 py-1"
              />
            </div>
            <span className="text-accent-400 text-xs tracking-[0.3em] uppercase font-semibold">
              About Us
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-background-50 mt-2">
              A decade of caring for students
            </h1>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-24 px-4 md:px-8">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground-950 leading-tight">
              More than a place to sleep — a place to grow.
            </h2>
            <p className="mt-6 text-foreground-700 leading-relaxed">
              Mubarak Group of Hostels began in 2012 with a simple belief: that students deserve
              accommodation that treats them with dignity, security and care. What started as a
              single 50-bed hostel in D Block, Satellite Town, Rawalpindi has grown into a network of hostels
              serving students from universities across Pakistan.
            </p>
            <p className="mt-4 text-foreground-700 leading-relaxed">
              Our management philosophy is rooted in discipline and respect — for the student, for
              the family that trusts us, and for the learning environment we help protect. We
              believe a clean room, a warm meal and a safe building are not luxuries; they are the
              foundation every student needs to succeed.
            </p>
            <p className="mt-4 text-foreground-700 leading-relaxed">
              Today, our team of managers and support staff work around the clock to
              maintain the highest standards of cleanliness, security and student support across
              every one of our branches.
            </p>
          </div>
          <div className="relative">
            <img
              src="https://storage.helloreaddy.io/project_files/9cdb5fa8-b5b4-4047-a387-50ae18ce3247/db69d22d-f7de-46d5-bd73-201f66a529af_compressed_unnamed-3.webp"
              alt="Hostel lounge"
              className="w-full h-[420px] object-cover object-top rounded-2xl"
            />
            <div className="absolute -bottom-8 -left-6 bg-accent-500 rounded-xl px-7 py-5">
              <div className="font-heading text-4xl font-bold text-foreground-950">14+</div>
              <div className="text-xs uppercase tracking-widest text-foreground-800">Years of Trust</div>
            </div>
          </div>
        </div>
      </section>

      {/* CEO */}
      <section className="py-24 px-4 md:px-8 bg-background-50">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-[1fr_1.4fr] gap-12 items-center">
          <div className="relative">
            <img
              src={ceo.photo}
              alt={ceo.name}
              className="w-full h-[440px] md:h-[500px] object-cover object-top rounded-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-accent-500 rounded-xl px-6 py-4 hidden md:block">
              <div className="font-heading text-lg font-bold text-foreground-950">Founder</div>
              <div className="text-xs text-foreground-800">Est. 2012</div>
            </div>
          </div>
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-primary-600 font-semibold">
              Meet Our CEO
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground-950 mt-3">
              {ceo.name}
            </h2>
            <div className="text-foreground-600 font-semibold mt-1">{ceo.title}</div>
            <div className="text-foreground-500 text-sm mt-1">{ceo.designation}</div>
            <p className="mt-6 text-foreground-700 leading-relaxed">{ceo.intro}</p>
            <blockquote className="mt-6 text-foreground-600 italic border-l-2 border-accent-500 pl-4">
              "{ceo.quote}"
            </blockquote>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:${ceo.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold whitespace-nowrap cursor-pointer transition"
              >
                <i className="ri-phone-line"></i>
                {ceo.phone}
              </a>
              <a
                href={whatsappLink(ceo.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#25D366] hover:bg-[#1eb958] text-white text-sm font-semibold whitespace-nowrap cursor-pointer transition"
              >
                <i className="ri-whatsapp-line"></i>
                WhatsApp
              </a>
              <a
                href={`mailto:${ceo.email}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-background-300 text-foreground-800 text-sm font-semibold whitespace-nowrap cursor-pointer hover:bg-background-100 transition"
              >
                <i className="ri-mail-line"></i>
                {ceo.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <TeamSection showWardens={false} />

      {/* Managers */}
      <section className="py-24 px-4 md:px-8 bg-background-100">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs tracking-[0.3em] uppercase text-primary-600 font-semibold">
              Our Manager
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground-950 mt-3">
              The caretakers of every residence
            </h2>
            <p className="mt-4 text-foreground-600">
              Every hostel has a dedicated resident manager responsible for the safety, discipline
              and wellbeing of its students — available on-site around the clock.
            </p>
          </div>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wardens.length === 0 ? (
              <div className="sm:col-span-2 lg:col-span-3 text-center py-10 text-foreground-500 text-sm">
                Manager details will appear here once accounts are assigned.
              </div>
            ) : (
              wardens.map((w) => {
                const hostel = hostels.find((h) => h.id === w.hostelId);
                return (
                  <div
                    key={w.id}
                    className="bg-background-50 border border-background-200 rounded-2xl p-6 hover:border-primary-300 transition"
                  >
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-4 border-background-100 bg-secondary-500 text-background-50 flex items-center justify-center text-2xl font-bold">
                      {w.avatarUrl ? (
                        <img src={w.avatarUrl} alt={w.name} className="w-full h-full object-cover object-top" />
                      ) : (
                        w.name.charAt(0)
                      )}
                    </div>
                    <div className="mt-4 text-center">
                      <h3 className="font-heading text-lg font-bold text-foreground-950">{w.name}</h3>
                      <div className="text-sm text-foreground-500 mt-0.5">{(w.position ?? "Manager").replace(/Warden/gi, "Manager")}</div>
                    </div>
                    <div className="mt-5 pt-5 border-t border-background-200 space-y-2.5 text-sm">
                      <div className="flex items-start gap-2">
                        <i className="ri-building-2-line text-primary-600 mt-0.5"></i>
                        <span className="text-foreground-700">{hostel?.name ?? "Unassigned"}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <a
                          href={`tel:${(w.phone ?? "").replace(/\s/g, "")}`}
                          className="flex items-center gap-2 text-foreground-700 hover:text-primary-600 cursor-pointer min-w-0"
                        >
                          <i className="ri-phone-line text-primary-600"></i>
                          <span className="truncate">{w.phone ?? "—"}</span>
                        </a>
                        {w.phone && (
                          <a
                            href={whatsappLink(w.phone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Chat on WhatsApp"
                            className="w-8 h-8 shrink-0 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:bg-[#1eb958] cursor-pointer transition"
                          >
                            <i className="ri-whatsapp-line text-sm"></i>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4 md:px-8 bg-background-100">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs tracking-[0.3em] uppercase text-primary-600 font-semibold">
              Our Values
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground-950 mt-3">
              What we stand for
            </h2>
          </div>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div
                key={v.title}
                className={`rounded-2xl p-7 border ${
                  i === 1
                    ? "bg-primary-500 border-primary-500 text-background-50"
                    : "bg-background-50 border-background-200"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-md flex items-center justify-center ${
                    i === 1 ? "bg-background-50/15" : "bg-primary-50"
                  }`}
                >
                  <i
                    className={`${v.icon} text-2xl ${i === 1 ? "text-background-50" : "text-primary-600"}`}
                  ></i>
                </div>
                <h3 className={`mt-5 font-heading text-lg font-bold ${i === 1 ? "text-background-50" : "text-foreground-950"}`}>
                  {v.title}
                </h3>
                <p className={`mt-2 text-sm leading-relaxed ${i === 1 ? "text-background-100" : "text-foreground-600"}`}>
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Houses */}
      <section className="py-24 px-4 md:px-8 bg-background-100">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs tracking-[0.3em] uppercase text-primary-600 font-semibold">
              Our Houses
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground-950 mt-3">
              Three residences, one standard of care.
            </h2>
            <p className="mt-4 text-foreground-600">
              Every Mubarak house runs to the same playbook — vetted on-site staff, 24/7 security, a
              hygienic in-house kitchen and a resident manager who knows each student by name.
            </p>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostels.length === 0 ? (
              <div className="sm:col-span-2 lg:col-span-3 text-center py-10 text-foreground-500 text-sm">
                <i className="ri-loader-4-line animate-spin"></i> Loading our houses…
              </div>
            ) : (
              hostels.map((h) => {
                const manager = wardens.find((w) => w.hostelId === h.id);
                return (
                  <Link
                    key={h.id}
                    to={`/hostel/${h.id}`}
                    className="group bg-background-50 border border-background-200 rounded-2xl overflow-hidden hover:border-primary-300 transition flex flex-col"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={h.image ?? ""}
                        alt={h.name}
                        loading="lazy"
                        className="w-full h-full object-cover object-bottom group-hover:scale-105 transition-transform duration-700"
                      />
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background-50/95 backdrop-blur text-xs font-semibold text-primary-700">
                        <i className="ri-map-pin-line mr-1"></i>
                        {h.location ?? "Rawalpindi"}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-heading text-xl font-bold text-foreground-950 group-hover:text-primary-600 transition">
                        {h.name}
                      </h3>

                      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                        <div className="rounded-md bg-background-100 py-2">
                          <div className="font-heading text-lg font-bold text-primary-600">{h.rooms}</div>
                          <div className="text-[10px] uppercase tracking-widest text-foreground-500">Rooms</div>
                        </div>
                        <div className="rounded-md bg-background-100 py-2">
                          <div className="font-heading text-lg font-bold text-primary-600">{h.beds}</div>
                          <div className="text-[10px] uppercase tracking-widest text-foreground-500">Beds</div>
                        </div>
                        <div className="rounded-md bg-background-100 py-2">
                          <div className="font-heading text-lg font-bold text-primary-600">{h.available}</div>
                          <div className="text-[10px] uppercase tracking-widest text-foreground-500">Free</div>
                        </div>
                      </div>

                      {manager && (
                        <div className="mt-5 flex items-center gap-3 rounded-xl bg-background-100 p-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden bg-primary-500 text-background-50 flex items-center justify-center font-semibold text-sm shrink-0">
                            {manager.avatarUrl ? (
                              <img src={manager.avatarUrl} alt={manager.name} className="w-full h-full object-cover object-top" />
                            ) : (
                              manager.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[10px] uppercase tracking-widest text-foreground-500">
                              Resident manager
                            </div>
                            <div className="text-sm font-semibold text-foreground-900 truncate">
                              {manager.name}
                            </div>
                          </div>
                        </div>
                      )}

                      <span className="mt-auto pt-5 border-t border-background-200 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600">
                        Explore {h.name}
                        <i className="ri-arrow-right-line"></i>
                      </span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}