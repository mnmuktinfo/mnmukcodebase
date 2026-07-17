import React from "react";
import { Link } from "react-router-dom";
import { slugify } from "../../../../utils/slugify";

const CollectionGrid = ({ items = [], title, subtitle }) => {
  // Cap the total items to 8 for desktop.
  const visibleItems = items.slice(0, 8);

  return (
    <section className="w-full bg-[#fafafa] py-5 md:py-10">
      <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-6 lg:px-10">
        {/* ── PREMIUM HEADER (Matched with Video/Product Sections) ── */}
        <div className="flex flex-col items-center text-center mb-6 md:mb-12">
          {title && (
            <h2 className="text-[18px] sm:text-[20px] md:text-[26px] font-medium text-[#1a1a1a] tracking-[0.01em] leading-tight">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="mt-1.5 md:mt-2 text-[12px] sm:text-[13px] md:text-[14px] text-[#6b6b6b] max-w-[420px] tracking-[0.02em]">
              {subtitle}
            </p>
          )}
        </div>

        {/* ── RESPONSIVE GRID ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 md:gap-x-6 md:gap-y-14">
          {visibleItems.map((item, idx) => (
            <Link
              key={item.key || idx}
              to={`/collections/${slugify(item.title)}`}
              // Hide items from index 4 onwards on mobile devices (only show 4 on mobile, 8 on desktop)
              className={`group w-full transition-transform duration-300 md:hover:-translate-y-1 ${
                idx >= 4 ? "hidden md:block" : "block"
              }`}>
              {/* Image Container */}
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#F9F5F6] rounded-sm md:rounded-none border border-gray-100/50">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/0 md:group-hover:bg-black/5 transition duration-500" />
              </div>

              {/* Info Container */}
              <div className="pt-3 pb-2 md:pt-4 md:pb-3 flex flex-col items-center text-center px-1">
                <h3 className="text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-gray-900 uppercase tracking-widest truncate w-full transition-colors duration-300 group-hover:text-[#da127d]">
                  {item.title}
                </h3>

                {item.subtitle && (
                  <p className="text-[10px] sm:text-[11px] text-gray-500 italic font-serif mt-1 md:mt-1.5 truncate w-full">
                    {item.subtitle}
                  </p>
                )}

                {item.count && (
                  <p className="text-[9px] md:text-[10px] font-semibold text-gray-400 mt-1.5 md:mt-2">
                    {item.count} ITEMS
                  </p>
                )}

                {/* Animated underline indicator */}
                <div className="mt-2 h-[1px] w-0 bg-[#da127d] mx-auto group-hover:w-8 transition-all duration-500 ease-out" />
              </div>
            </Link>
          ))}
        </div>

        {/* ── EMPTY STATE ── */}
        {items.length === 0 && (
          <div className="text-center py-16 md:py-20 flex flex-col items-center justify-center">
            <p className="text-[#6b6b6b] text-[12px] md:text-[14px] uppercase tracking-widest">
              Curating new collections...
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(CollectionGrid);
