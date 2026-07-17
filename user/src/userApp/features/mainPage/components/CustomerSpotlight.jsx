import React, { useMemo } from "react";
import { CONFIG } from "../../../../config/AppConfig";

const CustomerSpotlight = () => {
  const photos = useMemo(
    () =>
      CONFIG?.ugcPhotos || [
        "https://judgeme.imgix.net/babli/1772878940__img20260218110605jpg__original.jpeg?auto=format&w=1024",
        "https://judgeme.imgix.net/babli/1772960703__14560aa9-d153-4241-8696-6b02b2bd327e__original.jpeg?auto=format&w=1024",
        "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop",
        "https://judgeme.imgix.net/babli/1771137507__1001065162__original.jpg?auto=format&w=1024",
        "https://judgeme.imgix.net/babli/1773417431__1773417423070-1000439858__original.jpg?auto=format&w=1024",
      ],
    [],
  );

  // Responsive stagger:
  // Mobile (2 cols) staggers the 2nd column.
  // Desktop (3 cols) staggers the middle and last columns.
  const getStaggerClass = (idx) => {
    const mobileStagger =
      idx % 2 === 1 ? "translate-y-3 sm:translate-y-4" : "translate-y-0";
    const desktopStagger =
      idx % 3 === 1
        ? "md:translate-y-6"
        : idx % 3 === 2
          ? "md:-translate-y-2"
          : "md:translate-y-0";

    return `${mobileStagger} ${desktopStagger}`;
  };

  return (
    <section className="relative w-full py-10 md:py-16 bg-white overflow-hidden">
      {/* SOFT BACKGROUND TEXTURE (Matched to VideoSection's subtle pink) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#fff7fa_0%,_transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col lg:flex-row gap-10 lg:gap-16 items-center lg:items-start pb-6 md:pb-8">
        {/* ── LEFT CONTENT ── */}
        <div className="w-full lg:w-1/3 text-center lg:text-left flex flex-col items-center lg:items-start">
          {/* Tag */}
          <span className="text-[#da127d] uppercase tracking-[0.2em] text-[10px] md:text-[11px] font-medium mb-2 md:mb-3">
            Our Community
          </span>

          {/* Heading */}
          <h2 className="text-[18px] sm:text-[20px] md:text-[26px] font-medium text-[#1a1a1a] tracking-[0.01em] leading-tight">
            {CONFIG?.BRAND_NAME || "Mnmukt"} Ke Patake
          </h2>

          {/* Sub text */}
          <p className="mt-1.5 md:mt-2 text-[12px] sm:text-[13px] md:text-[14px] text-[#6b6b6b] max-w-[420px] tracking-[0.02em] leading-relaxed">
            Real people. Real style. Real confidence. Discover how our community
            brings {CONFIG?.BRAND_NAME || "Mnmukt"} to life — from everyday
            elegance to statement moments.
          </p>

          <p className="mt-2 text-[11px] md:text-[12px] text-gray-500 italic font-serif">
            Every look tells a story — yours could be next.
          </p>

          {/* CTA (Matched with ProductSection Button) */}
          <a
            href={CONFIG?.websiteURL || "/"}
            className="inline-flex justify-center items-center mt-6 md:mt-8 px-6 py-2.5 md:px-8 md:py-3 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-300 rounded-none shadow-sm bg-white text-black border border-[#da127d] hover:bg-[#da127d] hover:text-white">
            Explore Stories
          </a>
        </div>

        {/* ── RIGHT GRID ── */}
        <div className="w-full lg:w-2/3 mt-4 lg:mt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {photos.map((photo, idx) => (
              <div
                key={idx}
                className={`group relative overflow-hidden bg-[#F9F5F6] border border-gray-100/50 rounded-sm md:rounded-none transition-transform duration-500 hover:z-20 md:hover:-translate-y-1 hover:shadow-lg ${getStaggerClass(
                  idx,
                )}`}>
                {/* IMAGE (Aspect matched to 3/4 rhythm) */}
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={photo}
                    alt={`Customer ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                </div>

                {/* PREMIUM HOVER OVERLAY */}
                <div className="absolute inset-0 bg-black/0 md:group-hover:bg-black/5 transition duration-500 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(CustomerSpotlight);
